import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Copy, Download, Flame, Gift, Github, Heart, Menu, Moon, Pause, Play, Send, Sparkles, Sun, Users, Volume2, VolumeX, X } from 'lucide-react'

type Section = 'home' | 'celebrate' | 'wishes' | 'about'

const diyaAsset = `${import.meta.env.BASE_URL}assets/diya-art.svg`
type Particle = { x:number; y:number; vx:number; vy:number; life:number; max:number; hue:number; size:number; trail:{x:number;y:number}[] }

const projects = [
  {name:'Type Scale Studio',kind:'A little tool for type lovers',url:'https://akhilalladi-code.github.io/type-scale-studio/',mark:'Aa',tone:'plum'},
  {name:'DesignerOS',kind:'A workspace for the everyday designer',url:'https://github.com/akhilalladi-code/designer-os',mark:'✳',tone:'leaf'},
  {name:'PackProof',kind:'A calmer way to check creative handoffs',url:'https://akhilalladi-code.github.io/packproof/',mark:'▧',tone:'saffron'},
  {name:'Claude Code at ₹0',kind:'Notes from learning by making',url:'https://akhilalladi-code.github.io/claude-code-at-zero-cost/',mark:'⌘',tone:'rose'},
]

function useFireworks(active:boolean,canvasRef:RefObject<HTMLCanvasElement|null>,onBurst:()=>void,reduceMotion:boolean) {
  const particles=useRef<Particle[]>([])
  const onBurstRef=useRef(onBurst)
  onBurstRef.current=onBurst
  const rockets=useRef<{x:number;y:number;tx:number;ty:number;speed:number;hue:number}[]>([])
  const startRef=useRef<()=>void>(()=>{})
  useEffect(()=>{
    const canvas=canvasRef.current
    if(!canvas||reduceMotion)return
    const ctx=canvas.getContext('2d')
    if(!ctx)return
    let frame=0,raf=0,running=false
    const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
    const burst=(x:number,y:number,hue:number)=>{const count=38+Math.floor(Math.random()*26);for(let i=0;i<count;i++){const angle=Math.random()*Math.PI*2,speed=1+Math.random()*4.2;particles.current.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:48+Math.random()*35,max:83,hue:hue+Math.random()*34-17,size:1+Math.random()*2.1,trail:[]})}}
    const loop=()=>{
      frame++
      ctx.clearRect(0,0,innerWidth,innerHeight)
      if(active&&frame%18===0)rockets.current.push({x:innerWidth*(.16+Math.random()*.68),y:innerHeight+10,tx:innerWidth*(.15+Math.random()*.7),ty:innerHeight*(.12+Math.random()*.48),speed:7+Math.random()*3,hue:[35,330,155,18][Math.floor(Math.random()*4)]})
      rockets.current=rockets.current.filter(r=>{const dx=r.tx-r.x,dy=r.ty-r.y,d=Math.hypot(dx,dy);if(d<r.speed+4){burst(r.x,r.y,r.hue);onBurstRef.current();return false}r.x+=dx/d*r.speed;r.y+=dy/d*r.speed;ctx.beginPath();ctx.arc(r.x,r.y,2,0,Math.PI*2);ctx.fillStyle='hsl('+r.hue+' 90% 72%)';ctx.fill();return true})
      particles.current=particles.current.filter(p=>p.life>0)
      for(const p of particles.current){p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.vx*=.985;p.life--;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle='hsla('+p.hue+' 92% 70% / '+Math.max(0,p.life/p.max)+')';ctx.fill()}
      if(active||particles.current.length||rockets.current.length){raf=requestAnimationFrame(loop)}else{running=false;ctx.clearRect(0,0,innerWidth,innerHeight)}
    }
    const start=()=>{if(running)return;running=true;raf=requestAnimationFrame(loop)}
    startRef.current=start
    const click=(e:PointerEvent)=>{if(!active&&!document.querySelector('.celebrate-page'))return;if((e.target as HTMLElement)?.closest('button,a,input,select,textarea'))return;burst(e.clientX,e.clientY,[38,330,160,22][Math.floor(Math.random()*4)]);onBurstRef.current();start()}
    resize();window.addEventListener('resize',resize);window.addEventListener('pointerdown',click)
    if(active||particles.current.length||rockets.current.length)start()
    return()=>{cancelAnimationFrame(raf);running=false;startRef.current=()=>{};window.removeEventListener('resize',resize);window.removeEventListener('pointerdown',click)}
  },[active,canvasRef,reduceMotion])
  return ()=>{if(reduceMotion)return;const x=innerWidth*(.2+Math.random()*.6),y=innerHeight*(.15+Math.random()*.35),hue=[35,330,155,18][Math.floor(Math.random()*4)];for(let i=0;i<48;i++){const angle=Math.random()*Math.PI*2,speed=1+Math.random()*4;particles.current.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:55,max:55,hue,size:1+Math.random()*2,trail:[]})}startRef.current();onBurstRef.current()}
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
  const reduceMotion=useReducedMotion()
  const [section,setSection]=useState<Section>(()=>{const candidate=location.hash.slice(1);return ['home','celebrate','wishes','about'].includes(candidate)?candidate as Section:'home'})
  const [menu,setMenu]=useState(false),[lit,setLit]=useState<number[]>([0]),[continuous,setContinuous]=useState(false)
  const [sound,setSound]=useState(false),[volume,setVolume]=useState(.25),[to,setTo]=useState(''),[from,setFrom]=useState('Akhil')
  const [tone,setTone]=useState('heartfelt'),[wish,setWish]=useState(''),[copied,setCopied]=useState(false),[dark,setDark]=useState(false)
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const mainRef=useRef<HTMLElement>(null)
  const audio=useRef<AudioContext|null>(null)
  useEffect(()=>{const onHash=()=>{const candidate=location.hash.slice(1);setSection(['home','celebrate','wishes','about'].includes(candidate)?candidate as Section:'home')};window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash)},[])
  useEffect(()=>{const closeMenu=(event:KeyboardEvent)=>{if(event.key==='Escape')setMenu(false)};window.addEventListener('keydown',closeMenu);return()=>window.removeEventListener('keydown',closeMenu)},[])
  useEffect(()=>{document.body.classList.toggle('night-mode',dark);return()=>document.body.classList.remove('night-mode')},[dark])
  useEffect(()=>{mainRef.current?.focus({preventScroll:true})},[section])
  useEffect(()=>{if(reduceMotion)setContinuous(false)},[reduceMotion])
  useEffect(()=>()=>{if(audio.current)void audio.current.close()},[])
  const navigate=(s:Section)=>{setSection(s);location.hash=s==='home'?'':'#'+s;setMenu(false);window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'})}
  const light=(i:number)=>setLit(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])
  const playChime=()=>{if(!sound)return;try{const Ctx=window.AudioContext||((window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext);if(!Ctx)return;audio.current??=new Ctx();const c=audio.current,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=660;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(volume*.16,c.currentTime+.03);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.7);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.72)}catch{/* Audio is an optional enhancement. */}}
  const playFireworkSound=()=>{if(!sound)return;try{const Ctx=window.AudioContext||((window as unknown as {webkitAudioContext?:typeof AudioContext}).webkitAudioContext);if(!Ctx)return;audio.current??=new Ctx();const c=audio.current;void c.resume();const now=c.currentTime;const boom=c.createOscillator(),boomGain=c.createGain();boom.type='sine';boom.frequency.setValueAtTime(125,now);boom.frequency.exponentialRampToValueAtTime(42,now+.42);boomGain.gain.setValueAtTime(Math.max(.0001,volume*.42),now);boomGain.gain.exponentialRampToValueAtTime(.0001,now+.46);boom.connect(boomGain);boomGain.connect(c.destination);boom.start(now);boom.stop(now+.48);const length=Math.floor(c.sampleRate*.32),buffer=c.createBuffer(1,length,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);const noise=c.createBufferSource(),filter=c.createBiquadFilter(),crackleGain=c.createGain();noise.buffer=buffer;filter.type='bandpass';filter.frequency.value=1500;filter.Q.value=.7;crackleGain.gain.setValueAtTime(Math.max(.0001,volume*.18),now);crackleGain.gain.exponentialRampToValueAtTime(.0001,now+.3);noise.connect(filter);filter.connect(crackleGain);crackleGain.connect(c.destination);noise.start(now);noise.stop(now+.32)}catch{/* Audio is an optional enhancement. */}}
  const launch=useFireworks(continuous,canvasRef,playFireworkSound,Boolean(reduceMotion))
  const makeWish=()=>{const name=to.trim();const greeting=name?`, ${name}`:'';const lines=tone==='joyful'?[`Happy Diwali${greeting}!`,'Hope the house is full of laughter, the sweets disappear too quickly, and the year ahead brings lovely surprises.']:tone==='simple'?[`A beautiful Diwali${name?` to you, ${name}`:''}.`,'Wishing you peace at home, light in your heart, and good things in the days ahead.']:[`Thinking of you this Diwali${greeting}.`,'May there be warmth around your table, familiar voices at your door, and enough little moments to remember long after the lights come down.'];setWish(lines.join('\n\n'))}
  const copyWish=async()=>{
    const text=(wish||'May there be warmth around your table, familiar voices at your door, and enough little moments to remember long after the lights come down.')+'\n\nWith love, '+(from.trim()||'Akhil')
    try{
      if(!navigator.clipboard||!window.isSecureContext)throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(text)
      setCopied(true);window.setTimeout(()=>setCopied(false),1800)
    }catch{
      const field=document.createElement('textarea');field.value=text;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select()
      const ok=document.execCommand('copy');field.remove()
      if(ok){setCopied(true);window.setTimeout(()=>setCopied(false),1800)}else window.prompt('Copy your Diwali greeting:',text)
    }
  }
  const greeting=wish||'May there be warmth around your table, familiar voices at your door, and enough little moments to remember long after the lights come down.'
  return <div className="site-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <canvas ref={canvasRef} className="firework-canvas" aria-hidden="true"/>
    <header className="site-header">
      <button className="wordmark" onClick={()=>navigate('home')} aria-label="Go home"><img src={diyaAsset} alt=""/><span>Diwali <i>Universe</i></span></button>
      <nav className={menu?'main-nav open':'main-nav'} aria-label="Main navigation">
        {([{id:'home',label:'Home'},{id:'celebrate',label:'Little Lights'},{id:'wishes',label:'Create & Share'},{id:'about',label:'Our Story'}] as {id:Section;label:string}[]).map(item=><button key={item.label} className={section===item.id?'nav-active':''} onClick={()=>navigate(item.id)}>{item.label}</button>)}
      </nav>
      <div className="header-actions"><button className="icon-button" onClick={()=>setDark(!dark)} aria-label="Toggle night mode" aria-pressed={dark}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button><button className="menu-button" onClick={()=>setMenu(!menu)} aria-label="Toggle menu" aria-expanded={menu}>{menu?<X/>:<Menu/>}</button><button className="header-cta" onClick={()=>navigate('celebrate')}><Flame size={13}/> Light a Virtual Diya <ArrowUpRight size={14}/></button></div>
    </header>
    <AnimatePresence mode="wait">
      <motion.main id="main-content" ref={mainRef} tabIndex={-1} aria-label={`${section} section`} key={section} initial={reduceMotion?{opacity:1,y:0}:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={reduceMotion?{opacity:1,y:0}:{opacity:0,y:-8}} transition={reduceMotion?{duration:0}:{duration:.38,ease:[.22,.61,.36,1]}}>
        {section==='home'&&<Home navigate={navigate}/>}
        {section==='celebrate'&&<Celebrate lit={lit} light={light} playChime={playChime} continuous={continuous} setContinuous={setContinuous} launch={launch} sound={sound} setSound={setSound} volume={volume} setVolume={setVolume} reducedMotion={Boolean(reduceMotion)}/>}
        {section==='wishes'&&<Wishes to={to} setTo={setTo} from={from} setFrom={setFrom} tone={tone} setTone={setTone} makeWish={makeWish} wish={greeting} copyWish={copyWish} copied={copied}/>}
        {section==='about'&&<About/>}
      </motion.main>
    </AnimatePresence>
    <footer className="site-footer"><div className="footer-flower"><Rangoli small/></div><span>Made slowly, with love & a little code.</span><span>Made in Hyderabad · Festival of Lights</span><a href="https://github.com/akhilalladi-code/diwali-universe" target="_blank" rel="noreferrer">Akhil's little project <Github size={14}/></a></footer>
  </div>
}

