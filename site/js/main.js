const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],root=document.documentElement;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* splash: JATIN NAIK animates in, then its letters fly into the hero heading */
(async()=>{
 const intro=$('#intro'),iw=$('#iw'),ib=$('#ib'),h1=$('.copy h1');
 if(RM){root.classList.remove('splash');intro.remove();return}
 try{
  const SP='cubic-bezier(.34,1.5,.5,1)',EO='cubic-bezier(.22,1,.36,1)',sleep=ms=>new Promise(r=>setTimeout(r,ms));
  iw.innerHTML=[...'Jatin Naik'].map(c=>c===' '?'<span class="is"></span>':'<span class="il">'+c+'</span>').join('');
  const L=[...iw.querySelectorAll('.il')];
  await Promise.race([document.fonts.ready,sleep(1500)]);
  await Promise.all(L.map((el,i)=>el.animate([{opacity:0,transform:'translateY(.6em)'},{opacity:1,transform:'none'}],{duration:560,delay:i*38,easing:SP,fill:'forwards'}).finished));
  await sleep(200);
  const rg=document.createRange(),T=[];
  [...h1.childNodes].filter(n=>n.nodeType===3).forEach(n=>{for(let i=0;i<n.nodeValue.length;i++){rg.setStart(n,i);rg.setEnd(n,i+1);const r=rg.getBoundingClientRect();T.push({l:r.left,t:r.top,ch:n.nodeValue[i]})}});
  const sc=parseFloat(getComputedStyle(h1).fontSize)/parseFloat(getComputedStyle(L[0]).fontSize),M=820;
  h1.style.cssText='transition:none;opacity:0;transform:none';
  ib.animate([{opacity:1},{opacity:0}],{duration:M,delay:80,easing:'ease-in-out',fill:'forwards'});
  const run=L.map((el,i)=>{const t=T[i],c=el.getBoundingClientRect();
   if(!t||t.t>innerHeight)return el.animate([{opacity:1},{opacity:0}],{duration:400,fill:'forwards'}).finished;
   setTimeout(()=>{el.textContent=t.ch},M*.45+i*18);
   return el.animate([{transform:'none'},{transform:'translate('+(t.l-c.left)+'px,'+(t.t-c.top)+'px) scale('+sc+')'}],{duration:M,delay:i*18,easing:EO,fill:'forwards'}).finished});
  await sleep(M*.55);root.classList.remove('splash');
  await Promise.all(run);
  h1.style.opacity='1';
  L.forEach(el=>el.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'}));
  await sleep(180);h1.style.cssText='';intro.remove()
 }catch(e){h1.style.cssText='';root.classList.remove('splash');intro.remove()}
})();
/* theme */
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
$$('[data-theme-toggle]').forEach(b=>b.onclick=()=>{const d=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
 root.dataset.theme=d?'light':'dark';try{localStorage.setItem('theme',root.dataset.theme)}catch(e){}});
/* nav */
const pill=$('#pill'),menu=$('#menu'),bubble=$('#bubble'),nav=$('#nav'),links=$$('#links a:not(.hm)');let active=null;
menu.onclick=()=>{const o=pill.classList.toggle('open');menu.setAttribute('aria-expanded',o)};
$$('#links a').forEach(a=>a.addEventListener('click',()=>{pill.classList.remove('open');menu.setAttribute('aria-expanded',false)}));
function moveBubble(a){if(!a||innerWidth<=760){bubble.style.opacity=0;return}bubble.style.opacity=1;bubble.style.width=a.offsetWidth+'px';bubble.style.transform='translateX('+a.offsetLeft+'px)'}
links.forEach(a=>{a.addEventListener('pointerenter',()=>moveBubble(a));a.addEventListener('focus',()=>moveBubble(a))});
$('#links').addEventListener('pointerleave',()=>moveBubble(active));
const stk=$$('main .stk');
function fit(){stk.forEach(s=>{const h=s.offsetHeight,tall=h>innerHeight*1.2;s.classList.toggle('tall',tall);s.style.top=tall?'':Math.min(0,innerHeight-h)+'px'})}
const clamp01=v=>Math.min(1,Math.max(0,v));
const ptar=stk.map(()=>0),pcur=stk.map(()=>0);let ttar=0,tcur=0,ltar=0,lcur=0;
function targets(){
 stk.forEach((s,i)=>{const n=stk[i+1];ptar[i]=n&&!s.classList.contains('tall')?clamp01(1-n.getBoundingClientRect().top/innerHeight):0});
 ttar=clamp01((innerHeight-aboutSec.getBoundingClientRect().top)/(innerHeight*.85));
 const r=tl.getBoundingClientRect();ltar=clamp01((innerHeight*.62-r.top)/r.height)}
function setActive(){let a=null;stk.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.5)a=s});
 const l=a?links.find(k=>k.getAttribute('href')==='#'+a.id)||null:null;if(l!==active){active=l;links.forEach(k=>k.classList.toggle('on',k===l));moveBubble(l)}}
