import type { LucideIcon } from "lucide-react";
import { Building2, Layers, Network, Radio, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import { Slide, Step, useSlideContext } from "@/components/deck";
import { useStepContext } from "@/components/deck/context";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";

/** The path one request takes through Meta's infrastructure. Each → press moves it one hop. */
const HOPS: {
	icon: LucideIcon;
	title: string;
	stat: string;
	text: string;
	chips: string[];
}[] = [
	{
		icon: Radio,
		title: "Edge PoPs & caches",
		stat: "Close to users",
		text: "Points of presence and Meta cache servers placed inside ISPs answer most photo and video requests locally.",
		chips: ["PoP", "ISP cache", "TLS"],
	},
	{
		icon: Network,
		title: "Private backbone",
		stat: "Express Backbone",
		text: "Meta-owned fibre links edge sites and data centers, so traffic between them stays off the public internet.",
		chips: ["Fibre", "Subsea cables"],
	},
	{
		icon: Building2,
		title: "Data center fabric",
		stat: "20+ owned campuses",
		text: "Each building is a mesh of identical racks and switches (the F16 fabric). Many paths, so one failure doesn't matter.",
		chips: ["Racks", "Spine switches"],
	},
	{
		icon: Layers,
		title: "Service stack",
		stat: "Shared by all apps",
		text: "Web servers build the page, TAO and Memcache serve the social graph from memory, MySQL keeps the data.",
		chips: ["Web", "TAO", "Memcache", "MySQL"],
	},
];

const NODES = [
	{ icon: Smartphone, title: "User", chips: ["Facebook", "Instagram", "WhatsApp"] },
	...HOPS,
];

const ROW = 104; // px between node centres in the diagram
const ease = [0.22, 1, 0.36, 1] as const;

function RequestPath({ phase, still }: { phase: number; still: boolean }) {
	return (
		<div className="relative w-[440px]" style={{ height: ROW * (NODES.length - 1) + 64 }}>
			{/* Track and the part of it the request has already travelled */}
			<div className="absolute top-8 left-8 w-px border-l border-dashed border-border" style={{ height: ROW * (NODES.length - 1) }} />
			<motion.div
				className="absolute top-8 left-8 w-0.5 -translate-x-px bg-accent"
				initial={false}
				animate={{ height: ROW * phase }}
				transition={{ duration: still ? 0 : 0.7, ease }}
			/>
			{/* The request */}
			<motion.div
				className="absolute left-8 z-[5] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_18px_var(--accent)]"
				initial={false}
				animate={{ top: 32 + ROW * phase }}
				transition={{ duration: still ? 0 : 0.7, ease }}
			/>

			{NODES.map(({ icon: Icon, title, chips }, i) => {
				const reached = i <= phase;
				const active = i === phase;
				return (
					<div key={title} className="absolute left-0 flex w-full items-center gap-5" style={{ top: ROW * i }}>
						<div
							className={cn(
								"relative z-10 grid size-16 shrink-0 place-items-center rounded-2xl border bg-surface transition-colors duration-500",
								active ? "border-accent shadow-soft" : reached ? "border-accent/40" : "border-border",
							)}
						>
							<Icon className={cn("size-7 transition-colors duration-500", reached ? "text-accent" : "text-muted/60")} />
						</div>
						<div className={cn("transition-opacity duration-500", reached ? "opacity-100" : "opacity-40")}>
							<p className="font-display text-lg font-semibold">{title}</p>
							<div className="mt-1 flex flex-wrap gap-1.5">
								{chips.map((c, k) => (
									<motion.span
										key={c}
										className={cn(
											"rounded-md border px-2 py-0.5 font-mono text-[11px]",
											active ? "border-accent/40 text-accent-2" : "border-border text-muted",
										)}
										initial={false}
										animate={active && !still ? { y: [0, -3, 0] } : { y: 0 }}
										transition={{ delay: 0.5 + k * 0.08, duration: 0.4 }}
									>
										{c}
									</motion.span>
								))}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export function MetaRequestPathSlide() {
	const { step } = useStepContext();
	const { mode } = useSlideContext();
	const phase = Math.min(step, HOPS.length);

	return (
		<Slide layout="split" className="grid-cols-[1fr_auto] gap-12 px-16 py-10">
			<div className="flex flex-col gap-5">
				<div>
					<span className="font-mono text-sm text-muted">5. Meta (Facebook)</span>
					<Heading gradient className="mt-2">
						How Meta serves 3B+ people
					</Heading>
				</div>
				<p className="text-lg leading-snug text-muted">
					Meta isn't a cloud provider. It builds one private cloud for its own apps.
					Follow one request:
				</p>

				<ol className="flex flex-col gap-2.5">
					{HOPS.map(({ icon: Icon, title, stat, text }, i) => (
						<Step as="li" key={title} effect="fade-right" dim>
							<div
								className={cn(
									"flex border border-dashed px-4 py-3 transition-colors duration-500",
									phase === i + 1 ? "border-accent/50 bg-surface shadow-soft" : "border-border bg-surface/60",
								)}
							>
								<Icon className="mt-0.5 size-6 shrink-0 pr-2 text-accent" />
								<div>
									<p className="flex items-baseline gap-3 font-display text-xl font-semibold">
										{title}
										<span className="font-mono text-xs font-normal text-accent-2">{stat}</span>
									</p>
									<p className="text-[15px] leading-snug text-muted">{text}</p>
								</div>
							</div>
						</Step>
					))}
				</ol>
			</div>

			<RequestPath phase={phase} still={mode === "thumbnail"} />
		</Slide>
	);
}
