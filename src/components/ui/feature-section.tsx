import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { cn } from "@/lib/utils";
import { DecorIcon } from "./decor-icon";
import { GridPattern } from "./grid-pattern";

export type Feature = {
	icon: LucideIcon;
	title: string;
	text: string;
};

/**
 * Blueprint-style feature card: hairline borders that run past the card,
 * "+" corner marks, a masked grid in the corner and an accent glow that
 * follows the cursor. Uses the deck's theme tokens so it works in light and dark.
 */
export function FeatureCard({
	feature,
	index = 0,
	className,
	...props
}: React.ComponentProps<"div"> & { feature: Feature; index?: number }) {
	const { icon: Icon, title, text } = feature;

	const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const r = e.currentTarget.getBoundingClientRect();
		e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
		e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
	};

	return (
		<div
			onMouseMove={onMove}
			className={cn(
				"group relative flex h-full flex-col gap-8 bg-surface px-7 pt-8 pb-7",
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

			{/* Corner marks — drift outward and light up on hover */}
			<DecorIcon
				position="top-left"
				className="size-4 transition-[translate,stroke] duration-300 group-hover:-translate-x-[calc(50%+3px)] group-hover:-translate-y-[calc(50%+3px)] group-hover:stroke-accent"
			/>
			<DecorIcon
				position="bottom-right"
				className="size-4 transition-[translate,stroke] duration-300 group-hover:translate-x-[calc(50%+3px)] group-hover:translate-y-[calc(50%+3px)] group-hover:stroke-accent"
			/>

			{/* Masked grid in the top-right corner, with a few filled cells */}
			<div className="pointer-events-none absolute top-0 right-0 h-36 w-52 max-w-full overflow-hidden mask-[radial-gradient(farthest-side_at_top_right,white,transparent)]">
				<GridPattern
					width={24}
					height={24}
					x={-1}
					y={-1}
					squares={squaresFor(index)}
					className="fill-accent/10 stroke-fg/10 transition-[fill] duration-500 group-hover:fill-accent/25"
				/>
			</div>

			{/* Cursor spotlight */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background:
						"radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
				}}
			/>

			<div className="relative z-10 flex items-start justify-between">
				<motion.div
					className="flex w-fit items-center justify-center rounded-xl border border-border bg-bg/70 p-3 shadow-soft backdrop-blur-sm transition-colors duration-300 group-hover:border-accent/50"
					initial={{ scale: 0, rotate: -60 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{
						type: "spring",
						stiffness: 220,
						damping: 14,
						delay: 0.6 + index * 0.1,
					}}
					whileHover={{ rotate: 12, scale: 1.12 }}
				>
					<Icon className="size-6 text-accent" strokeWidth={1.6} />
				</motion.div>
				<span className="font-mono text-sm text-muted/70 transition-colors duration-300 group-hover:text-accent">
					{String(index + 1).padStart(2, "0")}
				</span>
			</div>

			<div className="relative z-10 mt-auto space-y-2">
				<h3 className="font-display text-xl font-semibold leading-tight">
					{title}
				</h3>
				<p className="text-base leading-relaxed text-muted">{text}</p>
			</div>

			{/* Accent underline that grows on hover */}
			<span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2 transition-transform duration-500 group-hover:scale-x-100" />
		</div>
	);
}

/** Deterministic filled cells so the pattern doesn't reshuffle on every render. */
function squaresFor(seed: number): Array<[number, number]> {
	const cells: Array<[number, number]> = [];
	let s = seed * 9301 + 49297;
	for (let i = 0; i < 4; i++) {
		s = (s * 9301 + 49297) % 233280;
		const x = 3 + (s % 6);
		s = (s * 9301 + 49297) % 233280;
		const y = s % 4;
		cells.push([x, y]);
	}
	return cells;
}
