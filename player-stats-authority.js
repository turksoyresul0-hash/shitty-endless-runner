const G=global.__fpsMatchAuthority;
if(!G)throw new Error('FPS player stats authority bootstrap missing');
const tracked=new Map();
const previousRequested=new Map();
function reset(id,p){p.assists=0;tracked.set(id,{kills:0,deaths:0,assists:0,lastScore:p.score||0,lastDead:!!p.dead})}
function send(r){for(const id of r.players){const p=G.players.get(id);const s=tracked.get(id);if(!p||!s||p.ws?.readyState!==1)continue;s.assists=Math.max(s.assists,Number(p.assists)||0);p.ws.send(JSON.stringify({type:'player_stats',id,name:p.name||'Oyuncu',team:p.team||'red',kills:s.kills,assists:s.assists,deaths:s.deaths,score:p.score||0}))}}
setInterval(()=>{for(const r of G.rooms.values()){const requested=!!r.matchRequested;const was=previousRequested.get(r.code)||false;if(requested&&!was){for(const id of r.players){const p=G.players.get(id);if(p)reset(id,p)}}previousRequested.set(r.code,requested);for(const id of r.players){const p=G.players.get(id);if(!p)continue;let s=tracked.get(id);if(!s)reset(id,p),s=tracked.get(id);if(p.score<s.lastScore)s.lastScore=0;if(p.score>s.lastScore){s.kills+=p.score-s.lastScore;s.lastScore=p.score}if(!s.lastDead&&p.dead)s.deaths++;s.lastDead=!!p.dead;s.assists=Math.max(s.assists,Number(p.assists)||0)}send(r)}for(const id of [...tracked.keys()])if(!G.players.has(id))tracked.delete(id)},250);
