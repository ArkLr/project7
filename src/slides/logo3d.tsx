import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

export type LogoKind = 'cloud' | 'aws' | 'meta' | 'chip' | 'compare'
type Single = Exclude<LogoKind, 'compare'>

const LAYERS = 16 // stacked copies that fake the extrusion
const GAP = 2.4 // px between layers

function Shape({ kind }: { kind: Single }) {
  const line = { fill: 'none', strokeLinejoin: 'round', strokeLinecap: 'round' } as const
  return (
    <svg viewBox="0 0 200 120" className="size-full text-fg" overflow="visible">
      {kind === 'cloud' && (
        <path d="M50 100 C20 100 10 70 35 60 C32 30 70 20 85 42 C100 15 150 25 150 58 C180 55 195 100 160 100 Z"
          fill="#38bdf8" stroke="#38bdf8" strokeWidth={6} strokeLinejoin="round" />
      )}
      {kind === 'meta' && (
        <path d="M100 60 C80 20 20 20 20 60 C20 100 80 100 100 60 C120 20 180 20 180 60 C180 100 120 100 100 60 Z"
          stroke="#0866ff" strokeWidth={18} {...line} />
      )}
      {kind === 'aws' && (
        <>
          <text x="100" y="68" textAnchor="middle" fontSize="76" fontWeight="800" fill="currentColor"
            style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '-2px' }}>aws</text>
          <path d="M38 88 Q100 124 162 88 M150 80 L163 88 L149 99" stroke="#ff9900" strokeWidth={8} {...line} />
        </>
      )}
      {kind === 'chip' && (
        <>
          <rect x="50" y="22" width="100" height="76" rx="10" stroke="#22c55e" strokeWidth={8} {...line} />
          <rect x="80" y="45" width="40" height="30" rx="4" fill="#22c55e" />
          <path d="M72 22V8 M100 22V8 M128 22V8 M72 98v14 M100 98v14 M128 98v14 M50 48H36 M50 72H36 M150 48h14 M150 72h14"
            stroke="#22c55e" strokeWidth={8} {...line} />
        </>
      )}
    </svg>
  )
}

/** A logo made of stacked layers: it looks extruded in 3D and tilts toward the mouse. */
function Logo({ kind }: { kind: Single }) {
  const tilt = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tilt.current
    if (!el) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tx = 0, ty = 0, cx = 0, cy = 0, t = 0, raf = 0
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 80
      ty = -(e.clientY / window.innerHeight - 0.5) * 50
    }
    window.addEventListener('pointermove', onMove)
    const loop = () => {
      t += 0.016
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      const sway = calm ? 0 : Math.sin(t * 0.8) * 14
      el.style.transform = `rotateY(${cx + sway}deg) rotateX(${cy}deg)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [])

  return (
    <div style={{ perspective: 900 }} className="h-[132px] w-[220px]">
      <motion.div
        className="size-full"
        style={{ transformStyle: 'preserve-3d' }}
        initial={{ rotateY: -110, scale: 0.5, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 12, delay: 0.3 }}
      >
        <div ref={tilt} className="relative size-full" style={{ transformStyle: 'preserve-3d' }}>
          {Array.from({ length: LAYERS }, (_, i) => (
            <div key={i} className="absolute inset-0" style={{
              transform: `translateZ(${(i - (LAYERS - 1) / 2) * GAP}px)`,
              filter: `brightness(${0.5 + (0.5 * i) / (LAYERS - 1)})`,
            }}>
              <Shape kind={kind} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function Logo3D({ kind }: { kind: LogoKind }) {
  return (
    <div aria-hidden className="pointer-events-none absolute right-12 top-5 z-0 flex gap-6">
      {kind === 'compare' ? (<><Logo kind="aws" /><Logo kind="meta" /></>) : <Logo kind={kind} />}
    </div>
  )
}