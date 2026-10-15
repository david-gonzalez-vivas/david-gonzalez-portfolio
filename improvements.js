// v56 — hero type reveal + About portrait art + radar interactions + mobile carousel + responsive mountain treatment
(()=>{
// Refined one-time hero reveal: words arrive in sequence, letters settle subtly into place.
const heroTitle=document.querySelector('#intro.hero h1');
if(heroTitle&&!heroTitle.dataset.revealReady){
 heroTitle.dataset.revealReady='true';
 const words=[...heroTitle.querySelectorAll(':scope > span')];
 words.forEach((word,wordIndex)=>{
  const text=word.textContent;
  word.setAttribute('aria-label',text);
  word.classList.add('hero-reveal-word');
  word.innerHTML=[...text].map((char,charIndex)=>`<span class="hero-reveal-letter" aria-hidden="true" style="--word:${wordIndex};--letter:${charIndex}">${char===' '?'&nbsp;':char}</span>`).join('');
 });
 requestAnimationFrame(()=>requestAnimationFrame(()=>heroTitle.classList.add('hero-reveal-ready')));
}

// Restore the original About composition removed from the compact homepage markup.
const aboutPortrait=document.querySelector('#aboutPortrait');
if(aboutPortrait&&!aboutPortrait.querySelector('.portrait-art')){
 const art=document.createElement('div');
 art.className='portrait-art';
 art.setAttribute('aria-hidden','true');
 art.innerHTML=`
  <span class="art-shape art-arc" data-from="-42,32,-18" data-to="0,0,0"></span>
  <span class="art-shape art-orbit" data-from="46,-35,22" data-to="0,0,0"></span>
  <span class="art-shape art-block" data-from="-54,-18,-13" data-to="0,0,0"></span>
  <span class="art-shape art-circle art-circle-a" data-from="38,48,0" data-to="0,0,0"></span>
  <span class="art-shape art-circle art-circle-b" data-from="-30,-45,0" data-to="0,0,0"></span>
  <span class="art-shape art-cross" data-from="58,22,18" data-to="0,0,0"></span>
  <span class="art-shape art-dots" data-from="-48,45,-8" data-to="0,0,0"></span>
  <span class="art-shape art-rule art-rule-a" data-from="65,-28,12" data-to="0,0,0"></span>
  <span class="art-shape art-rule art-rule-b" data-from="-55,20,-18" data-to="0,0,0"></span>
  <span class="art-code" data-from="-58,-35,-6" data-to="0,0,0"><code>const solve = problem =&gt; {<br>&nbsp;&nbsp;research(problem);<br>&nbsp;&nbsp;structure();<br>&nbsp;&nbsp;build();<br>&nbsp;&nbsp;verify();<br>};</code></span>
  <span class="art-stack" data-from="62,42,8" data-to="0,0,0">// BUILD<br>// AUTOMATE<br>// ANALYZE<br>// IMPROVE<br>// REPEAT</span>
  <span class="art-disciplines" data-from="52,-44,5" data-to="0,0,0">DATA<br>SYSTEMS<br>WEB<br>QA<br>AUTOMATION</span>`;
 aboutPortrait.prepend(art);
 if(!aboutPortrait.querySelector('.portrait-meta')){
  const meta=document.createElement('div');
  meta.className='portrait-meta';
  meta.innerHTML='<span>CARLOS DAVID</span><span>PROFILE / 05</span><i></i><span>GUATEMALA</span><span>REMOTE</span><span>SYSTEM STATUS</span><span>AVAILABLE <b></b></span>';
  aboutPortrait.appendChild(meta);
 }
}

const names=['DATA','WEB','QUALITY','SYSTEMS'];
function radar(el,initial,compact=false){
 if(!el)return null;
 const c=150,r=compact?82:94,levels=[.25,.5,.75,1];
 const pt=(i,v)=>{const a=(-90+i*90)*Math.PI/180,rr=r*(v/100);return [c+Math.cos(a)*rr,c+Math.sin(a)*rr]};
 const ring=v=>[0,1,2,3].map(i=>pt(i,v*100)).map(x=>x.join(',')).join(' ');
 el.innerHTML=`<svg class="discipline-radar${compact?' compact-radar':''}" viewBox="0 0 300 300" role="img" aria-label="Discipline profile: Data, Web, Quality and Systems">${levels.map(v=>`<polygon class="radar-grid" points="${ring(v)}"/>`).join('')}<line class="radar-axis" x1="150" y1="${150-r}" x2="150" y2="${150+r}"/><line class="radar-axis" x1="${150-r}" y1="150" x2="${150+r}" y2="150"/><polygon class="radar-shape"/><g class="radar-dots"></g><text class="radar-label" x="150" y="42" text-anchor="middle">DATA</text><text class="radar-label" x="267" y="153" text-anchor="end">WEB</text><text class="radar-label" x="150" y="266" text-anchor="middle">QUALITY</text><text class="radar-label" x="33" y="153">SYSTEMS</text></svg>`;
 const poly=el.querySelector('.radar-shape'),dots=el.querySelector('.radar-dots');dots.innerHTML=names.map(()=>'<circle class="radar-dot" r="4"/>').join('');
 const update=vals=>{const points=vals.map((v,i)=>pt(i,v));poly.setAttribute('points',points.map(x=>x.join(',')).join(' '));[...dots.children].forEach((d,i)=>{d.setAttribute('cx',points[i][0]);d.setAttribute('cy',points[i][1])});};update(initial);return update;
}
const projectRadar=radar(document.querySelector('#projectRadar'),[45,100,70,65]);
document.querySelectorAll('.project').forEach(project=>{const update=()=>projectRadar&&projectRadar(project.dataset.profile.split(',').map(Number));project.addEventListener('mouseenter',update);project.addEventListener('focus',update);project.addEventListener('click',update);});
document.querySelectorAll('.project').forEach(project=>{const content=project.children[1];if(!content||content.querySelector('.mobile-project-radar'))return;const holder=document.createElement('div');holder.className='mobile-project-radar';holder.setAttribute('aria-label','Project discipline profile');content.appendChild(holder);radar(holder,project.dataset.profile.split(',').map(Number),true);});
const projects=document.querySelector('.projects');
if(projects&&projects.children.length){const cards=[...projects.querySelectorAll('.project')];const nav=document.createElement('div');nav.className='mobile-work-nav';nav.setAttribute('aria-label','Selected work carousel controls');nav.innerHTML=`<span class="mobile-work-count" aria-live="polite">01 / ${String(cards.length).padStart(2,'0')}</span><div class="mobile-work-dots" aria-hidden="true">${cards.map((_,i)=>`<span class="mobile-work-dot${i===0?' active':''}"></span>`).join('')}</div><div class="mobile-work-arrows"><button class="mobile-work-arrow work-prev" type="button" aria-label="Previous project">←</button><button class="mobile-work-arrow work-next" type="button" aria-label="Next project">→</button></div>`;projects.insertAdjacentElement('afterend',nav);const count=nav.querySelector('.mobile-work-count'),dots=[...nav.querySelectorAll('.mobile-work-dot')],prev=nav.querySelector('.work-prev'),next=nav.querySelector('.work-next');let current=0;const setCurrent=i=>{current=Math.max(0,Math.min(i,cards.length-1));count.textContent=`${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;dots.forEach((d,n)=>d.classList.toggle('active',n===current));prev.disabled=current===0;next.disabled=current===cards.length-1;};const go=i=>{const card=cards[Math.max(0,Math.min(i,cards.length-1))];if(card)projects.scrollTo({left:card.offsetLeft-projects.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));let ticking=false;projects.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{let best=0,dist=Infinity;cards.forEach((card,i)=>{const d=Math.abs(card.offsetLeft-projects.offsetLeft-projects.scrollLeft);if(d<dist){dist=d;best=i}});setCurrent(best);ticking=false;});},{passive:true});setCurrent(0);}

// Desktop: mountains remain at the bottom of the hero with parallax. Mobile: a static opener before 01 / INTRO.
const hero=document.querySelector('#intro.hero');
if(hero&&!hero.querySelector('.hero-mountains')){
 const mountains=document.createElement('div');mountains.className='hero-mountains';mountains.setAttribute('aria-hidden','true');mountains.innerHTML='<img src="montains-paralax.png" alt="" decoding="async">';hero.appendChild(mountains);
 const mobileStyle=document.createElement('style');mobileStyle.textContent='@media(max-width:600px){#intro.hero{padding-top:clamp(145px,40vw,185px)!important;padding-bottom:70px!important}.hero-mountains{top:0!important;bottom:auto!important;height:clamp(115px,32vw,150px)!important}.hero-mountains img{bottom:0!important;width:100%!important;max-width:100%!important;transform:translateX(-50%)!important;will-change:auto!important}.hero-mountains:after{height:18%!important}}@media(max-width:360px){#intro.hero{padding-top:128px!important}.hero-mountains{height:108px!important}}';document.head.appendChild(mobileStyle);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  let raf=0;
  const updateMountains=()=>{raf=0;if(matchMedia('(max-width:600px)').matches)return;const rect=hero.getBoundingClientRect();const travelled=Math.max(0,Math.min(hero.offsetHeight,-rect.top));const shift=travelled*.12;mountains.style.setProperty('--hero-mountain-y',`${shift.toFixed(1)}px`);};
  const requestMountains=()=>{if(!raf)raf=requestAnimationFrame(updateMountains)};
  addEventListener('scroll',requestMountains,{passive:true});addEventListener('resize',requestMountains,{passive:true});updateMountains();
 }
}

const interestGrid=document.querySelector('.interest-grid');if(interestGrid&&!interestGrid.querySelector('.mobile-pixel-sky')){const sky=document.createElement('div');sky.className='mobile-pixel-sky';sky.setAttribute('aria-hidden','true');sky.innerHTML='<div class="pixel-sun"><i></i></div><div class="pixel-cloud pixel-cloud-a"><i></i></div><div class="pixel-cloud pixel-cloud-b"><i></i></div>';interestGrid.appendChild(sky);}
const careerPanel=document.querySelector('.career-panel');const careerSignals=document.querySelector('#careerSignals');if(careerPanel&&careerSignals){careerSignals.hidden=true;const holder=document.createElement('div');holder.id='careerRadar';careerSignals.insertAdjacentElement('afterend',holder);const caption=document.createElement('p');caption.className='radar-caption';caption.textContent='DATA · WEB · QUALITY · SYSTEMS';holder.insertAdjacentElement('afterend',caption);const profiles=[[32,48,38,52],[38,52,45,68],[78,54,58,70],[82,78,72,78],[100,52,86,88]];const updateCareer=radar(holder,profiles[0]);const roles=[...document.querySelectorAll('.role[data-role]')];const sync=role=>{const i=Number(role.dataset.role)||0;updateCareer(profiles[Math.max(0,Math.min(i,profiles.length-1))]);};roles.forEach(role=>{role.addEventListener('mouseenter',()=>sync(role));role.addEventListener('focus',()=>sync(role));role.addEventListener('click',()=>sync(role));});const observer=new MutationObserver(()=>{const active=document.querySelector('.role.active[data-role]');if(active)sync(active)});roles.forEach(role=>observer.observe(role,{attributes:true,attributeFilter:['class']}));}
})();