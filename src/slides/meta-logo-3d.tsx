import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useThemeStore } from "@/store/theme";

/** Exported from public/Meta.blend: "Logo" (the twisted loop) and "Text" (the Meta wordmark). */
const MODEL_URL = "/models/meta-logo.glb";
const SPIN_EVERY = 30; // seconds between spins
const SPIN_DURATION = 2.4; // seconds one spin takes

function Model({ textColor }: { textColor: string }) {
	const { scene } = useGLTF(MODEL_URL);
	// Centre the model on its own bounding box once, before it is placed in the
	// (initially tiny) entrance group, so the measurement isn't skewed by that scale.
	const root = useMemo(() => {
		const r = scene.clone(true);
		const box = new THREE.Box3().setFromObject(r);
		r.position.sub(box.getCenter(new THREE.Vector3()));
		return r;
	}, [scene]);
	const tilt = useRef<THREE.Group>(null);
	const pointer = useRef({ x: 0, y: 0 });
	const calm = useMemo(
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
		[],
	);

	const logoMat = useMemo(
		() =>
			new THREE.MeshPhysicalMaterial({
				color: "#0866ff",
				emissive: "#0038c8",
				emissiveIntensity: 0.35,
				metalness: 0.35,
				roughness: 0.22,
				clearcoat: 1,
				clearcoatRoughness: 0.1,
			}),
		[],
	);
	const textMat = useMemo(
		() => new THREE.MeshStandardMaterial({ roughness: 0.5 }),
		[],
	);
	textMat.color.set(textColor);

	const logo = useMemo(() => {
		root.traverse((o) => {
			if (o instanceof THREE.Mesh)
				o.material = o.name.startsWith("Text") ? textMat : logoMat;
		});
		return root.getObjectByName("Logo");
	}, [root, logoMat, textMat]);
	const baseSpin = useMemo(() => logo?.rotation.y ?? 0, [logo]);

	useEffect(() => {
		const onMove = (e: PointerEvent) => {
			pointer.current.x = e.clientX / window.innerWidth - 0.5;
			pointer.current.y = e.clientY / window.innerHeight - 0.5;
		};
		window.addEventListener("pointermove", onMove);
		return () => window.removeEventListener("pointermove", onMove);
	}, []);

	useFrame((state, dt) => {
		// The loop makes one full turn about its vertical axis every SPIN_EVERY seconds
		// (starting on load), easing in and out, and rests in between.
		if (logo && !calm) {
			const t = state.clock.elapsedTime;
			const turn = Math.floor(t / SPIN_EVERY);
			const p = Math.min((t % SPIN_EVERY) / SPIN_DURATION, 1);
			const eased = p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
			logo.rotation.y = baseSpin + (turn + eased) * Math.PI * 2;
		}
		const g = tilt.current;
		if (!g) return;
		const sway = calm ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
		g.rotation.y = THREE.MathUtils.damp(
			g.rotation.y,
			pointer.current.x * 0.5 + sway,
			4,
			dt,
		);
		g.rotation.x = THREE.MathUtils.damp(
			g.rotation.x,
			pointer.current.y * 0.4,
			4,
			dt,
		);
		// Entrance: grow in from nothing.
		g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 1, 3.5, dt));
	});

	return (
		<group ref={tilt} scale={0.001}>
			<primitive object={root} />
		</group>
	);
}

/** The Meta logo from public/Meta.blend, rendered live in three.js. */
export default function MetaLogo3D() {
	const theme = useThemeStore((s) => s.theme);
	const textColor = theme === "dark" ? "#fbf7f7" : "#140a0b";

	return (
		<div className="h-24 min-w-28">
			<Canvas
				dpr={[1, 2]}
				// Measure the untransformed size: the deck scales slides with CSS transforms
				// (stage fit + entrance zoom), which would otherwise shrink the canvas for good.
				resize={{ offsetSize: true }}
				// Far camera + narrow lens: the wide wordmark keeps its size when it tilts
				// toward the camera instead of ballooning past the canvas edge.
				camera={{ position: [0, 0, 8.4], fov: 20 }}
				gl={{ alpha: true, antialias: true }}
			>
				<hemisphereLight args={["#ffffff", "#1a2a6c", 1.1]} />
				<directionalLight position={[3, 4, 5]} intensity={2} />
				<directionalLight
					position={[-4, -2, 3]}
					intensity={0.8}
					color="#7aa7ff"
				/>
				<Suspense fallback={null}>
					<Model textColor={textColor} />
				</Suspense>
			</Canvas>
		</div>
	);
}

useGLTF.preload(MODEL_URL);
