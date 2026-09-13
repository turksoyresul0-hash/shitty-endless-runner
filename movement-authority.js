(()=>{
  const A=global.__fpsMatchAuthority;
  if(!A)return;
  const {players,stats}=A;
  const last=new Map();
  const MAX_TICK=.35;
  const GRACE=1.35;
  const MAX_JUMP_HEIGHT=4.75;
  const GROUND_Y=2;
  function live(p){const s=p.room&&global.__fpsMatchState?.get(p.room);return !!(s&&s.phase==='live')}
  function spawnFor(p){return p.team==='blue'?{x:42,y:2,z:-42,ry:2.36}:{x:-42,y:2,z:42,ry:-.78}}
  function baseline(id,p,now){last.set(id,{x:p.x,y:p.y,z:p.z,t:now,ry:p.ry,rx:p.rx,room:p.room,team:p.team,live:live(p)})}
  function check(){
    const now=Date.now();
    for(const [id,p] of players){
      if(p.dead){last.delete(id);continue}
      const isLive=live(p);
      const prev=last.get(id);
      if(!prev||prev.room!==p.room||prev.team!==p.team||prev.live!==isLive){baseline(id,p,now);continue}
      const dt=Math.max(.05,Math.min(MAX_TICK,(now-prev.t)/1000));
      const c=stats(p.character);
      const maxSpeed=9.5*(c.speed||1);
      const maxDist=maxSpeed*dt*GRACE+1.0;
      const dx=p.x-prev.x,dy=p.y-prev.y,dz=p.z-prev.z;
      const horizontal=Math.hypot(dx,dz);
      const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
      const yTooHigh=p.y>GROUND_Y+MAX_JUMP_HEIGHT;
      if(!Number.isFinite(dist)||dist>maxDist||horizontal>maxDist||yTooHigh){
        p.x=prev.x;p.y=prev.y;p.z=prev.z;p.ry=prev.ry??p.ry;p.rx=prev.rx??p.rx;
        baseline(id,p,now);
        continue;
      }
      last.set(id,{x:p.x,y:p.y,z:p.z,t:now,ry:p.ry,rx:p.rx,room:p.room,team:p.team,live:isLive});
    }
    for(const id of last.keys())if(!players.has(id))last.delete(id)
  }
  setInterval(check,100);
})();