const past=()=>nav.classList.toggle('past',scrollY>innerHeight*.6);
const hero=$('#home');
function onScroll(){past();hero.classList.toggle('away',scrollY>innerHeight*.55);if(!RM)targets();setActive()}
addEventListener('scroll',onScroll,{passive:true});let lw=innerWidth;addEventListener('resize',()=>{if(innerWidth!==lw){lw=innerWidth;fit();layoutTL()}onScroll()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
/* entrances replay every time an element comes back into view */
const rise=new IntersectionObserver(es=>es.forEach(e=>{if(e.intersectionRatio>=.15)e.target.classList.add('in');else if(!e.isIntersecting)e.target.classList.remove('in')}),{threshold:[0,.15]});
$$('.rise').forEach(el=>RM?el.classList.add('in'):rise.observe(el));

/* lens: appears from a corner when the pointer is active, tiny over empty areas, bigger over text */
const lens=$('#lens'),lin=$('#lin'),art=$('#art'),card=$('#card'),S=1.4,rng=document.createRange();
const TINY=matchMedia('(pointer:coarse)').matches?18:24;
const rx={v:0,x:0,t:0},ry={v:0,x:0,t:0};
let x=0,y=0,vx=0,vy=0,tx=0,ty=0,px=0,py=0,sc=0,sv=0,on=false,over=false,moved=false,cur=null,clone=null,fc=0;
const corner=(a,b)=>({x:a<innerWidth/2?-80:innerWidth+80,y:b<innerHeight/2?-80:innerHeight+80});
function textAt(el,a,b){for(let n=el,d=0;n&&n!==document.body&&d<3;n=n.parentElement,d++){
 for(const t of n.childNodes){if(t.nodeType===3&&t.nodeValue.trim()){rng.selectNodeContents(t);
  for(const r of rng.getClientRects())if(a>=r.left-10&&a<=r.right+10&&b>=r.top-8&&b<=r.bottom+8)return true}}
 if(n.hasAttribute('data-mag'))break}return false}
function setSource(src){if(src===cur)return;cur=src;lin.textContent='';clone=null;
 if(src){clone=src.cloneNode(true);clone.removeAttribute('data-mag');clone.setAttribute('aria-hidden','true');clone.classList.add('lc');
  clone.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));clone.querySelectorAll('a,button').forEach(n=>n.tabIndex=-1);lin.appendChild(clone)}}
function aim(e){px=e.clientX;py=e.clientY;moved=true;
 if(!on){on=true;const c=corner(px,py);x=c.x;y=c.y;vx=vy=0;sc=0;sv=0}
 const b=art.getBoundingClientRect();
 rx.t=Math.max(-14,Math.min(14,-((py-(b.top+b.height/2))/innerHeight)*34));
 ry.t=Math.max(-18,Math.min(18,((px-(b.left+b.width/2))/innerWidth)*44))}
function rest(){on=false;over=false;rx.t=ry.t=0}
addEventListener('pointermove',aim);addEventListener('pointerdown',aim);
addEventListener('pointerup',e=>{if(e.pointerType==='touch')rest()});addEventListener('pointercancel',rest);
document.documentElement.addEventListener('mouseleave',rest);addEventListener('blur',rest);