function Home({navigate}:{navigate:(s:Section)=>void}){
  const ideas=[
    {title:'Light One for Someone',copy:'Send a virtual diya and share a little positivity.',image:'https://images.pexels.com/photos/25050399/pexels-photo-25050399.jpeg?auto=compress&cs=tinysrgb&w=420',alt:'Golden festive lights glowing in the night',go:()=>navigate('celebrate')},
    {title:'Send a Note, Not a Template',copy:'Write a heartfelt wish with our beautiful card editor.',image:'https://images.pexels.com/photos/8819385/pexels-photo-8819385.jpeg?auto=compress&cs=tinysrgb&w=420',alt:'A beautifully wrapped festive gift',go:()=>navigate('wishes')},
    {title:'Leave a Little Light On',copy:'Explore simple ideas to make this Diwali more meaningful.',image:'https://www.uel.ac.uk/sites/default/files/2025-10/AdobeStock_465253019.jpeg',alt:'Colourful traditional rangoli decoration',go:()=>navigate('celebrate')}
  ];
  const shortcuts=[
    {label:'Light a Diya',sub:'A small ritual',icon:<Flame size={29}/>,go:()=>navigate('celebrate')},
    {label:'Our Story',sub:'Meet the maker',icon:<Gift size={29}/>,go:()=>navigate('about')},
    {label:'Send a Wish',sub:'A note for someone',icon:<Users size={29}/>,go:()=>navigate('wishes')},
    {label:'Festival Ideas',sub:'Little ways to celebrate',icon:<Heart size={29}/>,go:()=>document.getElementById('festival-ideas')?.scrollIntoView({behavior:'smooth'})},
    {label:'Little Lights',sub:'Make a moment',icon:<CalendarDays size={27}/>,go:()=>navigate('celebrate')}
  ];
  return <div className="home-page reference-home">
    <section className="reference-hero">
      <div className="reference-hero-photo" role="img" aria-label="A warm Diwali evening with glowing diyas, marigolds and rangoli"/>
      <div className="reference-hero-shade"/>
      <div className="reference-hero-inner page-width">
        <div className="reference-hero-copy">
          <span className="reference-eyebrow">A FESTIVE SPACE TO CELEBRATE THE FESTIVAL<br/>OF ETERNAL LIGHTS</span>
          <h1>Some nights<br/>are made for<br/><em>light.</em></h1>
          <p>The homes shine a little brighter, the hearts feel a little warmer, and hope finds its way back — that's the magic of Diwali.</p>
          <div className="reference-hero-actions"><button className="reference-primary" onClick={()=>navigate('celebrate')}><Flame size={15}/> Light a Diya <ArrowRight size={15}/></button><button className="reference-secondary" onClick={()=>navigate('wishes')}><Send size={14}/> Share a Wish <ArrowUpRight size={14}/></button></div>
        </div>
      </div>
      <div className="reference-shortcuts page-width">{shortcuts.map(item=><button key={item.label} className="reference-shortcut" onClick={item.go}><span className="shortcut-icon">{item.icon}</span><strong>{item.label}</strong><small>{item.sub}</small></button>)}</div>
    </section>
    <section className="reference-ideas page-width" id="festival-ideas">
      <div className="reference-ideas-copy"><span className="reference-section-kicker">IDEAS, TOOLS & INSPIRATION</span><h2>It’s the small<br/>things that make<br/><em>the evening.</em></h2><p>From a single diya to a thoughtful message, Diwali is about the little moments that bring us closer.</p></div>
      <div className="reference-idea-list">{ideas.map(idea=><button className="reference-idea" key={idea.title} onClick={idea.go}><img src={idea.image} alt={idea.alt} loading="lazy"/><span className="reference-idea-copy"><strong>{idea.title}</strong><small>{idea.copy}</small></span><span className="reference-idea-arrow"><ArrowRight size={17}/></span></button>)}</div>
    </section>
    <section className="reference-project-section">
      <div className="reference-project-inner page-width">
        <div className="reference-project-copy"><span className="reference-section-kicker">DESIGN, CREATE & CELEBRATE</span><h2>A little design.<br/>A little <em>code.</em></h2><p>Interactive tools and creative mini-projects inspired by the spirit of Diwali.</p></div>
        <div className="reference-project-grid">{projects.map((p,i)=><a className={'reference-project-card '+p.tone} key={p.name} href={p.url} target="_blank" rel="noreferrer"><span className="reference-project-mark">{p.mark}</span><strong>{p.name}</strong><small>{i===0?'Explore Diwali typography':i===1?'A creative workspace for designers':i===2?'Preview your festive packaging':'Build festive projects with AI'} <ArrowUpRight size={13}/></small></a>)}</div>
      </div>
      <div className="reference-bottom-diya" aria-label="A traditional diya resting on an intricate rangoli">
        <svg className="reference-rangoli-art" viewBox="0 0 620 170" aria-hidden="true">
          <g transform="translate(310 88)" fill="none" stroke="#c87932" strokeWidth="1.15">
            <circle r="76"/><circle r="65" strokeDasharray="2 4"/><circle r="49"/><circle r="37" strokeDasharray="2 3"/><circle r="20"/>
            {Array.from({length:16},(_,i)=><g key={i} transform={`rotate(${i*22.5})`}><path d="M0 -19 C-12 -37 -9 -54 0 -68 C9 -54 12 -37 0 -19Z" fill="#e9c79e" fillOpacity=".24"/><path d="M0 -49 C-5 -56 -4 -62 0 -68 C4 -62 5 -56 0 -49Z" fill="#cf8a45" fillOpacity=".35"/></g>)}
            {Array.from({length:12},(_,i)=><g key={`dot-${i}`} transform={`rotate(${i*30})`}><circle cx="0" cy="-83" r="2.5" fill="#d8893d"/><path d="M0 -91 l-3 -5 m3 5 l3 -5" /></g>)}
            <path d="M-120 0 Q-90 -18 -76 0 Q-90 18 -120 0 M120 0 Q90 -18 76 0 Q90 18 120 0" />
          </g>
          <path d="M28 145 Q75 119 120 145 T212 145 T310 145 T408 145 T500 145 T592 145" fill="none" stroke="#d59a5a" strokeWidth="1.2" opacity=".65"/>
          <path d="M46 154 q14 -19 28 0 q14 -19 28 0 M518 154 q14 -19 28 0 q14 -19 28 0" fill="none" stroke="#d59a5a" strokeWidth="1.2"/>
        </svg>
        <svg className="reference-diya-art" viewBox="0 0 140 112" role="img" aria-label="A glowing traditional terracotta diya">
          <defs><linearGradient id="clayBowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d18a3c"/><stop offset=".35" stopColor="#91430f"/><stop offset="1" stopColor="#4a1c09"/></linearGradient><radialGradient id="clayGlow"><stop stopColor="#ffcf69" stopOpacity=".75"/><stop offset="1" stopColor="#ff9e21" stopOpacity="0"/></radialGradient><linearGradient id="flameGold" x1="0" y1="1" x2="0" y2="0"><stop stopColor="#f36b12"/><stop offset=".5" stopColor="#ffc23e"/><stop offset="1" stopColor="#fff8ce"/></linearGradient></defs>
          <ellipse cx="70" cy="95" rx="48" ry="9" fill="#6b3515" opacity=".18"/>
          <ellipse cx="70" cy="89" rx="47" ry="15" fill="url(#clayGlow)"/>
          <path d="M69 54 C45 30 66 9 72 1 C83 19 92 35 73 55Z" fill="url(#flameGold)" filter="drop-shadow(0 0 7px #ffae37)"/>
          <path d="M72 48 C62 34 72 22 74 16 C81 31 82 39 72 48Z" fill="#fff9d9"/>
          <path d="M18 65 Q70 47 122 65 Q116 98 70 100 Q24 98 18 65Z" fill="url(#clayBowl)" stroke="#6b2e0c" strokeWidth="2"/>
          <ellipse cx="70" cy="65" rx="52" ry="12" fill="#c17a30" stroke="#71330e" strokeWidth="2"/>
          <ellipse cx="70" cy="64" rx="43" ry="7" fill="#55240b"/>
          <path d="M28 75 Q70 87 112 75" fill="none" stroke="#e5a24e" strokeWidth="2" opacity=".7"/>
          <path d="M37 88 Q70 98 103 88" fill="none" stroke="#3e1808" strokeWidth="2" opacity=".65"/>
        </svg>
      </div>
    </section>
  </div>
}

