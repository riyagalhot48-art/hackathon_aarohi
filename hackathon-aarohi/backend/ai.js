// Two separate assistants: Mentor (study and career) and HealthCare (wellbeing education).
// With ANTHROPIC_API_KEY set they use Claude. Without it they answer from built-in content ("basic" mode).
const { SUBJECTS } = require("./content");
const { ROLES, TOPICS } = require("./data");

const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.AI_MODEL || "claude-sonnet-4-6";

const PROMPTS = {
  mentor: "You are Aarohi Mentor, a friendly academic and career coach for B.Tech CSE students, mostly young women in India. Give practical, specific, encouraging guidance on subjects, study plans, exams, projects, resumes, internships and career paths. Keep answers under 200 words and use short lists. Be honest when unsure and never invent scholarships, deadlines or links. If the student raises a health or emotional topic, gently point them to the AI HealthCare tab.",
  health: "You are Aarohi HealthCare, a supportive health-education assistant for young women students. Give general, evidence-based information on stress, sleep, menstrual health, nutrition, exercise, posture and screen time. You are not a doctor: never diagnose, never recommend medicines or doses, and suggest seeing a qualified doctor for symptoms that are severe, persistent or worrying. Keep answers under 180 words, warm and clear. Do not ask for identifying personal details."
};

const CRISIS = /suicid|kill myself|end my life|want to die|self[- ]?harm|hurt myself|no reason to live/i;
const URGENT = /chest pain|can'?t breathe|cannot breathe|faint(ed|ing)|heavy bleeding|bleeding heavily|overdose|seizure/i;
const CRISIS_MSG = "I’m really glad you told me, and I’m sorry you’re hurting. You don’t have to carry this alone.\n\nPlease reach out to someone right now: a trusted friend, family member or teacher. In India you can call **Tele-MANAS at 14416** (free, 24/7), or **112** if you are in immediate danger.\n\nI’m here to talk, but a real person can support you in ways I can’t.";
const URGENT_MSG = "That could be serious. Please don’t wait: call **112** or go to the nearest hospital or emergency room now, or ask someone nearby to help you get there.";

async function askClaude(system, history, message) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 700, system, messages: [...history, { role: "user", content: message }] })
  });
  if (!r.ok) throw new Error("Claude API " + r.status);
  const d = await r.json();
  return d.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

const ALIASES = [[/\bdsa?\b|data struct|linked list|stack|queue|tree/, "Data Structures"], [/dbms|sql|database|normali/, "DBMS"], [/\bos\b|operating|deadlock|scheduling/, "Operating Systems"], [/network|tcp|osi|http/, "Computer Networks"], [/java|\boop/, "OOP with Java"], [/web|html|css|javascript|react/, "Web Development"], [/discrete|graph theory|logic|sets/, "Discrete Mathematics"], [/python/, "Python"]];
const ROLE_WORDS = [[/software|developer|coding|programmer/, "Software developer"], [/data|analy/, "Data analyst"], [/design|ui|ux/, "UI/UX designer"]];

function mentorBasic(m) {
  const t = m.toLowerCase();
  const sub = ALIASES.find(([re]) => re.test(t));
  const note = "\n\n(Basic mode. Ask your admin to set ANTHROPIC_API_KEY for full AI answers.)";
  if (sub) {
    const s = SUBJECTS.find((x) => x.name === sub[1]);
    return "**" + s.name + ": key ideas**\n" + s.topics.map((x) => "- " + x.title + ": " + x.points[0]).join("\n") + "\n\nOpen the Notes tab for the full notes on each topic." + note;
  }
  const role = ROLE_WORDS.find(([re]) => re.test(t));
  if (role) {
    const r = ROLES[role[1]];
    return "**Roadmap: " + role[1] + "**\n- Skills: " + r.skills.join(", ") + "\n- Projects: " + r.projects.join(", ") + "\n- Next step: " + r.next + note;
  }
  return "Here is a simple weekly study plan:\n- Give each subject 2 focused sessions a week.\n- Spend 30 minutes after each class reviewing your notes.\n- Do one practice task a week (a problem set, a mini project or a past paper).\n- Keep one lighter evening for rest.\n\nTell me a subject (for example, DBMS) or a career (for example, data analyst) and I’ll get more specific." + note;
}

function healthBasic(m) {
  const t = m.toLowerCase();
  const pick = /stress|exam|anxi|worr|pressure/.test(t) ? "Managing stress" : /sleep|tired|insomnia/.test(t) ? "Sleep" : /period|cramp|cycle|menstru/.test(t) ? "Cycle health" : /sad|mood|low|lonely|down/.test(t) ? "Low mood" : null;
  const note = "\n\n(Basic mode. Ask your admin to set ANTHROPIC_API_KEY for full AI answers.)";
  if (pick) {
    const a = TOPICS[pick];
    return "**" + a.t + "**\n" + a.p.map((x) => "- " + x).join("\n") + "\n\n**When to get support:** " + a.w + note;
  }
  return "I can share general wellbeing information on stress, sleep, periods and cycle health, mood, nutrition, posture and screen time. I can’t diagnose or suggest medicines, and a doctor is the right person for anything severe or persistent. What would you like to know?" + note;
}

const clean = (h) => (Array.isArray(h) ? h : []).filter((x) => x && (x.role === "user" || x.role === "assistant") && typeof x.content === "string").slice(-10).map((x) => ({ role: x.role, content: x.content.slice(0, 2000) }));

const handler = (kind) => async (req, res) => {
  const message = String(req.body.message || "").trim().slice(0, 1000);
  if (!message) return res.status(400).json({ error: "Please type a message." });
  if (kind === "health") {
    if (CRISIS.test(message)) return res.json({ reply: CRISIS_MSG, mode: "safety" });
    if (URGENT.test(message)) return res.json({ reply: URGENT_MSG, mode: "safety" });
  }
  if (KEY) {
    try { return res.json({ reply: await askClaude(PROMPTS[kind], clean(req.body.history), message), mode: "ai" }); }
    catch (e) { console.error("AI error:", e.message); }
  }
  res.json({ reply: (kind === "health" ? healthBasic : mentorBasic)(message), mode: "basic" });
};

// Simple per-user limit (20 messages a minute) to protect your API budget
const hits = new Map();
function limit(req, res, next) {
  const now = Date.now(), list = (hits.get(req.user.id) || []).filter((t) => now - t < 60000);
  if (list.length >= 20) return res.status(429).json({ error: "You’re sending messages quickly. Please wait a minute." });
  list.push(now); hits.set(req.user.id, list); next();
}
module.exports = { mentor: handler("mentor"), health: handler("health"), limit };
