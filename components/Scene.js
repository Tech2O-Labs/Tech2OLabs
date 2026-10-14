'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, CanvasTexture, MathUtils, SRGBColorSpace, Vector2, Vector3 } from 'three'

// shared with the DOM: pointer in NDC, and whether it has moved yet
export const S = { mouse: [0.6, 0], moved: false, pending: [], well: null, calm: false, logo: false } // starts to the right so the idle dot-hole sits behind the window

/* ---------- magnetic dot grid (background) ---------- */
const COLS = 110, ROWS = 62
const dotVert = /* glsl */ `
attribute vec2 aIdx,aT; uniform vec2 uRes; uniform vec3 uRip[4],uWell; uniform float uTime,uPx,uMorph,uCalm,uSnap;
varying float vP,vW;
void main(){
  float asp=uRes.x/uRes.y; vec2 A=vec2(asp,1.);
  vec2 h=aIdx*2.-1., d=(h-vec2(.3,0.))*A;                    // scroll ripples spread from a fixed centre
  float f=0.;
  vec2 p=h;
  p.y+=sin(h.x*6.+uTime*.6+h.y*3.)*.006;                      // gentle drift
  // scroll morph: concentric ripples from the cursor (off in the calm contact pool)
  float m=uMorph*(1.-uCalm), w=sin(length(d)*22.-uTime*2.2)*exp(-length(d)*.7);
  p+=normalize(d+1e-4)/A*w*.045*m; f+=max(w,0.)*.3*m;
  // click shockwaves
  for(int i=0;i<4;i++){
    vec2 r=(h-uRip[i].xy)*A; float age=uTime-uRip[i].z;
    float k=exp(-pow((length(r)-age*.9)*7.,2.))*exp(-age*1.1)*(1.+uCalm*.8);
    p+=normalize(r+1e-4)/A*k*.07; f+=k*.7;
  }
  // card gravity well
  vec2 g=(h-uWell.xy)*A; float gi=exp(-dot(g,g)*2.5)*uWell.z;
  p-=normalize(g+1e-4)/A*gi*.07;
  // logo snap: each dot flies (staggered) to its own spot in the wordmark
  float sr=fract(sin(dot(aIdx,vec2(12.9898,78.233)))*43758.5453);
  float sf=smoothstep(sr*.5,sr*.5+.5,uSnap);
  p=mix(p,vec2(aT.x*.95,aT.y*.95*asp),sf);
  vP=f+sf; vW=gi; gl_Position=vec4(p,.99,1.); gl_PointSize=uPx*(1.5+(f+gi)*3.+sf*.6);
}`
const dotFrag = /* glsl */ `
uniform vec3 uTint; varying float vP,vW;
void main(){
  if(length(gl_PointCoord-.5)>.5) discard;
  vec3 c=mix(mix(vec3(.2,.5,.8),vec3(0.,1.,.78),clamp(vP,0.,1.)),uTint,clamp(vW*1.5,0.,1.));
  gl_FragColor=vec4(c,.22+.78*clamp(vP+vW*.6,0.,1.));
}`

// fill `out` (x,y pairs, x in -1..1) with random points inside "Tech₂O" drawn on a canvas
function sampleLogo(out) {
  const W = 1024, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H
  const fam = getComputedStyle(document.body).fontFamily // next/font gives the face a hashed name
  const x = c.getContext('2d'), F = (n) => (x.font = `800 ${n}px ${fam}`)
  F(150); const wa = x.measureText('Tech').width, wd = x.measureText('O').width
  F(90); const wb = x.measureText('2').width
  const x0 = (W - wa - wb - wd) / 2
  F(150); x.fillText('Tech', x0, 190); x.fillText('O', x0 + wa + wb, 190)
  F(90); x.fillText('2', x0 + wa, 228)
  const im = x.getImageData(0, 0, W, H).data, px = []
  for (let i = 0; i < W * H; i++) if (im[i * 4 + 3] > 128) px.push(i)
  for (let k = 0; k < out.length / 2; k++) {
    const i = px[(Math.random() * px.length) | 0]
    out[k * 2] = ((i % W) / W - 0.5) * 2
    out[k * 2 + 1] = -(((i / W) | 0) / H - 0.5) * 2 * (H / W)
  }
}

