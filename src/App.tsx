import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Flame, Github, Heart, Menu, Moon, Pause, Play, Send, Sparkles, Sun, Volume2, VolumeX, X } from 'lucide-react'

type Section = 'home' | 'celebrate' | 'wishes' | 'about'
type Particle = { x:number; y:number; vx:number; vy:number; life:number; max:number; hue:number; size:number; trail:{x:number;y:number}[] }

const projects = [
  {name:'Type Scale Studio',kind:'A little tool for type lovers',url:'https://akhilalladi-code.github.io/type-scale-studio/',mark:'Aa',tone:'plum'},
  {name:'DesignerOS',kind:'A workspace for the everyday designer',url:'https://github.com/akhilalladi-code/designer-os',mark:'✳',tone:'leaf'},
  {name:'PackProof',kind:'A calmer way to check creative handoffs',url:'https://akhilalladi-code.github.io/packproof/',mark:'▧',tone:'saffron'},
  {name:'Claude Code at ₹0',kind:'Notes from learning by making',url:'https://akhilalladi-code.github.io/claude-code-at-zero-cost/',mark:'⌘',tone:'rose'},
]

function useFireworks(active:boolean,canvasRef:RefObject<HTMLCanvasElement|null>) {
  const particles=useRef<Particle[]>([])
  const rockets=useRef<{x:number;y:number;tx:number;ty:number;speed:number;hue:number}[]>([])
  useEffect(()=>{
    const canvas=canvasRef.current
    if(!canvas)return
    const ctx=canvas.getContext('2d')
    if(!ctx)return
    let frame=0,raf=0
    const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
    resize();window.addEventListener('resize',resize)
    const burst=(x:number,y:number,hue:number)=>{const count=38+Math.floor(Math.random()*26);for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*4.2;particles.current.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:48+Math.random()*35,max:83,hue:hue+Math.random()*34-17,size:1+Math.random()*2.1,trail:[]})}}
    const loop=()=>{
      frame++
      ctx.clearRect(0,0,innerWidth,innerHeight)
      if(active&&frame%18===0)rockets.current.push({x:innerWidth*(.16+Math.random()*.68),y:innerHeight+10,tx:innerWidth*(.15+Math.random()*.7),ty:innerHeight*(.12+Math.random()*.48),speed:7+Math.random()*3,hue:[35,330,155,18][Math.floor(Math.random()*4)]})
      rockets.current=rockets.current.filter(r=>{const dx=r.tx-r.x,dy=r.ty-r.y,d=Math.hypot(dx,dy);if(d<r.speed+4){burst(r.x,r.y,r.hue);return false}r.x+=dx/d*r.speed;r.y+=dy/d*r.speed;ctx.beginPath();ctx.arc(r.x,r.y,2,0,Math.PI*2);ctx.fillStyle='hsl('+r.hue+' 90% 72%)';ctx.fill();return true})
      particles.current=particles.current.filter(p=>p.life>0)
      for(const p of particles.current){p.trail.push({x:p.x,y:p.y});if(p.trail.length>4)p.trail.shift();p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.vx*=.985;p.life--;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle='hsla('+p.hue+' 92% 70% / '+Math.max(0,p.life/p.max)+')';ctx.fill()}
      raf=requestAnimationFrame(loop)
    }
    loop()
    const click=(e:PointerEvent)=>{if(!active&&!document.querySelector('.celebrate-page'))return;if((e.target as HTMLElement)?.closest('button,a,input,select,textarea'))return;burst(e.clientX,e.clientY,[38,330,160,22][Math.floor(Math.random()*4)])}
    window.addEventListener('pointerdown',click)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointerdown',click)}
  },[active,canvasRef])
  return ()=>{const x=innerWidth*(.2+Math.random()*.6),y=innerHeight*(.15+Math.random()*.35);const hue=[35,330,155,18][Math.floor(Math.random()*4)];for(let i=0;i<48;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*4;particles.current.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:55,max:55,hue,size:1+Math.random()*2,trail:[]})}}
}

function Rangoli({small=false}:{small?:boolean}) {
  return <svg className={small?'rangoli rangoli-small':'rangoli'} viewBox="0 0 220 220" aria-hidden="true">
    <g transform="translate(110 110)" fill="none" stroke="currentColor" strokeWidth="1.2">
      {Array.from({length:12},(_,i)=><g key={i} transform={`rotate(${i*30})`}><path d="M0 -18 C-9 -38 -9 -68 0 -91 C9 -68 9 -38 0 -18Z" fill="currentColor" fillOpacity=".08"/><circle cx="0" cy="-76" r="3" fill="currentColor"/><path d="M0 -23 Q-22 -45 0 -64 Q22 -45 0 -23Z"/></g>)}
      <circle r="18"/><circle r="7" fill="currentColor"/><circle r="99" strokeDasharray="2 6"/>
    </g>
  </svg>
}

