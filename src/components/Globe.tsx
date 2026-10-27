import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Port of the Framer University "3D Globe" code component as configured on the Framer site (node nQs4tPaa0):
// grey ocean sphere, 15° grid, white land outlines and land dots, one marker, slow clockwise spin and
// mouse drag with inertia. Land dots and outline rings are precomputed from Natural Earth 50m land
// (same grid and simplification the component uses) into /data/globe.json.

const remap = (v: number, a: number, b: number, c: number, d: number) => (b === a ? c : c + ((v - a) / (b - a)) * (d - c))
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

// Settings from the page, converted with the component's own mappings.
const SPEED = remap(clamp01(0.3), 0, 1, 0, 0.9) // speed 0.3, clockwise
const FOLLOW = remap(1, 0, 1, 0.4, 0.03) // smoothing 1
const FRICTION = remap(1, 0, 1, 0.7, 0.96)
const DRAG = remap(0.5, 0, 1, 0.001, 0.02) // dragSpeed 0.5
const DOT_RADIUS = 0.01 * remap(0.4, 0.1, 1, 0.1, 0.5) // dotSize 0.4
const MARKER_RADIUS = 0.01 * remap(40, 0, 100, 0.1, 2.5) // marker size 40
const LINE_RADIUS = (1 / 10) * 0.01 // outline and grid width 1
const START = { lng: -15, lat: 42 }
const MARKERS = [{ lat: 41, lng: 13 }]

const COLORS = {
  ocean: 'rgb(204, 204, 204)',
  grid: 'rgb(232, 232, 232)',
  outline: 'rgb(255, 255, 255)',
  outlineOpacity: 0.73,
  dot: 'rgb(255, 255, 255)',
  marker: 'rgb(16, 16, 16)',
}

type GlobeData = { dots: number[]; rings: number[][] }

/** Component's lat/lng → unit sphere. */
function toSphere(lat: number, lng: number) {
  const la = (lat * Math.PI) / 180
  const ln = (lng * Math.PI) / 180
  return new THREE.Vector3(Math.cos(la) * Math.sin(ln), Math.sin(la), Math.cos(la) * Math.cos(ln))
}

/** Thin tube along a list of points (how the component draws grid lines and outlines). */
function tube(points: THREE.Vector3[]) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), points.length * 2, LINE_RADIUS, 8, false)
}

function gridGeometry() {
  const parts: THREE.BufferGeometry[] = []
  // The pole "circles" have zero length, so they are skipped.
  for (let lat = -75; lat <= 75; lat += 15) {
    parts.push(tube(Array.from({ length: 65 }, (_, i) => toSphere(lat, (i / 64) * 360 - 180))))
  }
  for (let lng = -180; lng < 180; lng += 15) {
    parts.push(tube(Array.from({ length: 65 }, (_, i) => toSphere((i / 64) * 180 - 90, lng))))
  }
  return mergeGeometries(parts)
}

function outlineGeometry(rings: number[][]) {
  const parts: THREE.BufferGeometry[] = []
  for (const ring of rings) {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < ring.length; i += 2) points.push(toSphere(ring[i + 1], ring[i]))
    if (points.length < 2) continue
    if (points[0].distanceTo(points[points.length - 1]) > 0.001) points.push(points[0].clone())
    parts.push(tube(points))
  }
  return parts.length ? mergeGeometries(parts) : null
}

let dataPromise: Promise<GlobeData> | null = null
const loadData = () => (dataPromise ??= fetch('/data/globe.json').then((r) => r.json() as Promise<GlobeData>))

