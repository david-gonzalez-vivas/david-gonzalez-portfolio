const skills=[
 {n:'DATA',x:165,y:125,c:1},{n:'WEB',x:445,y:115,c:1},{n:'QUALITY',x:185,y:345,c:1},{n:'SYSTEMS',x:455,y:345,c:1},
 {n:'Python',x:72,y:62},{n:'SQL',x:104,y:198},{n:'BigQuery',x:245,y:62},{n:'Power BI',x:266,y:183},
 {n:'HTML/CSS',x:365,y:52},{n:'JavaScript',x:500,y:48},{n:'WordPress',x:540,y:142},{n:'Google Analytics',x:405,y:205},
 {n:'Research',x:72,y:330},{n:'UX/UI',x:120,y:420},{n:'Validation',x:245,y:420},{n:'Strategy',x:300,y:315},
 {n:'AWS',x:530,y:280},{n:'Cloudflare',x:550,y:405},{n:'Security',x:405,y:420},{n:'Infrastructure',x:390,y:275}
];
const links=[
 [0,4],[0,5],[0,6],[0,7],
 [1,8],[1,9],[1,10],[1,11],
 [2,12],[2,13],[2,14],[2,15],
 [3,16],[3,17],[3,18],[3,19],
 [11,0],[12,0],[15,1],[18,1],[19,1]
];
const svg=document.querySelector('#skillNetwork'), eg=svg.querySelector('.edges'), ng=svg.querySelector('.nodes');
links.forEach(([a,b],i)=>{let l=document.createElementNS('http://www.w3.org/2000/svg','line');Object.entries({x1:skills[a].x,y1:skills[a].y,x2:skills[b].x,y2:skills[b].y,class:'edge'}).forEach(([k,v])=>l.setAttribute(k,v));l.dataset.a=a;l.dataset.b=b;l.style.setProperty('--delay',`${i*28}ms`);eg.appendChild(l)});
skills.forEach((s,i)=>{let g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','node '+(s.c?'core':''));g.dataset.index=i;g.style.setProperty('--delay',`${180+i*34}ms`);let c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',s.x);c.setAttribute('cy',s.y);c.setAttribute('r',s.c?8:5);let t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',s.x+11);t.setAttribute('y',s.y+4);t.textContent=s.n;g.append(c,t);ng.appendChild(g)});
// Skill network: reveal on scroll, highlight connected disciplines on hover/focus, subtle pointer parallax.
const networkWrap=document.querySelector('.network-wrap');
const networkObserver=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){networkWrap.classList.add('network-ready');networkObserver.disconnect()}},{threshold:.28});
networkObserver.observe(networkWrap);
const nodeEls=[...ng.querySelectorAll('.node')], edgeEls=[...eg.querySelectorAll('.edge')];
function highlightNetwork(index){
 const related=new Set([index]);
 links.forEach(([a,b])=>{if(a===index)related.add(b);if(b===index)related.add(a)});
 nodeEls.forEach((el,i)=>el.classList.toggle('is-related',related.has(i)));
 nodeEls.forEach((el,i)=>el.classList.toggle('is-dim',!related.has(i)));
 edgeEls.forEach(el=>{const hit=+el.dataset.a===index||+el.dataset.b===index;el.classList.toggle('is-related',hit);el.classList.toggle('is-dim',!hit)});
}
function clearNetwork(){nodeEls.forEach(el=>el.classList.remove('is-related','is-dim'));edgeEls.forEach(el=>el.classList.remove('is-related','is-dim'))}
nodeEls.slice(0,4).forEach((el,i)=>{el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label',`Highlight ${skills[i].n} connections`);el.addEventListener('mouseenter',()=>highlightNetwork(i));el.addEventListener('mouseleave',clearNetwork);el.addEventListener('focus',()=>highlightNetwork(i));el.addEventListener('blur',clearNetwork)});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 // v14: breathing uses SVG group transforms; CSS no longer overrides the transform attribute.
 // This avoids conflicts with the entrance animation and keeps a single continuous phase.
 const motionStart=performance.now();
 const offsets=skills.map(()=>({x:0,y:0}));
 const nodeMotion=skills.map((_,i)=>(
  {ax:16+(i%4)*4.2, ay:12+(i%5)*3.1,
   sx:.00042+(i%3)*.000052, sy:.00034+(i%4)*.000046,
   px:i*.71, py:i*1.13}
 ));
 function smoothstep(v){return v*v*(3-2*v)}
 function breathe(now){
  const elapsed=now-motionStart;
  // Give the entrance animation time to settle, then smoothly increase movement.
  const ramp=smoothstep(Math.max(0,Math.min(1,(elapsed-650)/1100)));
  skills.forEach((s,i)=>{
   const m=nodeMotion[i];
   const ox=Math.sin(elapsed*m.sx+m.px)*m.ax*ramp;
   const oy=Math.cos(elapsed*m.sy+m.py)*m.ay*ramp;
   offsets[i].x=ox; offsets[i].y=oy;
   nodeEls[i].setAttribute('transform',`translate(${ox.toFixed(2)} ${oy.toFixed(2)})`);
  });
  edgeEls.forEach(el=>{
   const a=+el.dataset.a,b=+el.dataset.b;
   el.setAttribute('x1',(skills[a].x+offsets[a].x).toFixed(2));
   el.setAttribute('y1',(skills[a].y+offsets[a].y).toFixed(2));
   el.setAttribute('x2',(skills[b].x+offsets[b].x).toFixed(2));
   el.setAttribute('y2',(skills[b].y+offsets[b].y).toFixed(2));
  });
  requestAnimationFrame(breathe);
 }
 requestAnimationFrame(breathe);
 networkWrap.addEventListener('pointermove',e=>{
  const r=networkWrap.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  svg.style.transform=`translate(${x*7}px,${y*7}px) rotateX(${-y*1.4}deg) rotateY(${x*1.4}deg)`;
 });
 networkWrap.addEventListener('pointerleave',()=>{svg.style.transform=''});
}
const names=['DATA','WEB','QUALITY','SYSTEMS'];
function bars(el,vals){el.innerHTML=names.map((n,i)=>`<div class="bar"><div class="bar-head"><span>${n}</span><span>${String(vals[i]).padStart(2,'0')}</span></div><div class="track"><div class="fill" style="width:${vals[i]}%"></div></div></div>`).join('')}
const pb=document.querySelector('#projectBars');bars(pb,[55,100,70,90]);document.querySelectorAll('.project').forEach(p=>{const activate=()=>{document.querySelectorAll('.project').forEach(x=>x.classList.remove('active'));p.classList.add('active');bars(pb,p.dataset.profile.split(',').map(Number))};p.addEventListener('mouseenter',activate);p.addEventListener('focus',activate);p.addEventListener('click',()=>{activate(); if(p.dataset.href) window.location.href=p.dataset.href});p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(); if(p.dataset.href) window.location.href=p.dataset.href}})});
const career=[
 {y:'2010 — 2022',t:'elPeriódico de Guatemala',c:'IT → web → analytics → systems. The foundation of the connected profile.',v:[45,92,48,78]},
 {y:'2022',t:'HealthCare.com',c:'Systems and operational reliability become a more explicit part of the work.',v:[48,92,58,88]},
 {y:'2023',t:'European Union',c:'Data becomes a primary discipline: extraction, structuring, analysis and reporting.',v:[88,92,66,88]},
 {y:'2024 — 2026',t:'Fundación DESC',c:'Web, product, automation, quality and systems converge around a live digital platform.',v:[90,100,86,96]},
 {y:'2026 — PRESENT',t:'Apte',c:'Analytics engineering brings the accumulated systems mindset into data-centered work.',v:[100,100,92,98]}
];
const cy=document.querySelector('#careerYear'),ct=document.querySelector('#careerTitle'),cc=document.querySelector('#careerChange'),cs=document.querySelector('#careerSignals');
const roles=[...document.querySelectorAll('.role')];const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const careerCount=document.querySelector('#careerCount');
let activeCareer=0;
function renderCareer(i){
 activeCareer=(i+career.length)%career.length;
 const item=career[activeCareer];
 roles.forEach((r,n)=>r.classList.toggle('active',n===activeCareer));
 cy.textContent=item.y;ct.textContent=item.t;cc.textContent=item.c;bars(cs,item.v);
 if(careerCount) careerCount.textContent=`${String(activeCareer+1).padStart(2,'0')} / ${String(career.length).padStart(2,'0')}`;
}
renderCareer(0);
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)renderCareer(+e.target.dataset.role)})},{rootMargin:'-38% 0px -48% 0px',threshold:0});roles.forEach(r=>io.observe(r));
const careerPrev=document.querySelector('#careerPrev'),careerNext=document.querySelector('#careerNext');
if(careerPrev)careerPrev.addEventListener('click',()=>renderCareer(activeCareer-1));
if(careerNext)careerNext.addEventListener('click',()=>renderCareer(activeCareer+1));