export default function App(){
  const [section,setSection]=useState<Section>(()=>location.hash.replace('#','') as Section||'home')
  const [menu,setMenu]=useState(false),[lit,setLit]=useState<number[]>([0]),[continuous,setContinuous]=useState(false)
  const [sound,setSound]=useState(false),[volume,setVolume]=useState(.25),[to,setTo]=useState(''),[from,setFrom]=useState('Akhil')
  const [tone,setTone]=useState('heartfelt'),[wish,setWish]=useState(''),[copied,setCopied]=useState(false),[dark,setDark]=useState(false)
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const launch=useFireworks(continuous,canvasRef)
  const audio=useRef<AudioContext|null>(null)
  useEffect(()=>{const onHash=()=>setSection((location.hash.replace('#','') as Section)||'home');window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[])
  useEffect(()=>{document.body.classList.toggle('night-mode',dark);return()=>document.body.classList.remove('night-mode')},[dark])
  const navigate=(s:Section)=>{setSection(s);location.hash=s==='home'?'':'#'+s;setMenu(false);window.scrollTo({top:0,behavior:'smooth'})}
  const light=(i:number)=>setLit(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])
  const playChime=()=>{if(!sound)return;try{const Ctx=window.AudioContext||((window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext);if(!Ctx)return;audio.current??=new Ctx();const c=audio.current,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=660;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(volume*.16,c.currentTime+.03);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.7);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.72)}catch{/* Audio is an optional enhancement. */}}
  const makeWish=()=>{const name=to.trim()||'someone dear';const lines=tone==='joyful'?[`Happy Diwali, ${name}!`,'Hope the house is full of laughter, the sweets disappear too quickly, and the year ahead brings lovely surprises.']:tone==='simple'?[`A beautiful Diwali to you, ${name}.`,'Wishing you peace at home, light in your heart, and good things in the days ahead.']:[`Thinking of you this Diwali, ${name}.`,'May there be warmth around your table, familiar voices at your door, and enough little moments to remember long after the lights come down.'];setWish(lines.join('\n\n'))}
  const copyWish=async()=>{try{await navigator.clipboard.writeText(`${wish}\n\nWith love, ${from||'Akhil'}`);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}}
  const greeting=wish||'May there be warmth around your table, familiar voices at your door, and enough little moments to remember long after the lights come down.'
  return <div className="site-shell">
    <canvas ref={canvasRef} className="firework-canvas" aria-hidden="true"/>
    <header className="site-header">
      <button className="wordmark" onClick={()=>navigate('home')} aria-label="Go home"><img src="./assets/diya-art.svg" alt=""/><span>diwali,<i> at home.</i></span></button>
      <nav className={menu?'main-nav open':'main-nav'} aria-label="Main navigation">
        {(['home','celebrate','wishes','about'] as Section[]).map(s=><button key={s} className={section===s?'nav-active':''} onClick={()=>navigate(s)}>{s==='home'?'The evening':s==='celebrate'?'Little lights':s==='wishes'?'A note for you':'The maker'}</button>)}
      </nav>
      <div className="header-actions"><button className="icon-button" onClick={()=>setDark(!dark)} aria-label="Toggle night mode">{dark?<Sun size={17}/>:<Moon size={17}/>}</button><button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?<X/>:<Menu/>}</button><button className="header-cta" onClick={()=>navigate('celebrate')}>Come celebrate <ArrowUpRight size={14}/></button></div>
    </header>
    <AnimatePresence mode="wait">
      <motion.main key={section} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.38,ease:[.22,.61,.36,1]}}>
        {section==='home'&&<Home navigate={navigate} launch={launch}/>}
        {section==='celebrate'&&<Celebrate lit={lit} light={light} playChime={playChime} continuous={continuous} setContinuous={setContinuous} launch={launch} sound={sound} setSound={setSound} volume={volume} setVolume={setVolume}/>}
        {section==='wishes'&&<Wishes to={to} setTo={setTo} from={from} setFrom={setFrom} tone={tone} setTone={setTone} makeWish={makeWish} wish={greeting} copyWish={copyWish} copied={copied}/>}
        {section==='about'&&<About/>}
      </motion.main>
    </AnimatePresence>
    <footer className="site-footer"><div className="footer-flower"><Rangoli small/></div><span>Made slowly, with love & a little code.</span><span>Hyderabad · Diwali 2026</span><a href="https://github.com/akhilalladi-code/diwali-universe" target="_blank" rel="noreferrer">Akhil's little project <Github size={14}/></a></footer>
  </div>
}

