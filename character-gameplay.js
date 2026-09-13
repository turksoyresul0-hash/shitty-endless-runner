(()=>{'use strict';
const BASE={scout:{speed:9,hp:100,armor:55,damage:70},assault:{speed:8.5,hp:115,armor:72,damage:84},tank:{speed:6.5,hp:145,armor:100,damage:92},elite:{speed:9.5,hp:120,armor:82,damage:96}};
let last='';
function apply(){const p=window.__fpsPlayer;if(!p)return;const id=localStorage.getItem('char')||'scout',d=BASE[id]||BASE.scout;if(id===last)return;last=id;p.speed=d.speed;p.hp=Math.min(Number(p.hp)||d.hp,d.hp);p.maxHp=d.hp;p.armor=Math.min(Number(p.armor)||d.armor,d.armor);p.maxArmor=d.armor;p.character=id;p.damageMultiplier=d.damage/70;window.__fpsCharacterStats=d;window.dispatchEvent(new CustomEvent('fps:stats',{detail:{id,...d}}));}
setInterval(apply,250);window.addEventListener('fps:character',()=>{last='';apply()});
})();