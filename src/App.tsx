import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Copy, Flame, Github, Heart, Menu, Moon, Pause, Play, Send, Sparkles, Sun, Volume2, VolumeX, X } from 'lucide-react'

const asset = `${import.meta.env.BASE_URL}assets/diya-art.svg`
const lights = [
  { name: 'For home', note: 'A little warmth, wherever home is.', detail: 'HOME', tone: 'saffron' },
  { name: 'For family', note: 'For the voices around the table.', detail: 'TOGETHER', tone: 'rose' },
  { name: 'For friends', note: 'For the people who make it brighter.', detail: 'ALWAYS', tone: 'leaf' },
  { name: 'For hope', note: 'For all the good things still to come.', detail: 'FORWARD', tone: 'plum' },
  { name: 'For you', note: 'A small light, just because.', detail: 'YOU', tone: 'gold' },
]
type Burst = { x:number; y:number; vx:number; vy:number; life:number; max:number; hue:number; size:number }

function useFireworks(canvasRef: RefObject<HTMLCanvasElement | null>, active: boolean) {
  const particles = useRef<Burst[]>([])
  const addBurst = (x:number,y:number) => {
    const hue = [38, 330, 156, 18][Math.floor(Math.random()*4)]
    for(let i=0;i<64;i++){
      const angle=Math.random()*Math.PI*2, speed=1.2+Math.random()*4.4
      particles.current.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:48+Math.random()*32,max:80,hue:hue+Math.random()*24-12,size:1+Math.random()*2.2})
    }
  }
  useEffect(()=>{
    const canvas=canvasRef.current
    if(!canvas)return
    const ctx=canvas.getContext('2d')
    if(!ctx)return
    let raf=0, frame=0
    const resize=()=>{
      const dpr=Math.min(window.devicePixelRatio||1,2)
      canvas.width=Math.max(1,canvas.clientWidth*dpr)
      canvas.height=Math.max(1,canvas.clientHeight*dpr)
      ctx.setTransform(dpr,0,0,dpr,0,0)
    }
    resize()
    const observer=new ResizeObserver(resize)
    observer.observe(canvas)
    const loop=()=>{
      frame++
      ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight)
      if(active && frame%42===0) addBurst(canvas.clientWidth*(.12+Math.random()*.76),canvas.clientHeight*(.12+Math.random()*.52))
      particles.current=particles.current.filter(p=>p.life>0)
      for(const p of particles.current){
        p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.vx*=.985;p.life--
        ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
        ctx.fillStyle=`hsla(${p.hue} 90% 66% / ${Math.max(0,p.life/p.max)})`
        ctx.fill()
      }
      raf=requestAnimationFrame(loop)
    }
    loop()
    const click=(e:PointerEvent)=>{
      const rect=canvas.getBoundingClientRect()
      addBurst(e.clientX-rect.left,e.clientY-rect.top)
    }
    canvas.addEventListener('pointerdown',click)
    return()=>{cancelAnimationFrame(raf);observer.disconnect();canvas.removeEventListener('pointerdown',click)}
  },[active,canvasRef])
  return (x?:number,y?:number)=>{
    const canvas=canvasRef.current
    if(!canvas)return
    addBurst(x??canvas.clientWidth*.5,y??canvas.clientHeight*.38)
  }
}

function Rangoli({className=''}:{className?:string}){
  return <svg className={className} viewBox="0 0 240 240" aria-hidden="true">
    <g transform="translate(120 120)" fill="none" stroke="currentColor" strokeWidth="1.2">
      {Array.from({length:16},(_,i)=><g key={i} transform={`rotate(${i*22.5})`}><path d="M0 -18 C-12 -44 -10 -74 0 -100 C10 -74 12 -44 0 -18Z"/><path d="M0 -28 Q-25 -55 0 -77 Q25 -55 0 -28Z"/></g>)}
      <circle r="18"/><circle r="5" fill="currentColor"/><circle r="110" strokeDasharray="2 7"/>
    </g>
  </svg>
}

function Header({dark,setDark}:{dark:boolean;setDark:(v:boolean)=>void}){
  const [menu,setMenu]=useState(false)
  const links=[['The evening','#arrival'],['Little lights','#lights'],['The celebration','#celebration'],['A note for you','#note'],['The maker','#maker']]
  return <header className="site-header">
    <a className="brand" href="#arrival" aria-label="Diwali at home"><img src={asset} alt=""/><span>Diwali, <i>at home.</i></span></a>
    <nav className={menu?'nav-links nav-open':'nav-links'} aria-label="Main navigation">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</nav>
    <div className="header-tools"><button className="icon-btn" onClick={()=>setDark(!dark)} aria-label="Toggle night theme">{dark?<Sun size={17}/>:<Moon size={17}/>}</button><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">{menu?<X/>:<Menu/>}</button><a className="header-cta" href="#lights">Come celebrate <ArrowUpRight size={14}/></a></div>
  </header>
}

