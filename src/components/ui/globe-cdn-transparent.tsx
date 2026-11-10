"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

interface CdnMarker {
  id: string
  location: [number, number]
  region: string
}

interface CdnArc {
  id: string
  from: [number, number]
  to: [number, number]
}

interface GlobeCdnTransparentProps {
  markers?: CdnMarker[]
  arcs?: CdnArc[]
  className?: string
  speed?: number
}

/**
 * cobe always paints the sphere opaque. This rewrites its sphere fragment shader so the
 * ocean is fully transparent: the land-dot intensity becomes alpha, tinted with `baseColor`
 * (uniform F), and a ring of `rim` colour is painted just inside the globe's edge.
 * (`a` = squared distance from centre in cobe's shader; the sphere's radius is 0.8.)
 */
const COBE_SPHERE_OUT = "gl_FragColor=l+vec4(f*w,f);"
const glsl = (n: number) => n.toFixed(4)
function transparentSphereOut([r, g, b]: RGB, strength: number) {
  return (
    "float _m=max(max(F.r,F.g),max(F.b,1e-3));" +
    "float _a=clamp((max(l.r,max(l.g,l.b))/_m-.1)*1.15,0.,1.);" +
    "float _d=sqrt(a);" +
    `float _r=${glsl(strength)}*smoothstep(.68,.8,_d)*(1.-smoothstep(.8,.806,_d));` +
    `gl_FragColor=vec4(F*_a+vec3(${glsl(r)},${glsl(g)},${glsl(b)})*_r*(1.-_a),_a+_r*(1.-_a));`
  )
}

type RGB = [number, number, number]

function patchCanvasForTransparency(canvas: HTMLCanvasElement, rim: RGB, rimStrength: number) {
  const sphereOut = transparentSphereOut(rim, rimStrength)
  const original = canvas.getContext.bind(canvas) as (
    id: string,
    opts?: unknown
  ) => RenderingContext | null
  canvas.getContext = ((id: string, opts?: unknown) => {
    const ctx = original(id, opts)
    if (ctx && (id === "webgl" || id === "webgl2")) {
      const gl = ctx as WebGLRenderingContext
      const shaderSource = gl.shaderSource.bind(gl)
      gl.shaderSource = (shader, src) =>
        shaderSource(shader, src.replace(COBE_SPHERE_OUT, sphereOut))
    }
    return ctx
  }) as HTMLCanvasElement["getContext"]
}

const defaultMarkers: CdnMarker[] = [
  { id: "cdn-iad", location: [38.95, -77.45], region: "iad1" },
  { id: "cdn-sfo", location: [37.62, -122.38], region: "sfo1" },
  { id: "cdn-cdg", location: [49.01, 2.55], region: "cdg1" },
  { id: "cdn-hnd", location: [35.55, 139.78], region: "hnd1" },
  { id: "cdn-syd", location: [-33.95, 151.18], region: "syd1" },
  { id: "cdn-gru", location: [-23.43, -46.47], region: "gru1" },
  { id: "cdn-sin", location: [1.36, 103.99], region: "sin1" },
  { id: "cdn-arn", location: [59.65, 17.93], region: "arn1" },
  { id: "cdn-dub", location: [53.43, -6.25], region: "dub1" },
  { id: "cdn-bom", location: [19.09, 72.87], region: "bom1" },
]

const defaultArcs: CdnArc[] = [
  { id: "cdn-arc-1", from: [38.95, -77.45], to: [49.01, 2.55] },
  { id: "cdn-arc-2", from: [37.62, -122.38], to: [35.55, 139.78] },
  { id: "cdn-arc-3", from: [49.01, 2.55], to: [1.36, 103.99] },
  { id: "cdn-arc-4", from: [38.95, -77.45], to: [-23.43, -46.47] },
  { id: "cdn-arc-5", from: [35.55, 139.78], to: [-33.95, 151.18] },
  { id: "cdn-arc-6", from: [49.01, 2.55], to: [19.09, 72.87] },
]

