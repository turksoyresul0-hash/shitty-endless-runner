const http = require('http');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 10000;
const players = new Map();
const server = http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/plain'});res.end('FPS Arena multiplayer server online');});
const wss = new WebSocketServer({server});
function broadcast(data,except){const msg=JSON.stringify(data);for(const [id,p] of players){if(id!==except&&p.ws.readyState===1)p.ws.send(msg)}}
wss.on('connection',ws=>{
 const id=Math.random().toString(36).slice(2,10);
 const p={ws,x:0,y:2,z:12,ry:0,rx:0,hp:100,armor:100,weapon:'pistol',name:'Oyuncu-'+id};
 players.set(id,p);
 ws.send(JSON.stringify({type:'welcome',id,players:[...players].filter(([i])=>i!==id).map(([i,v])=>({id:i,x:v.x,y:v.y,z:v.z,ry:v.ry,rx:v.rx,hp:v.hp,armor:v.armor,weapon:v.weapon,name:v.name}))}));
 broadcast({type:'join',player:{id,x:p.x,y:p.y,z:p.z,ry:p.ry,rx:p.rx,hp:p.hp,armor:p.armor,weapon:p.weapon,name:p.name}},id);
 ws.on('message',raw=>{let m;try{m=JSON.parse(raw)}catch{return}
  if(m.type==='state'){Object.assign(p,{x:Number(m.x)||0,y:Number(m.y)||2,z:Number(m.z)||0,ry:Number(m.ry)||0,rx:Number(m.rx)||0,hp:Math.max(0,Number(m.hp)||0),armor:Math.max(0,Number(m.armor)||0),weapon:String(m.weapon||'pistol').slice(0,20)});broadcast({type:'state',player:{id,x:p.x,y:p.y,z:p.z,ry:p.ry,rx:p.rx,hp:p.hp,armor:p.armor,weapon:p.weapon}},id)}
  else if(m.type==='shoot'){broadcast({type:'shoot',id,weapon:String(m.weapon||p.weapon).slice(0,20),rx:Number(m.rx)||0,ry:Number(m.ry)||0},id)}
  else if(m.type==='chat'){const text=String(m.text||'').trim().slice(0,180);if(text)broadcast({type:'chat',id,name:p.name,text})}
  else if(m.type==='name'){p.name=String(m.name||p.name).trim().slice(0,24)||p.name;broadcast({type:'name',id,name:p.name})}
 });
 ws.on('close',()=>{players.delete(id);broadcast({type:'leave',id})});
});
setInterval(()=>{for(const [id,p] of players){if(p.ws.readyState!==1)players.delete(id)}},10000);
server.listen(PORT,()=>console.log('FPS Arena server listening on '+PORT));
