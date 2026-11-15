(() => {
"use strict";
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const U = id => `https://images.unsplash.com/${id}?w=1200&q=80`;

/* ---------- Data ---------- */
const PLANETS = [
 {name:"Mercury",color:"#b1a59a",bg:"radial-gradient(circle at 30% 30%,#e2d8cc,#8c7f74 50%,#3a332d)",desc:"The smallest planet and closest to the Sun, a cratered world of extreme temperatures.",dist:"57.9M km",diam:"4,879 km",day:"59 Earth days",moons:"0",temp:"-173 to 427°C"},
 {name:"Venus",color:"#e8b86b",bg:"radial-gradient(circle at 30% 30%,#fbe3a8,#d99a3d 50%,#6b3f10)",desc:"Wrapped in thick toxic clouds, Venus is the hottest planet in our solar system.",dist:"108.2M km",diam:"12,104 km",day:"243 Earth days",moons:"0",temp:"465°C"},
 {name:"Earth",color:"#3fa9f5",bg:"radial-gradient(circle at 30% 30%,#9fe0ff,#1e6fd9 45%,#1f7a3a 60%,#08204a)",desc:"Our home: the only known world with liquid oceans on its surface and life.",dist:"149.6M km",diam:"12,742 km",day:"24 hours",moons:"1",temp:"15°C avg"},
 {name:"Mars",color:"#e2553b",bg:"radial-gradient(circle at 30% 30%,#ffae8a,#c1440e 50%,#4a1404)",desc:"The Red Planet, home to the tallest volcano and deepest canyon in the solar system.",dist:"227.9M km",diam:"6,779 km",day:"24.6 hours",moons:"2",temp:"-65°C avg"},
 {name:"Jupiter",color:"#d8a878",bg:"repeating-linear-gradient(175deg,#e8c9a0 0 18px,#b47a4b 18px 34px,#f1dcc0 34px 46px),#c08a5a",desc:"A gas giant more than twice as massive as all other planets combined.",dist:"778.5M km",diam:"139,820 km",day:"9.9 hours",moons:"95",temp:"-110°C"},
 {name:"Saturn",color:"#f0d58c",bg:"repeating-linear-gradient(175deg,#f5e2b0 0 20px,#d9b46a 20px 36px),#e0c080",desc:"Famous for its dazzling rings made of billions of ice and rock fragments.",dist:"1.43B km",diam:"116,460 km",day:"10.7 hours",moons:"146",temp:"-140°C"},
 {name:"Uranus",color:"#7fe0e8",bg:"radial-gradient(circle at 30% 30%,#d6fbff,#62c8d6 50%,#1a5a66)",desc:"An ice giant that spins on its side, with a faint ring system.",dist:"2.87B km",diam:"50,724 km",day:"17.2 hours",moons:"28",temp:"-195°C"},
 {name:"Neptune",color:"#4c6fff",bg:"radial-gradient(circle at 30% 30%,#a8bcff,#3355e6 50%,#0c1660)",desc:"The windiest world, with supersonic storms racing across its deep blue face.",dist:"4.5B km",diam:"49,244 km",day:"16.1 hours",moons:"16",temp:"-200°C"}];
const MISSIONS = [
 ["1957","Sputnik 1","🛰️","The first artificial satellite beeps its way around Earth, starting the Space Age."],
 ["1969","Apollo 11","🌕","Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon."],
 ["1977","Voyager 1","🚀","Launched to the outer planets, it is now the most distant human-made object."],
 ["1990","Hubble","🔭","The space telescope that revealed the age and expansion of the universe."],
 ["1998","ISS","🏗️","Assembly begins on the International Space Station, continuously crewed since 2000."],
 ["2021","James Webb","✨","The most powerful space telescope ever built, peering at the first galaxies."]];
const GALLERY = [
 ["photo-1462331940025-496dfbfc7564","nebulae","Pillars of Color"],
 ["photo-1614732414444-096e5f1122d5","planets","Ringed Giant"],
 ["photo-1543722530-d2c3201371e7","galaxies","Milky Way Core"],
 ["photo-1541873676-a18131494184","astronauts","Spacewalk"],
 ["photo-1465101162946-4377e57745c3","nebulae","Cosmic Cloud"],
 ["photo-1446776811953-b23d57bd21aa","planets","Blue Marble"],
 ["photo-1502134249126-9f3755a50d78","galaxies","Starry Spiral"],
 ["photo-1614728894747-a83421e2b9c9","planets","Distant World"],
 ["photo-1419242902214-272b3f66ee7a","galaxies","Night Galaxy"],
 ["photo-1454789548928-9efd52dc4031","astronauts","Above Earth"],
 ["photo-1506318137071-a8e063b4bec0","nebulae","Deep Field"],
 ["photo-1451187580459-43490279c0fa","planets","Connected Planet"]];
const CREW = [
 ["Dr. Aria Chen","Mission Commander","photo-1494790108377-be9c29b29330"],
 ["Leo Martinez","Flight Engineer","photo-1500648767791-00dcc994a43e"],
 ["Dr. Priya Nair","Astrophysicist","photo-1573496359142-b8d87734a5a2"],
 ["Kai Andersen","Pilot","photo-1507003211169-0a1dd7228f2d"]];
const QUOTES = [
 ["Somewhere, something incredible is waiting to be known.","Carl Sagan"],
 ["That's one small step for man, one giant leap for mankind.","Neil Armstrong"],
 ["Look up at the stars and not down at your feet.","Stephen Hawking"],
 ["The Earth is the cradle of humanity, but one cannot live in a cradle forever.","Konstantin Tsiolkovsky"]];

/* ---------- Preloader ---------- */
function initPreloader(){
  const el=$("#preloader"),c=$("#loadCount");let n=0,loaded=false;
  addEventListener("load",()=>loaded=true);
  const t=setInterval(()=>{n=Math.min(loaded?100:95,n+(loaded?6:2));c.textContent=n;
    if(n>=100){clearInterval(t);setTimeout(()=>el.classList.add("done"),250);}},30);
  setTimeout(()=>loaded=true,3500);
}

/* ---------- Starfield: 3 depth layers, mouse parallax, shooting stars ---------- */
function initStarfield(){
  const cv=$("#starfield"),ctx=cv.getContext("2d");let w,h,stars=[],shoot=[],mx=0,my=0;
  const resize=()=>{w=cv.width=cv.offsetWidth*devicePixelRatio;h=cv.height=cv.offsetHeight*devicePixelRatio;
    stars=Array.from({length:450},()=>({x:Math.random()*w,y:Math.random()*h,z:1+Math.floor(Math.random()*3),r:Math.random()*1.4+.3,t:Math.random()*Math.PI*2}));};
  resize();addEventListener("resize",debounce(resize,200));
  addEventListener("mousemove",e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});
  const draw=()=>{ctx.clearRect(0,0,w,h);
    for(const s of stars){s.t+=.03;const a=.5+Math.sin(s.t)*.5;
      // deeper layers (bigger z) move more with the mouse
      const x=(s.x+mx*s.z*25*devicePixelRatio+w)%w,y=(s.y+my*s.z*25*devicePixelRatio+h)%h;
      ctx.globalAlpha=a;ctx.fillStyle=s.z===3?"#cfe9ff":"#fff";ctx.beginPath();ctx.arc(x,y,s.r*s.z*.7*devicePixelRatio,0,7);ctx.fill();}
    if(Math.random()<.008)shoot.push({x:Math.random()*w,y:Math.random()*h*.4,l:0});
    ctx.globalAlpha=1;
    shoot=shoot.filter(s=>{s.l+=14;const g=ctx.createLinearGradient(s.x+s.l,s.y+s.l*.5,s.x+s.l-120,s.y+s.l*.5-60);
      g.addColorStop(0,"#fff");g.addColorStop(1,"transparent");ctx.strokeStyle=g;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(s.x+s.l,s.y+s.l*.5);ctx.lineTo(s.x+s.l-120,s.y+s.l*.5-60);ctx.stroke();return s.l<w*.6;});
    if(!reduced)requestAnimationFrame(draw);};
  draw();
}

/* ---------- Navbar ---------- */
function initNavbar(){
  const nav=$("#nav"),burger=$("#burger"),links=$("#navLinks");
  $$("li",links).forEach((li,i)=>li.style.setProperty("--i",i));
  addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>40),{passive:true});
  const toggle=o=>{links.classList.toggle("open",o);burger.classList.toggle("open",o);burger.setAttribute("aria-expanded",o);document.body.style.overflow=o?"hidden":"";};
  burger.addEventListener("click",()=>toggle(!links.classList.contains("open")));
  $$("a",links).forEach(a=>a.addEventListener("click",()=>toggle(false)));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$("a",links).forEach(a=>a.classList.toggle("active",a.hash==="#"+e.target.id));}),{rootMargin:"-45% 0px -50% 0px"});
  $$("main section[id]").forEach(s=>io.observe(s));
  $$('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const t=$(a.getAttribute("href"));if(!t)return;e.preventDefault();
    scrollTo({top:t.offsetTop-(t.id==="home"?0:60),behavior:reduced?"auto":"smooth"});}));
}