function Home({navigate,launch}:{navigate:(s:Section)=>void;launch:()=>void}){
  return <div className="home-page">
    <section className="home-hero page-width">
      <div className="hero-note"><span className="hand-line"/> A LITTLE FESTIVE CORNER OF THE INTERNET</div>
      <div className="hero-grid">
        <div className="hero-copy"><p className="small-kicker">NOVEMBER 2026 <span>✳</span> HYDERABAD, INDIA</p><h1>Some nights<br/>are made for <em>light.</em></h1><p className="hero-intro">The house smells of sweets. Someone's fixing the rangoli. There's always one more diya to light. I wanted to keep a little of that feeling here.</p><div className="hero-buttons"><button className="button-plum" onClick={()=>navigate('celebrate')}>Light a diya <ArrowRight size={16}/></button><button className="button-text" onClick={launch}>Make a little sparkle <Sparkles size={15}/></button></div><div className="handwritten">A small Diwali project, made by Akhil <span>↗</span></div></div>
        <div className="hero-art-wrap"><div className="paper-circle"></div><div className="hero-sticker">शुभ<br/>दीपावली</div><img className="main-diya" src="./assets/diya-art.svg" alt="A colourful illustrated diya in magenta, emerald and gold"/><div className="art-caption"><span>01 / 05</span><span>LIGHT, IN ITS OWN WAY</span></div><div className="tiny-star star-one">✳</div><div className="tiny-star star-two">✦</div></div>
      </div>
      <div className="hero-bottom"><span>SCROLL A LITTLE</span><ArrowDown size={14}/><span className="bottom-note">No rush. Stay for a moment.</span></div>
    </section>
    <section className="little-things page-width"><div className="section-intro"><span className="section-number">01 — THE NICE LITTLE THINGS</span><h2>It's the small things<br/>that make <em>the evening.</em></h2><p>Not everything needs to sparkle. Sometimes a warm light and a familiar voice are plenty.</p></div><div className="memory-list"><article><span className="memory-icon">01</span><div><h3>Light one for someone</h3><p>A row of little flames, each one carrying a quiet wish.</p></div><button onClick={()=>navigate('celebrate')} aria-label="Go light a diya"><ArrowUpRight/></button></article><article><span className="memory-icon">02</span><div><h3>Send a note, not a template</h3><p>Write something that sounds like you. A name makes all the difference.</p></div><button onClick={()=>navigate('wishes')} aria-label="Write a greeting"><ArrowUpRight/></button></article><article><span className="memory-icon">03</span><div><h3>Leave a little light on</h3><p>Let the night have its own pace. A few fireworks, then quiet again.</p></div><button onClick={()=>navigate('celebrate')} aria-label="See the fireworks"><ArrowUpRight/></button></article></div></section>
    <section className="projects-section"><div className="page-width projects-inner"><div className="section-intro"><span className="section-number">02 — THINGS I'VE BEEN MAKING</span><h2>A little design.<br/>A little <em>code.</em></h2><p>When I'm not making festive things, I'm usually making tools for designers or trying to make the next idea real.</p></div><div className="project-cards">{projects.map((p,i)=><a className={`project-card ${p.tone}`} key={p.name} href={p.url} target="_blank" rel="noreferrer"><span className="project-count">0{i+1}</span><span className="project-symbol">{p.mark}</span><strong>{p.name}</strong><small>{p.kind}</small><ArrowUpRight className="project-arrow"/></a>)}</div></div></section>
    <section className="closing-note page-width"><Rangoli/><p>Wherever you are,<br/><em>may there be light.</em></p><span>HAPPY DIWALI · WITH LOVE, AKHIL</span><button className="button-plum" onClick={()=>navigate('wishes')}>Send someone a wish <Send size={15}/></button></section>
  </div>
}