export function GlobeCdnTransparent({
  markers = defaultMarkers,
  arcs = defaultArcs,
  className = "",
  speed = 0.003,
}: GlobeCdnTransparentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.theme === "dark"
  )
  // Re-tint the dots when the deck's theme toggles.
  useEffect(() => {
    const root = document.documentElement
    const mo = new MutationObserver(() => setIsDark(root.dataset.theme === "dark"))
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] })
    return () => mo.disconnect()
  }, [])
  const [traffic, setTraffic] = useState(() =>
    defaultArcs.map((a, i) => ({ id: a.id, value: [420, 380, 290, 185, 156, 134][i] || 100 }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTraffic((data) =>
        data.map((t) => ({
          ...t,
          value: Math.max(50, t.value + Math.floor(Math.random() * 21) - 10),
        }))
      )
    }, 250)
    return () => clearInterval(interval)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      // Transparent sphere: only the fine land dots, a dark edge ring, arcs and markers are drawn.
      // Dots are tinted with the theme's foreground so they read on light and dark slides.
      const ink: RGB = isDark ? [0.88, 0.9, 0.95] : [0.12, 0.1, 0.11]
      const rim: RGB = [0.04, 0.03, 0.035] // dark edge colour
      patchCanvasForTransparency(canvas, rim, isDark ? 0.9 : 0.55)
      globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width, height: width,
      phi: 0, theta: 0.2, dark: 1, diffuse: 1.2,
      mapSamples: 40000, mapBrightness: 1.6, mapBaseBrightness: 0,
      baseColor: ink,
      markerColor: ink,
      glowColor: [0, 0, 0],
      markerElevation: 0.02,
      markers: markers.map((m) => ({ location: m.location, size: 0.01, id: m.id })),
      arcs: arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
      arcColor: ink,
      arcWidth: 0.3, arcHeight: 0.25, opacity: 0.85,
    })
    function animate() {
      if (!isPausedRef.current) phi += speed
      globe!.update({
        phi: phi + phiOffsetRef.current + dragOffset.current.phi,
        theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
      })
      animationId = requestAnimationFrame(animate)
    }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, arcs, speed, isDark])

  const pyramidFaceStyle = (nth: number): React.CSSProperties => {
    const transforms = [
      "rotateY(0deg) translateZ(4px) rotateX(19.5deg)",
      "rotateY(120deg) translateZ(4px) rotateX(19.5deg)",
      "rotateY(240deg) translateZ(4px) rotateX(19.5deg)",
      "rotateX(-90deg) rotateZ(60deg) translateY(4px)",
    ]
    const colors = ["#e5e7eb", "#9ca3af", "#f9fafb", "#6b7280"]
    return {
      position: "absolute", left: -0.5, top: 0,
      width: 0, height: 0,
      borderLeft: "6.5px solid transparent",
      borderRight: "6.5px solid transparent",
      borderBottom: `13px solid ${colors[nth]}`,
      transformOrigin: "center bottom",
      transform: transforms[nth],
    }
  }

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pyramid-spin {
          0% { transform: rotateX(20deg) rotateY(0deg); }
          100% { transform: rotateX(20deg) rotateY(360deg); }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: 6,
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          <div style={{
            width: 12, height: 12, position: "relative",
            transformStyle: "preserve-3d" as const,
            animation: "pyramid-spin 4s linear infinite",
          }}>
            {[0, 1, 2, 3].map((n) => (
              <div key={n} style={pyramidFaceStyle(n)} />
            ))}
          </div>
          <span style={{
            fontFamily: "monospace", fontSize: "0.55rem", color: "var(--fg)",
            background: "var(--surface)", padding: "2px 6px", borderRadius: 3,
            letterSpacing: "0.05em", whiteSpace: "nowrap" as const,
            border: "1px solid var(--border)",
          }}>{m.region}</span>
        </div>
      ))}
      {traffic.map((t) => (
        <div
          key={t.id}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-arc-${t.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            fontFamily: "monospace",
            fontSize: "0.5rem",
            color: "var(--bg)",
            background: "var(--fg)",
            padding: "3px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap" as const,
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-arc-${t.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-arc-${t.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          {t.value}k req/s
        </div>
      ))}
    </div>
  )
}
