const $=s=>document.querySelector(s),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const C=['#22e6ff','#8a5bff','#ff3fd0','#ff9f43'];
let mx=innerWidth/2,my=innerHeight/2;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;const g=$('#glow');g.style.left=mx+'px';g.style.top=my+'px'});
// theme
try{const t=localStorage.getItem('th');if(t)document.documentElement.dataset.theme=t}catch(e){}
$('#tg').onclick=()=>{const d=document.documentElement,dark=getComputedStyle(d).getPropertyValue('--bg').trim()==='#070714';d.dataset.theme=dark?'light':'dark';try{localStorage.setItem('th',d.dataset.theme)}catch(e){}};
// background: drifting data nodes
const bg=$('#bg'),bx=bg.getContext('2d');let P=[];
function rs(){bg.width=innerWidth;bg.height=innerHeight;P=Array.from({length:Math.min(70,innerWidth/18|0)},()=>({x:Math.random()*bg.width,y:Math.random()*bg.height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,c:C[Math.random()*4|0]}))}
rs();addEventListener('resize',rs);
function drawBg(){bx.clearRect(0,0,bg.width,bg.height);
for(const p of P){const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);if(d<150){p.x+=dx/d*1.2;p.y+=dy/d*1.2}
p.x=(p.x+p.vx+bg.width)%bg.width;p.y=(p.y+p.vy+bg.height)%bg.height;
bx.fillStyle=p.c;bx.shadowColor=p.c;bx.shadowBlur=12;bx.beginPath();bx.arc(p.x,p.y,2,0,7);bx.fill()}
bx.shadowBlur=0;
for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<120){bx.strokeStyle=`rgba(138,91,255,${.25*(1-d/120)})`;bx.beginPath();bx.moveTo(P[i].x,P[i].y);bx.lineTo(P[j].x,P[j].y);bx.stroke()}}}
// hero chart: neon bars that rise on load and swell near the cursor
const ch=$('#chart'),cx=ch.getContext('2d'),N=34;let t0=performance.now(),cm=-1;
function rc(){const r=ch.getBoundingClientRect(),d=devicePixelRatio||1;ch.width=r.width*d;ch.height=r.height*d;cx.setTransform(d,0,0,d,0,0)}
rc();addEventListener('resize',rc);
ch.addEventListener('pointermove',e=>{const r=ch.getBoundingClientRect();cm=(e.clientX-r.left)/r.width});
ch.addEventListener('pointerleave',()=>cm=-1);
function drawCh(now){const w=ch.clientWidth,h=ch.clientHeight,el=Math.min(1,(now-t0)/1600),bw=w/N;cx.clearRect(0,0,w,h);
const pts=[];
for(let i=0;i<N;i++){const f=i/N;let v=.28+.5*f+.14*Math.sin(i*.9+now/900);
if(cm>=0)v+=.25*Math.exp(-Math.pow((f-cm)*7,2));
const bh=Math.min(.97,v)*h*Math.min(1,el*1.4-f*.4>0?el*1.4-f*.4:0),x=i*bw+bw*.15,g=cx.createLinearGradient(0,h-bh,0,h);
g.addColorStop(0,C[(i%3+1)%4]);g.addColorStop(1,C[1]+'22');cx.fillStyle=g;cx.shadowColor=C[(i%3+1)%4];cx.shadowBlur=14;cx.fillRect(x,h-bh,bw*.7,bh);pts.push([x+bw*.35,h-bh-12])}
cx.shadowColor=C[3];cx.shadowBlur=16;cx.strokeStyle=C[3];cx.lineWidth=2;cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(...p):cx.moveTo(...p));cx.stroke()}
function loop(now){drawBg();drawCh(now);if(!RM)requestAnimationFrame(loop)}
requestAnimationFrame(loop);if(RM)setTimeout(()=>loop(t0+3000),50);
// reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('on');
e.target.querySelectorAll('.num').forEach(n=>{const T=+n.dataset.n,s=n.dataset.s||'',st=performance.now();(function f(now){const k=Math.min(1,(now-st)/1300);n.textContent=Math.round(T*(1-Math.pow(1-k,3)))+s;if(k<1)requestAnimationFrame(f)})(st)});io.unobserve(e.target)}),{threshold:.2});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));
// 3D tilt + spotlight on cards
document.querySelectorAll('.card').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty('--x',x*100+'%');c.style.setProperty('--y',y*100+'%');if(!RM&&c.id!=='panel')c.style.transform=`perspective(700px) rotateY(${(x-.5)*8}deg) rotateX(${(.5-y)*8}deg) translateY(-4px)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
// work tabs
const W=[
['Lazers\' Edge','B2B marketing · Customer acquisition','Turn local service into a reason to choose.','Audited website pathways and compared six national competitors to find gaps in search visibility, managed-print-service messaging, and conversion paths.','Channel roadmap and website concepts sized to a $3K–$5K annual marketing budget.',['Competitive analysis','Channel strategy','Conversion paths']],
['Lodgic','Consulting · Search demand','See how customers find and compare.','Benchmarked competitors and reviewed search demand across 10 keywords to show where a local business could earn attention.','Competitor benchmarks, keyword findings, and practical channel recommendations.',['Benchmarking','SEO','Keyword analysis']],
['Zenith Precision','Sales analytics · Excel','Make RFQ activity easy to scan.','Built a workbook dashboard covering 204 RFQs and 1,300+ part records, filterable by industry, division, status, outcome, and turnaround.','A one-screen view of pipeline counts and cycle times for the sales team.',['PivotTables','Slicers','KPI reporting']],
['Quantum Cognition','Interactive course · UIUC Gies','Let students test assumptions.','Created 16 lab experiments with 50+ interactive controls in Python, Jupyter, and the browser, built alongside faculty.','A hands-on lesson experience instead of a static reading.',['Python','ipywidgets','Scenario analysis']]];
const tb=$('#tabs'),pn=$('#panel');
function show(i){[...tb.children].forEach((b,j)=>b.setAttribute('aria-selected',j===i));const w=W[i];pn.style.animation='none';pn.offsetHeight;pn.style.animation='';
pn.innerHTML=`<div class="when">${w[1]}</div><h3 style="font-size:30px;margin:8px 0 12px">${w[2]}</h3><p style="max-width:680px">${w[3]}</p><p class="ch"><b>Contribution:</b> ${w[4]}</p><div class="chips">${w[5].map(s=>`<span class="chip">${s}</span>`).join('')}</div>`}
W.forEach((w,i)=>{const b=document.createElement('button');b.role='tab';b.textContent=w[0];b.onclick=()=>show(i);tb.append(b)});show(0);
// skills
const S=[['Growth & Marketing','Customer research,Segmentation,Channel strategy,SEO and keyword analysis,Conversion analysis,Competitive analysis'],['Analytics','Funnel analysis,KPI reporting,Cycle-time analysis,Scenario and sensitivity analysis,Customer behavior analysis'],['Technical Tools','Python,NumPy,Matplotlib,ipywidgets,Excel dashboards,PivotTables,Slicers,SQL,Tableau'],['Business Analysis','Requirements gathering,Process mapping,CRM prioritization,Cross-functional collaboration,Technical documentation']];
$('#sk').innerHTML=S.map(s=>`<div class="card rv"><h3>${s[0]}</h3><div class="chips">${s[1].split(',').map(x=>`<span class="chip">${x}</span>`).join('')}</div></div>`).join('');
document.querySelectorAll('#sk .rv').forEach(e=>io.observe(e));
// nav highlight
const secs=['experience','work','skills','contact'].map(id=>$('#'+id));
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('nav ul a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'}).observe&&secs.forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('nav ul a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'}).observe(s));

// parallax photo
addEventListener('pointermove',e=>{const p=$('#ph');if(!p||RM)return;p.style.setProperty('--px',((e.clientX/innerWidth-.5)*-16)+'px');p.style.setProperty('--py',((e.clientY/innerHeight-.5)*-16)+'px')});
// work slider
const E=[
['2026–present · Business Strategy Research Analyst','UIUC Gies College of Business','Interactive lessons and analytical tools built with faculty. Python models, Jupyter notebooks, and browser experiences let students test assumptions.',[['16','lab experiments'],['50+','controls']],['Python','Jupyter','ipywidgets','Faculty collaboration']],
['Feb–May 2025 · Business Operations & Analytics','Zenith Precision','An Excel dashboard tracking requests by industry, division, status, outcome, and turnaround time, so the team could scan sales at a glance.',[['204','RFQs'],['1,300+','part records']],['Excel','PivotTables','Slicers','KPI reporting']],
['2025–2026 · CRM & Prospect Engagement','UIUC Enrollment Operations','Follow-up adapted to each student\u2019s interest, decision stage, and urgency: prioritize, personalize, follow up.',[['4','channels'],['100+','students']],['CRM','Segmentation','Prioritization','Follow-up']],
['2025–2026 · Growth Consulting Projects','Lodgic + Lazers\u2019 Edge','Studied how customers find, compare, and choose for two local businesses: competitor benchmarks, search demand, website paths, channel advice.',[['2','businesses'],['10','keywords']],['Competitor benchmarks','Search demand','Website paths','Channel advice']],
['Python · Flask · Machine Learning','MatchOracle','A football match prediction system using team strength, recent form, league strength, home advantage and goal-based modeling.',[],['Team strength','Recent form','League strength','Home advantage','Goal-based modeling']]];
const tr=$('#tr'),dt=$('#dots'),vp=$('.viewport');let cur=0;
tr.innerHTML=E.map((e,i)=>`<article class="slide" aria-label="${i+1} of ${E.length}"><span class="st">${e[0]}</span><h3>${e[1]}</h3><p>${e[2]}</p><div class="more">${e[3].length?`<div class="kp">${e[3].map(k=>`<span><b>${k[0]}</b>${k[1]}</span>`).join('')}</div>`:''}<div class="chips">${e[4].map(c=>`<span class="chip">${c}</span>`).join('')}</div></div><button class="lm" aria-expanded="false">Learn more</button></article>`).join('');
dt.innerHTML=E.map((e,i)=>`<button aria-label="Go to ${e[1]}"></button>`).join('');
function go(i){cur=(i+E.length)%E.length;tr.style.transform=`translateX(${-cur*100}%)`;[...tr.children].forEach((s,k)=>s.inert=k!==cur);[...dt.children].forEach((d,k)=>d.classList.toggle('on',k===cur))}
tr.querySelectorAll('.lm').forEach(b=>b.onclick=()=>{const s=b.parentElement,o=s.classList.toggle('open');b.textContent=o?'Show less':'Learn more';b.setAttribute('aria-expanded',o)});
[...dt.children].forEach((d,k)=>d.onclick=()=>go(k));
$('#pv').onclick=()=>go(cur-1);$('#nx').onclick=()=>go(cur+1);
let sx=null;vp.addEventListener('pointerdown',e=>sx=e.clientX);
vp.addEventListener('pointerup',e=>{if(sx===null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>50)go(cur+(d<0?1:-1))});
$('.slider').addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(cur+1);if(e.key==='ArrowLeft')go(cur-1)});
go(0);
