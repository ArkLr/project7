"use client";
import React, {
	useRef,
	useMemo,
	useState,
	useCallback,
	Suspense,
	type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker {
	lat: number;
	lng: number;
	/** Image shown in the round badge (ignored when `icon` is set). */
	src?: string;
	/** Any React node (e.g. a lucide icon) shown in the round badge instead of an image. */
	icon?: ReactNode;
	label?: string;
	/** Show `label` as a tag next to the badge. */
	showLabel?: boolean;
	/** Badge diameter in px (default: config.markerSize). */
	size?: number;
	/** Badge background + pin colour. */
	color?: string;
	/** Pin height as a factor of the globe radius (default 1.18). */
	height?: number;
}

export interface GlobeArc {
	from: { lat: number; lng: number };
	to: { lat: number; lng: number };
	color?: string;
	/** Peak height above the surface, as a factor of the radius (default: scales with distance). */
	altitude?: number;
}

export interface GlobeFocus {
	lat: number;
	lng: number;
	/** Camera distance from the globe centre, as a factor of the radius (default 3.5). */
	distance?: number;
	/** Keep auto-rotating once the camera has arrived (default false). */
	spin?: boolean;
}

export interface Globe3DConfig {
	/** Globe radius */
	radius?: number;
	/** Globe base color (used as fallback or tint) */
	globeColor?: string;
	/** URL to the Earth texture map */
	textureUrl?: string;
	/** URL to the bump/elevation map for terrain */
	bumpMapUrl?: string;
	/** Whether to show atmosphere glow */
	showAtmosphere?: boolean;
	/** Atmosphere color */
	atmosphereColor?: string;
	/** Atmosphere intensity */
	atmosphereIntensity?: number;
	/** Atmosphere blur/softness (higher = more diffuse, default 3) */
	atmosphereBlur?: number;
	/** Terrain bump scale (0 = flat, higher = more pronounced) */
	bumpScale?: number;
	/** Auto rotate speed (0 = disabled) */
	autoRotateSpeed?: number;
	/** Enable zoom */
	enableZoom?: boolean;
	/** Enable pan */
	enablePan?: boolean;
	/** Min zoom distance */
	minDistance?: number;
	/** Max zoom distance */
	maxDistance?: number;
	/** Initial rotation */
	initialRotation?: { x: number; y: number };
	/** Marker default size */
	markerSize?: number;
	/** Show wireframe overlay */
	showWireframe?: boolean;
	/** Wireframe color */
	wireframeColor?: string;
	/** Ambient light intensity */
	ambientIntensity?: number;
	/** Point light intensity */
	pointLightIntensity?: number;
	/** Background color (null for transparent) */
	backgroundColor?: string | null;
}

interface Globe3DProps {
	/** Array of markers to display on the globe */
	markers?: GlobeMarker[];
	/** Globe configuration */
	config?: Globe3DConfig;
	/** Additional CSS classes */
	className?: string;
	/** Callback when a marker is clicked */
	onMarkerClick?: (marker: GlobeMarker) => void;
		/** Callback when a marker is hovered */
	onMarkerHover?: (marker: GlobeMarker | null) => void;
	/** Curved, animated lines drawn between two points on the globe. */
	arcs?: GlobeArc[];
	/** Fly the camera to look at this point (null = free orbit / auto-rotate). */
	focus?: GlobeFocus | null;
}

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
	"https://cdn.21st.dev/assets/localized/228deba2e4b600146bdcb6cfa359b8ead6aacc2b1c13550a29cd82824cfa1c01.jpg";
const DEFAULT_BUMP_TEXTURE =
	"https://cdn.21st.dev/assets/localized/839b12da2e4dd346b256cebae72e10c479a102c8980a22084c41275e4b9a0e12.png";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(
	lat: number,
	lng: number,
	radius: number,
): THREE.Vector3 {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);

	const x = -(radius * Math.sin(phi) * Math.cos(theta));
	const z = radius * Math.sin(phi) * Math.sin(theta);
	const y = radius * Math.cos(phi);

	return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Marker Component (static - rotation handled by parent group)
// ============================================================================

interface MarkerProps {
	marker: GlobeMarker;
	radius: number;
	defaultSize: number;
	onClick?: (marker: GlobeMarker) => void;
	onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({
	marker,
	radius,
	defaultSize,
	onClick,
	onHover,
}: MarkerProps) {
	// Badge diameter in screen px (config.markerSize below 1 is the old world-unit default → 8px).
	const px = marker.size ?? (defaultSize >= 1 ? defaultSize : 8);
	const [hovered, setHovered] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const groupRef = useRef<THREE.Group>(null);
	const imageGroupRef = useRef<THREE.Group>(null);
	const { camera } = useThree();

	// Surface position (where the line starts)
	const surfacePosition = useMemo(() => {
		return latLngToVector3(marker.lat, marker.lng, radius * 1.001);
	}, [marker.lat, marker.lng, radius]);

	// Top of the line (where the image is) - positioned further out to prevent going inside globe
	const topPosition = useMemo(() => {
				return latLngToVector3(marker.lat, marker.lng, radius * (marker.height ?? 1.18));
	}, [marker.lat, marker.lng, marker.height, radius]);

	const lineHeight = topPosition.distanceTo(surfacePosition);

	// Check if marker is facing the camera
	useFrame(() => {
		if (!imageGroupRef.current) return;

		// Get the world position of the image (the positioned element)
		const worldPos = new THREE.Vector3();
		imageGroupRef.current.getWorldPosition(worldPos);

		// Direction from globe center (0,0,0) to marker
		const markerDirection = worldPos.clone().normalize();

		// Direction from globe center to camera
		const cameraDirection = camera.position.clone().normalize();

		// Dot product: positive means facing camera, negative means behind
		const dot = markerDirection.dot(cameraDirection);

		// Show marker only if it's facing the camera (stricter threshold)
		setIsVisible(dot > 0.1);
	});

	const handlePointerEnter = useCallback(() => {
		setHovered(true);
		onHover?.(marker);
	}, [marker, onHover]);

	const handlePointerLeave = useCallback(() => {
		setHovered(false);
		onHover?.(null);
	}, [onHover]);

	const handleClick = useCallback(() => {
		onClick?.(marker);
	}, [marker, onClick]);

	// Calculate line center and orientation
	const { lineCenter, lineQuaternion } = useMemo(() => {
		const center = surfacePosition.clone().lerp(topPosition, 0.5);

		// Calculate rotation to align cylinder with the direction from surface to top
		const direction = topPosition.clone().sub(surfacePosition).normalize();
		const quaternion = new THREE.Quaternion();
		quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

		return { lineCenter: center, lineQuaternion: quaternion };
	}, [surfacePosition, topPosition]);

	return (
		<group ref={groupRef} visible={isVisible}>
			{/* Pin line from surface to image - properly oriented */}
			<mesh position={lineCenter} quaternion={lineQuaternion}>
				<cylinderGeometry args={[0.003, 0.003, lineHeight, 8]} />
				<meshBasicMaterial
					color={hovered ? "#ffffff" : "#94a3b8"}
					transparent
					opacity={hovered ? 0.9 : 0.6}
				/>
			</mesh>

			{/* Pin point at the surface */}
			<mesh position={surfacePosition} quaternion={lineQuaternion}>
				<coneGeometry args={[0.015, 0.04, 8]} />
				<meshBasicMaterial color={hovered ? "#f97316" : (marker.color ?? "#ef4444")} />
			</mesh>

			{/* Circular image at the top */}
			<group ref={imageGroupRef} position={topPosition}>
				<Html
					center
					style={{
						pointerEvents: isVisible ? "auto" : "none",
						opacity: isVisible ? 1 : 0,
						transition: "opacity 0.15s ease-out",
					}}
				>
					<div className="relative">
						<div
							className={cn(
								"flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-neutral-900 text-white shadow-lg transition-transform duration-200 [&>svg]:size-[62%]",
								marker.icon && "ring-1 ring-white/80",
								hovered && "scale-125 shadow-xl ring-1 ring-white/50",
							)}
							style={{
								width: `${px}px`,
								height: `${px}px`,
								background: marker.color,
							}}
							title={marker.label}
							onMouseEnter={handlePointerEnter}
							onMouseLeave={handlePointerLeave}
							onClick={handleClick}
						>
							{marker.icon ??
								(marker.src && (
									<img
										src={marker.src}
										alt={marker.label || "Marker"}
										className="h-full w-full object-cover"
										draggable={false}
									/>
								))}
						</div>
						{marker.showLabel && marker.label && (
							<span
								className="absolute top-1/2 left-full -translate-y-1/2 whitespace-nowrap bg-neutral-950/80 font-mono text-white"
								style={{
									fontSize: `${Math.max(10, px * 0.5)}px`,
									lineHeight: 1.5,
									marginLeft: 4,
									padding: "0 5px",
									borderRadius: 4,
								}}
							>
								{marker.label}
							</span>
						)}
					</div>
				</Html>
			</group>
		</group>
	);
}

// ============================================================================
// Rotating Globe with Markers (all rotate together)
// ============================================================================

interface RotatingGlobeProps {
	config: Required<Globe3DConfig>;
	markers: GlobeMarker[];
	arcs: GlobeArc[];
	onMarkerClick?: (marker: GlobeMarker) => void;
	onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function RotatingGlobe({
	config,
	markers,
	arcs,
	onMarkerClick,
	onMarkerHover,
}: RotatingGlobeProps) {
	const groupRef = useRef<THREE.Group>(null);

	// Load Earth textures
	const [earthTexture, bumpTexture] = useTexture([
		config.textureUrl,
		config.bumpMapUrl,
	]);

	// Configure textures
	useMemo(() => {
		if (earthTexture) {
			earthTexture.colorSpace = THREE.SRGBColorSpace;
			earthTexture.anisotropy = 16;
		}
		if (bumpTexture) {
			bumpTexture.anisotropy = 8;
		}
	}, [earthTexture, bumpTexture]);

	// Create geometries
	const geometry = useMemo(() => {
		return new THREE.SphereGeometry(config.radius, 64, 64);
	}, [config.radius]);

	const wireframeGeometry = useMemo(() => {
		return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
	}, [config.radius]);

	return (
		<group ref={groupRef}>
			{/* Main globe mesh with Earth texture */}
			<mesh geometry={geometry}>
				<meshStandardMaterial
					map={earthTexture}
					bumpMap={bumpTexture}
					bumpScale={config.bumpScale * 0.05}
					roughness={0.7}
					metalness={0.0}
				/>
			</mesh>

			{/* Wireframe overlay */}
			{config.showWireframe && (
				<mesh geometry={wireframeGeometry}>
					<meshBasicMaterial
						color={config.wireframeColor}
						wireframe
						transparent
						opacity={0.08}
					/>
				</mesh>
			)}

			{/* Arcs */}
			{arcs.map((arc, index) => (
				<Arc key={`arc-${index}`} arc={arc} radius={config.radius} />
			))}

			{/* Markers - now inside the rotating group */}
			{markers.map((marker, index) => (
				<Marker
					key={`marker-${index}-${marker.lat}-${marker.lng}`}
					marker={marker}
					radius={config.radius}
					defaultSize={config.markerSize}
					onClick={onMarkerClick}
					onHover={onMarkerHover}
				/>
			))}
		</group>
	);
}

// ============================================================================
// Arc Component (great-circle curve lifted off the surface, with flowing dashes)
// ============================================================================

function Arc({ arc, radius }: { arc: GlobeArc; radius: number }) {
	const ref = useRef<{ material: { dashOffset: number } } | null>(null);

	const points = useMemo(() => {
		const a = latLngToVector3(arc.from.lat, arc.from.lng, 1);
		const b = latLngToVector3(arc.to.lat, arc.to.lng, 1);
		const lift = arc.altitude ?? Math.min(0.45, a.angleTo(b) * 0.22);
		const pts: THREE.Vector3[] = [];
		for (let i = 0; i <= 64; i++) {
			const t = i / 64;
			const dir = a.clone().lerp(b, t).normalize();
			pts.push(dir.multiplyScalar(radius * (1.004 + Math.sin(t * Math.PI) * lift)));
		}
		return pts;
	}, [arc, radius]);

	useFrame((_, dt) => {
		if (ref.current) ref.current.material.dashOffset -= dt * 0.5;
	});

	return (
		<Line
			// drei's Line2 type is awkward to name; we only touch material.dashOffset.
			ref={ref as never}
			points={points}
			color={arc.color ?? "#ffffff"}
			lineWidth={1.6}
			dashed
			dashSize={0.1}
			gapSize={0.05}
			transparent
			opacity={0.9}
		/>
	);
}

// ============================================================================
// Camera Rig (flies to `focus`, then hands control back to OrbitControls)
// ============================================================================

function CameraRig({
	focus,
	radius,
}: {
	focus: GlobeFocus | null;
	radius: number;
}) {
	const { camera } = useThree();
	const controls = useThree((s) => s.controls) as { update(): void } | null;
	const flying = useRef(false);
	/** Direction to fly towards; null = keep the current direction (just zoom back out). */
	const targetDir = useRef<THREE.Vector3 | null>(null);
	const targetDist = useRef(radius * 3.5);

	React.useEffect(() => {
		if (focus) {
			targetDir.current = latLngToVector3(focus.lat, focus.lng, 1);
			targetDist.current = radius * (focus.distance ?? 3.5);
		} else {
			// Focus cleared: return to the default orbit distance from wherever we are.
			targetDir.current = null;
			targetDist.current = radius * 3.5;
		}
		flying.current = true;
	}, [focus, radius]);

	useFrame((_, dt) => {
		if (!flying.current) return;
		const k = 1 - Math.exp(-dt * 2.5);
		// Move direction and distance separately so the camera arcs around the globe, not through it.
		const dir = camera.position.clone().normalize();
		const dirDone = !targetDir.current || dir.angleTo(targetDir.current) < 0.002;
		if (targetDir.current) dir.lerp(targetDir.current, k).normalize();
		const dist = THREE.MathUtils.lerp(camera.position.length(), targetDist.current, k);
		camera.position.copy(dir.multiplyScalar(dist));
		camera.lookAt(0, 0, 0);
		controls?.update();
		if (dirDone && Math.abs(dist - targetDist.current) < 0.005) flying.current = false;
	});

	return null;
}

// ============================================================================
// Atmosphere Component (stays static - doesn't rotate)
// ============================================================================

interface AtmosphereProps {
	radius: number;
	color: string;
	intensity: number;
	blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
	// blur controls the fresnel exponent: lower = more diffuse, higher = sharper edge
	// We invert it so higher blur value = more diffuse (lower exponent)
	const fresnelPower = Math.max(0.5, 5 - blur);

	const atmosphereMaterial = useMemo(() => {
		return new THREE.ShaderMaterial({
			uniforms: {
				atmosphereColor: { value: new THREE.Color(color) },
				intensity: { value: intensity },
				fresnelPower: { value: fresnelPower },
			},
			vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          // Back faces of a slightly larger shell: strongest next to the globe, fading to 0 at the outer rim.
          float rim = abs(dot(vNormal, normalize(-vPosition)));
          gl_FragColor = vec4(atmosphereColor, clamp(pow(rim, fresnelPower) * intensity, 0.0, 1.0));
        }
      `,
			side: THREE.BackSide,
			transparent: true,
			depthWrite: false,
		});
	}, [color, intensity, fresnelPower]);

	return (
		<mesh scale={[1.12, 1.12, 1.12]}>
			<sphereGeometry args={[radius, 64, 32]} />
			<primitive object={atmosphereMaterial} attach="material" />
		</mesh>
	);
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
	markers: GlobeMarker[];
	arcs: GlobeArc[];
	focus: GlobeFocus | null;
	config: Required<Globe3DConfig>;
	onMarkerClick?: (marker: GlobeMarker) => void;
	onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function Scene({
	markers,
	arcs,
	focus,
	config,
	onMarkerClick,
	onMarkerHover,
}: SceneProps) {
	const { camera } = useThree();

	// Set initial camera position (pulled back to accommodate markers)
	React.useEffect(() => {
		camera.position.set(0, 0, config.radius * 3.5);
		camera.lookAt(0, 0, 0);
	}, [camera, config.radius]);

	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={config.ambientIntensity} />
			<directionalLight
				position={[config.radius * 5, config.radius * 2, config.radius * 5]}
				intensity={config.pointLightIntensity}
				color="#ffffff"
			/>
			<directionalLight
				position={[-config.radius * 3, config.radius, -config.radius * 2]}
				intensity={config.pointLightIntensity * 0.3}
				color="#88ccff"
			/>

			{/* Rotating Globe with Markers */}
			<RotatingGlobe
				config={config}
				markers={markers}
				arcs={arcs}
				onMarkerClick={onMarkerClick}
				onMarkerHover={onMarkerHover}
			/>

			{/* Atmosphere (static) */}
			{config.showAtmosphere && (
				<Atmosphere
					radius={config.radius}
					color={config.atmosphereColor}
					intensity={config.atmosphereIntensity}
					blur={config.atmosphereBlur}
				/>
			)}

			<CameraRig focus={focus} radius={config.radius} />

			{/* Controls */}
			<OrbitControls
				makeDefault
				enablePan={config.enablePan}
				enableZoom={config.enableZoom}
				minDistance={config.minDistance}
				maxDistance={config.maxDistance}
				rotateSpeed={0.4}
				autoRotate={config.autoRotateSpeed > 0 && (!focus || !!focus.spin)}
				autoRotateSpeed={config.autoRotateSpeed}
				enableDamping
				dampingFactor={0.1}
			/>
		</>
	);
}

// ============================================================================
// Loading Fallback
// ============================================================================

function LoadingFallback() {
	return (
		<Html center>
			<div className="flex shrink-0 flex-col items-center gap-3">
				<span className="inline-block shrink-0 text-sm text-neutral-400">
					Loading globe...
				</span>
			</div>
		</Html>
	);
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
	radius: 2,
	globeColor: "#1a1a2e",
	textureUrl: DEFAULT_EARTH_TEXTURE,
	bumpMapUrl: DEFAULT_BUMP_TEXTURE,
	showAtmosphere: false,
	atmosphereColor: "#4da6ff",
	atmosphereIntensity: 0.5,
	atmosphereBlur: 2,
	bumpScale: 1,
	autoRotateSpeed: 0.3,
	enableZoom: false,
	enablePan: false,
	minDistance: 5,
	maxDistance: 15,
	initialRotation: { x: 0, y: 0 },
	markerSize: 0.06,
	showWireframe: false,
	wireframeColor: "#4a9eff",
	ambientIntensity: 0.6,
	pointLightIntensity: 1.5,
	backgroundColor: null,
};

const NO_ARCS: GlobeArc[] = [];

export function Globe3D({
	markers = [],
	arcs = NO_ARCS,
	focus = null,
	config = {},
	className,
	onMarkerClick,
	onMarkerHover,
}: Globe3DProps) {
	const mergedConfig = useMemo(
		() => ({ ...defaultConfig, ...config }),
		[config],
	);

	return (
		<div className={cn("relative h-[500px] w-full", className)}>
			<Canvas
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: "high-performance",
				}}
				dpr={[1, 2]}
				resize={{ offsetSize: true }}
				camera={{
					fov: 45,
					near: 0.1,
					far: 1000,
					position: [0, 0, mergedConfig.radius * 3.5],
				}}
				style={{
					background: mergedConfig.backgroundColor || "transparent",
				}}
			>
				<Suspense fallback={<LoadingFallback />}>
					<Scene
						markers={markers}
						arcs={arcs}
						focus={focus}
						config={mergedConfig}
						onMarkerClick={onMarkerClick}
						onMarkerHover={onMarkerHover}
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}

// export default Globe3D;

// "use client";
// import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";

// const sampleMarkers: GlobeMarker[] = [
//   {
//     lat: 40.7128,
//     lng: -74.006,
//     src: "https://cdn.21st.dev/assets/localized/9330b299938127244aa249ee03c095db066c29c3545aebcc61662ed5499003e9.webp",
//     label: "New York",
//   },
//   {
//     lat: 51.5074,
//     lng: -0.1278,
//     src: "https://cdn.21st.dev/assets/localized/39f1e89e5596050671d2c5e43247556682b6501fdc26a72514c1b6b27aca1040.webp",
//     label: "London",
//   },
//   {
//     lat: 35.6762,
//     lng: 139.6503,
//     src: "https://cdn.21st.dev/assets/localized/d2f606dd20ae0f042b33801d94e64ebede24d0881c18518f027e75871c46db24.webp",
//     label: "Tokyo",
//   },
//   {
//     lat: -33.8688,
//     lng: 151.2093,
//     src: "https://cdn.21st.dev/assets/localized/db3a4fbabb256c7ddb62896ba874be07f89dcce5ec82dbf31f0d29241a089c0d.webp",
//     label: "Sydney",
//   },
//   {
//     lat: 48.8566,
//     lng: 2.3522,
//     src: "https://cdn.21st.dev/assets/localized/517863093d43d51285cbb156a97a13dbb8a4da2178336e63fb84a2f9dff31721.webp",
//     label: "Paris",
//   },
//   {
//     lat: 28.6139,
//     lng: 77.209,
//     src: "https://cdn.21st.dev/assets/localized/a6b7394b90e0f93c7a07e26b63fc927bb6b4c361474f508b3902196d30ec29d9.webp",
//     label: "New Delhi",
//   },
//   {
//     lat: 55.7558,
//     lng: 37.6173,
//     src: "https://cdn.21st.dev/assets/localized/ddf108b39535f3be69c96dae3c31c69ed9ba282766c8543c5ff78dd4edc7755e.webp",
//     label: "Moscow",
//   },
//   {
//     lat: -22.9068,
//     lng: -43.1729,
//     src: "https://cdn.21st.dev/assets/localized/ee638b072758424ef4dc58adbf6d24d95d562f371b5d5660e3cf4682507f9b21.webp",
//     label: "Rio de Janeiro",
//   },
//   {
//     lat: 31.2304,
//     lng: 121.4737,
//     src: "https://cdn.21st.dev/assets/localized/d74859654f1bfc3e0258b9b7e519319287c3f6e4c0c8cebfd42dec18c33f747c.webp",
//     label: "Shanghai",
//   },
//   {
//     lat: 25.2048,
//     lng: 55.2708,
//     src: "https://cdn.21st.dev/assets/localized/8e5396313325182ff85d1229a80fdff6351d6e9d18a74ba7a202cefdba9eb840.webp",
//     label: "Dubai",
//   },
//   {
//     lat: -34.6037,
//     lng: -58.3816,
//     src: "https://cdn.21st.dev/assets/localized/4270ec0a3fab31d664d1febae5f74fb06603099fa8476feb7367dec5f04ecb57.webp",
//     label: "Buenos Aires",
//   },
//   {
//     lat: 1.3521,
//     lng: 103.8198,
//     src: "https://cdn.21st.dev/assets/localized/276d61dd498c0836991acd0d78c3e588dfe2396ac209eadd76f7e610588d473e.webp",
//     label: "Singapore",
//   },
//   {
//     lat: 37.5665,
//     lng: 126.978,
//     src: "https://cdn.21st.dev/assets/localized/4134f3dcc459b74f84d65c239bccbf6532920d950a1ee11e3c2a738f9d455be5.webp",
//     label: "Seoul",
//   },
// ];

// export default function Globe3DDemo() {
//   return (
//     <div className="h-screen w-full">
//       <Globe3D
//         className="h-full w-full"
//         markers={sampleMarkers}
//         config={{
//           atmosphereColor: "#4da6ff",
//           atmosphereIntensity: 20,
//           bumpScale: 5,
//           autoRotateSpeed: 0.3,
//         }}
//         onMarkerClick={(marker) => {
//           console.log("Clicked marker:", marker.label);
//         }}
//         onMarkerHover={(marker) => {
//           if (marker) {
//             console.log("Hovering:", marker.label);
//           }
//         }}
//       />
//     </div>
//   );
// }