/* ---------- Typing ---------- */
function initTyping(){
  const el=$("#typing"),words=["Discover new worlds.","Travel beyond light.","Join the next mission."];let w=0,i=0,del=false;
  const tick=()=>{const s=words[w];el.textContent=s.slice(0,i);
    if(!del&&i++===s.length){del=true;return setTimeout(tick,1600);}
    if(del&&i--===0){del=false;w=(w+1)%words.length;i=0;}
    setTimeout(tick,del?40:85);};
  tick();
}

/* ---------- Reveal + counters ---------- */
function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const d=+e.target.dataset.delay||0;setTimeout(()=>e.target.classList.add("visible"),d);io.unobserve(e.target);}}),{threshold:.15});
  $$("[data-reveal]").forEach(el=>io.observe(el));
}
function initCounters(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
    const el=e.target,end=+el.dataset.count,dec=+el.dataset.decimals||0,suf=el.dataset.suffix||"",t0=performance.now();
    const step=t=>{const p=Math.min((t-t0)/2000,1),v=end*(1-Math.pow(1-p,3));
      el.textContent=(dec?v.toFixed(dec):Math.round(v).toLocaleString())+suf;if(p<1)requestAnimationFrame(step);};
    requestAnimationFrame(step);}),{threshold:.6});
  $$("[data-count]").forEach(el=>io.observe(el));
}

