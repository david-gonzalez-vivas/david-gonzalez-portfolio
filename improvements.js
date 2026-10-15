// v40 — DATA / WEB / QUALITY / SYSTEMS radar interactions
(()=>{
const names=['DATA','WEB','QUALITY','SYSTEMS'];
function radar(el,initial){
 if(!el)return null;
 const c=150,r=94,levels=[.25,.5,.75,1];
 const pt=(i,v)=>{const a=(-90+i*90)*Math.PI/180,rr=r*(v/100);return [c+Math.cos(a)*rr,c+Math.sin(a)*rr]};
 const ring=v=>[0,1,2,3].map(i=>pt(i,v*100)).map(x=>x.join(',')).join(' ');
 el.innerHTML=`<svg class="discipline-radar" viewBox="0 0 300 300" role="img" aria-label="Discipline profile: Data, Web, Quality and Systems">${levels.map(v=>`<polygon class="radar-grid" points="${ring(v)}"/>`).join('')}<line class="radar-axis" x1="150" y1="56" x2="150" y2="244"/><line class="radar-axis" x1="56" y1="150" x2="244" y2="150"/><polygon class="radar-shape"/><g class="radar-dots"></g><text class="radar-label" x="150" y="35" text-anchor="middle">DATA</text><text class="radar-label" x="268" y="153" text-anchor="end">WEB</text><text class="radar-label" x="150" y="276" text-anchor="middle">QUALITY</text><text class="radar-label" x="32" y="153">SYSTEMS</text></svg>`;
 const poly=el.querySelector('.radar-shape'),dots=el.querySelector('.radar-dots');
 dots.innerHTML=names.map(()=>'<circle class="radar-dot" r="4"/>').join('');
 const update=vals=>{const points=vals.map((v,i)=>pt(i,v));poly.setAttribute('points',points.map(x=>x.join(',')).join(' '));[...dots.children].forEach((d,i)=>{d.setAttribute('cx',points[i][0]);d.setAttribute('cy',points[i][1])});};
 update(initial);return update;
}
const projectRadar=radar(document.querySelector('#projectRadar'),[45,100,70,65]);
document.querySelectorAll('.project').forEach(project=>{
 const update=()=>projectRadar&&projectRadar(project.dataset.profile.split(',').map(Number));
 project.addEventListener('mouseenter',update);project.addEventListener('focus',update);project.addEventListener('click',update);
});
const educationItems=[...document.querySelectorAll('.education-item[data-education-profile]')];
const educationStage=document.querySelector('#educationStage');
const educationRadar=radar(document.querySelector('#educationRadar'),[100,78,88,92]);
function activateEducation(item){educationItems.forEach(x=>x.classList.toggle('active',x===item));if(educationStage)educationStage.textContent=item.dataset.educationStage;if(educationRadar)educationRadar(item.dataset.educationProfile.split(',').map(Number));}
educationItems.forEach(item=>{item.addEventListener('mouseenter',()=>activateEducation(item));item.addEventListener('focus',()=>activateEducation(item));item.addEventListener('click',()=>activateEducation(item));});
if(educationItems[0])activateEducation(educationItems[0]);
})();
