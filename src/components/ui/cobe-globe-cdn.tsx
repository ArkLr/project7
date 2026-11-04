"use client";

/**
 * GlobeCdn: the "▲ CDN" showcase from the cobe website (github.com/shuding/cobe,
 * MIT © Shu Ding), adapted for this deck:
 *   - spinning 3D pyramid markers with region labels
 *   - live-updating traffic labels on the arcs
 *   - labels fade/blur out as they rotate behind the globe
 * Labels follow the globe via CSS anchor positioning (cobe v2 creates an anchor per
 * marker/arc and sets `--cobe-visible-<id>` while it faces the viewer).
 * Colours: red & white. Drag to spin.
 */

import createGlobe, {
	type Arc,
	type COBEOptions,
	type Globe,
	type Marker,
} from "cobe";
import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore, type Theme } from "@/store/theme";

type LatLng = [number, number];

/** Same edge locations as the cobe showcase, labelled with their AWS region codes. */
const REGIONS: { id: string; location: LatLng; region: string }[] = [
	{ id: "iad", location: [38.95, -77.45], region: "us-east-1" },
	{ id: "sfo", location: [37.62, -122.38], region: "us-west-1" },
	{ id: "cdg", location: [49.01, 2.55], region: "eu-west-3" },
	{ id: "hnd", location: [35.55, 139.78], region: "ap-northeast-1" },
	{ id: "syd", location: [-33.95, 151.18], region: "ap-southeast-2" },
	{ id: "gru", location: [-23.43, -46.47], region: "sa-east-1" },
	{ id: "sin", location: [1.36, 103.99], region: "ap-southeast-1" },
	{ id: "arn", location: [59.65, 17.93], region: "eu-north-1" },
	{ id: "dub", location: [53.43, -6.25], region: "eu-west-1" },
	{ id: "bom", location: [19.09, 72.87], region: "ap-south-1" },
];

const LINKS: { id: string; from: LatLng; to: LatLng; base: number }[] = [
	{ id: "a1", from: [38.95, -77.45], to: [49.01, 2.55], base: 420 }, // IAD → CDG
	{ id: "a2", from: [37.62, -122.38], to: [35.55, 139.78], base: 380 }, // SFO → HND
	{ id: "a3", from: [49.01, 2.55], to: [1.36, 103.99], base: 290 }, // CDG → SIN
	{ id: "a4", from: [38.95, -77.45], to: [-23.43, -46.47], base: 185 }, // IAD → GRU
	{ id: "a5", from: [35.55, 139.78], to: [-33.95, 151.18], base: 156 }, // HND → SYD
	{ id: "a6", from: [49.01, 2.55], to: [19.09, 72.87], base: 134 }, // CDG → BOM
];

type RGB = [number, number, number];
const RED: RGB = [255, 0, 0];

const palettes: Record<Theme, Partial<COBEOptions>> = {
	light: {
		dark: 0,
		baseColor: [1, 1, 1],
		glowColor: [1, 0.9, 0.9],
		markerColor: RED,
		arcColor: RED,
		mapBrightness: 10,
	},
	dark: {
		dark: 0,
		baseColor: [1, 1, 1],
		glowColor: [0.55, 0.1, 0.12],
		markerColor: RED,
		arcColor: [0.95, 0.25, 0.27],
		mapBrightness: 10,
	},
};

export interface GlobeCdnProps {
	className?: string;
	/** Auto-rotation speed in radians per frame. */
	speed?: number;
}