/* ---------- Planets ---------- */
function initPlanets(){
  const sel=$("#planetSelector"),big=$("#bigPlanet"),info=$("#planetInfo");let cur=-1;
  sel.innerHTML=PLANETS.map((p,i)=>`<button class="p-dot" role="tab" aria-label="${p.name}" data-name="${p.name}" data-i="${i}" style="background:${p.bg};color:${p.color}"></button>`).join("");
  const show=i=>{if(i===cur)return;cur=i;const p=PLANETS[i];
    $$(".p-dot",sel).forEach((b,j)=>{b.classList.toggle("active",j===i);b.setAttribute("aria-selected",j===i);});
    big.classList.add("out");
    setTimeout(()=>{big.style.background=p.bg;big.style.boxShadow=`inset -50px -30px 80px rgba(0,0,0,.75),0 0 90px ${p.color}66`;
      big.classList.remove("out");big.classList.add("in");void big.offsetWidth;big.classList.remove("in");},reduced?0:450);
    info.innerHTML=`<p class="eyebrow">Planet ${i+1} of 8</p><h3 class="gradient-text">${p.name}</h3><p class="muted">${p.desc}</p>
      <div class="p-stats">${[["Distance from Sun",p.dist],["Diameter",p.diam],["Day length",p.day],["Moons",p.moons],["Temperature",p.temp]].map(([k,v])=>`<div><small>${k}</small>${v}</div>`).join("")}</div>`;
    [...info.children].forEach((c,k)=>c.style.animationDelay=k*.12+"s");};
  sel.addEventListener("click",e=>{const b=e.target.closest(".p-dot");if(b)show(+b.dataset.i);});
  sel.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){const n=(cur+(e.key==="ArrowRight"?1:7))%8;show(n);$$(".p-dot",sel)[n].focus();}});
  show(2);
}

/* ---------- Timeline: fill height follows scroll progress through the section ---------- */
function initTimeline(){
  const tl=$("#timeline"),fill=$("#timelineFill");
  tl.insertAdjacentHTML("beforeend",MISSIONS.map(([y,t,ic,d],i)=>`<article class="t-item" data-reveal="${i%2?"fade-left":"fade-right"}"><div class="t-card glass"><span class="t-year">${y}</span><h3><span class="t-icon">${ic}</span>${t}</h3><p class="muted">${d}</p></div></article>`).join(""));
  const upd=()=>{const r=tl.getBoundingClientRect(),p=Math.min(Math.max((innerHeight*.6-r.top)/r.height,0),1);fill.style.height=p*100+"%";};
  addEventListener("scroll",()=>requestAnimationFrame(upd),{passive:true});upd();
}

