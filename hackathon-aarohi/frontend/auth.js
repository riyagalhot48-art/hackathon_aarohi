/* Shared login state, nav buttons and the sign up / log in forms */
var API=window.API_URL||"http://localhost:5000";
function store(k,v){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}
function read(k){try{return localStorage.getItem(k)}catch(e){return null}}
function logout(){store("aarohi_token",null);store("aarohi_user",null);location.href="index.html"}

function renderNav(){
 var box=document.getElementById("authnav");if(!box)return;
 var u=null;try{u=JSON.parse(read("aarohi_user"))}catch(e){}
 if(u&&read("aarohi_token")){
  box.innerHTML='<a href="app.html">Dashboard</a><span class="hi">Hi, '+u.name.split(" ")[0].replace(/[<>&"]/g,"")+'</span><a href="#" id="logout">Log out</a>';
  document.getElementById("logout").addEventListener("click",function(e){e.preventDefault();logout()});
  fetch(API+"/api/auth/me",{headers:{Authorization:"Bearer "+read("aarohi_token")}}).then(function(r){if(r.status===401)logout()}).catch(function(){});
 }else{
  box.innerHTML='<a href="login.html">Log in</a><a class="cta" href="signup.html">Sign up</a>';
 }
}

var form=document.getElementById("authform");
if(form){
 var mode=form.dataset.mode,err=document.getElementById("autherr"),btn=form.querySelector("button");
 form.addEventListener("submit",function(e){
  e.preventDefault();err.textContent="";btn.disabled=true;
  var body={email:form.email.value,password:form.password.value};
  if(mode==="signup"){
   body.name=form.name.value;
   if(form.password.value!==form.confirm.value){err.textContent="The two passwords don’t match.";btn.disabled=false;return}
  }
  fetch(API+"/api/auth/"+mode,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})
   .then(function(r){return r.json().then(function(d){return{ok:r.ok,d:d}})})
   .then(function(x){
    if(!x.ok){err.textContent=x.d.error||"Something went wrong. Try again.";btn.disabled=false;return}
    store("aarohi_token",x.d.token);store("aarohi_user",JSON.stringify(x.d.user));location.href="app.html";
   })
   .catch(function(){err.textContent="Can’t reach the Aarohi server. Start the backend (npm start in the backend folder) and try again.";btn.disabled=false});
 });
}
renderNav();
