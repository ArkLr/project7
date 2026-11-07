import { useEffect, useRef } from 'react'

export type BackdropVariant = 'cloud' | 'lanes' | 'aws' | 'meta' | 'compare' | 'network'

const COLORS: Record<BackdropVariant, string[]> = {
  cloud: ['#38bdf8', '#818cf8'],
  lanes: ['#22c55e', '#38bdf8'],
  aws: ['#ff9900'],
  meta: ['#0866ff'],
  compare: ['#ff9900', '#0866ff'],
  network: ['#a78bfa', '#38bdf8'],
}

const W = 1280
const H = 720
const rnd = (a: number, b: number) => a + Math.random() * (b - a)

/** Animated canvas background that reacts to the mouse. Sits behind slide content. */
export function Backdrop({ variant }: { variant: BackdropVariant }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    cv.width = W * dpr
    cv.height = H * dpr
    ctx.scale(dpr, dpr)

    const cols = COLORS[variant]
    const speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1
    const mouse = { x: W / 2, y: H / 2, on: false }
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      mouse.x = ((e.clientX - r.left) * W) / r.width
      mouse.y = ((e.clientY - r.top) * H) / r.height
      mouse.on = true
    }
    window.addEventListener('pointermove', onMove)

    // --- scene data ---
    const clouds = Array.from({ length: 8 }, (_, i) => ({
      x: rnd(0, W), y: rnd(60, H - 60), s: rnd(0.7, 1.7), v: rnd(0.15, 0.5), d: rnd(0.4, 1.6), c: cols[i % cols.length],
    }))
    const nodes = Array.from({ length: 48 }, (_, i) => ({
      x: rnd(0, W), y: rnd(0, H), vx: rnd(-0.25, 0.25), vy: rnd(-0.25, 0.25), p: rnd(0, 6.28), c: cols[i % cols.length],
    }))
    const lanes = Array.from({ length: 9 }, (_, i) => ({
      y: 50 + i * 78, v: rnd(1, 3.2), c: cols[i % cols.length],
      dots: Array.from({ length: 7 }, () => rnd(0, W)),
    }))

    let t = 0
    let raf = 0
    const frame = () => {
      t += 0.016 * speed
      ctx.clearRect(0, 0, W, H)

      if (variant === 'cloud') {
        for (const c of clouds) {
          c.x += c.v * speed
          if (c.x > W + 160) c.x = -160
          const px = c.x + (mouse.x - W / 2) * 0.05 * c.d
          const py = c.y + (mouse.y - H / 2) * 0.05 * c.d + Math.sin(t + c.d * 4) * 6
          ctx.fillStyle = c.c
          ctx.globalAlpha = 0.13
          for (const [dx, dy, r] of [[-60, 10, 30], [-22, -10, 42], [24, -6, 46], [64, 8, 32], [0, 16, 36]])
            { ctx.beginPath(); ctx.arc(px + dx * c.s, py + dy * c.s, r * c.s, 0, 6.28); ctx.fill() }
        }
      } else if (variant === 'lanes') {
        for (const l of lanes) {
          const near = mouse.on && Math.abs(l.y - mouse.y) < 45
          ctx.globalAlpha = near ? 0.35 : 0.12
          ctx.strokeStyle = l.c
          ctx.beginPath(); ctx.moveTo(0, l.y); ctx.lineTo(W, l.y); ctx.stroke()
          ctx.fillStyle = l.c
          ctx.globalAlpha = near ? 0.9 : 0.4
          l.dots = l.dots.map((x) => {
            const nx = x + l.v * (near ? 4 : 1) * speed
            return nx > W + 20 ? -20 : nx
          })
          for (const x of l.dots) ctx.fillRect(x, l.y - 3, near ? 22 : 14, 6)
        }
      } else {
        for (const n of nodes) {
          n.x += n.vx * speed; n.y += n.vy * speed
          if (n.x < 0 || n.x > W) n.vx *= -1
          if (n.y < 0 || n.y > H) n.vy *= -1
          const dx = mouse.x - n.x, dy = mouse.y - n.y
          if (mouse.on && dx * dx + dy * dy < 200 * 200) { n.x += dx * 0.004 * speed; n.y += dy * 0.004 * speed }
        }
        ctx.lineWidth = 1
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i]
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j]
            const d = Math.hypot(a.x - b.x, a.y - b.y)
            if (d < 150) { ctx.globalAlpha = (1 - d / 150) * 0.28; ctx.strokeStyle = a.c; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() }
          }
          const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y)
          if (mouse.on && dm < 200) { ctx.globalAlpha = (1 - dm / 200) * 0.6; ctx.strokeStyle = a.c; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke() }
        }
        for (const n of nodes) {
          ctx.fillStyle = n.c
          ctx.globalAlpha = 0.18
          ctx.beginPath(); ctx.arc(n.x, n.y, 9 + Math.sin(t * 2 + n.p) * 3, 0, 6.28); ctx.fill()
          ctx.globalAlpha = 0.7
          ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, 6.28); ctx.fill()
        }
      }
      raf = requestAnimationFrame(frame)
    }
    frame()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [variant])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
}