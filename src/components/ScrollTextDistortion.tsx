import { useEffect, useRef } from 'react'

// Port of the Framer University "Scroll Text Distortion" code component used on the Framer site
// (preset "liquid"). The text is drawn to a canvas texture and warped by 3D simplex noise whose
// strength follows the page scroll speed. Same shader and speed math, plain WebGL instead of three.js.

const VERTEX = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const FRAGMENT = `
precision highp float;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uScrollSpeed;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  vec2 uv = vUv;
  float volatility = uScrollSpeed * 0.15;
  float z = uTime * 0.5;
  uv += vec2(snoise(vec3(uv * 3.0, z)), snoise(vec3(uv * 3.0 + 100.0, z))) * volatility;
  gl_FragColor = texture2D(uTexture, uv);
}`

/** Component's linear remap helper (maps `value` along the line through (x1, y1) and (x2, y2)). */
const remap = (y1: number, y2: number, x1: number, x2: number, value: number) => {
  const slope = (y1 - y2) / (x1 - x2)
  return slope * value + (y2 - slope * x2)
}

type Props = {
  text: string
  fontSize: number
  fontFamily?: string
  fontWeight?: number
  color?: string
  /** 0.1–1; higher reacts to slower scrolling. The Framer site uses 0.95. */
  sensitivity?: number
}

function drawText(canvas: HTMLCanvasElement, w: number, h: number, p: Required<Props>) {
  canvas.width = w * 2
  canvas.height = h * 2
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = `${p.fontWeight} ${p.fontSize * 2}px ${p.fontFamily}`
  ctx.fillStyle = p.color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  const m = ctx.measureText(p.text)
  const textHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
  ctx.fillText(p.text, canvas.width / 2, canvas.height / 2 + textHeight / 2 - m.actualBoundingBoxDescent)
}

export default function ScrollTextDistortion({
  text,
  fontSize,
  fontFamily = "'Editor', serif",
  fontWeight = 400,
  color = '#ffffff',
  sensitivity = 0.95,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const props = { text, fontSize, fontFamily, fontWeight, color, sensitivity }
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true })
    if (!gl) {
      // No WebGL: show the plain text instead.
      wrap.dataset.fallback = 'true'
      return
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT))
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'uTime')
    const uScrollSpeed = gl.getUniformLocation(program, 'uScrollSpeed')
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const texture = gl.createTexture()
    const textCanvas = document.createElement('canvas')
    const upload = () => {
      const w = wrap.clientWidth || 1
      const h = wrap.clientHeight || 1
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
      drawText(textCanvas, w, h, props)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }
    upload()
    document.fonts?.ready.then(upload)
    const resize = new ResizeObserver(upload)
    resize.observe(wrap)

    // Speed math from the original: scroll delta per frame, normalised by sensitivity, lerped by 0.1.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const divisor = remap(10, 60, 1, 0.1, sensitivity)
    let lastY = window.scrollY
    let speed = 0
    let time = 0
    let frame = 0
    let visible = true
    const render = () => {
      time += 0.016
      const y = window.scrollY
      const target = reduceMotion ? 0 : Math.min(Math.abs(y - lastY) / divisor, 1)
      lastY = y
      speed += (target - speed) * 0.1
      if (visible) {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform1f(uTime, time)
        gl.uniform1f(uScrollSpeed, speed)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    // Skip drawing while off screen (the original renders all the time).
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(wrap)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      io.disconnect()
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [text, fontSize, fontFamily, fontWeight, color, sensitivity])

  return (
    <div
      ref={wrapRef}
      className="group/std relative flex items-center justify-center overflow-visible"
      style={{ color }}
      aria-label={text}
      role="img"
    >
      {/* Invisible copy sets the size, exactly like the original (nbsp padding on both sides). */}
      <div
        aria-hidden
        className="relative z-[2] whitespace-nowrap text-transparent group-data-[fallback=true]/std:text-[inherit]"
        style={{ fontSize, fontWeight, fontFamily, lineHeight: '1em' }}
      >
        {' '}
        {text}
        {' '}
      </div>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full group-data-[fallback=true]/std:hidden" />
    </div>
  )
}
