(()=>{
  const $=id=>document.getElementById(id);
  const panel=$('mpPanel');
  if(!panel)return;
  const badge=document.createElement('div');
  badge.id='mpPerfBadge';
  badge.style.cssText='margin-top:8px;padding:6px 8px;border-radius:7px;background:#07101899;font-size:11px;line-height:1.35';
  badge.innerHTML='Oyuncular: <b id="mpPlayers2">0</b> • Durum: <b id="mpNet2">--</b>';
  panel.appendChild(badge);
  const style=document.createElement('style');
  style.textContent='.mp-hp{position:fixed;z-index:9;width:58px;height:5px;background:#111;border:1px solid #000;border-radius:4px;overflow:hidden;pointer-events:none;transform:translateX(-50%)}.mp-hp>i{display:block;height:100%;width:100%;background:#48e36b}.mp-hit{position:fixed;z-index:100;pointer-events:none;font:900 18px Arial;color:#ffe36e;text-shadow:2px 2px 4px #000;transform:translate(-50%,-50%);transition:opacity .35s,transform .35s}';
  document.head.appendChild(style);
  const hpBars=new Map();
  const scene=()=>window.__fpsGame?.scene;
  function ensureBar(o){if(!o?.userData?.id)return;if(hpBars.has(o.userData.id))return hpBars.get(o.userData.id);const d=document.createElement('div');d.className='mp-hp';const i=document.createElement('i');d.appendChild(i);document.body.appendChild(d);const x={d,i};hpBars.set(o.userData.id,x);return x}
  function update(){const s=scene();if(!s)return;let count=0;s.traverse(o=>{if(!o.userData?.id||!o.userData?.target)return;count++;const b=ensureBar(o),hp=Math.max(0,Math.min(100,Number(o.userData.hp??100)));b.i.style.width=hp+'%';const p=o.position.clone();p.y+=3;p.project(window.__fpsGame.camera);b.d.style.left=((p.x*.5+.5)*innerWidth)+'px';b.d.style.top=((-p.y*.5+.5)*innerHeight+7)+'px';b.d.style.display=p.z<1?'block':'none'});$('mpPlayers2').textContent=count;$('mpNet2').textContent=$('mpStatus')?.textContent||'--';requestAnimationFrame(update)}
  update();
  setInterval(()=>{for(const [id,b] of hpBars){let alive=false;scene()?.traverse(o=>{if(o.userData?.id===id)alive=true});if(!alive){b.d.remove();hpBars.delete(id)}}},1500);
  let lastStatus='';let stableSince=performance.now();
  setInterval(()=>{const st=$('mpStatus');if(!st)return;if(st.textContent!==lastStatus){lastStatus=st.textContent;stableSince=performance.now()}if(/Yeniden bağlanıyor|Hata|Sunucu hatası/i.test(lastStatus)){const btn=$('mpConnect');if(btn&&performance.now()-stableSince>3500){btn.click();stableSince=performance.now()}}},1200);
  function smooth(){const s=scene();if(!s)return;s.traverse(o=>{if(!o.userData?.target)return;if(o.userData.target.distanceTo(o.position)>.01)o.position.lerp(o.userData.target,.22);o.visible=true});requestAnimationFrame(smooth)}
  smooth();
  window.__mpShowHit=(damage,head)=>{const d=document.createElement('div');d.className='mp-hit';d.textContent=(head?'HEADSHOT ':'HIT ')+'-'+Math.round(damage);d.style.left='50%';d.style.top='44%';document.body.appendChild(d);requestAnimationFrame(()=>{d.style.opacity='0';d.style.transform='translate(-50%,-90%)'});setTimeout(()=>d.remove(),380)};
})();
