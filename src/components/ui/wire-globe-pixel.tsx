/**
 * PixelGlobe: a pixel-art take on WireGlobe. The scene is rasterised by hand onto a
 * low-resolution canvas, with every pixel either solid ink or empty; fainter parts
 * (atmosphere, star trails, lines near the limb) get their tone from ordered dithering.
 * The browser then scales the canvas up without smoothing.
 */

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme";

export interface PixelGlobeProps {
	className?: string;
	/** Size of one art pixel, in slide pixels. */
	pixelSize?: number;
	/** Frame rate; a low value suits the retro look. */
	fps?: number;
	/** Sphere radius as a fraction of the canvas width. */
	radius?: number;
	/** Where the top of the sphere sits, as a fraction of the canvas height. */
	top?: number;
	/** How far the north pole is tipped toward the viewer (radians). */
	tilt?: number;
	/** Screen-plane roll (radians); positive leans the pole to the left. */
	roll?: number;
	/** Grid spacing in degrees. */
	latStep?: number;
	lonStep?: number;
	/** Number of stars travelling along the atmosphere rings. */
	orbiters?: number;
	/** Spin speed in radians per second; positive turns clockwise on screen. */
	speed?: number;
}

const DEG = Math.PI / 180;
const SEG = 180;
/** Ink coverage (0–1) of each layer. */
const TONE = { ring: 0.8, inner: 0.35, star: 1 };
/** The far side is drawn as a regular dotted line: one pixel in this many. */
const BACK_DOT_EVERY = 5;
/** 4×4 Bayer matrix: the order in which pixels switch on as a tone gets darker. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
	(v) => (v + 0.5) / 16,
);

export function PixelGlobe({
	className,
	pixelSize = 3,
	fps = 15,
	radius = 0.58,
	top = 0.28,
	tilt = 0.2,
	roll = 0.24,
	latStep = 15,
	lonStep = 15,
	orbiters = 14,
	speed = 0.035,
}: PixelGlobeProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const theme = useThemeStore((s) => s.theme);
	const reduced = useReducedMotion();

	// biome-ignore lint/correctness/useExhaustiveDependencies: `theme` re-reads the ink colour.
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		// Normalises any CSS colour to #rrggbb.
		ctx.fillStyle =
			getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#000";
		const hex = ctx.fillStyle;
		const ink = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

		// Seeded so the overview thumbnail matches.
		let seed = 7;
		const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
		const stars = Array.from({ length: orbiters }, () => {
			const inner = rand() < 0.3;
			return {
				radius: inner ? 1.006 + rand() * 0.022 : 1.06 + rand() * 0.075,
				angle: rand() * Math.PI * 2,
				speed: 0.025 + rand() * 0.06,
				size: 0.8 + rand() * 1,
				trail: 0.06 + rand() * 0.1,
				phase: rand() * Math.PI * 2,
			};
		});

		let W = 1;
		let H = 1;
		let tone = new Float32Array(1);
		let image = ctx.createImageData(1, 1);
		const resize = () => {
			W = Math.max(1, Math.ceil(canvas.offsetWidth / pixelSize));
			H = Math.max(1, Math.ceil(canvas.offsetHeight / pixelSize));
			canvas.width = W;
			canvas.height = H;
			tone = new Float32Array(W * H);
			image = ctx.createImageData(W, H);
		};
		resize();

		const plot = (x: number, y: number, a: number) => {
			const px = Math.round(x);
			const py = Math.round(y);
			if (px < 0 || py < 0 || px >= W || py >= H) return;
			const i = py * W + px;
			if (a > tone[i]) tone[i] = a;
		};

		// Bresenham, so diagonals stay one art pixel thick.
		let dotCount = 0;
		const line = (ax: number, ay: number, bx: number, by: number, a: number, every = 1) => {
			let x = Math.round(ax);
			let y = Math.round(ay);
			const x1 = Math.round(bx);
			const y1 = Math.round(by);
			const dx = Math.abs(x1 - x);
			const dy = -Math.abs(y1 - y);
			const sx = x < x1 ? 1 : -1;
			const sy = y < y1 ? 1 : -1;
			let err = dx + dy;
			for (;;) {
				if (dotCount++ % every === 0) plot(x, y, a);
				if (x === x1 && y === y1) return;
				const e2 = 2 * err;
				if (e2 >= dy) {
					err += dy;
					x += sx;
				}
				if (e2 <= dx) {
					err += dx;
					y += sy;
				}
			}
		};

		const cosT = Math.cos(tilt);
		const sinT = Math.sin(tilt);
		const cosR = Math.cos(roll);
		const sinR = Math.sin(roll);

		const draw = (time: number) => {
			const R = W * radius;
			const cx = W / 2;
			const cy = H * top + R;
			const spin = -time * speed;
			tone.fill(0);

			const circle = (r: number, a: number) => {
				const steps = Math.ceil(Math.PI * 2 * r);
				for (let i = 0; i < steps; i++) {
					const t = (i / steps) * Math.PI * 2;
					plot(cx + r * Math.cos(t), cy + r * Math.sin(t), a);
				}
			};

			// ── Atmosphere: rings stay at least three art pixels apart so they don't merge ──
			circle(R * 1.015, TONE.inner);
			const outerRings = Math.max(2, Math.floor((R * 0.075) / 3));
			for (let i = 0; i < outerRings; i++) {
				const t = i / (outerRings - 1);
				circle(R * (1.06 + t * 0.075), TONE.ring * (0.2 + 0.8 * (1 - t) ** 1.2));
			}

			// ── Grid: near-side lines thin out toward the limb, where they crowd together ──
			const project = (lat: number, lon: number) => {
				const cl = Math.cos(lat);
				const px = cl * Math.sin(lon + spin);
				const py = Math.sin(lat);
				const pz = cl * Math.cos(lon + spin);
				const y2 = py * cosT - pz * sinT;
				const z2 = py * sinT + pz * cosT;
				return {
					x: cx + R * (px * cosR - y2 * sinR),
					y: cy - R * (px * sinR + y2 * cosR),
					z: z2,
				};
			};
			const polyline = (at: (t: number) => { x: number; y: number; z: number }, segments: number) => {
				let a = at(0);
				for (let i = 1; i <= segments; i++) {
					const b = at(i / segments);
					if (a.y <= H + 4 || b.y <= H + 4) {
						const z = (a.z + b.z) / 2;
						if (z >= 0) line(a.x, a.y, b.x, b.y, Math.min(1, 0.45 + z * 1.6));
						else line(a.x, a.y, b.x, b.y, 1, BACK_DOT_EVERY);
					}
					a = b;
				}
			};
			for (let lat = -90 + latStep; lat < 90 - 1e-6; lat += latStep)
				polyline((t) => project(lat * DEG, t * Math.PI * 2), SEG);
			// Meridians run pole to pole so they all meet at a single point.
			for (let lon = 0; lon < 360 - 1e-6; lon += lonStep)
				polyline((t) => project((-90 + t * 180) * DEG, lon * DEG), SEG / 2);

			// ── Orbiting stars: a head, a fading tail and a plus-shaped sparkle on the big ones ──
			for (const st of stars) {
				const rr = R * st.radius;
				const a = st.angle + time * st.speed;
				const twinkle = 0.75 + 0.25 * Math.sin(time * 2.2 + st.phase);
				const steps = Math.ceil(rr * st.trail);
				for (let k = 1; k <= steps; k++) {
					const t = k / steps;
					const ta = a - st.trail * t;
					plot(cx + rr * Math.cos(ta), cy + rr * Math.sin(ta), TONE.star * twinkle * (1 - t) ** 2);
				}
				const hx = cx + rr * Math.cos(a);
				const hy = cy + rr * Math.sin(a);
				plot(hx, hy, TONE.star);
				if (st.size > 1.4) {
					const arm = twinkle > 0.85 ? 2 : 1;
					for (let k = 1; k <= arm; k++) {
						plot(hx + k, hy, TONE.star);
						plot(hx - k, hy, TONE.star);
						plot(hx, hy + k, TONE.star);
						plot(hx, hy - k, TONE.star);
					}
				}
			}

			// ── Dither the tones down to solid pixels ──
			const out = image.data;
			for (let y = 0; y < H; y++) {
				for (let x = 0; x < W; x++) {
					const i = y * W + x;
					const on = tone[i] > BAYER[(y & 3) * 4 + (x & 3)];
					const o = i * 4;
					out[o] = ink[0];
					out[o + 1] = ink[1];
					out[o + 2] = ink[2];
					out[o + 3] = on ? 255 : 0;
				}
			}
			ctx.putImageData(image, 0, 0);
		};

		const start = performance.now();
		const elapsed = () => (reduced ? 0 : (performance.now() - start) / 1000);
		const ro = new ResizeObserver(() => {
			resize();
			draw(elapsed());
		});
		ro.observe(canvas);

		let raf = 0;
		let last = -Infinity;
		const loop = (now: number) => {
			raf = requestAnimationFrame(loop);
			if (now - last < 1000 / fps) return;
			last = now;
			draw((now - start) / 1000);
		};
		if (reduced) draw(0);
		else raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	}, [theme, reduced, pixelSize, fps, radius, top, tilt, roll, latStep, lonStep, orbiters, speed]);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className={cn("pointer-events-none block size-full [image-rendering:pixelated]", className)}
		/>
	);
}