// v8 — on compact layouts each project carries its own discipline profile.
document.querySelectorAll('.project').forEach(project=>{
  const vals=project.dataset.profile.split(',').map(Number);
  const content=project.children[1];
  const profile=document.createElement('div');
  profile.className='mobile-project-profile';
  profile.setAttribute('aria-label','Project discipline profile');
  profile.innerHTML=names.map((name,i)=>`<div class="mini-bar"><div class="mini-bar-head"><span>${name}</span><span>${String(vals[i]).padStart(2,'0')}</span></div><div class="mini-track"><div class="mini-fill" style="width:${vals[i]}%"></div></div></div>`).join('');
  content.appendChild(profile);
});

// v18 — ABOUT assembles on scroll, then the background system keeps orbiting gently.
(() => {
  const wrap = document.querySelector('#aboutPortrait');
  if (!wrap || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pieces = [...wrap.querySelectorAll('[data-from]')];
  const portrait = wrap.querySelector('.portrait');
  const frame = wrap.querySelector('.portrait-frame');
  const parse = el => el.dataset.from.split(',').map(Number);
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = t => 1 - Math.pow(1 - t, 3);

  // Different radii / speeds keep the motion organic rather than making every item
  // rotate as one rigid wheel. Large structural shapes move less; small markers move more.
  const orbital = pieces.map((el, i) => {
    const structural = el.classList.contains('art-orbit') || el.classList.contains('art-arc') || el.classList.contains('art-block');
    return {
      rx: structural ? 7 + (i % 2) * 2.2 : 12 + (i % 4) * 3.2,
      ry: structural ? 5 + (i % 3) * 1.2 : 8 + (i % 3) * 2.6,
      speed: structural ? .00024 + (i % 3) * .000035 : .00032 + (i % 4) * .000045,
      phase: i * 1.73,
      dir: i % 2 ? -1 : 1,
      spin: structural ? 1.1 : 2.2
    };
  });

  let scrollProgress = 0;
  let visible = true;

  function updateProgress(){
    const r = wrap.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const raw = clamp((vh * .96 - r.top) / (vh * .72));
    scrollProgress = ease(raw);
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
  }, { rootMargin: '25% 0px 25% 0px' });
  observer.observe(wrap);

  function render(now){
    const p = scrollProgress;
    // Orbit fades in only as the scattered pieces approach their final composition.
    const orbitMix = ease(clamp((p - .34) / .42));

    pieces.forEach((el, i) => {
      const [fx, fy, fr] = parse(el);
      const local = clamp((p - i * .012) / (.86 - i * .004));
      const q = ease(local);
      const o = orbital[i];
      const angle = now * o.speed * o.dir + o.phase;
      const ox = Math.cos(angle) * o.rx * orbitMix;
      const oy = Math.sin(angle) * o.ry * orbitMix;
      const orbitRot = Math.sin(angle * .72) * o.spin * orbitMix;
      const x = fx * (1 - q) + ox;
      const y = fy * (1 - q) + oy;
      const rot = fr * (1 - q) + orbitRot;
      const scale = .92 + .08 * q;
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = String(.16 + .84 * q);
    });

    // Keep the portrait stable; only the surrounding system orbits.
    const drift = (.5 - p) * 5;
    if (portrait) portrait.style.transform = `translate3d(0,${drift.toFixed(2)}px,0)`;
    if (frame) frame.style.transform = `translate3d(-24px,${(20 - drift * .45).toFixed(2)}px,0)`;

    requestAnimationFrame(render);
  }

  const requestProgress = () => updateProgress();
  addEventListener('scroll', requestProgress, { passive: true });
  addEventListener('resize', requestProgress, { passive: true });
  updateProgress();
  requestAnimationFrame(render);
})();
