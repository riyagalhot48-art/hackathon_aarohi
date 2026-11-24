/* Aarohi frontend: talks to the backend API */
var API=window.API_URL||"http://localhost:5000";
function api(u){return fetch(API+u).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
function apiError(){var m=document.createElement("p");m.className="note";m.textContent="Can’t reach the Aarohi server. Start the backend (npm start in the backend folder) and refresh.";document.querySelector("main").prepend(m)}
var $=function(s){return document.querySelector(s)};
/* Planner */

var PLANS={},ROLES={},TOPICS={};
var cur="good";
async function renderPlan(){
 if(!PLANS[cur])PLANS[cur]=await api("/api/plan/"+cur);
 var p=PLANS[cur],h="";
 p.items.forEach(function(t,i){h+='<li><input type="checkbox" id="t'+i+'"><label for="t'+i+'"><time>'+t[0]+'</time>'+t[1]+' <span class="tag t-'+t[2]+'">'+t[3]+'</span></label></li>'});
 $("#tasks").innerHTML=h;
 $("#tasks").querySelectorAll("input").forEach(function(c){c.addEventListener("change",prog)});
 prog();
}
function prog(){
 var all=document.querySelectorAll("#tasks input"),n=0;
 all.forEach(function(c){if(c.checked)n++});
 $("#bar").style.width=(n/all.length*100)+"%";
 $("#pmsg").textContent=n===all.length?"Plan complete. Well done today.":PLANS[cur].msg+" "+n+" of "+all.length+" done.";
}
$("#energy").addEventListener("click",function(e){
 var b=e.target.closest("button");if(!b)return;
 cur=b.dataset.e;
 this.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});
 renderPlan();
});
renderPlan().catch(apiError);

/* Career */

var role="Software developer";
function renderRoles(){
 if(!ROLES[role])return;
 var h="";Object.keys(ROLES).forEach(function(r){h+='<button aria-pressed="'+(r===role)+'" data-r="'+r+'">'+r+'</button>'});
 $("#roles").innerHTML=h;
}
function list(arr,id,chk){return '<ul>'+arr.map(function(s,i){return '<li><label>'+(chk?'<input type="checkbox" data-k="'+id+'">':'')+'<span>'+s+'</span></label></li>'}).join('')+'</ul>'}
function renderRoad(){
 if(!ROLES[role])return;
 var r=ROLES[role];
 $("#road").innerHTML='<div class="card"><h3>Skills to learn</h3>'+list(r.skills,"s",true)+'</div><div class="card"><h3>Projects to build</h3>'+list(r.projects,"p",true)+'</div><div class="card"><h3>Your next step</h3><p>'+r.next+'</p><p class="sub" style="margin-top:12px">'+r.ops+'</p></div>';
 $("#rnote").textContent="Nothing ticked yet. Pick one skill to start.";
 $("#road").querySelectorAll("input").forEach(function(c){c.addEventListener("change",function(){
  c.closest("li").classList.toggle("done",c.checked);
  var t=$("#road").querySelectorAll("input"),d=$("#road").querySelectorAll("input:checked");
  $("#rnote").textContent=d.length+" of "+t.length+" milestones done. Your roadmap updates as you learn.";
 })});
}
$("#roles").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;role=b.dataset.r;renderRoles();renderRoad()});
api("/api/roles").then(function(d){ROLES=d;renderRoles();renderRoad()}).catch(function(){});

/* Wellness */

var topic="Managing stress";
function renderTopics(){
 if(!TOPICS[topic])return;
 var h="";Object.keys(TOPICS).forEach(function(k){h+='<button aria-pressed="'+(k===topic)+'" data-t="'+k+'">'+k+'</button>'});
 $("#topics").innerHTML=h;
 var a=TOPICS[topic];
 $("#ans").innerHTML='<h3>'+a.t+'</h3><ul>'+a.p.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul><p class="talk"><strong>When to get support:</strong> '+a.w+'</p>';
}
$("#topics").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;topic=b.dataset.t;renderTopics()});
api("/api/topics").then(function(d){TOPICS=d;renderTopics()}).catch(function(){});
