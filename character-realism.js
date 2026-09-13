(()=>{
'use strict';
const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
let THREE=null;
const state={type:localStorage.getItem('char')||'scout',scene:null,camera:null,renderer:null,model:null,raf:0};
const defs={
 scout:{name:'SCOUT',skin:0x9a7357,uniform:0x405447,armor:0x26323a,helmet:0x343b40,accent:0x78a85c,stats:'Hızlı • Hafif zırh • Keşif'},
 assault:{name:'ASSAULT',skin:0x8d6249,uniform:0x343a32,armor:0x171b1e,helmet:0x252b2e,accent:0xc48a3a,stats:'Dengeli • Orta zırh • Saldırı'},
 tank:{name:'TANK',skin:0x72513e,uniform:0x3d4540,armor:0x20272a,helmet:0x1b2022,accent:0x9b6c35,stats:'Yüksek zırh • Ağır • Dayanıklı'},
 elite:{name:'ELITE',skin:0xa7795d,uniform:0x242936,armor:0x12151c,helmet:0x171a20,accent:0x55a9d8,stats:'Hız + zırh • Özel birlik'}
};
function mat(c,rough=.65,metal=0){return new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:metal});}
function limb(g,c){const m=new THREE.Mesh(g,mat(c));m.castShadow=true;m.receiveShadow=true;return m}
function makeSoldier(type='scout'){
 const d=defs[type]||defs.scout, root=new THREE.Group();root.userData.characterType=type;
 const skin=mat(d.skin,.72), uniform=mat(d.uniform,.9), armor=mat(d.armor,.55,.2), dark=mat(0x15191c,.75), accent=mat(d.accent,.48,.35);
 const pelvis=limb(new THREE.BoxGeometry(.58,.38,.34),uniform);pelvis.position.y=1.22;root.add(pelvis);
 const torso=limb(new THREE.BoxGeometry(.82,.92,.46),uniform);torso.position.y=1.78;root.add(torso);
 const vest=limb(new THREE.BoxGeometry(.86,.62,.49),armor);vest.position.set(0,1.84,.02);root.add(vest);
 for(const s of[-1,1]){const shoulder=limb(new THREE.SphereGeometry(.18,12,8),armor);shoulder.position.set(s*.51,2.02,0);root.add(shoulder);const arm=limb(new THREE.CylinderGeometry(.115,.13,.72,10),uniform);arm.position.set(s*.56,1.65,0);arm.rotation.z=s*.08;root.add(arm);const hand=limb(new THREE.SphereGeometry(.13,10,8),skin);hand.position.set(s*.58,1.25,.02);root.add(hand);const thigh=limb(new THREE.CylinderGeometry(.15,.17,.72,10),uniform);thigh.position.set(s*.2,.72,0);root.add(thigh);const boot=limb(new THREE.BoxGeometry(.28,.22,.5),dark);boot.position.set(s*.2,.2,.08);root.add(boot)}
 const head=limb(new THREE.SphereGeometry(.29,18,14),skin);head.position.y=2.55;root.add(head);
 const neck=limb(new THREE.CylinderGeometry(.13,.14,.18,12),skin);neck.position.y=2.29;root.add(neck);
 const helmet=limb(new THREE.SphereGeometry(.34,18,10,0,Math.PI*2,0,Math.PI*.58),mat(d.helmet,.5,.25));helmet.position.y=2.66;root.add(helmet);
 const visor=limb(new THREE.BoxGeometry(.47,.08,.09),dark);visor.position.set(0,2.62,.27);root.add(visor);
 const pouch=limb(new THREE.BoxGeometry(.18,.23,.1),accent);pouch.position.set(-.33,1.68,.27);root.add(pouch);
 const rifle=limb(new THREE.BoxGeometry(.85,.12,.1),dark);rifle.position.set(.28,1.5,.28);rifle.rotation.z=-.28;root.add(rifle);const barrel=limb(new THREE.CylinderGeometry(.035,.035,.38,8),dark);barrel.rotation.x=Math.PI/2;barrel.position.set(.68,1.63,.29);root.add(barrel);
 root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});root.scale.setScalar(1.35);return root;
}
async function initThree(){
 if(THREE)return THREE;THREE=await import(THREE_URL);return THREE;
}
function setupLobby(){
 const stage=document.querySelector('.charStage');if(!stage||stage.dataset.real3d)return;stage.dataset.real3d='1';
 const old=stage.querySelector('.avatar');if(old)old.remove();
 const canvas=document.createElement('canvas');canvas.className='realCharCanvas';canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block';stage.appendChild(canvas);
 const label=document.createElement('div');label.className='realCharHint';label.textContent='3D KARAKTER';label.style.cssText='position:absolute;right:20px;top:18px;font-size:11px;letter-spacing:2px;opacity:.45';stage.appendChild(label);
 initThree().then(T=>{state.scene=new T.Scene();state.scene.background=new T.Color(0x0a151d);state.camera=new T.PerspectiveCamera(30,1,.1,100);state.camera.position.set(3.2,2.25,5.5);state.camera.lookAt(0,1.35,0);state.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});state.renderer.setPixelRatio(Math.min(devicePixelRatio,2));state.renderer.shadowMap.enabled=true;state.renderer.shadowMap.type=T.PCFSoftShadowMap;state.scene.add(new T.HemisphereLight(0xb9d9ff,0x111820,2));const key=new T.DirectionalLight(0xffe5c0,3.2);key.position.set(3,6,4);key.castShadow=true;state.scene.add(key);const rim=new T.DirectionalLight(0x5aa9ff,2);rim.position.set(-4,3,-2);state.scene.add(rim);const floor=new T.Mesh(new T.CircleGeometry(2.2,48),new T.MeshStandardMaterial({color:0x151d22,roughness:.82}));floor.rotation.x=-Math.PI/2;floor.position.y=.08;floor.receiveShadow=true;state.scene.add(floor);state.model=makeSoldier(state.type);state.model.position.y=.08;state.scene.add(state.model);resize();animate();});
 function resize(){if(!state.renderer)return;const r=stage.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);state.renderer.setSize(w,h,false);state.camera.aspect=w/h;state.camera.updateProjectionMatrix()}
 window.addEventListener('resize',resize);
}
function animate(){state.raf=requestAnimationFrame(animate);if(!state.renderer)return;if(state.model){state.model.rotation.y+=.003;const t=performance.now()*.003;state.model.position.y=.08+Math.sin(t)*.018}state.renderer.render(state.scene,state.camera)}
function select(type){state.type=type;localStorage.setItem('char',type);if(state.model&&state.scene){state.scene.remove(state.model);state.model=makeSoldier(type);state.model.position.y=.08;state.scene.add(state.model)}const n=document.getElementById('lbCharName');if(n)n.textContent=(defs[type]||defs.scout).name;const tag=document.querySelector('.stageTag');if(tag)tag.textContent=(defs[type]||defs.scout).stats;}
function addCharacterPicker(){const center=document.querySelector('.lbCenter');if(!center||document.getElementById('charPicker'))return;const box=document.createElement('div');box.id='charPicker';box.style.cssText='display:flex;gap:7px;margin-top:10px;justify-content:center;flex-wrap:wrap';Object.keys(defs).forEach(k=>{const b=document.createElement('button');b.textContent=defs[k].name;b.dataset.char=k;b.style.cssText='background:#111a22dd;color:#fff;border:1px solid #ffffff22;padding:7px 12px;border-radius:5px;font-weight:800;cursor:pointer';b.onclick=()=>select(k);box.appendChild(b)});center.insertBefore(box,center.querySelector('.lbHint'));select(state.type)}
function enhanceRemote(){if(!window.__fpsGame?.scene)return;const scene=window.__fpsGame.scene;scene.traverse(root=>{if(!root.userData?.id||root.userData.realisticCharacter)return;root.userData.realisticCharacter=1;root.userData.baseVisibleMeshes=[];const type=root.userData.characterType||'scout';const visual=makeSoldier(type);visual.name='REALISTIC_PLAYER_MODEL';visual.scale.setScalar(.72);visual.position.y=-1.05;root.add(visual);root.userData.realisticVisual=visual;root.userData.baseVisibleMeshes=[];root.children.forEach(c=>{if(c!==visual&&c.isMesh){c.visible=false;root.userData.baseVisibleMeshes.push(c)}});});}
function animateRemote(){if(!window.__fpsGame?.scene)return;window.__fpsGame.scene.traverse(root=>{const v=root.userData?.realisticVisual;if(!v)return;const moving=Math.abs(root.userData.vx||0)+Math.abs(root.userData.vz||0)>0.02;const t=performance.now()*.01;v.position.y=-1.05+(moving?Math.abs(Math.sin(t))*.035:0);v.rotation.y=root.rotation.y||0});}
(async()=>{await initThree();setInterval(()=>{setupLobby();addCharacterPicker();enhanceRemote()},800);setInterval(animateRemote,50);})();
window.fpsSelectCharacter=select;
})();