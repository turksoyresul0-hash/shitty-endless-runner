(()=>{
'use strict';
const boot=()=>{
 const lobby=document.getElementById('lobby'); if(!lobby||document.getElementById('mmx')) return false;
 const style=document.createElement('style'); style.textContent=`
#mmx{position:absolute;inset:0;z-index:20;pointer-events:none;font-family:Arial,sans-serif}
.mmx-profile{position:absolute;left:22px;top:86px;width:236px;background:#071018d9;border:1px solid #ffffff25;border-radius:12px;padding:12px;box-shadow:0 10px 35px #0007;backdrop-filter:blur(10px);pointer-events:auto}
.mmx-avatar{width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#e5a83d,#6f4320);display:grid;place-items:center;font-size:22px;font-weight:900;float:left;margin-right:10px}.mmx-name{font-size:15px;font-weight:900}.mmx-level{font-size:11px;opacity:.6;margin-top:3px}.mmx-xp{clear:both;height:6px;background:#182532;border-radius:5px;margin-top:11px;overflow:hidden}.mmx-xp i{display:block;width:62%;height:100%;background:#e5a83d;box-shadow:0 0 10px #e5a83d66}.mmx-xprow{display:flex;justify-content:space-between;font-size:10px;margin-top:5px;opacity:.65}
.mmx-stats{display:flex;gap:6px;margin-top:10px}.mmx-stat{flex:1;text-align:center;padding:7px 3px;border-radius:7px;background:#ffffff08;border:1px solid #ffffff10}.mmx-stat b{display:block;font-size:14px;color:#ffd66e}.mmx-stat span{font-size:9px;opacity:.5}
.mmx-online{position:absolute;right:22px;top:86px;padding:8px 11px;background:#071018d9;border:1px solid #ffffff20;border-radius:8px;font-size:11px;backdrop-filter:blur(8px)}.mmx-online i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#48e37b;box-shadow:0 0 9px #48e37b;margin-right:6px}
.mmx-mission{position:absolute;left:22px;bottom:22px;width:236px;background:#071018d9;border:1px solid #ffffff20;border-radius:10px;padding:11px;box-shadow:0 10px 30px #0006;pointer-events:auto}.mmx-mission b{font-size:12px}.mmx-mission small{display:block;opacity:.55;margin:4px 0 8px}.mmx-progress{height:5px;background:#17232d;border-radius:4px;overflow:hidden}.mmx-progress i{display:block;width:34%;height:100%;background:#58a9e8}.mmx-reward{display:flex;justify-content:space-between;margin-top:6px;font-size:10px}.mmx-reward span{color:#ffd66e}
.mmx-event{position:absolute;right:22px;bottom:22px;width:250px;background:linear-gradient(135deg,#111d27ee,#071018ee);border:1px solid #e5a83d55;border-radius:10px;padding:12px;box-shadow:0 10px 35px #0008;pointer-events:auto}.mmx-event .tag{color:#ffd66e;font-size:9px;font-weight:900;letter-spacing:1px}.mmx-event h3{margin:5px 0;font-size:15px}.mmx-event p{margin:0;opacity:.6;font-size:11px;line-height:1.4}.mmx-event button{margin-top:9px;width:100%;padding:8px;border:0;border-radius:6px;background:#e5a83d;font-weight:900;cursor:pointer}
.mmx-queue{position:absolute;left:50%;bottom:105px;transform:translateX(-50%);font-size:10px;letter-spacing:1px;color:#ffd66e;opacity:0;transition:.25s;text-shadow:0 2px 8px #000}.mmx-queue.on{opacity:1}.mmx-spin{display:inline-block;width:9px;height:9px;border:2px solid #ffffff44;border-top-color:#ffd66e;border-radius:50%;animation:mmxspin .7s linear infinite;margin-right:5px;vertical-align:-2px}@keyframes mmxspin{to{transform:rotate(360deg)}}
@media(max-width:900px){.mmx-profile{left:10px;top:82px;width:170px;padding:9px}.mmx-stats{display:none}.mmx-online{right:10px;top:82px}.mmx-mission{display:none}.mmx-event{display:none}.mmx-queue{bottom:98px}}
`;
 document.head.appendChild(style);
 const root=document.createElement('div');root.id='mmx';root.innerHTML=`
 <div class="mmx-profile"><div class="mmx-avatar">⚡</div><div class="mmx-name">OPERATÖR</div><div class="mmx-level">SEVİYE <b id="mmxLvl">12</b> • FRONTLINE</div><div class="mmx-xp"><i id="mmxXp"></i></div><div class="mmx-xprow"><span id="mmxXpText">2.450 / 4.000 XP</span><span>62%</span></div><div class="mmx-stats"><div class="mmx-stat"><b id="mmxKills">0</b><span>ELİM</span></div><div class="mmx-stat"><b id="mmxWins">0</b><span>GALİBİYET</span></div><div class="mmx-stat"><b id="mmxMoney">0</b><span>₺</span></div></div></div>
 <div class="mmx-online"><i></i><b id="mmxOnline">24</b> oyuncu çevrimiçi</div>
 <div class="mmx-mission"><b>🎯 GÜNLÜK GÖREV</b><small>3 rakibi etkisiz hale getir</small><div class="mmx-progress"><i id="mmxMissionBar"></i></div><div class="mmx-reward"><span id="mmxMissionText">1 / 3</span><span>+250₺</span></div></div>
 <div class="mmx-event"><div class="tag">⚡ SEZON ETKİNLİĞİ</div><h3>FRONTLINE: YENİ OPERASYON</h3><p>Yeni silahlar, görevler ve ödüller. Sezon XP'si kazan ve özel içeriklerin kilidini aç.</p><button id="mmxEventBtn">ETKİNLİĞİ GÖR</button></div>
 <div class="mmx-queue" id="mmxQueue"><span class="mmx-spin"></span>UYGUN MAÇ ARANIYOR...</div>`;
 lobby.appendChild(root);
 const money=()=>{const n=Number(localStorage.getItem('money')||0);const dom=Number(document.getElementById('lbMoney')?.textContent||0);return dom||n};
 const sync=()=>{const m=money();document.getElementById('mmxMoney').textContent=m.toLocaleString('tr-TR');const owned=JSON.parse(localStorage.getItem('owned')||'["pistol"]');document.getElementById('mmxKills').textContent=Number(localStorage.getItem('totalKills')||0);document.getElementById('mmxWins').textContent=Number(localStorage.getItem('wins')||0);document.getElementById('mmxLvl').textContent=Number(localStorage.getItem('fpsLevel')||12)};
 sync();
 const play=document.getElementById('lbPlay'),quick=document.getElementById('lbQuick');
 const queue=()=>{document.getElementById('mmxQueue').classList.add('on');setTimeout(()=>document.getElementById('mmxQueue').classList.remove('on'),1800)};
 play?.addEventListener('click',queue);quick?.addEventListener('click',queue);
 document.getElementById('mmxEventBtn').onclick=()=>{const b=document.querySelector('#lbShop');if(b)b.click();else window.dispatchEvent(new CustomEvent('fps:open-content'))};
 window.addEventListener('storage',sync);window.addEventListener('fps:money',sync);window.addEventListener('fps:character',sync);
 setInterval(()=>{const n=18+Math.floor(Math.random()*15);document.getElementById('mmxOnline').textContent=n;},7000);
 return true;
};
if(!boot()){const mo=new MutationObserver(()=>{if(boot())mo.disconnect()});mo.observe(document.body,{childList:true,subtree:true})}
})();