/* avatar flight: the hero avatar travels into the About slot as you scroll */
const aboutSec=$('#about'),flyEl=$('#fly'),flyImg=flyEl.firstElementChild,avH=$('#avH'),avA=$('#avA'),cropA=$('.crop');
avA.src=avH.src;flyImg.src=avH.src;
[avA,flyImg].forEach(im=>{if(im.decode)im.decode().catch(()=>{})});
let fst='h',fw=0,fh=0,last=0;
const lerp=(a,b,t)=>a+(b-a)*t;
const sm=(a,b,k,dt)=>{const d=b-a;return Math.abs(d)<.0005?b:a+d*(1-Math.exp(-k*dt))};
function fstate(s){if(s===fst)return;fst=s;
 avH.style.visibility=s==='h'?'':'hidden';avA.style.visibility=s==='a'?'':'hidden';
 flyEl.style.visibility=s==='f'?'visible':'hidden';flyEl.style.willChange=flyImg.style.willChange=s==='f'?'transform':''}
function applyP(i){const p=pcur[i],s=stk[i];s.style.setProperty('--p',p.toFixed(4));s.style.transform=p>.001?'scale('+(1-p*.06).toFixed(4)+')':''}

function loop(now){
 const dt=Math.min(.05,(now-(last||now))/1000),f=dt*60,D=lens.offsetWidth;last=now;fc++;
 /* math: spring-smoothed scroll values (frame-rate independent) */
 const dirty=[];
 for(let i=0;i<stk.length;i++){const n=sm(pcur[i],ptar[i],10,dt);if(n!==pcur[i]){pcur[i]=n;dirty.push(i)}}
 tcur=sm(tcur,ttar,7,dt);const nl=sm(lcur,ltar,8,dt),ld=nl!==lcur;lcur=nl;
 const fs=tcur<.003&&ttar<.003?'h':tcur>.997&&ttar>.997?'a':'f';
 /* reads first, so the page is never measured between writes */
 if(on&&(moved||fc%6===0)){moved=false;const el=document.elementFromPoint(px,py),src=el&&el.closest('[data-mag]');over=!!src&&textAt(el,px,py);setSource(src)}
 const cr=clone&&cur?cur.getBoundingClientRect():null;
 let h,ai,c,bw,bh;
 if(fs==='f'){h=art.getBoundingClientRect();ai=avA.getBoundingClientRect();c=cropA.getBoundingClientRect();bw=art.offsetWidth;bh=art.offsetHeight}
 /* writes */
 dirty.forEach(i=>applyP(i));if(ld)applyTL();
 fstate(fs);
 if(fs==='f'){
  if(bw!==fw||bh!==fh){fw=bw;fh=bh;flyImg.style.width=bw+'px';flyImg.style.height=bh+'px'}
  const e=tcur*tcur*tcur*(tcur*(tcur*6-15)+10);
  const cw=lerp(h.width,c.width,e),ch=lerp(h.height,c.height,e),cx=lerp(h.left,c.left,e),cy=lerp(h.top,c.top,e);
  flyEl.style.width=cw+'px';flyEl.style.height=ch+'px';
  flyEl.style.transform='translate3d('+cx+'px,'+cy+'px,0) perspective(1000px) rotateX('+rx.x*(1-e)+'deg) rotateY('+ry.x*(1-e)+'deg)';
  flyImg.style.transform='translate3d('+(lerp(h.left,ai.left,e)-cx)+'px,'+(lerp(h.top,ai.top,e)-cy)+'px,0) scale('+lerp(h.width,ai.width,e)/bw+')'}
 /* lens */
 if(on){tx=px;ty=py}else{const k=corner(px,py);tx=k.x;ty=k.y}
 const st=!on?0:over?1:TINY/D;
 vx=(vx+(tx-x)*.12*f)*Math.pow(.74,f);vy=(vy+(ty-y)*.12*f)*Math.pow(.74,f);x+=vx*f;y+=vy*f;
 sv=(sv+(st-sc)*.16*f)*Math.pow(.7,f);sc+=sv*f;if(sc<0)sc=0;
 const kk=Math.min(.1,Math.hypot(vx,vy)*.006);
 lens.style.opacity=sc>.03?'1':'0';
 lens.style.transform='translate('+(x-D/2)+'px,'+(y-D/2)+'px) scale('+sc*(1+kk)+','+sc*(1-kk)+')';
 if(cr){clone.style.width=cr.width+'px';clone.style.height=cr.height+'px';
  clone.style.transform='translate('+(D/2-(x-cr.left)*S)+'px,'+(D/2-(y-cr.top)*S)+'px) scale('+S+')'}
 for(const a of [rx,ry]){a.v=(a.v+(a.t-a.x)*.08*f)*Math.pow(.8,f);a.x+=a.v*f}
 card.style.transform='rotateX('+rx.x+'deg) rotateY('+ry.x+'deg)';
 requestAnimationFrame(loop)}
