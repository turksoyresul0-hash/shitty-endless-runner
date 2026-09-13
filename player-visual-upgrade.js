(()=>{
'use strict';
let T=null;
const COLORS=[0x53685a,0x4c555c,0x3e474d,0x252a31,0x6b5145,0x4d5969];
function mat(c,r=.62,m=.12){return new T.MeshStandardMaterial({color:c,roughness:r,metalness:m})}
function addPart(g,o){o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
function buildRealistic(root,index=0){if(!T||root.userData.__realisticVisual)return;root.userData.__realisticVisual=true;const g=new T.Group();g.name='REALISTIC_PLAYER';const skin=mat(0xb87858,.75,0),cloth=mat(COLORS[index%COLORS.length]),dark=mat(0x171c20,.5,.35),black=mat(0x090b0c,.72,.15),accent=mat(0xd39a42,.42,.3);
const pelvis=addPart(g,new T.Mesh(new T.BoxGeometry(.55,.3,.34),dark));pelvis.position.y=.82;
const torso=addPart(g,new T.Mesh(new T.CapsuleGeometry(.38,.68,6,12),cloth));torso.position.y=1.32;
const plate=addPart(g,new T.Mesh(new T.BoxGeometry(.62,.65,.18),dark));plate.position.set(0,1.35,.31);
const neck=addPart(g,new T.Mesh(new T.CylinderGeometry(.11,.13,.18,10),skin));neck.position.y=1.78;
const head=addPart(g,new T.Mesh(new T.SphereGeometry(.29,18,14),skin));head.scale.set(1,.98,.92);head.position.y=2.05;
const helmet=addPart(g,new T.Mesh(new T.SphereGeometry(.34,18,12,0,Math.PI*2,0,Math.PI*.62),dark));helmet.position.y=2.15;
const visor=addPart(g,new T.Mesh(new T.BoxGeometry(.43,.11,.035),black));visor.position.set(0,2.08,.28);
for(const s of[-1,1]){const arm=addPart(g,new T.Mesh(new T.CapsuleGeometry(.115,.62,5,9),cloth));arm.position.set(s*.49,1.35,0);arm.rotation.z=s*.08;const fore=addPart(g,new T.Mesh(new T.CapsuleGeometry(.1,.43,5,9),cloth));fore.position.set(s*.54,1.02,.13);fore.rotation.z=s*.12;const hand=addPart(g,new T.Mesh(new T.SphereGeometry(.11,10,8),skin));hand.position.set(s*.55,.78,.15);const thigh=addPart(g,new T.Mesh(new T.CapsuleGeometry(.14,.55,5,9),dark));thigh.position.set(s*.19,.52,0);const shin=addPart(g,new T.Mesh(new T.CapsuleGeometry(.115,.52,5,9),dark));shin.position.set(s*.19,.18,0);const boot=addPart(g,new T.Mesh(new T.BoxGeometry(.24,.16,.42),black));boot.position.set(s*.19,.02,.09)}
const belt=addPart(g,new T.Mesh(new T.TorusGeometry(.39,.028,8,28),accent));belt.rotation.x=Math.PI/2;belt.position.y=1.02;
const rifle=new T.Group();const rb=addPart(rifle,new T.Mesh(new T.BoxGeometry(.62,.12,.18),dark));const barrel=addPart(rifle,new T.Mesh(new T.CylinderGeometry(.035,.035,.72,8),black));barrel.rotation.z=Math.PI/2;barrel.position.x=.56;const mag=addPart(rifle,new T.Mesh(new T.BoxGeometry(.1,.25,.11),black));mag.position.set(.08,-.15,0);rifle.position.set(.34,1.35,.3);rifle.rotation.z=-.12;g.add(rifle);
const height=2.25;g.scale.setScalar(1);g.position.y=0;root.add(g);root.userData.realisticModel=g;return g}
function scan(){const game=window.__fpsGame;if(!T||!game?.scene)return;game.scene.traverse(o=>{if(o?.userData?.id&&!o.userData.local&&!o.userData.__realisticVisual){buildRealistic(o,hash(String(o.userData.id)))}})}
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
async function boot(){try{T=await import('three');setInterval(scan,700);setTimeout(scan,1500)}catch(e){console.warn('player visual upgrade unavailable',e)}}
boot();
})();