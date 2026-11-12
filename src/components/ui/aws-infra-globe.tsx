/**
 * AwsInfraGlobe: the realistic Globe3D (src/components/ui/3d-globe.tsx) driven step by step
 * to explain the AWS global infrastructure. Every marker is a pin with a round icon badge,
 * like the Globe3D demo, but with an icon per infrastructure type:
 *   0 overview        – every Region (cloud icon), globe spinning
 *   1 regions         – Region codes appear next to the main Regions
 *   2 availability    – camera flies to a hypothetical Region near Algiers and shows its 3 AZs + links
 *   3 edge locations  – camera pulls back, CloudFront edge locations (antenna icon) appear
 *   4 backbone        – animated arcs of the private global network between Regions
 */

import { Building2, Cloud, Radio } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useMemo } from "react";
import {
	Globe3D,
	type GlobeArc,
	type GlobeFocus,
	type GlobeMarker,
} from "@/components/ui/3d-globe";
import { cn } from "@/lib/utils";

export type GlobePhase = 0 | 1 | 2 | 3 | 4;

interface Region {
	code: string;
	name: string;
	lat: number;
	lng: number;
	/** Shown as a label in the "regions" phase (the rest stay as dots to avoid clutter). */
	label?: boolean;
}

/** AWS Regions placed at (roughly) their metro area. */
const REGIONS: Region[] = [
	{
		code: "us-east-1",
		name: "N. Virginia",
		lat: 38.9,
		lng: -77.4,
		label: true,
	},
	{ code: "us-east-2", name: "Ohio", lat: 40.0, lng: -83.0 },
	{ code: "us-west-1", name: "N. California", lat: 37.4, lng: -121.9 },
	{ code: "us-west-2", name: "Oregon", lat: 45.8, lng: -119.7, label: true },
	{ code: "ca-central-1", name: "Canada", lat: 45.5, lng: -73.6 },
	{ code: "mx-central-1", name: "Mexico", lat: 20.6, lng: -100.4 },
	{ code: "sa-east-1", name: "São Paulo", lat: -23.5, lng: -46.6, label: true },
	{ code: "eu-west-1", name: "Ireland", lat: 53.3, lng: -6.3, label: true },
	{ code: "eu-west-2", name: "London", lat: 51.5, lng: -0.1 },
	{ code: "eu-west-3", name: "Paris", lat: 48.9, lng: 2.35 },
	{ code: "eu-central-1", name: "Frankfurt", lat: 50.1, lng: 8.7 },
	{ code: "eu-north-1", name: "Stockholm", lat: 59.3, lng: 18.1 },
	{ code: "eu-south-1", name: "Milan", lat: 45.5, lng: 9.2 },
	{ code: "me-south-1", name: "Bahrain", lat: 26.1, lng: 50.6 },
	{ code: "me-central-1", name: "UAE", lat: 24.5, lng: 54.4, label: true },
	{ code: "af-south-1", name: "Cape Town", lat: -33.9, lng: 18.4, label: true },
	{ code: "ap-south-1", name: "Mumbai", lat: 19.1, lng: 72.9, label: true },
	{
		code: "ap-southeast-1",
		name: "Singapore",
		lat: 1.35,
		lng: 103.8,
		label: true,
	},
	{ code: "ap-southeast-3", name: "Jakarta", lat: -6.2, lng: 106.8 },
	{ code: "ap-east-1", name: "Hong Kong", lat: 22.3, lng: 114.2 },
	{ code: "ap-northeast-1", name: "Tokyo", lat: 35.7, lng: 139.7, label: true },
	{ code: "ap-northeast-2", name: "Seoul", lat: 37.6, lng: 127.0 },
	{ code: "ap-northeast-3", name: "Osaka", lat: 34.7, lng: 135.5 },
	{
		code: "ap-southeast-2",
		name: "Sydney",
		lat: -33.9,
		lng: 151.2,
		label: true,
	},
];

/**
 * Hypothetical Region used for the Availability Zones close-up. AWS has no Region or data
 * centres in Algeria: this one only illustrates how a Region is split into AZs.
 */
const FOCUS: Region = {
	code: "example-dz",
	name: "Algiers",
	lat: 36.75,
	lng: 3.06,
};

/** Its three AZs (illustrative positions, spread out so they read at this zoom). */
const AZS = [
	{ id: "dz-az1", lat: 36.2, lng: 1.2 }, // towards Chlef
	{ id: "dz-az2", lat: 36.15, lng: 5.4 }, // towards Sétif
	{ id: "dz-az3", lat: 34.7, lng: 3.25 }, // towards Djelfa
];
// Every AZ pair is linked by redundant, low-latency fibre.
const AZ_LINKS = AZS.flatMap((a, i) => AZS.slice(i + 1).map((b) => ({ a, b })));

/** A sample of CloudFront edge locations / PoPs. */
const EDGES: [number, number][] = [
	[40.7, -74.0],
	[41.9, -87.6],
	[33.7, -84.4],
	[25.8, -80.2],
	[32.8, -96.8],
	[29.8, -95.4],
	[39.7, -105.0],
	[33.4, -112.1],
	[34.1, -118.2],
	[47.6, -122.3],
	[49.3, -123.1],
	[43.7, -79.4],
	[19.4, -99.1],
	[4.7, -74.1],
	[-12.0, -77.0],
	[-33.4, -70.6],
	[-34.6, -58.4],
	[-22.9, -43.2],
	[40.4, -3.7],
	[41.4, 2.2],
	[38.7, -9.1],
	[52.4, 4.9],
	[50.8, 4.4],
	[48.1, 11.6],
	[52.5, 13.4],
	[47.4, 8.5],
	[48.2, 16.4],
	[52.2, 21.0],
	[50.1, 14.4],
	[60.2, 24.9],
	[55.7, 12.6],
	[59.9, 10.8],
	[41.9, 12.5],
	[37.98, 23.7],
	[41.0, 29.0],
	[30.0, 31.2],
	[6.5, 3.4],
	[-1.3, 36.8],
	[-26.2, 28.0],
	[25.2, 55.3],
	[24.7, 46.7],
	[28.6, 77.2],
	[13.1, 80.3],
	[12.97, 77.6],
	[17.4, 78.5],
	[13.8, 100.5],
	[3.1, 101.7],
	[14.6, 121.0],
	[25.0, 121.5],
	[31.2, 121.5],
	[39.9, 116.4],
	[35.2, 129.1],
	[-37.8, 145.0],
	[-27.5, 153.0],
	[-31.95, 115.9],
	[-36.8, 174.8],
	[21.3, -157.9],
	[61.2, -149.9],
	[64.1, -21.9],
	[53.5, -2.2],
];

