(()=>{
'use strict';
const KEY='fpsAudioEnabled';
let enabled=localStorage.getItem(KEY)!=='0';
let ctx=null, master=null, musicGain=null, musicTimer=null, musicStep=0;
function ensure(){if(!enabled)return false;if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.75;master.connect(ctx.destination);musicGain=ctx.createGain();musicGain.gain.value=.16;musicGain.connect(master)}if(ctx.state==='suspended')ctx.resume();return true}
function tone(freq,dur,type='sine',gain=.05,when=0){if(!ensure())return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,ctx.currentTime+when);g.gain.setValueAtTime(gain,ctx.currentTime+when);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+when+dur);o.connect(g);g.connect(master);o.start(ctx.currentTime+when);o.stop(ctx.currentTime+when+dur+.02)}
function noise(dur=.08,gain=.06){if(!ensure())return;const b=ctx.createBuffer(1,ctx.sampleRate*dur,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*(1-i/a.length);const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=b;g.gain.value=gain;s.connect(g);g.connect(master);s.start()}
const sounds={jump:()=>{tone(280,.08,'triangle',.08);tone(520,.13,'sine',.045,.04)},land:()=>tone(95,.08,'sine',.06),shoot:()=>{noise(.045,.11);tone(120,.07,'square',.05)},reload:()=>{tone(650,.06,'square',.05);tone(850,.05,'square',.045,.1);tone(480,.1,'square',.05,.18)},run:()=>tone(110,.045,'triangle',.025),crouch:()=>tone(180,.08,'sine',.035),prone:()=>tone(130,.1,'sine',.04),ui:()=>tone(720,.05,'sine',.035)};
window.fpsSound=(name)=>{if(sounds[name])sounds[name]()};
window.fpsSetAudio=(v)=>{enabled=!!v;localStorage.setItem(KEY,enabled?'1':'0');if(!enabled){if(musicTimer)clearInterval(musicTimer);musicTimer=null;if(ctx)ctx.suspend();}else{ensure();startMusic()}};
function startMusic(){if(musicTimer||!enabled)return;const notes=[110,147,165,196,165,147,123,147];musicTimer=setInterval(()=>{if(!enabled)return;const f=notes[musicStep++%notes.length];tone(f,.42,'sine',.018);tone(f*2,.25,'triangle',.008,.04)},520)}
function hook(){document.addEventListener('keydown',e=>{if(e.repeat)return;const k=e.key.toLowerCase();if(k===' '){fpsSound('jump')}else if(k==='r'){fpsSound('reload')}else if(k==='c'||k==='z'){fpsSound('crouch')}else if(k==='x'){fpsSound('prone')}});document.addEventListener('mousedown',e=>{if(e.button===0)fpsSound('shoot')});window.addEventListener('fps:audio',e=>fpsSetAudio(e.detail?.enabled!==false));setTimeout(()=>{if(enabled){ensure();startMusic()}},900)}
hook();
const oldSet=window.setInterval;
window.addEventListener('load',()=>{document.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>fpsSound('ui')))});
})();