if(RM)lens.remove();else requestAnimationFrame(loop);

/* projects: multitasking window stack */
const wb=$('#wb');let pc=0,closed=false;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const dots='<svg class="i" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';
function lb(label,href,cls){if(!href)return'';return href==='TODO'?'<span class="btn s dis" aria-disabled="true">'+label+' (link soon)</span>':'<a class="btn '+cls+'" href="'+href+'" target="_blank" rel="noopener">'+label+'</a>'}
function acts(p){return [['Live demo',p.live],['Watch demo',p.video],['Code',p.code]].filter(a=>a[1]).map((a,i)=>lb(a[0],a[1],i?'s':'p')).join('')}
function winHTML(p,list){
 const shot=p.img?'<div class="shot"><img src="'+p.img+'" style="object-position:'+(p.pos||'top')+'" alt="Screenshot of the '+esc(p.name)+' landing page" loading="lazy"></div>':'<div class="shot ph" role="img" aria-label="Screenshot of '+esc(p.name)+' coming soon"><b>'+p.name[0]+'</b><span>Screenshot coming soon</span></div>';
 return '<article class="win" data-mag style="--tc:'+p.tc+'" aria-label="'+esc(p.name)+'"><div class="wbar"><span class="gp" aria-hidden="true"><i></i><i></i><i></i></span>'+(list?'':'<button class="mbtn" data-act="menu" aria-label="Project menu" aria-haspopup="true" aria-expanded="false">'+dots+'</button>')+'</div>'+
 (list?'':'<div class="mpop gr" role="menu" hidden><button role="menuitem" data-act="next">Next project</button><button role="menuitem" data-act="close">Close</button></div>')+
 shot+'<div class="info"><p class="lbl">'+esc(p.label)+'</p><h3>'+esc(p.name)+'</h3><p class="sum">'+esc(p.summary)+'</p><ul>'+p.results.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul><div class="chips">'+p.stack.map(s=>'<span class="sc">'+esc(s)+'</span>').join('')+'</div><div class="act">'+acts(p)+'</div></div></article>'}
function render(){
 if(RM){wb.className='wb list';wb.innerHTML=PROJECTS.map(p=>winHTML(p,true)).join('');fit();return}
 const folds=PROJECTS.map((p,i)=>[p,i]).filter(([p,i])=>closed||i!==pc).map(([p,i])=>'<button class="fold" data-i="'+i+'" style="--tc:'+p.tc+'" aria-label="Open '+esc(p.name)+'"><span class="gl"'+(p.img?' style="background-image:url('+p.img+')"':'')+'></span><i class="ini">'+p.name[0]+'</i><span class="nm">'+esc(p.name)+'</span><small>'+esc(p.label)+'</small></button>').join('');
 const plus='<a class="fold plus" href="'+GH+'" target="_blank" rel="noopener" aria-label="More on GitHub, opens in a new tab"><span class="pl">+</span><span class="nm">More on GitHub</span></a>';
 wb.className='wb';
 wb.innerHTML='<div class="stack" role="group" aria-label="Other projects">'+folds+plus+'</div>'+(closed?'<div class="ghost"><p>Window closed.</p><p>Open a project from the stack.</p></div>':winHTML(PROJECTS[pc],false));
 fit()}
const FIN={transform:'none',opacity:1},OUT={transform:'translateX(-50px) rotateY(16deg) scale(.94)',opacity:0},IN0={transform:'translateX(-70px) rotateY(-14deg) scale(.9)',opacity:0};
function anim(el,a,b,ms,ease){if(!el||RM||!el.animate)return Promise.resolve();return el.animate([a,b],{duration:ms,easing:ease,fill:'forwards'}).finished.catch(()=>{})}
async function go(i,toClosed){await anim(wb.querySelector('.win,.ghost'),FIN,OUT,220,'ease-in');if(i!=null)pc=i;closed=!!toClosed;render();anim(wb.querySelector('.win,.ghost'),IN0,FIN,650,'cubic-bezier(.34,1.5,.5,1)')}
wb.addEventListener('click',e=>{const b=e.target.closest('[data-act],[data-i]');if(!b)return;
 if(b.dataset.i!=null){go(+b.dataset.i);return}
 const a=b.dataset.act,m=wb.querySelector('.mpop');
 if(a==='menu'){const o=m.hidden;m.hidden=!o;b.setAttribute('aria-expanded',String(o));return}
 if(a==='next')go((pc+1)%PROJECTS.length);
 if(a==='close')go(null,true)});
document.addEventListener('click',e=>{const m=wb.querySelector('.mpop');if(m&&!m.hidden&&!e.target.closest('.mpop,.mbtn')){m.hidden=true;const b=wb.querySelector('.mbtn');if(b)b.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=wb.querySelector('.mpop');if(m)m.hidden=true}});
let sx=0,sy=0,sw=false;
wb.addEventListener('pointerdown',e=>{sw=!!e.target.closest('.win')&&!e.target.closest('a,button');sx=e.clientX;sy=e.clientY});
wb.addEventListener('pointerup',e=>{if(!sw||closed)return;sw=false;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dy)<45)go((pc+(dx<0?1:PROJECTS.length-1))%PROJECTS.length)});
render();

