import { cn } from "@/lib/utils";
import type React from "react";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
	ZapIcon,
	CpuIcon,
	FingerprintIcon,
	PencilIcon,
	Settings2Icon,
	SparklesIcon,
} from "lucide-react";

type FeatureType = {
	title: string;
	icon: React.ReactNode;
	description: string;
};

// Deterministic filled cells for the corner grid, varied per card.
function squaresFor(index: number): [number, number][] {
	const sets: [number, number][][] = [
		[
			[1, 1],
			[3, 0],
			[4, 2],
			[6, 1],
		],
		[
			[0, 2],
			[2, 1],
			[5, 0],
			[6, 2],
		],
		[
			[1, 0],
			[3, 2],
			[5, 1],
			[7, 0],
		],
	];
	return sets[index % sets.length];
}

function DecorIcon({
	position,
	className,
}: {
	position: "top-left" | "bottom-right";
	className?: string;
}) {
	const pos = position === "top-left" ? "-top-2 -left-2" : "-bottom-2 -right-2";
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden
			className={cn("absolute stroke-border", pos, className)}
		>
			<path d="M8 1v14M1 8h14" strokeWidth={1} />
		</svg>
	);
}

export function FeatureSection() {
	return (
		<div className="mx-auto w-full h-full max-w-5xl flex flex-col justify-center space-y-8">
			<div className="max-w-3xl">
				<h2 className="font-heading text-balance font-medium text-2xl md:text-4xl lg:text-5xl">
					Current trends
				</h2>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
				{features.map((feature, i) => (
					<FeatureCard feature={feature} index={i} key={feature.title} />
				))}
			</div>
		</div>
	);
}

export function FeatureCard({
	feature,
	index = 0,
	className,
	...props
}: React.ComponentProps<"div"> & { feature: FeatureType; index?: number }) {
	return (
		<div
			className={cn(
				"relative flex h-full flex-col gap-8 bg-background px-7 pt-8 pb-7",
				"bg-[radial-gradient(60%_80%_at_20%_0%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent)]",
				className,
			)}
			{...props}
		>
			{/* Extended hairlines: neighbouring cards' lines cross into a blueprint grid */}
			<div className="absolute -inset-y-4 -left-px w-px bg-border" />
			<div className="absolute -inset-y-4 -right-px w-px bg-border" />
			<div className="absolute -inset-x-4 -top-px h-px bg-border" />
			<div className="absolute -inset-x-4 -bottom-px h-px bg-border" />

			{/* Corner marks */}
			<DecorIcon position="top-left" className="size-4" />
			<DecorIcon position="bottom-right" className="size-4" />

			{/* Masked grid in the top-right corner, with a few filled cells */}
			<div className="pointer-events-none absolute top-0 right-0 h-36 w-52 max-w-full overflow-hidden mask-[radial-gradient(farthest-side_at_top_right,white,transparent)]">
				<GridPattern
					width={24}
					height={24}
					x={-1}
					y={-1}
					squares={squaresFor(index)}
					className="fill-accent/10 stroke-foreground/10"
				/>
			</div>

			<div className="relative z-10 flex items-start justify-between">
				<div className="flex w-fit items-center justify-center rounded-xl border border-border bg-background/70 p-3 shadow-sm backdrop-blur-sm [&_svg]:size-6 [&_svg]:text-accent">
					{feature.icon}
				</div>
				<span className="font-mono text-sm text-muted-foreground/70">
					{String(index + 1).padStart(2, "0")}
				</span>
			</div>

			<div className="relative z-10 mt-auto space-y-2">
				<h3 className="font-heading text-xl font-semibold leading-tight">
					{feature.title}
				</h3>
				<p className="text-base leading-relaxed text-muted-foreground">
					{feature.description}
				</p>
			</div>
		</div>
	);
}

const features: FeatureType[] = [
	{
		title: "AI and GPUs",
		icon: <ZapIcon />,
		description:
			"Meta has described clusters of 24,576 NVIDIA H100 GPUs for generative AI.",
	},
	{
		title: "Custom processors",
		icon: <CpuIcon />,
		description: "AWS Graviton, Trainium and Inferentia; Meta MTIA.",
	},
	{
		title: "Energy efficiency",
		icon: <FingerprintIcon />,
		description:
			"Efficient chips, advanced and liquid cooling, renewable energy.",
	},
	{
		title: "Edge computing",
		icon: <PencilIcon />,
		description:
			"Process data near its source: lower latency and network traffic.",
	},
	{
		title: "High-speed networking",
		icon: <Settings2Icon />,
		description:
			"Ethernet, InfiniBand, RDMA and optical links. Meta’s October 2026 OCP news includes liquid-cooled network gear.",
	},
	{
		title: "Disaggregation",
		icon: <SparklesIcon />,
		description:
			"Separating compute, memory and storage so each can scale on its own.",
	},
];