function Celebrate({lit,light,playChime,continuous,setContinuous,launch,sound,setSound,volume,setVolume,reducedMotion}:{lit:number[];light:(i:number)=>void;playChime:()=>void;continuous:boolean;setContinuous:(v:boolean)=>void;launch:()=>void;sound:boolean;setSound:(v:boolean)=>void;volume:number;setVolume:(v:number)=>void;reducedMotion:boolean}){
  return <section className="celebrate-page page-width"><div className="page-heading"><span className="section-number">A SMALL RITUAL</span><h1>One flame at<br/><em>a time.</em></h1><p>Tap a diya to light it. Nothing more complicated than that.</p></div><div className="diya-ritual"><div className="ritual-top"><span>THE LITTLE ROW OF LIGHTS</span><span>{lit.length} OF 5 LIT</span></div><div className="diya-row">{Array.from({length:5},(_,i)=><button key={i} className={lit.includes(i)?'ritual-diya is-lit':'ritual-diya'} onClick={()=>{light(i);playChime()}} aria-pressed={lit.includes(i)}><span className="ritual-flame"/><img src={diyaAsset} alt=""/><small>{['For home','For family','For friends','For hope','For you'][i]}</small></button>)}</div><div className="ritual-bottom"><span aria-live="polite">{lit.length===5?'All five are glowing. Keep that feeling.':`${lit.length} of 5 diyas are glowing. A little light goes a long way.`}</span><div className="ritual-controls"><button onClick={()=>{for(let i=0;i<5;i++)if(!lit.includes(i))light(i)}} disabled={lit.length===5}>Light them all <Flame size={14}/></button><button onClick={()=>{for(let i=0;i<5;i++)if(lit.includes(i))light(i)}} disabled={lit.length===0}>Reset diyas</button></div></div></div><div className="firework-invite"><div><span className="section-number">WHEN THE SKY GETS DARK</span><h2>Shall we make<br/>a little <em>noise?</em></h2><p>Turn on a few fireworks. Tap the open space to make your own bursts.</p></div><div className="firework-actions"><button className="button-plum" onClick={launch} disabled={reducedMotion}>A little sparkle <Sparkles size={15}/></button><button className={continuous?'button-outline selected':'button-outline'} onClick={()=>setContinuous(!continuous)} disabled={reducedMotion}>{continuous?<Pause size={14}/>:<Play size={14}/>} {continuous?'Pause the sky':'Keep them coming'}</button><button className="button-outline" onClick={()=>setSound(!sound)}>{sound?<Volume2 size={14}/>:<VolumeX size={14}/>} Sound {sound?'on':'off'}</button>{sound&&<label className="volume-control">A little softer <input aria-label="Sound volume" type="range" min="0" max="1" step=".05" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label>}{reducedMotion&&<p className="motion-note" role="status">Fireworks are paused because your device prefers reduced motion.</p>}</div></div></section>
}