function Celebrate({lit,light,playChime,continuous,setContinuous,launch,sound,setSound,volume,setVolume}:{lit:number[];light:(i:number)=>void;playChime:()=>void;continuous:boolean;setContinuous:(v:boolean)=>void;launch:()=>void;sound:boolean;setSound:(v:boolean)=>void;volume:number;setVolume:(v:number)=>void}){
  return <section className="celebrate-page page-width"><div className="page-heading"><span className="section-number">A SMALL RITUAL</span><h1>One flame at<br/><em>a time.</em></h1><p>Tap a diya to light it. Nothing more complicated than that.</p></div><div className="diya-ritual"><div className="ritual-top"><span>THE LITTLE ROW OF LIGHTS</span><span>{lit.length} OF 5 LIT</span></div><div className="diya-row">{Array.from({length:5},(_,i)=><button key={i} className={lit.includes(i)?'ritual-diya is-lit':'ritual-diya'} onClick={()=>{light(i);playChime()}} aria-pressed={lit.includes(i)}><span className="ritual-flame"/><img src="./assets/diya-art.svg" alt=""/><small>{['For home','For family','For friends','For hope','For you'][i]}</small></button>)}</div><div className="ritual-bottom"><span>{lit.length===5?'All five are glowing. Keep that feeling.':'A little light goes a long way.'}</span><button onClick={()=>{for(let i=0;i<5;i++)if(!lit.includes(i))light(i)}}>Light them all <Flame size={14}/></button></div></div><div className="firework-invite"><div><span className="section-number">WHEN THE SKY GETS DARK</span><h2>Shall we make<br/>a little <em>noise?</em></h2><p>Turn on a few fireworks. Tap the open space to make your own bursts.</p></div><div className="firework-actions"><button className="button-plum" onClick={launch}>A little sparkle <Sparkles size={15}/></button><button className={continuous?'button-outline selected':'button-outline'} onClick={()=>setContinuous(!continuous)}>{continuous?<Pause size={14}/>:<Play size={14}/>} {continuous?'Pause the sky':'Keep them coming'}</button><button className="button-outline" onClick={()=>setSound(!sound)}>{sound?<Volume2 size={14}/>:<VolumeX size={14}/>} Sound {sound?'on':'off'}</button>{sound&&<label className="volume-control">A little softer <input aria-label="Sound volume" type="range" min="0" max="1" step=".05" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label>}</div></div></section>
}

function Wishes({to,setTo,from,setFrom,tone,setTone,makeWish,wish,copyWish,copied}:{to:string;setTo:(v:string)=>void;from:string;setFrom:(v:string)=>void;tone:string;setTone:(v:string)=>void;makeWish:()=>void;wish:string;copyWish:()=>void;copied:boolean}){
  return <section className="wishes-page page-width"><div className="page-heading"><span className="section-number">A NOTE, JUST FOR YOU</span><h1>Words from<br/><em>the heart.</em></h1><p>A greeting doesn't have to be grand. It just has to feel like it came from you.</p></div><div className="wish-maker"><form onSubmit={e=>{e.preventDefault();makeWish()}}><label htmlFor="wish-to">Who are you thinking of?</label><input id="wish-to" value={to} onChange={e=>setTo(e.target.value)} placeholder="Their name" maxLength={50}/><label htmlFor="wish-from">And it's from...</label><input id="wish-from" value={from} onChange={e=>setFrom(e.target.value)} placeholder="Your name" maxLength={50}/><label>What sort of note?</label><div className="tone-options">{[['heartfelt','Heartfelt'],['joyful','A little silly'],['simple','Simple & warm']].map(([v,l])=><button type="button" key={v} className={tone===v?'tone-active':''} onClick={()=>setTone(v)}>{l}</button>)}</div><button className="button-plum submit-wish" type="submit">Write my note <ArrowRight size={15}/></button></form><div className="wish-preview"><div className="preview-top"><span>✳ A LITTLE NOTE FOR YOU</span><Heart size={15}/></div><div className="preview-body"><img src="./assets/diya-art.svg" alt=""/><p>{wish.split('\n\n').map((s,i)=><span key={i}>{s}</span>)}</p><small>WITH LOVE, {from||'AKHIL'}</small></div><button className="copy-button" onClick={copyWish}><Copy size={14}/>{copied?'Copied — go make someone smile':'Copy this little note'}{copied&&<Check size={14}/>}</button></div></div></section>
}

function About(){return <section className="about-page page-width"><div className="page-heading"><span className="section-number">A NOTE FROM THE MAKER</span><h1>Made by hand.<br/><em>Well, mostly.</em></h1><p>I'm Akhil — a graphic designer who likes making things, learning new tools and occasionally getting carried away with a side project.</p></div><div className="about-paper"><div className="about-doodle">✳</div><p>This little Diwali corner started with a simple thought: what if a website felt a little more like being at home during the festival? Not another shiny template. Just familiar colours, a lamp, a few small interactions, and a note you could send to someone you care about.</p><p>It's made in Hyderabad, with React, TypeScript, a little Canvas, and a lot of affection for the details.</p><span>— AKHIL ALLADI</span></div></section>}
