const http = require('http');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 10000;
const players = new Map();
const server = http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/plain'});res.end('FPS Arena multiplayer server online');});
const wss = new WebSocketServer({server});
function broadcast(data,except){const msg=JSON.stringify(data);for(const [id,p] of players){if(id!==except&&p.ws.readyState===1)p.ws.send(msg)}}
function publicPlayer(id,p){return{id,x:p.x,y:p.y,z:p.z,ry:p.ry,rx:p.rx,hp:p.hp,armor:p.armor,weapon:p.weapon,name:p.name}}
wss.on('connection',ws=>{
 const id=Math.random().toString(36).slice(2,10);
 const p={ws,x:0,y:2,z:12,ry:0,rx:0,hp:100,armor:100,weapon:'pistol',name:'Oyuncu-'+id,dead:false,respawnTimer:null};
 players.set(id,p);
 ws.send(JSON.stringify({type:'welcome',id,players:[...players].filter(([i])=>i!==id).map(([i,v])=>publicPlayer(i,v))}));
 broadcast({type:'join',player:publicPlayer(id,p)},id);
 ws.on('message',raw=>{let m;try{m=JSON.parse(raw)}catch{return}
  if(m.type==='state'){
   if(p.dead)return;
   Object.assign(p,{x:Number(m.x)||0,y:Number(m.y)||2,z:Number(m.z)||0,ry:Number(m.ry)||0,rx:Number(m.rx)||0,hp:Math.max(0,Math.min(100,Number(m.hp)||0)),armor:Math.max(0,Math.min(100,Number(m.armor)||0)),weapon:String(m.weapon||'pistol').slice(0,20)});
   broadcast({type:'state',player:publicPlayer(id,p)},id)
  }
  else if(m.type==='shoot'){
   if(p.dead)return;
   broadcast({type:'shoot',id,weapon:String(m.weapon||p.weapon).slice(0,20),rx:Number(m.rx)||0,ry:Number(m.ry)||0},id)
  }
  else if(m.type==='hit'){
   if(p.dead)return;
   const target=players.get(String(m.target||''));
   if(!target||target===p||target.dead)return;
   const dmg=Math.max(1,Math.min(100,Number(m.damage)||0));
   const hitType=String(m.hitType||'body').slice(0,12);
   let finalDamage=dmg;
   if(hitType==='armor')finalDamage=Math.max(1,Math.round(dmg*.7));
   const armorBlock=Math.min(target.armor,Math.round(finalDamage*.7));
   target.armor=Math.max(0,target.armor-armorBlock);
   target.hp=Math.max(0,target.hp-(finalDamage-armorBlock));
   broadcast({type:'hit',attacker:id,target:target.id,damage:finalDamage,hitType,hp:target.hp,armor:target.armor},null);
   if(target.hp<=0){
    target.dead=true;
    broadcast({type:'kill',attacker:id,target:target.id,reward:150},null);
    broadcast({type:'state',player:publicPlayer(target.id,target)},null);
    clearTimeout(target.respawnTimer);
    target.respawnTimer=setTimeout(()=>{
     if(!players.has(target.id))return;
     target.dead=false;target.hp=100;target.armor=100;target.x=0;target.y=2;target.z=12;
     broadcast({type:'respawn',id:target.id,x:target.x,y:target.y,z:target.z,hp:100,armor:100},null);
    },1200);
   }
  }
  else if(m.type==='chat'){
   const text=String(m.text||'').trim().slice(0,180);
   if(text)broadcast({type:'chat',id,name:p.name,text})
  }
  else if(m.type==='name'){
   p.name=String(m.name||p.name).trim().slice(0,24)||p.name;
   broadcast({type:'name',id,name:p.name})
  }
 });
 ws.on('close',()=>{clearTimeout(p.respawnTimer);players.delete(id);broadcast({type:'leave',id})});
});
setInterval(()=>{for(const [id,p] of players){if(p.ws.readyState!==1){clearTimeout(p.respawnTimer);players.delete(id)}}},10000);
server.listen(PORT,()=>console.log('FPS Arena server listening on '+PORT));
