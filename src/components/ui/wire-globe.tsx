/**
 * WireGlobe: a slowly turning wireframe planet seen from above, rising out of the
 * bottom of its box like a horizon — lat/long grid, see-through back side, a haze
 * along the limb, two bands of atmosphere rings and a few drifting specks.
 *
 * Drawn on a 2D canvas with an orthographic projection. Lines use the theme's
 * `--fg`, so it is dark ink on white in light mode and white on black in dark mode.
 */

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme";

export interface WireGlobeProps {
	className?: string;
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
	/** Number of rings in the outer atmosphere band. */
	rings?: number;
	/** Number of floating specks. */
	specks?: number;
	/** Number of stars travelling along the atmosphere rings. */
	orbiters?: number;
	/** Spin speed in radians per second; positive turns clockwise on screen. */
	speed?: number;
}

const DEG = Math.PI / 180;

type Pt = readonly [x: number, y: number, z: number];

export function WireGlobe({
	className,
	radius = 0.58,
	top = 0.28,
	tilt = 0.2,
	roll = 0.24,
	latStep = 10,
	lonStep = 7.5,
	rings = 16,
	specks = 70,
	orbiters = 14,
	speed = 0.035,
}: WireGlobeProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const theme = useThemeStore((s) => s.theme);
	const reduced = useReducedMotion();

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		// Theme colours are read once per theme change (the effect re-runs on `theme`).
		const ink =
			getComputedStyle(document.documentElement)
				.getPropertyValue("--fg")
				.trim() || "#000";
		const isDark = theme === "dark";
		const hazeRgb = isDark ? "255,255,255" : "20,10,11";
		const alpha = isDark
			? {
					front: 0.82,
					back: 0.13,
					ring: 0.55,
					inner: 0.22,
					speck: 0.6,
					haze: 0.13,
					star: 1,
				}
			: {
					front: 0.62,
					back: 0.1,
					ring: 0.42,
					inner: 0.16,
					speck: 0.4,
					haze: 0.07,
					star: 0.85,
				};

		// Stable pseudo-random specks (seeded so the overview thumbnail matches).
		let seed = 7;
		const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
		const dots = Array.from({ length: specks }, () => ({
			x: rand(),
			y: rand() * 0.8,
			r: 0.5 + rand() * 1.1,
			phase: rand() * Math.PI * 2,
			drift: (rand() - 0.5) * 0.004,
		}));

		// Stars riding the rings: which ring, where they start, how fast (rad/s, clockwise).
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

		let w = 0;
		let h = 0;
		let hair = 1; // one on-screen pixel, in layout px
		const resize = () => {
			w = canvas.offsetWidth;
			h = canvas.offsetHeight;
			// The deck scales slides with a CSS transform; render at the on-screen size.
			const stageScale = w ? canvas.getBoundingClientRect().width / w || 1 : 1;
			const dpr = Math.min(4, (window.devicePixelRatio || 1) * stageScale);
			canvas.width = Math.max(1, Math.round(w * dpr));
			canvas.height = Math.max(1, Math.round(h * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			hair = 1 / stageScale;
		};
		resize();

		const cosT = Math.cos(tilt);
		const sinT = Math.sin(tilt);
		const cosR = Math.cos(roll);
		const sinR = Math.sin(roll);
		const SEG = 180;

		const draw = (time: number) => {
			const R = w * radius;
			const cx = w / 2;
			const cy = h * top + R;
			// Negative spin moves the near side leftward = clockwise as seen from above the pole.
			const spin = -time * speed;

			ctx.clearRect(0, 0, w, h);
			ctx.strokeStyle = ink;
			ctx.fillStyle = ink;
			ctx.lineJoin = "round";
			ctx.lineCap = "butt";

			// ── Atmosphere: a tight faint band hugging the limb, then a gap and a wider band ──
			ctx.lineWidth = hair;
			for (let i = 0; i < 6; i++) {
				ctx.globalAlpha = alpha.inner * (1 - i / 6);
				ctx.beginPath();
				ctx.arc(cx, cy, R * (1.006 + i * 0.0045), 0, Math.PI * 2);
				ctx.stroke();
			}
			for (let i = 0; i < rings; i++) {
				const t = i / Math.max(1, rings - 1);
				ctx.globalAlpha = alpha.ring * (0.25 + 0.75 * (1 - t) ** 1.2);
				ctx.beginPath();
				ctx.arc(cx, cy, R * (1.06 + t * 0.075), 0, Math.PI * 2);
				ctx.stroke();
			}

			// ── Orbiting stars: a head with a soft glow, trailing a fading tail along its ring ──
			for (const st of stars) {
				const rr = R * st.radius;
				// Canvas angles grow clockwise (y points down).
				const a = st.angle + time * st.speed;
				const hx = cx + rr * Math.cos(a);
				const hy = cy + rr * Math.sin(a);
				if (hy > h + 20 || hx < -20 || hx > w + 20) continue;
				const twinkle = 0.75 + 0.25 * Math.sin(time * 2.2 + st.phase);

				const STEPS = 10;
				ctx.lineWidth = hair * st.size * 1.2;
				ctx.lineCap = "round";
				for (let k = 0; k < STEPS; k++) {
					const a0 = a - st.trail * ((k + 1) / STEPS);
					const a1 = a - st.trail * (k / STEPS);
					ctx.globalAlpha = alpha.star * twinkle * (1 - k / STEPS) ** 2 * 0.7;
					ctx.beginPath();
					ctx.arc(cx, cy, rr, a0, a1);
					ctx.stroke();
				}
				ctx.lineCap = "butt";

				const glowR = 7 * st.size * hair;
				const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, glowR);
				glow.addColorStop(0, `rgba(${hazeRgb},${0.5 * twinkle})`);
				glow.addColorStop(1, `rgba(${hazeRgb},0)`);
				ctx.globalAlpha = 1;
				ctx.fillStyle = glow;
				ctx.beginPath();
				ctx.arc(hx, hy, glowR, 0, Math.PI * 2);
				ctx.fill();

				ctx.fillStyle = ink;
				ctx.globalAlpha = alpha.star * twinkle;
				ctx.beginPath();
				ctx.arc(hx, hy, st.size * hair * 1.3, 0, Math.PI * 2);
				ctx.fill();
				// Tiny four-point sparkle on the bigger ones.
				if (st.size > 1.4) {
					const L = st.size * 4 * hair * twinkle;
					ctx.lineWidth = hair * 0.8;
					ctx.globalAlpha = alpha.star * twinkle * 0.6;
					ctx.beginPath();
					ctx.moveTo(hx - L, hy);
					ctx.lineTo(hx + L, hy);
					ctx.moveTo(hx, hy - L);
					ctx.lineTo(hx, hy + L);
					ctx.stroke();
				}
			}
			ctx.fillStyle = ink;

			// ── Haze just inside the limb ──
			const haze = ctx.createRadialGradient(cx, cy, R * 0.78, cx, cy, R);
			haze.addColorStop(0, `rgba(${hazeRgb},0)`);
			haze.addColorStop(0.8, `rgba(${hazeRgb},${alpha.haze * 0.6})`);
			haze.addColorStop(0.96, `rgba(${hazeRgb},${alpha.haze})`);
			haze.addColorStop(1, `rgba(${hazeRgb},0)`);
			ctx.globalAlpha = 1;
			ctx.fillStyle = haze;
			ctx.beginPath();
			ctx.arc(cx, cy, R, 0, Math.PI * 2);
			ctx.fill();

			// ── Grid: continuous polylines, split into a near-side path and a far-side path ──
			const front = new Path2D();
			const back = new Path2D();
			const project = (lat: number, lon: number): Pt => {
				const cl = Math.cos(lat);
				const x = cl * Math.sin(lon + spin);
				const y = Math.sin(lat);
				const z = cl * Math.cos(lon + spin);
				const y2 = y * cosT - z * sinT;
				const z2 = y * sinT + z * cosT;
				return [
					cx + R * (x * cosR - y2 * sinR),
					cy - R * (x * sinR + y2 * cosR),
					z2,
				];
			};
			const addLine = (pts: Pt[]) => {
				let side: Path2D | null = null;
				for (let i = 1; i < pts.length; i++) {
					const a = pts[i - 1];
					const b = pts[i];
					if (a[1] > h + 4 && b[1] > h + 4) {
						side = null;
						continue;
					}
					const next = a[2] + b[2] >= 0 ? front : back;
					if (next !== side) {
						next.moveTo(a[0], a[1]);
						side = next;
					}
					next.lineTo(b[0], b[1]);
				}
			};

			for (let lat = -90 + latStep; lat < 90 - 1e-6; lat += latStep) {
				const pts: Pt[] = [];
				for (let i = 0; i <= SEG; i++)
					pts.push(project(lat * DEG, (i / SEG) * Math.PI * 2));
				addLine(pts);
			}
			for (let lon = 0; lon < 360 - 1e-6; lon += lonStep) {
				const pts: Pt[] = [];
				// Meridians run pole to pole so they all meet at a single point.
				for (let i = 0; i <= SEG / 2; i++)
					pts.push(project((-90 + (i / (SEG / 2)) * 180) * DEG, lon * DEG));
				addLine(pts);
			}

			ctx.fillStyle = ink;
			ctx.lineWidth = hair;
			ctx.globalAlpha = alpha.back;
			ctx.stroke(back);
			ctx.globalAlpha = alpha.front;
			ctx.stroke(front);
			ctx.globalAlpha = 1;
		};

		const ro = new ResizeObserver(() => {
			resize();
			if (reduced) draw(0);
		});
		ro.observe(canvas);
		// The stage scale can change without our layout size changing.
		const onWinResize = () => {
			resize();
			if (reduced) draw(0);
		};
		window.addEventListener("resize", onWinResize);

		let raf = 0;
		const start = performance.now();
		const loop = (now: number) => {
			draw((now - start) / 1000);
			raf = requestAnimationFrame(loop);
		};
		if (reduced) draw(0);
		else raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			window.removeEventListener("resize", onWinResize);
		};
	}, [
		theme,
		reduced,
		radius,
		top,
		tilt,
		roll,
		latStep,
		lonStep,
		rings,
		specks,
		orbiters,
		speed,
	]);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className={cn("pointer-events-none block size-full", className)}
		/>
	);
}