function Dots() {
  const mat = useRef()
  const geo = useMemo(() => {
    const idx = new Float32Array(COLS * ROWS * 2)
    for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) { const k = (j * COLS + i) * 2; idx[k] = i / (COLS - 1); idx[k + 1] = j / (ROWS - 1) }
    return { idx, pos: new Float32Array(COLS * ROWS * 3), t: new Float32Array(COLS * ROWS * 2) }
  }, [])
  const ridx = useRef(0), attrT = useRef(), ready = useRef(false)
  useEffect(() => {
    document.fonts.load(`800 150px ${getComputedStyle(document.body).fontFamily}`).catch(() => {}).then(() => {
      sampleLogo(geo.t); attrT.current.needsUpdate = true; ready.current = true
    })
  }, [geo])
  useFrame(({ clock, size, gl }, dt) => {
    const u = mat.current.uniforms, dpr = gl.getPixelRatio()
    u.uTime.value = clock.elapsedTime; u.uPx.value = dpr * 1.6
    u.uRes.value.set(size.width, size.height)
    u.uMorph.value = MathUtils.damp(u.uMorph.value, MathUtils.smoothstep(scrollY / innerHeight, 0.15, 1.1), 4, dt)
    u.uSnap.value = MathUtils.damp(u.uSnap.value, S.logo && ready.current ? 1 : 0, 3, dt)
    u.uCalm.value = MathUtils.damp(u.uCalm.value, S.calm ? 1 : 0, 3, dt)
    while (S.pending.length) { const [x, y] = S.pending.pop(); u.uRip.value[ridx.current++ % 4].set(x, y, clock.elapsedTime) }
    const w = u.uWell.value, tg = S.well
    if (tg) { w.x = tg[0]; w.y = tg[1]; u.uTint.value.set(...tg[2]) }
    w.z = MathUtils.damp(w.z, tg ? 1 : 0, 6, dt)
  })
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geo.pos, 3]} />
        <bufferAttribute attach="attributes-aIdx" args={[geo.idx, 2]} />
        <bufferAttribute ref={attrT} attach="attributes-aT" args={[geo.t, 2]} />
      </bufferGeometry>
      <shaderMaterial ref={mat} vertexShader={dotVert} fragmentShader={dotFrag} transparent depthWrite={false}
        uniforms={{ uTime: { value: 0 }, uPx: { value: 2 }, uMorph: { value: 0 }, uCalm: { value: 0 }, uSnap: { value: 0 }, uWell: { value: new Vector3() }, uTint: { value: new Vector3(0, 1, 0.78) },
          uRip: { value: [0, 1, 2, 3].map(() => new Vector3(0, 0, -100)) }, uRes: { value: new Vector2(1, 1) } }} />
    </points>
  )
}

/* ---------- floating browser: code assembles into a UI ---------- */
const W = 1024, H = 640
const MONO = '600 31px ui-monospace, Menlo, Consolas, monospace'
const E = '#e6f6f4', K = '#c792ea', B = '#3b8cff', G = '#00ffc6', Y = '#ffd479', D = '#7a8b99'
const CODE = [
  [['const ', K], ['lab ', E], ['= new ', K], ['Studio', G], ['("Tech2O");', E]],
  [['lab', E], ['.build', B], ['({', E]],
  [['  web', E], [': ', D], ['"React · Next.js"', Y], [',', E]],
  [['  mobile', E], [': ', D], ['"iOS · Android"', Y], [',', E]],
  [['  ai', E], [': ', D], ['"LLMs · Agents"', Y], [',', E]],
  [['  cloud', E], [': ', D], ['"AWS · Docker"', Y], [',', E]],
  [['});', E]],
  [['await ', K], ['lab', E], ['.ship', B], ['();', E]],
]
// final UI blocks: [x, y, w, h, radius, colour]
const UI = [
  [40, 76, 944, 36, 10, '#0c2f3c'], [70, 150, 430, 36, 8, G], [70, 206, 540, 14, 6, B], [70, 230, 400, 14, 6, B],
  [70, 272, 170, 44, 22, G], [640, 150, 310, 170, 16, '#14506a'], [70, 360, 280, 200, 16, '#0c2a36'],
  [372, 360, 280, 200, 16, '#0c2a36'], [674, 360, 280, 200, 16, '#0c2a36'], [94, 386, 120, 14, 6, G],
  [396, 386, 120, 14, 6, B], [698, 386, 120, 14, 6, G],
]
const ease = (x) => x * x * (3 - 2 * x)

