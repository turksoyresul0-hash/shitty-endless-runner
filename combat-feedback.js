(()=>{
'use strict';
const boot=()=>{if(document.getElementById('fps-combat-feedback'))return;
const s=document.createElement('style');s.id='fps-combat-feedback';s.textContent=`#fps-hit-confirm{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.7);font:900 28px/1 Arial;color:#fff;text-shadow:0 2px 8px #000;opacity:0;pointer-events:none;z-index:10050;transition:.12s}#fps-hit-confirm.show{opacity:1;transform:translate(-50%,-50%) scale(1)}#fps-hit-confirm.head{color:#ffd84d}#fps-damage-vignette{position:fixed;inset:0;pointer-events:none;z-index:10040;opacity:0;background:radial-gradient(circle,transparent 48%,rgba(255,20,20,.7));transition:opacity .08s}#fps-damage-vignette.show{opacity:1}#fps-elim-banner{position:fixed;left:50%;top:18%;transform:translate(-50%,-20px);font:900 22px/1 Arial;letter-spacing:3px;color:#fff;text-shadow:0 2px 10px #000;opacity:0;pointer-events:none;z-index:10050;transition:.2s}.show{opacity:1!important;transform:translate(-50%,0)!important}`;document.head.appendChild(s);
const hit=document.createElement('div');hit.id='fps-hit-confirm';hit.textContent='HIT';document.body.appendChild(hit);const vig=document.createElement('div');vig.id='fps-damage-vignette';document.body.appendChild(vig);const elim=document.createElement('div');elim.id='fps-elim-banner';elim.textContent='ELIMINATION';document.body.appendChild(elim);
let t1,t2,t3;const flash=(el,ms,t)=>{clearTimeout(t);el.classList.add('show');return setTimeout(()=>el.classList.remove('show'),ms)};
window.addEventListener('fps:damage',e=>{const d=e.detail||{};if(d.attacker&&window.__fpsNetId&&d.attacker!==window.__fpsNetId)return;hit.textContent=d.hitType==='head'?'HEADSHOT':`-${d.damage||0}`;hit.classList.toggle('head',d.hitType==='head');t1=flash(hit,180,t1)});
window.addEventListener('fps:remote-hit',e=>{const d=e.detail||{};if(d.target&&window.__fpsNetId&&d.target!==window.__fpsNetId)return;t2=flash(vig,130,t2)});
window.addEventListener('fps:kill',e=>{const d=e.detail||{};if(d.attacker&&window.__fpsNetId&&d.attacker!==window.__fpsNetId)return;elim.textContent=d.headshot?'HEADSHOT ELIMINATION':'ELIMINATION';t3=flash(elim,700,t3)});
window.addEventListener('fps:respawn',()=>{vig.classList.remove('show')});
}; if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
