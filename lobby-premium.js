(()=>{
'use strict';
function boot(){
 const lobby=document.getElementById('lobby'); if(!lobby||document.getElementById('premiumLobby')) return;
 const style=document.createElement('style');style.id='premiumLobbyStyle';style.textContent=`
 #premiumLobby{position:absolute;inset:0;z-index:7;pointer-events:none;color:#fff;font-family:Arial,sans-serif}
 .pl-vignette{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,transparent 20%,#0004 72%,#0009 100%)}
 .pl-sky{position:absolute;inset:0;background:linear-gradient(180deg,#07111dcc 0%,transparent 30%,transparent 72%,#050b08aa 100%)}
 .pl-brand{position:absolute;left:28px;top:91px;font-size:11px;letter-spacing:3px;font-weight:900;color:#ffffff99;text-shadow:0 2px 8px #000}
 .pl-brand strong{color:#ffd36a;font-size:15px}
 .pl-profile{position:absolute;right:22px;top:84px;display:flex;align-items:center;gap:9px;background:#071018cc;border:1px solid #ffffff22;border-radius:9px;padding:7px 11px;backdrop-filter:blur(10px);box-shadow:0 8px 25px #0005}
 .pl-avatar{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#e5a83d,#8e5b1e);color:#111;font-weight:1000}
 .pl-profile small{display:block;color:#ffffff66;font-size:9px}.pl-profile b{font-size:12px}
 .pl-particles{position:absolute;inset:0;overflow:hidden}
 .pl-particle{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;opacity:.35;box-shadow:0 0 10px #fff;animation:plFloat linear infinite}
 @keyframes plFloat{from{transform:translateY(25px);opacity:0}15%{opacity:.45}85%{opacity:.2}to{transform:translateY(-110px);opacity:0}}
 .pl-bottom{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);display:flex;gap:8px;pointer-events:auto}
 .pl-bottom button{background:#071018dd;border:1px solid #ffffff20;color:#ffffffaa;border-radius:7px;padding:8px 14px;font-size:10px;font-weight:900;cursor:pointer;backdrop-filter:blur(8px)}
 .pl-bottom button:hover{color:#fff;border-color:#e5a83d88;background:#162331ee}
 .pl-announce{position:absolute;left:50%;top:88px;transform:translateX(-50%);font-size:10px;letter-spacing:1.5px;color:#fff9;background:#071018aa;border:1px solid #ffffff18;border-radius:20px;padding:7px 14px;backdrop-filter:blur(7px);box-shadow:0 5px 20px #0004}
 .pl-announce i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#4de17b;box-shadow:0 0 9px #4de17b;margin-right:7px}
 .pl-title{position:absolute;left:50%;top:17%;transform:translateX(-50%);text-align:center;pointer-events:none;text-shadow:0 4px 20px #000}
 .pl-title b{font-size:10px;letter-spacing:5px;color:#ffd66e}.pl-title h1{margin:4px 0 0;font-size:42px;letter-spacing:2px;font-weight:1000}.pl-title span{font-size:11px;color:#ffffff88;letter-spacing:2px}
 .pl-rank{position:absolute;left:22px;bottom:25px;background:#071018dd;border:1px solid #ffffff20;border-radius:10px;padding:11px 14px;width:205px;backdrop-filter:blur(9px);box-shadow:0 8px 30px #0005}
 .pl-rank-head{display:flex;justify-content:space-between;font-size:10px;color:#fff9}.pl-rank-head b{color:#ffd66e}.pl-xp{height:5px;background:#ffffff14;border-radius:4px;overflow:hidden;margin:7px 0 5px}.pl-xp i{display:block;width:64%;height:100%;background:linear-gradient(90deg,#d9952c,#ffd66e);box-shadow:0 0 10px #e5a83d66}.pl-rank small{font-size:9px;color:#ffffff66}
 .lbTop{backdrop-filter:blur(9px)!important}
 .lbLogo{font-size:27px!important}.lbLogo:after{content:'  //  ONLINE';font-size:8px;letter-spacing:2px;color:#54df83;vertical-align:middle;margin-left:8px}
 .playBtn{box-shadow:0 0 0 1px #ffd66e44,0 8px 30px #0008!important}
 .charStage{box-shadow:inset 0 0 90px #0005}
 @media(max-width:900px){.pl-title{top:13%}.pl-title h1{font-size:27px}.pl-profile{top:78px;right:10px}.pl-brand{left:12px;top:78px}.pl-rank{display:none}.pl-announce{top:116px}.pl-bottom{bottom:5px}.pl-bottom button{padding:7px 9px}}
 `;document.head.appendChild(style);
 const ui=document.createElement('div');ui.id='premiumLobby';ui.innerHTML=`<div class="pl-sky"></div><div class="pl-vignette"></div><div class="pl-particles"></div><div class="pl-brand"><strong>FPS ARENA</strong><br>TACTICAL COMBAT SYSTEM</div><div class="pl-profile"><div class="pl-avatar">R</div><div><small>OYUNCU</small><b>RESUL</b></div></div><div class="pl-announce"><i></i> SUNUCULAR AKTİF • SEZON 01</div><div class="pl-title"><b>WELCOME TO THE ARENA</b><h1>OPERASYONA HAZIR</h1><span>SEÇ • GELİŞTİR • SAVAŞ • KAZAN</span></div><div class="pl-rank"><div class="pl-rank-head"><span>SEZON İLERLEMESİ</span><b>12. SEVİYE</b></div><div class="pl-xp"><i></i></div><small>2.450 / 4.000 XP • Sonraki ödül: 500₺</small></div><div class="pl-bottom"><button id="plNews">▣ HABERLER</button><button id="plRules">◈ KURALLAR</button><button id="plHelp">? DESTEK</button></div>`;lobby.appendChild(ui);
 const particles=ui.querySelector('.pl-particles');for(let i=0;i<32;i++){const p=document.createElement('i');p.className='pl-particle';p.style.left=(Math.random()*100)+'%';p.style.top=(35+Math.random()*65)+'%';p.style.animationDuration=(5+Math.random()*8)+'s';p.style.animationDelay=(-Math.random()*10)+'s';p.style.transform=`scale(${.5+Math.random()*1.8})`;particles.appendChild(p)}
 ['plNews','plRules','plHelp'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>{const m={plNews:'📢 Yeni harita, yeni silahlar ve karakter sistemi yolda!',plRules:'🎯 Rakiplerini alt et, XP kazan ve operatörünü geliştir.',plHelp:'💡 WASD hareket • SPACE zıpla • Sol tık ateş • R reload'};if(typeof window.alert==='function')window.alert(m[id])}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,250));else setTimeout(boot,250);
setTimeout(boot,1500);setTimeout(boot,3500);
})();