export default function Globe({ className = '' }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current!
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      // No WebGL (old device, disabled GPU): leave the area empty instead of crashing the page.
      return
    }
    const width = () => host.clientWidth || 800
    const height = () => host.clientHeight || 600
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width(), height())
    renderer.outputColorSpace = THREE.SRGBColorSpace
    const canvas = renderer.domElement
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
    host.appendChild(canvas)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width() / height(), 0.1, 1000)
    camera.position.set(0, 0, 2.5)
    camera.lookAt(0, 0, 0)

    const globe = new THREE.Group()
    scene.add(globe)
    const disposables: { dispose(): void }[] = []
    const add = (geometry: THREE.BufferGeometry, material: THREE.Material, mesh?: THREE.Mesh) => {
      disposables.push(geometry, material)
      globe.add(mesh ?? new THREE.Mesh(geometry, material))
    }

    add(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshBasicMaterial({ color: COLORS.ocean }))
    add(gridGeometry(), new THREE.MeshBasicMaterial({ color: COLORS.grid }))
    const markerGeometry = new THREE.SphereGeometry(MARKER_RADIUS, 16, 16)
    const markerMaterial = new THREE.MeshBasicMaterial({ color: COLORS.marker })
    disposables.push(markerGeometry, markerMaterial)
    for (const m of MARKERS) {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.copy(toSphere(m.lat, m.lng))
      globe.add(marker)
    }

    let disposed = false
    loadData()
      .then(({ dots, rings }) => {
        if (disposed) return
        const outline = outlineGeometry(rings)
        if (outline) {
          add(outline, new THREE.MeshBasicMaterial({ color: COLORS.outline, transparent: true, opacity: COLORS.outlineOpacity }))
        }
        const count = dots.length / 2
        const dotGeometry = new THREE.SphereGeometry(DOT_RADIUS, 4, 4)
        const dotMaterial = new THREE.MeshBasicMaterial({ color: COLORS.dot })
        const instanced = new THREE.InstancedMesh(dotGeometry, dotMaterial, count)
        const matrix = new THREE.Matrix4()
        for (let i = 0; i < count; i++) {
          matrix.setPosition(toSphere(dots[i * 2 + 1], dots[i * 2]))
          instanced.setMatrixAt(i, matrix)
        }
        instanced.instanceMatrix.needsUpdate = true
        add(dotGeometry, dotMaterial, instanced)
      })
      .catch(() => {
        // Land data failed to load: the grey sphere and grid still render.
      })

    // Rotation state, as in the component: `target` moves, `current` follows it with smoothing.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const spin = reduceMotion ? 0 : SPEED
    const startX = (START.lng * Math.PI) / 180
    const startY = (START.lat * Math.PI) / 180
    const current = { x: startX, y: startY }
    const target = { x: startX, y: startY }
    const velocity = { x: 0, y: 0 }
    const halfPi = Math.PI / 2
    const frameMs = 1000 / 60
    let dragging = false
    let visible = true
    let last = performance.now()
    let frame = 0

    const tick = () => {
      const now = performance.now()
      const r = (now - last) / frameMs
      last = now
      const eps = 0.01
      if (!dragging) {
        target.x += spin * 0.01 * r
        if (Math.abs(velocity.x) > eps || Math.abs(velocity.y) > eps) {
          target.x += velocity.x * r
          target.y = Math.max(-halfPi, Math.min(halfPi, target.y + velocity.y * r))
          const decay = FRICTION ** r
          velocity.x *= decay
          velocity.y *= decay
        } else {
          velocity.x = velocity.y = 0
        }
      }
      const follow = 1 - (1 - FOLLOW) ** r
      current.x += (target.x - current.x) * follow
      current.y = Math.max(-halfPi, Math.min(halfPi, current.y + (target.y - current.y) * follow))
      globe.rotation.y = current.x
      globe.rotation.x = current.y
      if (visible) renderer.render(scene, camera)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    // Mouse drag (the component listens to mouse events only, so touch keeps scrolling the page).
    let lastX = 0
    let lastY = 0
    let lastT = 0
    const move = (e: MouseEvent) => {
      const t = performance.now()
      const dt = t - lastT
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      target.x += dx * DRAG
      target.y = Math.max(-halfPi, Math.min(halfPi, target.y + dy * DRAG))
      if (dt > 0) {
        velocity.x = dx * DRAG * 0.3 * (frameMs / dt)
        velocity.y = dy * DRAG * 0.3 * (frameMs / dt)
      }
      lastX = e.clientX
      lastY = e.clientY
      lastT = t
    }
    const up = () => {
      dragging = false
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    const down = (e: MouseEvent) => {
      dragging = true
      velocity.x = velocity.y = 0
      lastX = e.clientX
      lastY = e.clientY
      lastT = performance.now()
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }
    canvas.addEventListener('mousedown', down)

    const resize = new ResizeObserver(() => {
      camera.aspect = width() / height()
      camera.updateProjectionMatrix()
      renderer.setSize(width(), height())
    })
    resize.observe(host)
    // Skip drawing while off screen (the original renders all the time).
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(host)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      canvas.removeEventListener('mousedown', down)
      up()
      resize.disconnect()
      io.disconnect()
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      host.removeChild(canvas)
    }
  }, [])

  return <div ref={hostRef} className={`relative h-full w-full ${className}`} />
}