/* ---------- Gallery + Lightbox ---------- */
function initGallery(){
  const m=$("#masonry");
  m.innerHTML=GALLERY.map(([id,c,t],i)=>`<figure class="g-item" data-cat="${c}" data-i="${i}" tabindex="0"><img src="${U(id)}" alt="${t} — ${c}" width="600" height="${[700,450,800,600][i%4]}" style="aspect-ratio:600/${[700,450,800,600][i%4]}" loading="lazy"><figcaption>${t}</figcaption></figure>`).join("");
  $("#filters").addEventListener("click",e=>{const b=e.target.closest(".filter");if(!b)return;
    $$(".filter").forEach(f=>f.classList.toggle("active",f===b));const f=b.dataset.filter;
    $$(".g-item",m).forEach(it=>{const show=f==="all"||it.dataset.cat===f;it.style.opacity=0;it.style.transform="scale(.9)";
      setTimeout(()=>{it.classList.toggle("hide",!show);if(show)requestAnimationFrame(()=>{it.style.opacity=1;it.style.transform="";});},250);});});
  initLightbox(m);
}
function initLightbox(m){
  const lb=$("#lightbox"),img=$("#lbImg"),cap=$("#lbCap");let idx=0;
  const vis=()=>$$(".g-item:not(.hide)",m).map(e=>+e.dataset.i);
  const set=i=>{idx=i;const [id,,t]=GALLERY[i];img.src=U(id);img.alt=t;cap.textContent=t;};
  const move=d=>{const v=vis(),p=v.indexOf(idx);set(v[(p+d+v.length)%v.length]);};
  const open=i=>{set(i);openModal(lb);};
  m.addEventListener("click",e=>{const f=e.target.closest(".g-item");if(f)open(+f.dataset.i);});
  m.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.dataset.i)open(+e.target.dataset.i);});
  $(".lb-prev",lb).onclick=()=>move(-1);$(".lb-next",lb).onclick=()=>move(1);
  document.addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="ArrowLeft")move(-1);if(e.key==="ArrowRight")move(1);});
  let sx=0;lb.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
  lb.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)move(dx<0?1:-1);});
}

/* ---------- Modals (shared, with focus trap) ---------- */
let lastFocus=null;
function openModal(md){lastFocus=document.activeElement;md.classList.add("open");document.body.style.overflow="hidden";$(".modal__close",md).focus();}
function closeModal(md){md.classList.remove("open");document.body.style.overflow="";if(md.id==="trailerModal")$("#trailerFrame").src="";lastFocus&&lastFocus.focus();}
function initModals(){
  $("#trailerBtn").onclick=()=>{$("#trailerFrame").src="https://www.youtube.com/embed/udAL48P5NJU?autoplay=1";openModal($("#trailerModal"));};
  $$(".modal").forEach(md=>{$(".modal__close",md).onclick=()=>closeModal(md);md.addEventListener("click",e=>{if(e.target===md)closeModal(md);});});
  document.addEventListener("keydown",e=>{const md=$(".modal.open");if(!md)return;
    if(e.key==="Escape")closeModal(md);
    if(e.key==="Tab"){const f=$$("button,iframe",md),a=f[0],z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}});
}

/* ---------- Crew + 3D tilt ---------- */
function initTilt(){
  const g=$("#crewGrid"),ico='<a href="#" aria-label="Twitter">𝕏</a><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Instagram">◎</a>';
  g.innerHTML=CREW.map(([n,r,id],i)=>`<article class="c-card glass" data-reveal="fade-up" data-delay="${i*120}"><img src="https://images.unsplash.com/${id}?w=600&q=80" alt="Portrait of ${n}" width="400" height="500" loading="lazy"><div class="c-body"><h3>${n}</h3><p>${r}</p><div class="c-social">${ico}</div></div><span class="glare"></span></article>`).join("");
  if(matchMedia("(hover:none)").matches||reduced)return;
  $$(".c-card",g).forEach(c=>{
    c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      // map cursor position (0..1) to rotation of ±12deg
      c.style.transform=`rotateY(${(x-.5)*24}deg) rotateX(${(.5-y)*24}deg) translateZ(10px)`;
      c.style.setProperty("--gx",x*100+"%");c.style.setProperty("--gy",y*100+"%");});
    c.addEventListener("mouseleave",()=>c.style.transform="");});
}

