(()=>{
  const seen=new WeakSet();
  let socket=null,myId=null,currentWeapon='pistol',THREERef=null;
  import('three').then(m=>THREERef=m).catch(()=>{});
  const css=document.createElement('style');css.textContent='.dmg-number{position:fixed;z-index:100;pointer-events:none;font:900 24px Arial;color:#fff;text-shadow:2px 2px 5px #000;transform:translate(-50%,-50%);animation:dmgFloat .72s ease-out forwards}.dmg-number.head{color:#ffd43b;font-size:29px}.dmg-number.self{color:#ff5b5b;font-size:22px}@keyframes dmgFloat{0%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}100%{opacity:0;transform:translate(-50%,-155%) scale(1.35)}}';document.head.appendChild(css);
  function showDamage(pos,amount,head=false,self=false){const g=window.__fpsGame;if(!g||!pos)return;const v=pos.clone();v.y+=head?2.7:2.0;v.project(g.camera);if(v.z>1)return;const d=document.createElement('div');d.className='dmg-number'+(head?' head':'')+(self?' self':'');d.textContent=(head?'HEADSHOT ':'')+Math.round(amount);d.style.left=((v.x*.5+.5)*innerWidth)+'px';d.style.top=((-v.y*.5+.5)*innerHeight)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),720);const c=document.querySelector('.cross');if(c&&!self){const old=c.textContent;c.textContent='✕';c.style.fontSize='30px';setTimeout(()=>{c.textContent=old;c.style.fontSize='26px'},90)}}
  function findRemote(id){const s=window.__fpsGame?.scene;if(!s)return null;let hit=null;s.traverse(o=>{if(!hit&&o.userData&&o.userData.id===id)hit=o});return hit}
  function setLocalVitals(hp,armor){const p=window.__fpsGame?.player;if(!p)return;p.hp=Math.max(0,Number(hp)||0);p.armor=Math.max(0,Number(armor)||0);const a=document.getElementById('hp'),b=document.getElementById('armor');if(a)a.textContent=p.hp|0;if(b)b.textContent=p.armor|0}
  function note(text){const m=document.getElementById('msg');if(!m)return;m.textContent=text;clearTimeout(note.t);note.t=setTimeout(()=>{if(m.textContent===text)m.textContent=''},1200)}
  function incoming(e){let m;try{m=JSON.parse(e.data)}catch{return}
    if(m.type==='welcome'){myId=m.id;window.__mpMyId=m.id}
    if(m.type==='state'&&m.player?.id===myId)setLocalVitals(m.player.hp,m.player.armor);
    if(m.type==='hit'){
      if(m.attacker===myId){const g=findRemote(m.target);if(g){g.userData.hp=m.hp;g.userData.armor=m.armor;showDamage(g.position,m.damage,m.hitType==='head',false)}}
      if(m.target===myId){setLocalVitals(m.hp,m.armor);showDamage(window.__fpsGame?.player?.p,m.damage,m.hitType==='head',true);note('💥 -'+Math.round(m.damage)+' HASAR')}
    }
    if(m.type==='kill'){
      if(m.attacker===myId){const g=findRemote(m.target);if(g){g.visible=false;showDamage(g.position,m.reward||150,false,false)}note('💀 ELİMİNASYON +₺'+(m.reward||150));window.dispatchEvent(new CustomEvent('fps:kill',{detail:{target:m.target,reward:m.reward||150}}))}
      if(m.target===myId){setLocalVitals(0,0);note('💀 ÖLDÜN • YENİDEN DOĞUYORSUN');window.__fpsDead=true}
    }
    if(m.type==='respawn'){if(m.id!==myId){const g=findRemote(m.id);if(g){g.visible=true;g.position.set(m.x||0,m.y||2,m.z||12);g.userData.hp=100;g.userData.armor=100}}else{const p=window.__fpsGame?.player;if(p){p.p.set(m.x||0,m.y||2,m.z||12);p.hp=100;p.armor=100;p.vy=0;p.jump=true}window.__fpsDead=false;setLocalVitals(100,100);note('🔄 YENİDEN DOĞDUN')}}
  }
  const oldSend=WebSocket.prototype.send;
  WebSocket.prototype.send=function(data){socket=this;if(!seen.has(this)){seen.add(this);this.addEventListener('message',incoming)}try{const m=typeof data==='string'?JSON.parse(data):null;if(m?.type==='state'&&m.weapon)currentWeapon=String(m.weapon);if(m?.type==='shoot'&&m.weapon)currentWeapon=String(m.weapon)}catch{}return oldSend.call(this,data)};
  function remoteHitFromAim(){const g=window.__fpsGame;if(!g||window.__fpsDead||!THREERef)return;const ray=new THREERef.Raycaster();ray.setFromCamera(new THREERef.Vector2(0,0),g.camera);const objs=[];g.scene.traverse(o=>{if(o.isMesh){let p=o;while(p){if(p.userData&&p.userData.id&&p.userData.id!==myId){objs.push(o);break}p=p.parent}}});const hit=ray.intersectObjects(objs,false)[0];if(!hit)return;let root=hit.object;while(root.parent&&!(root.userData&&root.userData.id))root=root.parent;const id=root.userData?.id;if(!id)return;const head=hit.point.y>root.position.y+2.15;if(socket?.readyState===1)socket.send(JSON.stringify({type:'hit',target:id,weapon:currentWeapon,hitType:head?'head':'body'}))}
  document.addEventListener('pointerdown',e=>{if(e.target&&((e.target.closest&&e.target.closest('#fire'))||e.target===window.__fpsGame?.renderer?.domElement||e.target.tagName==='CANVAS'))setTimeout(remoteHitFromAim,0)},{passive:true});
})();