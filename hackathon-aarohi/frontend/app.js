/* Members area: dashboard, notes, lectures, AI Mentor and AI HealthCare */
var tok=read("aarohi_token"),user=null;try{user=JSON.parse(read("aarohi_user"))}catch(e){}
if(!tok||!user)location.replace("login.html");
var $=function(s){return document.querySelector(s)};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fmt(t){return esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^- /gm,"• ").replace(/\n/g,"<br>")}
function call(method,u,b){
 return fetch(API+u,{method:method,headers:Object.assign({Authorization:"Bearer "+tok},b?{"Content-Type":"application/json"}:{}),body:b?JSON.stringify(b):undefined})
 .then(function(r){if(r.status===401){logout();throw new Error("Please log in again.")}
  return r.json().then(function(d){if(!r.ok)throw new Error(d.error||"Something went wrong.");return d})});
}
var SUBJ=[],LEC=[],TT={},sel=0,done=[],DK="aarohi_done_"+(user&&user.id);
try{done=JSON.parse(read(DK))||[]}catch(e){}
var DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

/* tabs */
var TABS=["dash","notes","lec","mentor","health"];
function show(id){
 if(TABS.indexOf(id)<0)id="dash";
 TABS.forEach(function(t){$("#p-"+t).hidden=t!==id;$("#tab-"+t).setAttribute("aria-selected",t===id)});
 history.replaceState(null,"","#"+id);window.scrollTo(0,0);
}

/* dashboard */
function total(){return SUBJ.reduce(function(n,s){return n+s.topics.length},0)}
function dash(){
 var n=total(),d=done.length,pct=n?Math.round(d/n*100):0,day=new Date().getDay(),today=TT[day]||[];
 $("#hello").textContent="Welcome back, "+user.name.split(" ")[0];
 $("#stats").innerHTML=[[SUBJ.length,"subjects"],[d+" / "+n,"topics done"],[pct+"%","overall progress"]].map(function(x){return'<div class="card"><b>'+x[0]+'</b>'+x[1]+'</div>'}).join("");
 $("#pbar").style.width=pct+"%";
 var next=null;SUBJ.some(function(s,i){return s.topics.some(function(t,j){if(done.indexOf(i+"-"+j)<0){next={i:i,t:t.title,s:s.name};return true}})});
 $("#next").innerHTML=next?'<h3>Up next</h3><p>'+esc(next.s)+": "+esc(next.t)+'</p><button class="cta" data-open="'+next.i+'">Open notes</button>':'<h3>All topics done</h3><p>Great work. Revise with past papers or ask the AI Mentor for practice ideas.</p>';
 $("#today").innerHTML='<h3>'+DAYS[day]+'’s classes</h3>'+(today.length?'<ul class="plain">'+today.map(function(c){return'<li><b>'+c[0]+'</b> '+esc(c[1])+'</li>'}).join("")+'</ul>':'<p>No classes today. A good day to revise or rest.</p>');
}

/* notes and lectures */
function chipsHTML(){return SUBJ.map(function(s,i){return'<button aria-pressed="'+(i===sel)+'" data-i="'+i+'">'+esc(s.name)+'</button>'}).join("")}
function notes(){
 var s=SUBJ[sel];$("#nchips").innerHTML=chipsHTML();
 $("#nbody").innerHTML=s.topics.map(function(t,j){
  var k=sel+"-"+j,dn=done.indexOf(k)>-1;
  return'<details class="card topic"><summary>'+esc(t.title)+(dn?' <span class="tag t-rest">Done</span>':'')+'</summary><ul>'+t.points.map(function(p){return'<li>'+esc(p)+'</li>'}).join("")+'</ul><div class="row"><label><input type="checkbox" data-k="'+k+'"'+(dn?" checked":"")+'> Mark as done</label><button class="ghost" data-ask="'+esc("Explain "+t.title+" in "+s.name+" with a simple example")+'">Ask AI Mentor</button></div></details>';
 }).join("");
}
function lec(){
 $("#lchips").innerHTML=chipsHTML();
 var L=LEC[sel];
 $("#lbody").innerHTML='<div class="card"><h3>'+esc(L.subject)+': lecture plan</h3><ol class="plain">'+L.plan.map(function(p){return'<li><b>Lecture '+p.no+': '+esc(p.title)+'</b> <span class="sub">('+p.mins+' min)</span><br><span class="sub">Key idea: '+esc(p.focus)+'</span></li>'}).join("")+'</ol></div>'+
  '<div class="card"><h3>Practice task</h3><p>'+esc(L.practice)+'</p><h3 style="margin-top:14px">Where to learn more</h3><p>'+L.resources.map(esc).join(" · ")+'</p></div>';
}
function week(){
 $("#ttable").innerHTML='<h3>Weekly timetable <span class="sub">(sample, edit in backend/content.js)</span></h3><div class="tt">'+[1,2,3,4,5].map(function(d){return'<div><b>'+DAYS[d].slice(0,3)+'</b>'+(TT[d]||[]).map(function(c){return'<p><span class="sub">'+c[0]+'</span><br>'+esc(c[1])+'</p>'}).join("")+'</div>'}).join("")+'</div>';
}
function renderAll(){dash();notes();lec();week()}

