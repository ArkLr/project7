import { motion } from "motion/react";
import { PieCenter, PieChart, PieSlice } from "@/components/ui/charts";
import { cn } from "@/lib/utils";

/** Worldwide cloud infrastructure market share (Synergy Research Group, Q2 2025). */
const chartData = [
	{ label: "AWS", value: 26, color: "var(--accent)" },
	{ label: "Microsoft", value: 19, color: "var(--accent-2)" },
	{
		label: "Google Cloud",
		value: 16,
		color: "color-mix(in oklab, var(--accent) 45%, var(--bg))",
	},
	{
		label: "Others",
		value: 37,
		color: "color-mix(in oklab, var(--muted) 35%, var(--bg))",
	},
];

const ease = [0.22, 1, 0.36, 1] as const;

export const ChartPieCenter = ({ className }: { className?: string }) => (
	<motion.figure
		className={cn(
			"flex items-center gap-5 rounded-2xl border border-dashed border-border bg-surface/80 py-3 pr-3 pl-5 shadow-soft backdrop-blur",
			className,
		)}
		initial={{ opacity: 0, y: -16, scale: 0.94 }}
		animate={{ opacity: 1, y: 0, scale: 1 }}
		transition={{ delay: 0.35, duration: 0.6, ease }}
	>
		<figcaption className="flex flex-col gap-2">
			<span className="text-[12px] font-semibold tracking-[0.12em] text-muted uppercase">
				Cloud infra market share
			</span>
			<ul className="flex flex-col gap-1">
				{chartData.map((d, i) => (
					<motion.li
						key={d.label}
						className="flex items-center gap-2 text-sm"
						initial={{ opacity: 0, x: -12 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.7 + i * 0.1, duration: 0.45, ease }}
					>
						<span
							className="size-2.5 shrink-0 rounded-full"
							style={{ background: d.color }}
						/>
						<span className={i === 0 ? "font-semibold text-fg" : "text-muted"}>
							{d.label}
						</span>
						<span className="ml-auto pl-3 font-mono text-xs tabular-nums text-muted">
							{d.value}%
						</span>
					</motion.li>
				))}
			</ul>
			<span className="text-[10px] text-muted/70">
				Synergy Research, Q3 2026
			</span>
		</figcaption>

		<PieChart
			ariaLabel="Cloud infrastructure market share"
			data={chartData}
			innerRadius={44}
			size={136}
			padAngle={0.03}
			cornerRadius={0}
			hoverOffset={6}
			enterTransition={{ duration: 1.2, ease }}
		>
			{chartData.map((d, index) => (
				<PieSlice index={index} key={d.label} color={d.color} showGlow />
			))}
			<PieCenter>
				{({ value, label, isHovered }) => (
					<div className="flex flex-col items-center leading-none">
						<span className="font-display text-lg font-semibold text-fg tabular-nums">
							{isHovered ? `${value}%` : "30%"}
						</span>
						<span className="mt-1 text-[10px] text-muted">
							{isHovered ? label : "AWS"}
						</span>
					</div>
				)}
			</PieCenter>
		</PieChart>
	</motion.figure>
);

export default ChartPieCenter;