function App(){
  const reduceMotion=useReducedMotion()
  const [dark,setDark]=useState(false)
  const [lit,setLit]=useState<number[]>([0])
  const [ambient,setAmbient]=useState(false)
  const [sound,setSound]=useState(false)
  const [to,setTo]=useState('')
  const [from,setFrom]=useState('Akhil')
  const [note,setNote]=useState('May your home be full of warmth, your days full of light, and the year ahead full of little reasons to smile.')
  const [copied,setCopied]=useState(false)
  const [productScene,setProductScene]=useState(false)
  const [audioCtx,setAudioCtx]=useState<AudioContext|null>(null)
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const productRef=useRef<HTMLElement>(null)
  const burst=useFireworks(canvasRef,ambient)
  useEffect(()=>{
    document.documentElement.dataset.theme=dark?'night':'day'
    return()=>{delete document.documentElement.dataset.theme}
  },[dark])
  useEffect(()=>{
    const target=productRef.current
    if(!target)return
    const observer=new IntersectionObserver(([entry])=>setProductScene(entry.isIntersecting),{threshold:.25})
    observer.observe(target)
    return()=>observer.disconnect()
  },[])
  const toggleLight=(i:number)=>{
    setLit(old=>old.includes(i)?old.filter(n=>n!==i):[...old,i])
    if(sound){
      try{
        const Ctx=window.AudioContext
        const ctx=audioCtx??new Ctx()
        if(!audioCtx)setAudioCtx(ctx)
        const oscillator=ctx.createOscillator(),gain=ctx.createGain()
        oscillator.type='sine';oscillator.frequency.value=620+i*75
        gain.gain.setValueAtTime(.0001,ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(.11,ctx.currentTime+.025)
        gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.55)
        oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start();oscillator.stop(ctx.currentTime+.56)
      }catch{/* Audio is an optional enhancement. */}
    }
  }
  const lightAll=()=>setLit([0,1,2,3,4])
  const copyNote=async()=>{
    try{await navigator.clipboard.writeText(`Dear ${to.trim()||'friend'},\n\n${note}\n\nWith love, ${from.trim()||'Akhil'}`);setCopied(true);window.setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}
  }
  return <div className="site-shell">
    <Header dark={dark} setDark={setDark}/>
    <main>
      <section className="scene scene-arrival" id="arrival">
        <div className="arrival-grain"/>
        <div className="arrival-inner">
          <div className="arrival-copy">
            <h1><span>Some nights</span><span>are made for</span><em>light.</em></h1>
            <div className="arrival-actions"><a className="btn-primary" href="#lights">Light a diya <ArrowRight size={17}/></a><a className="btn-quiet" href="#celebration">Make a little sparkle <Sparkles size={16}/></a></div>
          </div>
          <div className="arrival-art" aria-label="Illustrated Diwali diya">
            <div className="art-halo"/><Rangoli className="arrival-rangoli"/>
            <div className="art-sticker">शुभ<br/>दीपावली</div>
            <AnimatePresence initial={false}>
              {!productScene&&<motion.img layoutId="flying-diya" className="arrival-diya" src={asset} alt="A colourful hand-illustrated diya with a golden flame" initial={reduceMotion?false:{x:-420,opacity:0,rotate:-18,scale:.7}} animate={{x:0,opacity:1,rotate:0,scale:1}} exit={{opacity:1,transition:{duration:.12}}} transition={{type:'spring',stiffness:75,damping:17,delay:reduceMotion?0:.15}}/>}
            </AnimatePresence>
            <span className="art-caption">LIGHT, IN ITS OWN WAY</span>
            <span className="art-star art-star-a">✳</span><span className="art-star art-star-b">✦</span>
          </div>
        </div>

      </section>

      <section className="scene scene-lights" id="lights" ref={productRef}>
        <div className="scene-heading">
          <span className="scene-index">01 / THE LITTLE ROW OF LIGHTS</span>
          <div className="scene-title-line"><h2>Five little lights.<br/><em>Five little wishes.</em></h2><p>Every flame has somewhere to go.<br/>Choose one and send a little warmth.</p></div>
        </div>
        <div className="light-products">
          {lights.map((item,i)=><motion.article className={`light-product ${item.tone} ${lit.includes(i)?'product-lit':''}`} key={item.name} initial={reduceMotion?false:{opacity:0,y:46,rotateX:8}} whileInView={{opacity:1,y:0,rotateX:0}} viewport={{once:true,amount:.2}} transition={{duration:.65,delay:i*.08,ease:[.22,.61,.36,1]}}>
            <span className="product-edition">DIWALI OBJECT Nº 0{i+1}</span>
            <div className="product-art">
              {i===0&&<AnimatePresence initial={false}>{productScene&&<motion.img layoutId="flying-diya" className="product-diya" src={asset} alt="Diwali diya" transition={{type:'spring',stiffness:70,damping:18}}/>}</AnimatePresence>}
              {i!==0&&<img className="product-diya product-diya-small" src={asset} alt="Diwali diya illustration"/>}
              <span className="product-spark">✳</span>
            </div>
            <div className="product-copy"><span>{item.detail}</span><h3>{item.name}</h3><p>{item.note}</p></div>
            <button className={lit.includes(i)?'light-action lit-action':'light-action'} onClick={()=>toggleLight(i)} aria-pressed={lit.includes(i)}>{lit.includes(i)?'A light is glowing':'Light this diya'} <Flame size={15}/></button>
          </motion.article>)}
        </div>
        <div className="lights-footer"><span>{lit.length} OF 5 LIGHTS GLOWING</span><button onClick={lightAll}>Light them all <Flame size={16}/></button></div>
      </section>

      <section className="scene scene-celebration" id="celebration">
        <canvas ref={canvasRef} className="firework-canvas" aria-label="Interactive fireworks. Tap anywhere in this scene to make a burst."/>
        <div className="celebration-copy"><span className="scene-index">02 / WHEN THE SKY GETS DARK</span><h2>Some joy<br/>deserves a little <em>noise.</em></h2><p>Tap the open sky. Make a burst. Let the night have its moment.</p>
          <div className="celebration-actions"><button className="btn-primary" onClick={()=>burst()}>A little sparkle <Sparkles size={16}/></button><button className="btn-quiet light-quiet" onClick={()=>setAmbient(!ambient)}>{ambient?<Pause size={15}/>:<Play size={15}/>} {ambient?'Pause the sky':'Keep them coming'}</button><button className="btn-quiet light-quiet" onClick={()=>setSound(!sound)}>{sound?<Volume2 size={15}/>:<VolumeX size={15}/>} Sound {sound?'on':'off'}</button></div>
        </div>
        <div className="celebration-side-note"><Rangoli className="night-rangoli"/><span>MAKE A WISH<br/>AND LET IT GO</span></div>
      </section>

      <section className="scene scene-note" id="note">
        <div className="note-intro"><span className="scene-index">03 / A NOTE, JUST FOR SOMEONE</span><h2>Not a template.<br/><em>A little thought.</em></h2><p>Put a name to the feeling. Send a note that sounds like you.</p></div>
        <div className="note-workbench">
          <form className="note-form" onSubmit={e=>{e.preventDefault();void copyNote()}}>
            <label htmlFor="note-to">WHO'S ON YOUR MIND?</label><input id="note-to" value={to} onChange={e=>setTo(e.target.value)} placeholder="Their name"/>
            <label htmlFor="note-from">SENDING WITH LOVE FROM</label><input id="note-from" value={from} onChange={e=>setFrom(e.target.value)} placeholder="Your name"/>
            <label htmlFor="note-message">WRITE YOUR LITTLE NOTE</label><textarea id="note-message" rows={4} maxLength={260} value={note} onChange={e=>setNote(e.target.value)}/>
            <button className="btn-primary" type="submit">{copied?'Copied!':'Copy your note'} {copied?<Check size={16}/>:<Copy size={16}/>}</button>
          </form>
          <div className="note-card"><div className="note-card-top"><span>✳ A LITTLE NOTE FOR YOU</span><Heart size={16}/></div><img src={asset} alt=""/><p>Dear {to.trim()||'someone dear'},</p><blockquote>{note}</blockquote><span className="note-signoff">WITH LOVE, {from.trim()||'AKHIL'}</span><div className="note-card-bottom">DIWALI · 2026 · HYDERABAD</div></div>
        </div>
      </section>

      <section className="scene scene-maker" id="maker">
        <Rangoli className="maker-rangoli"/>
        <div className="maker-content"><span className="scene-index">04 / A NOTE FROM THE MAKER</span><h2>Made with care.<br/><em>Shared with light.</em></h2><p>I'm Akhil — a graphic designer who likes making things, learning new tools and getting a little carried away with the details. This little corner was made in Hyderabad for the feeling of Diwali at home.</p><div className="maker-links"><a href="https://github.com/akhilalladi-code/diwali-universe" target="_blank" rel="noreferrer">Explore the project <Github size={16}/></a><a href="https://www.linkedin.com/in/akhil-alladi" target="_blank" rel="noreferrer">Say hello <ArrowUpRight size={16}/></a></div></div>
        <div className="maker-lamp"><img src={asset} alt="Diwali diya"/><span>WHEREVER YOU ARE,<br/><em>MAY THERE BE LIGHT.</em></span></div>
      </section>
    </main>
    <footer className="site-footer"><a className="footer-brand" href="#arrival">Diwali, <i>at home.</i></a><span>Made slowly, with love & a little code.</span><span>Hyderabad · Diwali 2026</span><a href="https://github.com/akhilalladi-code/diwali-universe" target="_blank" rel="noreferrer">Akhil's little project <ArrowUpRight size={14}/></a></footer>
  </div>
}

export default App