/* experience: S-curve timeline */
const tl=$('#tl'),xs=[...tl.children],NS='http://www.w3.org/2000/svg';
const tsvg=document.createElementNS(NS,'svg');tsvg.setAttribute('class','tlsvg');tsvg.setAttribute('aria-hidden','true');
const pBase=document.createElementNS(NS,'path'),pDraw=document.createElementNS(NS,'path');
pBase.setAttribute('class','pb');pDraw.setAttribute('class','pd');tsvg.append(pBase,pDraw);tl.prepend(tsvg);
let pts=[],plen=0;
function layoutTL(){
 const W=tl.clientWidth,H=tl.offsetHeight,mob=innerWidth<=760,A=mob?10:48,cx=mob?30:W/2;
 pts=xs.map((li,i)=>{const x=cx+(i%2?A:-A),y=li.offsetTop+34;
  li.classList.toggle('l',!mob&&i%2===0);li.classList.toggle('r',!mob&&i%2===1);
  li.querySelector('.card').classList.toggle('tr',!mob&&i%2===0);
  const n=li.querySelector('.node');n.style.left=x+'px';n.style.top='34px';return{x,y}});
 tsvg.setAttribute('width',W);tsvg.setAttribute('height',H);tsvg.setAttribute('viewBox','0 0 '+W+' '+H);
 let d='M'+pts[0].x+' '+(pts[0].y-30)+' L'+pts[0].x+' '+pts[0].y;
 for(let i=1;i<pts.length;i++){const p=pts[i-1],q=pts[i],m=(q.y-p.y)/2;d+=' C'+p.x+' '+(p.y+m)+' '+q.x+' '+(q.y-m)+' '+q.x+' '+q.y}
 pBase.setAttribute('d',d);pDraw.setAttribute('d',d);plen=pDraw.getTotalLength();pDraw.style.strokeDasharray=plen;
 tlProg();fit()}
function applyTL(){pDraw.style.strokeDashoffset=plen*(1-lcur);const head=lcur*tl.offsetHeight;
 xs.forEach((li,i)=>li.querySelector('.node').classList.toggle('on',!!pts[i]&&pts[i].y<=head))}
function tlProg(){if(RM){pDraw.style.strokeDashoffset=0;xs.forEach(li=>li.querySelector('.node').classList.add('on'))}else applyTL()}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layoutTL);
layoutTL();

/* footer */
$('#yr').textContent=new Date().getFullYear();
$('#top').addEventListener('click',()=>scrollTo({top:0,behavior:RM?'auto':'smooth'}));

/* boot */
fit();onScroll();
if(!RM){ptar.forEach((v,i)=>{pcur[i]=v;applyP(i)});tcur=ttar;lcur=ltar;applyTL()}
