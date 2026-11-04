"use client"

/**
 * GlobeCdn: a cobe WebGL globe (github.com/shuding/cobe, MIT © Shu Ding) styled as a dark
 * dotted planet with a red/white rim light, small red location dots and dark labels.
 *
 * - Labels follow the globe via CSS anchor positioning: cobe v2 creates an anchor per
 *   marker/arc and sets `--cobe-visible-<id>` while it faces the viewer.
 * - Drag horizontally to spin, vertically to tilt; it keeps rotating slowly on its own.
 */

import createGlobe, { type Arc, type COBEOptions, type Globe, type Marker } from "cobe"
import { useReducedMotion } from "motion/react"
import { useEffect, useId, useRef, type CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { useThemeStore, type Theme } from "@/store/theme"

type LatLng = [number, number]

export interface GlobeLocation {
  id: string
  location: LatLng
  label: string
}

export interface GlobeLink {
  id: string
  from: LatLng
  to: LatLng
}

/** Major cloud data-center regions. */
const defaultLocations: GlobeLocation[] = [
  { id: "iad", location: [38.95, -77.45], label: "N. Virginia" },
  { id: "pdx", location: [45.6, -121.2], label: "Oregon" },
  { id: "dub", location: [53.43, -6.25], label: "Ireland" },
  { id: "fra", location: [50.1, 8.7], label: "Frankfurt" },
  { id: "arn", location: [65.6, 22.1], label: "Sweden" },
  { id: "bom", location: [19.09, 72.87], label: "Mumbai" },
  { id: "sin", location: [1.36, 103.99], label: "Singapore" },
  { id: "hnd", location: [35.55, 139.78], label: "Tokyo" },
  { id: "syd", location: [-33.95, 151.18], label: "Sydney" },
  { id: "gru", location: [-23.43, -46.47], label: "São Paulo" },
]

const defaultLinks: GlobeLink[] = [
  { id: "l1", from: [38.95, -77.45], to: [53.43, -6.25] },
  { id: "l2", from: [53.43, -6.25], to: [50.1, 8.7] },
  { id: "l3", from: [50.1, 8.7], to: [19.09, 72.87] },
  { id: "l4", from: [19.09, 72.87], to: [1.36, 103.99] },
  { id: "l5", from: [1.36, 103.99], to: [35.55, 139.78] },
  { id: "l6", from: [38.95, -77.45], to: [-23.43, -46.47] },
]

type RGB = [number, number, number]
const RED: RGB = [0.94, 0.2, 0.22]

/** Dark planet in dark mode; in light mode the sphere turns white with dark dots. */
const palettes: Record<Theme, Partial<COBEOptions>> = {
  dark: {
    dark: 1,
    baseColor: [0.16, 0.16, 0.18],
    glowColor: [0.5, 0.08, 0.1],
    markerColor: RED,
    arcColor: [0.85, 0.2, 0.22],
    mapBrightness: 7,
    diffuse: 1.1,
  },
  light: {
    dark: 0,
    baseColor: [1, 1, 1],
    glowColor: [1, 0.86, 0.86],
    markerColor: RED,
    arcColor: [0.85, 0.12, 0.15],
    mapBrightness: 9,
    diffuse: 1.4,
  },
}

export interface GlobeCdnProps {
  className?: string
  locations?: GlobeLocation[]
  links?: GlobeLink[]
  /** Auto-rotation speed in radians per frame. */
  speed?: number
  /** Initial rotation (radians). Tweak to choose which side faces the viewer first. */
  initialPhi?: number
}

export function GlobeCdn({
  className,
  locations = defaultLocations,
  links = defaultLinks,
  speed = 0.002,
  initialPhi = -0.4,
}: GlobeCdnProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<Globe | null>(null)
  const theme = useThemeStore((s) => s.theme)
  const reduced = useReducedMotion()

  // Unique anchor names per instance (the overview thumbnail renders a second globe).
  const uid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "")

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // A fresh canvas per mount: reusing one across remounts (StrictMode) reuses a torn-down GL context.
    const canvas = document.createElement("canvas")
    canvas.className = "block size-full cursor-grab touch-none opacity-0 transition-opacity duration-1000"
    container.prepend(canvas)

    const stylesBefore = new Set(document.head.querySelectorAll("style"))
    const markers: Marker[] = locations.map((l) => ({ id: `${uid}-${l.id}`, location: l.location, size: 0.025 }))
    const arcs: Arc[] = links.map((l) => ({ id: `${uid}-${l.id}`, from: l.from, to: l.to }))

    let width = canvas.offsetWidth
    let phi = initialPhi
    let theta = 0.25
    let velocity = 0
    let drag: { x: number; y: number; phi: number; theta: number } | null = null
    let raf = 0

    const globe = createGlobe(canvas, {
      ...palettes[useThemeStore.getState().theme],
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi,
      theta,
      mapSamples: 20000,
      mapBaseBrightness: 0,
      markerElevation: 0.01,
      markers,
      arcs,
      arcWidth: 0.35,
      arcHeight: 0.2,
      opacity: 0.85,
    } as COBEOptions)
    globeRef.current = globe
    // cobe adds a <style> for the --cobe-visible-* variables; remember it for cleanup.
    const cobeStyles = [...document.head.querySelectorAll("style")].filter((s) => !stylesBefore.has(s))

    const frame = () => {
      if (!drag) {
        phi += (reduced ? 0 : speed) + velocity
        velocity *= 0.94
      }
      globe.update({ phi, theta, width, height: width })
      raf = requestAnimationFrame(frame)
    }
    frame()

    const ro = new ResizeObserver(() => {
      width = canvas.offsetWidth
    })
    ro.observe(canvas)

    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, phi, theta }
      velocity = 0
      canvas.setPointerCapture(e.pointerId)
      canvas.style.cursor = "grabbing"
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const next = drag.phi + (e.clientX - drag.x) / 300
      velocity = (next - phi) * 0.3
      phi = next
      theta = Math.max(-0.6, Math.min(0.9, drag.theta + (e.clientY - drag.y) / 600))
    }
    const onUp = () => {
      drag = null
      canvas.style.cursor = "grab"
    }
    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)
    const fade = setTimeout(() => (canvas.style.opacity = "1"), 50)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(fade)
      ro.disconnect()
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
      globe.destroy()
      globeRef.current = null
      cobeStyles.forEach((s) => s.remove())
      canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext()
      // cobe wraps the canvas in a div of its own; remove the whole thing.
      const wrapper = canvas.parentElement
      if (wrapper && wrapper !== container) wrapper.remove()
      else canvas.remove()
    }
  }, [reduced, speed, initialPhi, locations, links, uid])

  // Recolour on theme change without recreating the globe.
  useEffect(() => {
    globeRef.current?.update(palettes[theme])
  }, [theme])

  const anchored = (key: string): CSSProperties =>
    ({
      positionAnchor: `--cobe-${key}`,
      opacity: `var(--cobe-visible-${key}, 0)`,
      filter: `blur(calc((1 - var(--cobe-visible-${key}, 0)) * 6px))`,
    }) as CSSProperties

  return (
    <div ref={containerRef} data-no-nav className={cn("globe relative aspect-square w-full select-none", className)}>
      {/* The canvas is created in the effect above. */}

      {/* Rim light: red from the upper left, white from the lower left (sits on the sphere's edge). */}
      <div aria-hidden className="globe-rim" />

      {locations.map((l) => (
        <span key={l.id} className="globe-label" style={anchored(`${uid}-${l.id}`)}>
          {l.label}
        </span>
      ))}
    </div>
  )
}