/** Private-backbone links drawn in the last phase. */
const BACKBONE: [string, string][] = [
	["us-east-1", "eu-west-1"],
	["us-east-1", "us-west-2"],
	["us-east-1", "sa-east-1"],
	["us-west-2", "ap-northeast-1"],
	["eu-west-1", "eu-central-1"],
	["eu-central-1", "me-central-1"],
	["me-central-1", "ap-south-1"],
	["ap-south-1", "ap-southeast-1"],
	["ap-southeast-1", "ap-northeast-1"],
	["ap-southeast-1", "ap-southeast-2"],
	["eu-west-1", "af-south-1"],
	["us-west-1", "ap-southeast-2"],
];
const byCode = Object.fromEntries(REGIONS.map((r) => [r.code, r]));

/** Badge colours, picked to stand out on the satellite imagery. */
const c = { region: "#e0141e", az: "#2563eb", edge: "#d97706" };

const TEX = `${import.meta.env.BASE_URL}globe/`;

/** Camera per phase (null = free orbit with auto-rotate). */
const FOCUS_BY_PHASE: Record<GlobePhase, GlobeFocus | null> = {
	0: null,
	1: null,
	2: { lat: FOCUS.lat - 0.9, lng: FOCUS.lng, distance: 1.3 },
	3: { lat: 30, lng: -30, distance: 3.5, spin: true },
	4: { lat: 30, lng: -30, distance: 3.5, spin: true },
};

export interface AwsInfraGlobeProps {
	phase: GlobePhase;
	/** Pixel size of the (square) globe. */
	size?: number;
	/** No rotation (overview thumbnails). */
	still?: boolean;
	className?: string;
}

export function AwsInfraGlobe({
	phase,
	size = 560,
	still = false,
	className,
}: AwsInfraGlobeProps) {
	const reduced = useReducedMotion() || still;

	const markers = useMemo<GlobeMarker[]>(() => {
		// In the AZ close-up only the hypothetical Algiers Region is shown.
		const regions = phase === 2 ? [FOCUS] : REGIONS;
		const m: GlobeMarker[] = regions.map((r) => ({
			lat: r.lat,
			lng: r.lng,
			icon: <Cloud />,
			color: c.region,
			size: phase === 2 ? 30 : 22,
			height: phase === 2 ? 1.06 : 1.12,
			label: phase === 2 ? `${r.code} · ${r.name}` : r.code,
			showLabel: phase === 2 || ((phase === 1 || phase === 4) && !!r.label),
		}));
		if (phase === 2)
			m.push(
				...AZS.map((a) => ({
					lat: a.lat,
					lng: a.lng,
					icon: <Building2 />,
					color: c.az,
					size: 22,
					height: 1.02,
					label: a.id,
					showLabel: true,
				})),
			);
		if (phase >= 3)
			m.push(
				// Every other one: enough to show coverage without hiding the map.
				...EDGES.filter((_, i) => i % 2 === 0).map(([lat, lng]) => ({
					lat,
					lng,
					icon: <Radio />,
					color: c.edge,
					size: 14,
					height: 1.04,
					label: "Edge location",
				})),
			);
		return m;
	}, [phase]);

	const arcs = useMemo<GlobeArc[]>(() => {
		if (phase === 2)
			return AZ_LINKS.map(({ a, b }) => ({
				from: a,
				to: b,
				color: "#bfdbfe",
				altitude: 0.02,
			}));
		if (phase === 4)
			return BACKBONE.map(([a, b]) => ({
				from: byCode[a],
				to: byCode[b],
				color: "#fbbf24",
			}));
		return [];
	}, [phase]);

	const config = useMemo(
		() => ({
			textureUrl: `${TEX}earth-blue-marble.jpg`,
			bumpMapUrl: `${TEX}earth-topology.png`,
			showAtmosphere: true,
			atmosphereColor: "#4da6ff",
			atmosphereIntensity: 1.6,
			atmosphereBlur: 3.5,
			minDistance: 2.4,
			bumpScale: 5,
			autoRotateSpeed: reduced ? 0 : 0.4,
			markerSize: 20,
			ambientIntensity: 2,
			pointLightIntensity: 1.2,
		}),
		[reduced],
	);

	return (
		<div
			data-no-nav
			className={cn(
				"relative cursor-grab select-none active:cursor-grabbing",
				className,
			)}
			style={{
				width: size,
				height: size,
				// Round "lens" when zoomed in, so the close-up doesn't show the square canvas edge.
				clipPath: phase === 2 ? "circle(48%)" : "circle(75%)",
				transition: "clip-path 1.2s ease",
			}}
		>
			<Globe3D
				className="h-full w-full"
				markers={markers}
				arcs={arcs}
				focus={FOCUS_BY_PHASE[phase]}
				config={config}
			/>
		</div>
	);
}