export function GlobeCdn({ className, speed = 0.003 }: GlobeCdnProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const globeRef = useRef<Globe | null>(null);
	const theme = useThemeStore((s) => s.theme);
	const reduced = useReducedMotion();

	// Unique anchor names per instance (the overview thumbnail renders a second globe).
	const uid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");
	const mid = (id: string) => `${uid}-${id}`;

	const [traffic, setTraffic] = useState(() => LINKS.map((l) => l.base));

	// Self-updating traffic numbers (as on the cobe site).
	useEffect(() => {
		if (reduced) return;
		const t = setInterval(() => {
			setTraffic((v) =>
				v.map((n) => Math.max(50, n + Math.floor(Math.random() * 21) - 10)),
			);
		}, 250);
		return () => clearInterval(t);
	}, [reduced]);

	// Create the globe once per mount.
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// A fresh canvas per mount: reusing one across remounts (StrictMode) reuses a torn-down GL context.
		const canvas = document.createElement("canvas");
		canvas.className =
			"block size-full cursor-grab touch-none opacity-0 transition-opacity duration-700";
		container.prepend(canvas);

		const stylesBefore = new Set(document.head.querySelectorAll("style"));
		const markers: Marker[] = REGIONS.map((r) => ({
			id: `${uid}-${r.id}`,
			location: r.location,
			size: 0.012,
		}));
		const arcs: Arc[] = LINKS.map((l) => ({
			id: `${uid}-${l.id}`,
			from: l.from,
			to: l.to,
		}));

		let width = canvas.offsetWidth;
		let phi = 0;
		let velocity = 0;
		let drag: { x: number; phi: number } | null = null;
		let raf = 0;

		const globe = createGlobe(canvas, {
			...palettes[useThemeStore.getState().theme],
			devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
			width,
			height: width,
			phi: 0,
			theta: 0.2,
			diffuse: 1.5,
			mapSamples: 16000,
			markerElevation: 0.02,
			markers,
			arcs,
			arcWidth: 0.5,
			arcHeight: 0.25,
			opacity: 0.7,
		} as COBEOptions);
		globeRef.current = globe;
		// cobe adds this <style> for the --cobe-visible-* variables; remember it for cleanup.
		const cobeStyles = [...document.head.querySelectorAll("style")].filter(
			(s) => !stylesBefore.has(s),
		);

		const frame = () => {
			if (!drag) {
				phi += (reduced ? 0 : speed) + velocity;
				velocity *= 0.94;
			}
			globe.update({ phi, width, height: width });
			raf = requestAnimationFrame(frame);
		};
		frame();

		const ro = new ResizeObserver(() => {
			width = canvas.offsetWidth;
		});
		ro.observe(canvas);

		const onDown = (e: PointerEvent) => {
			drag = { x: e.clientX, phi };
			velocity = 0;
			canvas.setPointerCapture(e.pointerId);
			canvas.style.cursor = "grabbing";
		};
		const onMove = (e: PointerEvent) => {
			if (!drag) return;
			const next = drag.phi + (e.clientX - drag.x) / 200;
			velocity = (next - phi) * 0.3;
			phi = next;
		};
		const onUp = () => {
			drag = null;
			canvas.style.cursor = "grab";
		};
		canvas.addEventListener("pointerdown", onDown);
		canvas.addEventListener("pointermove", onMove);
		canvas.addEventListener("pointerup", onUp);
		canvas.addEventListener("pointercancel", onUp);
		const fade = setTimeout(() => (canvas.style.opacity = "1"), 50);

		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(fade);
			ro.disconnect();
			canvas.removeEventListener("pointerdown", onDown);
			canvas.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerup", onUp);
			canvas.removeEventListener("pointercancel", onUp);
			globe.destroy();
			globeRef.current = null;
			cobeStyles.forEach((s) => s.remove());
			canvas
				.getContext("webgl2")
				?.getExtension("WEBGL_lose_context")
				?.loseContext();
			// cobe wraps the canvas in a div of its own; remove the whole thing.
			const wrapper = canvas.parentElement;
			if (wrapper && wrapper !== container) wrapper.remove();
			else canvas.remove();
		};
	}, [reduced, speed, uid]);

	// Recolour on theme change without recreating the globe.
	useEffect(() => {
		globeRef.current?.update(palettes[theme]);
	}, [theme]);

	const anchored = (key: string): CSSProperties =>
		({
			positionAnchor: `--cobe-${key}`,
			opacity: `var(--cobe-visible-${key}, 0)`,
			filter: `blur(calc((1 - var(--cobe-visible-${key}, 0)) * 8px))`,
		}) as CSSProperties;

	return (
		<div
			ref={containerRef}
			data-no-nav
			className={cn(
				"cdn-globe relative aspect-square w-full select-none",
				className,
			)}
		>
			{/* The canvas is created in the effect above. */}

			{REGIONS.map((r) => (
				<div key={r.id} className="cdn-marker" style={anchored(mid(r.id))}>
					<div className="cdn-pyramid">
						<div className="cdn-pyramid-face" />
						<div className="cdn-pyramid-face" />
						<div className="cdn-pyramid-face" />
						<div className="cdn-pyramid-face" />
					</div>
					<span className="cdn-label">{r.region}</span>
				</div>
			))}

			{LINKS.map((l, i) => (
				<div
					key={l.id}
					className="cdn-arc-label"
					style={anchored(`arc-${mid(l.id)}`)}
				>
					{traffic[i]}k req/s
				</div>
			))}
		</div>
	);
}
