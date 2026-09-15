const G=global.__fpsMatchAuthority;
if(!G)throw new Error('FPS assist authority bootstrap missing');
const recent=new Map();
const WINDOW_MS=10000;
const original=G.broadcast;
if(typeof original!=='function')throw new Error('FPS assist authority requires broadcast');
G.broadcast=function(data,except){
  if(data&&data.type==='hit'&&data.attacker&&data.target){
    let log=recent.get(String(data.target));
    if(!log){log=new Map();recent.set(String(data.target),log)}
    log.set(String(data.attacker),Date.now());
  }
  if(data&&data.type==='kill'&&data.target){
    const targetId=String(data.target),killerId=String(data.attacker||''),killer=G.players.get(killerId),now=Date.now(),log=recent.get(targetId);
    if(log){
      for(const [attackerId,at] of log){
        if(attackerId===killerId||now-at>WINDOW_MS)continue;
        const p=G.players.get(attackerId);
        if(p&&p.room===killer?.room&&p.team!==killer?.team)p.assists=(p.assists||0)+1;
      }
    }
    recent.delete(targetId);
  }
  return original.call(G,data,except);
};
setInterval(()=>{
  const now=Date.now();
  for(const [targetId,log] of recent){
    for(const [attackerId,at] of log)if(now-at>WINDOW_MS||!G.players.has(attackerId))log.delete(attackerId);
    if(!log.size)recent.delete(targetId);
  }
},1000);
global.__fpsAssistAuthority={recent};