/* ---------- Quotes slider ---------- */
function initSlider(){
  const s=$("#slider"),tr=$("#sliderTrack"),dots=$("#sliderDots");let i=0,timer;
  tr.innerHTML=QUOTES.map(([q,a])=>`<div class="slide"><blockquote>“${q}”</blockquote><cite>— ${a}</cite></div>`).join("");
  dots.innerHTML=QUOTES.map((_,k)=>`<button aria-label="Quote ${k+1}"></button>`).join("");
  const go=k=>{i=(k+QUOTES.length)%QUOTES.length;tr.style.transform=`translateX(-${i*100}%)`;$$("button",dots).forEach((d,j)=>d.classList.toggle("active",j===i));};
  const play=()=>{clearInterval(timer);timer=setInterval(()=>go(i+1),5000);};
  dots.addEventListener("click",e=>{const b=e.target.closest("button");if(b){go($$("button",dots).indexOf(b));play();}});
  s.addEventListener("mouseenter",()=>clearInterval(timer));s.addEventListener("mouseleave",play);
  let sx=0;s.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});
  s.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50){go(i+(dx<0?1:-1));play();}});
  go(0);play();
}

/* ---------- Forms ---------- */
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3200);}
function initForm(){
  const f=$("#contactForm");
  const rules={name:v=>v.trim().length>=2||"Please tell us your name (2+ characters).",email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)||"That email doesn't look quite right.",subject:v=>v.trim().length>=3||"Add a short subject.",message:v=>v.trim().length>=10||"Your message needs at least 10 characters."};
  const check=el=>{const r=rules[el.name](el.value),fd=el.parentElement;fd.classList.toggle("error",r!==true);$("small",fd).textContent=r===true?"":r;return r===true;};
  $$("input,textarea",f).forEach(el=>el.addEventListener("input",()=>check(el)));
  f.addEventListener("submit",e=>{e.preventDefault();const ok=$$("input,textarea",f).map(check).every(Boolean);if(!ok)return;
    const b=$("button",f);b.classList.add("loading");b.disabled=true;
    setTimeout(()=>{b.classList.remove("loading");b.disabled=false;f.reset();toast("Transmission received 🚀");},1600);});
  $("#newsletter").addEventListener("submit",e=>{e.preventDefault();e.target.reset();toast("You're on the launch list ✨");});
}

/* ---------- Cursor, magnetic, progress, back-to-top ---------- */
function initCursor(){
  if(matchMedia("(hover:none)").matches)return;
  const d=$(".cursor-dot"),r=$(".cursor-ring");let x=0,y=0,rx=0,ry=0;
  addEventListener("mousemove",e=>{x=e.clientX;y=e.clientY;d.style.transform=`translate(${x-3}px,${y-3}px)`;});
  const loop=()=>{rx+=(x-rx)*.18;ry+=(y-ry)*.18;r.style.transform=`translate(${rx-r.offsetWidth/2}px,${ry-r.offsetHeight/2}px)`;requestAnimationFrame(loop);};loop();
  document.addEventListener("mouseover",e=>r.classList.toggle("grow",!!e.target.closest("a,button,.g-item")));
  $$(".magnetic").forEach(b=>{b.addEventListener("mousemove",e=>{const rc=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-rc.left-rc.width/2)*.3}px,${(e.clientY-rc.top-rc.height/2)*.4}px)`;});b.addEventListener("mouseleave",()=>b.style.transform="");});
}
function initScrollProgress(){
  const bar=$("#progressBar"),top=$("#toTop"),ring=$("#topRing"),C=138.2;
  const upd=()=>{const p=scrollY/(document.documentElement.scrollHeight-innerHeight||1);bar.style.width=p*100+"%";ring.style.strokeDashoffset=C*(1-p);top.classList.toggle("show",scrollY>600);};
  addEventListener("scroll",()=>requestAnimationFrame(upd),{passive:true});upd();
  top.onclick=()=>scrollTo({top:0,behavior:"smooth"});
  $("#year").textContent=new Date().getFullYear();
}
function debounce(fn,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};}

initPreloader();
document.addEventListener("DOMContentLoaded",()=>{initStarfield();initNavbar();initTyping();initCounters();initPlanets();initTimeline();initGallery();initModals();initTilt();initSlider();initForm();initCursor();initScrollProgress();initReveal();});
})();