function Wishes({to,setTo,from,setFrom,tone,setTone,makeWish,wish,copyWish,copied}:{to:string;setTo:(v:string)=>void;from:string;setFrom:(v:string)=>void;tone:string;setTone:(v:string)=>void;makeWish:()=>void;wish:string;copyWish:()=>void;copied:boolean}){
  const [exporting,setExporting]=useState(false)
  const exportCard=async()=>{
    setExporting(true)
    try{
      const canvas=document.createElement('canvas')
      canvas.width=1600
      canvas.height=900
      const ctx=canvas.getContext('2d')
      if(!ctx)throw new Error('Canvas unavailable')
      const W=canvas.width,H=canvas.height
      ctx.fillStyle='#f5ecdf'
      ctx.fillRect(0,0,W,H)
      ctx.strokeStyle='#c49a68'
      ctx.lineWidth=2
      ctx.strokeRect(42,42,W-84,H-84)
      ctx.strokeStyle='#d9bea0'
      ctx.lineWidth=1
      ctx.strokeRect(58,58,W-116,H-116)
      ctx.textAlign='center'
      ctx.textBaseline='middle'
      ctx.fillStyle='#9d155f'
      ctx.font='500 25px Georgia'
      ctx.fillText('✳  A LITTLE NOTE FOR YOU  ✳',W/2,118)
      ctx.fillStyle='#b77b30'
      ctx.font='24px Georgia'
      ctx.fillText('✦',W/2,174)
      const art=new Image()
      art.src=diyaAsset
      await new Promise<void>((resolve,reject)=>{
        if(art.complete&&art.naturalWidth){resolve();return}
        art.onload=()=>resolve()
        art.onerror=()=>reject(new Error('Diya artwork failed to load'))
      })
      ctx.drawImage(art,W/2-78,202,156,156)
      const maxWidth=1260
      const rawText=wish.split(String.fromCharCode(13)).join('').split(String.fromCharCode(10)).map(part=>part.trim()).filter(Boolean)
      const wrap=(fontSize:number)=>{
        ctx.font='italic '+fontSize+'px Georgia'
        const lines:string[]=[]
        for(const paragraph of rawText){
          let line=''
          for(const word of paragraph.split(' ').filter(Boolean)){
            const candidate=line?line+' '+word:word
            if(ctx.measureText(candidate).width<=maxWidth){line=candidate;continue}
            if(line)lines.push(line)
            line=''
            if(ctx.measureText(word).width<=maxWidth){line=word;continue}
            let fragment=''
            for(const char of word){
              if(ctx.measureText(fragment+char).width>maxWidth&&fragment){lines.push(fragment);fragment=char}
              else fragment+=char
            }
            line=fragment
          }
          if(line)lines.push(line)
          lines.push('')
        }
        if(lines[lines.length-1]==='')lines.pop()
        return lines
      }
      let fontSize=35
      let lines=wrap(fontSize)
      while(lines.length*48>238&&fontSize>22){fontSize-=1;lines=wrap(fontSize)}
      const lineHeight=Math.min(48,fontSize*1.42)
      const contentHeight=lines.reduce((sum,line)=>sum+(line?lineHeight:12),0)
      let y=405+(260-contentHeight)/2
      ctx.fillStyle='#33242b'
      ctx.font='italic '+fontSize+'px Georgia'
      for(const line of lines){
        if(line){ctx.fillText(line,W/2,y);y+=lineHeight}
        else y+=12
      }
      ctx.fillStyle='#9d155f'
      ctx.font='600 20px Arial'
      ctx.fillText('WITH LOVE, '+(from.trim()||'AKHIL').toUpperCase(),W/2,714)
      ctx.fillStyle='#8b7668'
      ctx.font='16px Arial'
      ctx.fillText('DIWALI 2026  ·  HYDERABAD',W/2,782)
      ctx.fillStyle='#b77b30'
      ctx.font='24px Georgia'
      ctx.fillText('✳     ✦     ✳',W/2,824)
      const link=document.createElement('a')
      const safeName=(to.trim()||'for-you').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
      link.download='diwali-greeting-'+(safeName||'for-you')+'.png'
      link.href=canvas.toDataURL('image/png')
      link.click()
    }catch(error){
      console.error('Greeting export failed',error)
      alert('The greeting image could not be exported. Please try again.')
    }finally{setExporting(false)}
  }
  return <section className="wishes-page page-width"><div className="page-heading"><span className="section-number">A NOTE, JUST FOR YOU</span><h1>Words from<br/><em>the heart.</em></h1><p>A greeting doesn't have to be grand. It just has to feel like it came from you.</p></div><div className="wish-maker"><form onSubmit={e=>{e.preventDefault();makeWish()}}><label htmlFor="wish-to">Who are you thinking of?</label><input id="wish-to" value={to} onChange={e=>setTo(e.target.value)} placeholder="Their name" maxLength={50}/><label htmlFor="wish-from">And it's from...</label><input id="wish-from" value={from} onChange={e=>setFrom(e.target.value)} placeholder="Your name" maxLength={50}/><label>What sort of note?</label><div className="tone-options" role="group" aria-label="Greeting tone">{[['heartfelt','Heartfelt'],['joyful','A little silly'],['simple','Simple & warm']].map(([v,l])=><button type="button" key={v} className={tone===v?'tone-active':''} aria-pressed={tone===v} onClick={()=>setTone(v)}>{l}</button>)}</div><button className="button-plum submit-wish" type="submit">Write my note <ArrowRight size={15}/></button></form><div className="wish-preview"><div className="preview-top"><span>✳ A LITTLE NOTE FOR YOU</span><Heart size={15}/></div><div className="preview-body"><img src={diyaAsset} alt=""/><p>{wish.split('\n\n').map((s,i)=><span key={i}>{s}</span>)}</p><small>WITH LOVE, {from||'AKHIL'}</small></div><div className="wish-export-actions"><button className="copy-button" onClick={copyWish}><Copy size={14}/>{copied?'Copied — go make someone smile':'Copy this little note'}{copied&&<Check size={14}/>}</button><button className="copy-button export-image-button" onClick={exportCard} disabled={exporting}><Download size={14}/>{exporting?'Preparing image…':'Export as PNG'}</button></div></div></div></section>
}
function About(){return <section className="about-page page-width"><div className="page-heading"><span className="section-number">A NOTE FROM THE MAKER</span><h1>Made by hand.<br/><em>Well, mostly.</em></h1><p>I'm Akhil — a graphic designer who likes making things, learning new tools and occasionally getting carried away with a side project.</p></div><div className="about-paper"><div className="about-doodle">✳</div><p>This little Diwali corner started with a simple thought: what if a website felt a little more like being at home during the festival? Not another shiny template. Just familiar colours, a lamp, a few small interactions, and a note you could send to someone you care about.</p><p>It's made in Hyderabad, with React, TypeScript, a little Canvas, and a lot of affection for the details.</p><span>— AKHIL ALLADI</span></div></section>}
