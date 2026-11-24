require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { PLANS, ROLES, TOPICS } = require("./data");
const { router: authRouter, requireAuth } = require("./auth");
const { SUBJECTS, LECTURES, TIMETABLE } = require("./content");
const ai = require("./ai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => res.json({ ok: true, app: "Aarohi" }));

// Daily planner: energy is "good", "ok" or "low"
app.get("/api/plan/:energy", (req, res) => {
  const plan = PLANS[req.params.energy];
  if (!plan) return res.status(404).json({ error: "Energy must be good, ok or low." });
  res.json(plan);
});

// Career roadmaps
app.get("/api/roles", (req, res) => res.json(ROLES));
app.get("/api/roles/:name", (req, res) => {
  const role = ROLES[req.params.name];
  if (!role) return res.status(404).json({ error: "Unknown career. Try /api/roles for the list." });
  res.json(role);
});

// AshaCare wellness education (education only, not diagnosis)
app.get("/api/topics", (req, res) => res.json(TOPICS));

// Members-only content (login required)
app.get("/api/subjects", requireAuth, (req, res) => res.json(SUBJECTS));
app.get("/api/lectures", requireAuth, (req, res) => res.json({ lectures: LECTURES, timetable: TIMETABLE }));
app.post("/api/mentor", requireAuth, ai.limit, ai.mentor);
app.post("/api/health-ai", requireAuth, ai.limit, ai.health);

// Also serve the frontend so one command runs everything
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.listen(PORT, () => console.log(`Aarohi running at http://localhost:${PORT}`));
