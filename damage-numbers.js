(()=>{
  const W={pistol:50,smg:22,rifle:32,shotgun:28,sniper:150,lmg:27};
  const seen=new WeakSet();
  let socket=null,myId=null;
  const css=document.createElement('style');css.textContent='.dmg-number{position:fixed;z-index:100;pointer-events:none;font:900 24px Arial;text-shadow:2px 2px 4px #000;transform:translate(-50%,-50%);animation:dmgFloat .7s ease-out forwards}@keyframes dmgFloat{0%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}100%{opacity:0;transform:translate(-50%,-150%) scale(1.35)}}';document.head.appendChild(css);
  function showDamage(pos,amount,head){
    const g=window.__fpsGame;if(!g||!pos)return;
    const v=pos.clone();v.y+=head?2.7:2.0;v.project(g.camera);if(v.z>1)return;
    const d=document.createElement('div');d.className='dmg-number';d.textContent=(head?'HEADSHOT ':'')+Math.round(amount);d.style.left=((v.x*.5+.5)*innerWidth)+'px';d.style.top=((-v.y*.5+.5)*innerHeight)+'px';d.style.fontSize=head?'28px':'23px';d.style.fontWeight='900';document.body.appendChild(d);setTimeout(()=>d.remove(),720);
    const c=document.querySelector('.cross');if(c){const old=c.textContent;c.textContent='✕';c.style.fontSize='30px';setTimeout(()=>{c.textContent=old;c.style.fontSize='26px'},90)}
  }
  function findRemote(id){const s=window.__fpsGame?.scene;if(!s)return null;let hit=null;s.traverse(o=>{if(!hit&&o.userData&&o.userData.id===id)hit=o});return hit}
  function incoming(e){let m;try{m=JSON.parse(e.data)}catch{return}
    if(m.type==='welcome'){myId=m.id;window.__mpMyId=m.id}
    if(m.type==='hit'&&m.attacker===myId){const g=findRemote(m.target);if(g){g.userData.hp=m.hp;g.userData.armor=m.armor;showDamage(g.position,m.damage,m.hitType==='head')}}
    if(m.type==='kill'&&m.attacker===myId){const g=findRemote(m.target);if(g)showDamage(g.position,m.reward||150,false);const msg=document.getElementById('msg');if(msg){msg.textContent='💀 ELİMİNASYON +₺'+(m.reward||150);setTimeout(()=>{if(msg.textContent.startsWith('💀 ELİMİNASYON'))msg.textContent=''},1100)}}
    if(m.type==='respawn'&&m.id!==myId){const g=findRemote(m.id);if(g){g.position.set(m.x||0,m.y||2,m.z||12);g.userData.hp=100;g.userData.armor=100}}
  }
  const oldSend=WebSocket.prototype.send;
  WebSocket.prototype.send=function(data){socket=this;if(!seen.has(this)){seen.add(this);this.addEventListener('message',incoming)}return oldSend.call(this,data)};
  function remoteHitFromAim(){
    const g=window.__fpsGame;if(!g||window.__fpsDead)return;
    const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),g.camera);
    const objs=[];g.scene.traverse(o=>{if(o.isMesh){let p=o;while(p){if(p.userData&&p.userData.id&&p.userData.id!==myId){objs.push(o);break}p=p.parent}}});
    const hit=ray.intersectObjects(objs,false)[0];if(!hit)return;
    let root=hit.object;while(root.parent&&!(root.userData&&root.userData.id))root=root.parent;const id=root.userData?.id;if(!id)return;
    const weapon=window.__fpsCurrentWeapon||'pistol';const base=W[weapon]||50;const head=hit.point.y>root.position.y+2.15;const damage=head?Math.min(100,base*2.5):base;
    if(socket?.readyState===1)socket.send(JSON.stringify({type:'hit',target:id,damage,hitType:head?'head':'body'}));
  }
  document.addEventListener('pointerdown',e=>{if(e.target&&((e.target.closest&&e.target.closest('#fire'))||e.target===window.__fpsGame?.renderer?.domElement||e.target.tagName==='CANVAS'))setTimeout(remoteHitFromAim,0)},{passive:true});
  setInterval(()=>{if(!socket&&window.__fpsGame){}},500);
})();
