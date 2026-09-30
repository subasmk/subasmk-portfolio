(() => {
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const kind=document.body.dataset.showcase;
const grid=document.getElementById('showcase-grid');
const colors=['#ff70a6','#73a7ff','#62ef87','#ffad43','#fbff48'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let items=kind==='certificates'?window.PORTFOLIO_CERTIFICATES:window.PORTFOLIO_PROJECTS;
let filter='all',query='',lastTrigger;
const dlg=document.getElementById('showcase-dialog');
function links(url,label,extra=''){return `<a class="neo-link ${extra}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;}
function render(){
 if(!grid)return;
 const list=items.map((x,i)=>({...x,index:i})).filter(x=>(filter==='all'||x.category===filter)&&[x.title,x.name,x.issuer,x.language,x.description].join(' ').toLowerCase().includes(query));
 grid.innerHTML=list.map(x=>{
 const cert=kind==='certificates',title=cert?x.title:x.name;
 const img=cert?(x.preview?`<img class="card-image" src="${esc(x.preview)}" alt="${esc(title)} certificate" loading="lazy">`:`<div class="credential-symbol">&lt;/&gt;<small>PUBLIC CREDENTIAL LINK</small></div>`):`<div class="project-cover">${x.category==='apps'?'APP.EXE':'&lt;/&gt;'}<small>${esc(x.language||'CODE')} / PUBLIC REPOSITORY</small></div>`;
 return `<button class="neo-card gallery-card ${cert?'':'project-card'} ${reduce?'':'reveal-card'}" data-index="${x.index}" style="--card-color:${colors[x.index%colors.length]};--delay:${Math.min(x.index*.035,.25)}s"><span class="card-number">/${String(x.index+1).padStart(2,'0')}<span>↗</span></span>${img}<h2>${esc(title)}</h2><p class="card-meta">${esc(cert?x.issuer:x.description)}</p>${cert&&x.date?`<p class="card-meta">${esc(x.date)}</p>`:''}<span class="card-action">${cert?'OPEN SHOWCASE':'EXPLORE PROJECT'} +</span></button>`;
 }).join('');
 document.getElementById('gallery-status').textContent=`${list.length} ${kind==='certificates'?'credentials':'public repositories'}`;
 document.getElementById('empty-state').hidden=!!list.length;
 grid.querySelectorAll('[data-index]').forEach(b=>{b.addEventListener('click',()=>openItem(items[+b.dataset.index],b));if(fine&&!reduce){b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.transform=`perspective(900px) translateY(-4px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;});b.addEventListener('pointerleave',()=>b.style.transform='');}});
}
async function openItem(x,trigger){
 lastTrigger=trigger;document.getElementById('dialog-label').textContent=kind==='certificates'?'CERTIFICATE_SHOWCASE':'PROJECT_SHOWCASE';
 const cert=kind==='certificates';
 const left=cert?(x.preview?`<img class="detail-image" src="${esc(x.preview)}" alt="${esc(x.title)} certificate">`:'<div class="project-graphic">HackerRank<br>SKILL</div>'):`<div class="project-graphic">${esc(x.name)}</div>`;
 const content=cert?`<h2>${esc(x.title)}</h2><dl><dt>ISSUER</dt><dd>${esc(x.issuer)}</dd>${x.date?`<dt>DATE / PERIOD</dt><dd>${esc(x.date)}</dd>`:''}${x.credential?`<dt>DOCUMENT IDENTIFIER</dt><dd>${esc(x.credential)}</dd>`:''}</dl><p>${esc(x.detail)}</p>${x.file?links(x.file,'View original certificate','dark-link'):''}${x.url?links(x.url,'Open credential link'):''}`:`<h2>${esc(x.name)}</h2><p>${esc(x.description)}</p><dl><dt>LANGUAGE</dt><dd>${esc(x.language||'Not specified')}</dd><dt>REPOSITORY</dt><dd>${esc(x.full_name)}</dd></dl><div class="repo-preview" id="repo-file-list">Loading repository contents...</div>${links(x.html_url,'Open code on GitHub','dark-link')}`;
 document.getElementById('dialog-content').innerHTML=`<div class="dialog-layout">${left}<div class="detail-info">${content}</div></div>`;
 dlg.showModal();document.body.style.overflow='hidden';
 if(!cert){try{const r=await fetch(`https://api.github.com/repos/${encodeURIComponent(x.full_name.split('/')[0])}/${encodeURIComponent(x.name)}/contents`,{signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error();const files=await r.json();const panel=document.getElementById('repo-file-list');if(panel&&dlg.open)panel.innerHTML='<b>REPOSITORY CONTENTS</b>'+files.slice(0,18).map(f=>`<a href="${esc(f.html_url)}" target="_blank" rel="noopener noreferrer">${f.type==='dir'?'▸':'▤'} ${esc(f.name)}</a>`).join('');}catch{const panel=document.getElementById('repo-file-list');if(panel)panel.textContent='Repository preview is unavailable. Open GitHub to explore the code.';}}
}
if(dlg){document.getElementById('dialog-close').addEventListener('click',()=>dlg.close());dlg.addEventListener('close',()=>{document.body.style.overflow='';lastTrigger?.focus();});dlg.addEventListener('click',e=>{if(e.target===dlg){const r=dlg.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dlg.close();}});}
if(grid){document.getElementById('gallery-search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();render();});document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();}));render();}
// Libraries are enhancements only: the page works before either loads.
if(grid&&!reduce){import('https://cdn.jsdelivr.net/npm/animejs@4.1.3/+esm').then(({animate,stagger})=>{animate('.gallery-card',{opacity:[0,1],translateY:[12,0],duration:400,delay:stagger(35),ease:'out(3)'});}).catch(()=>{});}
const scene=document.getElementById('mini-scene');
if(scene&&fine&&!reduce&&innerWidth>=768){
 const observer=new IntersectionObserver(async entries=>{if(!entries[0].isIntersecting)return;observer.disconnect();try{const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');const s=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.z=4;const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setSize(140,140);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));const box=new THREE.BoxGeometry(1.5,1.5,1.5);const cube=new THREE.LineSegments(new THREE.EdgesGeometry(box),new THREE.LineBasicMaterial({color:0x121212}));s.add(cube);scene.replaceChildren(renderer.domElement);let visible=true;new IntersectionObserver(e=>{visible=e[0].isIntersecting;}).observe(scene);let last=0;function loop(t){requestAnimationFrame(loop);if(document.hidden||!visible||t-last<33)return;last=t;cube.rotation.x=.4;cube.rotation.y=t*.00025;cube.rotation.z=.1;renderer.render(s,camera);}requestAnimationFrame(loop);}catch{/* static cube stays when WebGL fails */}});observer.observe(scene);
}
})();