function drawScreen(ctx, m) {
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#061721'; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#0a2230'; ctx.fillRect(0, 0, W, 56)
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(32 + i * 26, 28, 8, 0, 7); ctx.fill() })
  ctx.fillStyle = '#061721'; ctx.beginPath(); ctx.roundRect(300, 14, 424, 28, 14); ctx.fill()
  ctx.fillStyle = D; ctx.font = '500 16px ui-monospace, Menlo, monospace'; ctx.fillText('tech2olabs.com', 450, 34)

  // code text fades out as the UI assembles
  ctx.globalAlpha = Math.max(0, 1 - m * 1.6) ** 1.5; ctx.font = MONO
  CODE.forEach((line, i) => {
    let x = 90; const y = 130 + i * 50
    ctx.fillStyle = '#2d4756'; ctx.fillText(String(i + 1), 40, y)
    line.forEach(([t, c]) => { ctx.fillStyle = c; ctx.fillText(t, x, y); x += ctx.measureText(t).width })
  })

  // each block flies from a code-line position to its final spot, staggered
  UI.forEach(([x, y, w, h, r, c], i) => {
    const mi = ease(MathUtils.clamp(m * 1.7 - i * 0.07, 0, 1)); if (mi < 0.01) return
    const sx = 90 + ((i * 37) % 140), sy = 116 + (i % 8) * 50, sw = 140 + ((i * 53) % 260)
    const L = (a, b) => a + (b - a) * mi
    ctx.beginPath(); ctx.roundRect(L(sx, x), L(sy, y), L(sw, w), L(14, h), L(4, r))
    ctx.globalAlpha = (1 - mi) * 0.6 * Math.min(1, mi * 12); ctx.fillStyle = B; ctx.fill() // fade in as it starts moving, so no stray bars at rest
    ctx.globalAlpha = mi; ctx.fillStyle = c; ctx.fill()
  })
  ctx.globalAlpha = 1
}

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(0,255,198,.35)'); g.addColorStop(1, 'rgba(0,255,198,0)')
  x.fillStyle = g; x.fillRect(0, 0, 256, 256)
  return new CanvasTexture(c)
}

function Browser() {
  const g = useRef(), st = useRef({ m: 0, drawn: -1, rx: 0, ry: -0.2 })
  const { viewport, size } = useThree()
  const { ctx, tex, glow } = useMemo(() => {
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const tex = new CanvasTexture(c); tex.colorSpace = SRGBColorSpace; tex.anisotropy = 8
    return { ctx: c.getContext('2d'), tex, glow: glowTexture() }
  }, [])
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime, s = st.current
    // always loops on its own (code <-> UI, dwelling at both ends); ignores the cursor
    s.m = MathUtils.smoothstep(Math.sin(t * 0.5), -0.6, 0.6)
    if (Math.abs(s.m - s.drawn) > 0.003) { drawScreen(ctx, s.m); s.drawn = s.m; tex.needsUpdate = true }
    const G = g.current, vw = viewport.width
    s.vis = MathUtils.damp(s.vis ?? 1, S.logo ? 0 : 1, 5, dt)
    G.scale.setScalar(Math.min(1, (0.38 * vw) / 4.4) * s.vis)
    G.position.x = vw * 0.26
    G.position.y = (scrollY / innerHeight) * viewport.height + Math.sin(t * 0.8) * 0.08 // scrolls away with the hero
    G.rotation.set(0.08 + Math.sin(t * 0.3) * 0.04, -0.2 + Math.sin(t * 0.4) * 0.08, 0)
    G.visible = size.width >= 768 // mobile: dots only
  })
  return (
    <group ref={g}>
      <mesh position={[0, 0, -0.4]}><planeGeometry args={[8, 6]} /><meshBasicMaterial map={glow} transparent blending={AdditiveBlending} depthWrite={false} /></mesh>
      <mesh>
        <boxGeometry args={[4.4, 2.75, 0.12]} />
        {[0, 1, 2, 3].map((i) => <meshBasicMaterial key={i} attach={`material-${i}`} color="#0d3a4a" />)}
        <meshBasicMaterial attach="material-4" map={tex} toneMapped={false} />
        <meshBasicMaterial attach="material-5" color="#061721" />
      </mesh>
    </group>
  )
}

export default function Scene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 8], fov: 40 }} gl={{ antialias: true }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, animation: 'fadein 1.2s ease-out' }}>
      <color attach="background" args={['#03080f']} />
      <Dots />
      <Browser />
    </Canvas>
  )
}