/* chat */
function chat(id,url,hello){
 var log=$("#"+id+"-log"),form=$("#"+id+"-form"),input=form.querySelector("input"),hist=[];
 function add(who,html){var b=document.createElement("div");b.className="bubble "+who;b.innerHTML=html;log.appendChild(b);log.scrollTop=log.scrollHeight;return b}
 add("bot",fmt(hello));
 function send(text){
  text=String(text).trim();if(!text)return;
  add("me",esc(text));input.value="";var w=add("bot","Thinking…");
  call("POST",url,{message:text,history:hist}).then(function(d){
   w.innerHTML=fmt(d.reply)+(d.mode==="ai"?'<span class="badge">AI answer</span>':d.mode==="basic"?'<span class="badge">Basic mode</span>':"");
   hist.push({role:"user",content:text},{role:"assistant",content:d.reply});log.scrollTop=log.scrollHeight;
  }).catch(function(e){w.textContent=e.message||"Can’t reach the server."});
 }
 form.addEventListener("submit",function(e){e.preventDefault();send(input.value)});
 return send;
}
var askMentor=chat("mentor","/api/mentor","Hi! I’m your Aarohi Mentor. Ask me about a subject, a study plan, exam prep, projects, resumes or career paths.");
var askHealth=chat("health","/api/health-ai","Hi, I’m Aarohi HealthCare. I share general wellbeing information on stress, sleep, periods, mood, nutrition and posture. I’m not a doctor and can’t diagnose, but I can help you understand things and know when to see one. What’s on your mind?");

/* clicks */
document.addEventListener("click",function(e){
 var t=e.target.closest("button");if(!t)return;
 if(t.closest(".subjchips")){sel=+t.dataset.i;notes();lec()}
 else if(t.dataset.ask){show("mentor");askMentor(t.dataset.ask)}
 else if(t.dataset.say){(t.closest("[data-to]").dataset.to==="health"?askHealth:askMentor)(t.dataset.say)}
 else if(t.dataset.go)show(t.dataset.go);
 else if(t.dataset.open){sel=+t.dataset.open;notes();lec();show("notes")}
 else if(t.getAttribute("role")==="tab")show(t.id.replace("tab-",""));
});
document.addEventListener("change",function(e){
 var c=e.target;if(!c.dataset.k)return;
 var i=done.indexOf(c.dataset.k);if(c.checked&&i<0)done.push(c.dataset.k);if(!c.checked&&i>-1)done.splice(i,1);
 store(DK,JSON.stringify(done));
 var sm=c.closest("details").querySelector("summary"),tg=sm.querySelector(".tag");if(tg)tg.remove();
 if(c.checked)sm.insertAdjacentHTML("beforeend",' <span class="tag t-rest">Done</span>');
 dash();
});

show((location.hash||"#dash").slice(1));
Promise.all([call("GET","/api/subjects"),call("GET","/api/lectures")]).then(function(r){SUBJ=r[0];LEC=r[1].lectures;TT=r[1].timetable;renderAll()})
 .catch(function(e){$("#hello").textContent="Couldn’t load your content";$("#stats").innerHTML='<p class="note">'+esc(e.message)+" Make sure the backend is running (npm start in the backend folder).</p>"});
