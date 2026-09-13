(()=>{
  const G=global.__fpsMatchAuthority;
  if(!G)return;
  const locked=new Map();
  const lastHealth=new Map();
  const lastDead=new Map();
  function resetKey(id){locked.delete(id);lastHealth.delete(id);lastDead.delete(id)}
  function live(p){const s=p.room&&global.__fpsMatchState?.get(p.room);return !!(s&&s.phase==='live')}
  function tick(){
    const seen=new Set();
    for(const [id,p] of G.players){
      seen.add(id);
      if(!p.room){resetKey(id);continue}
      if(p.dead){lastHealth.delete(id);lastDead.set(id,true);continue}
      if(!live(p))continue;
      if(lastDead.get(id)===true){
        lastDead.set(id,false);
        locked.set(id,{character:p.character,maxHp:p.maxHp,maxArmor:p.maxArmor});
        lastHealth.set(id,{hp:p.hp,armor:p.armor});
        continue;
      }
      const prev=locked.get(id);
      if(!prev){
        locked.set(id,{character:p.character,maxHp:p.maxHp,maxArmor:p.maxArmor});
        lastHealth.set(id,{hp:p.hp,armor:p.armor});
        lastDead.set(id,false);
        continue;
      }
      if(p.character!==prev.character){
        p.character=prev.character;
        p.maxHp=prev.maxHp;
        p.maxArmor=prev.maxArmor;
        p.hp=Math.min(p.hp,prev.maxHp);
        p.armor=Math.min(p.armor,prev.maxArmor);
      }
      const h=lastHealth.get(id);
      if(h){
        if(p.hp>h.hp)p.hp=h.hp;
        if(p.armor>h.armor)p.armor=h.armor;
      }
      lastHealth.set(id,{hp:p.hp,armor:p.armor});
      lastDead.set(id,false);
    }
    for(const id of locked.keys())if(!seen.has(id))resetKey(id);
  }
  setInterval(tick,100);
  global.__fpsCombatAuthority={locked};
})();
