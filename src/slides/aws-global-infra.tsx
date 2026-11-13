import type { LucideIcon } from "lucide-react";
import { Globe2, Info, MapPin, Network, Radio } from "lucide-react";
import { Slide, Step, useSlideContext } from "@/components/deck";
import { useStepContext } from "@/components/deck/context";
import { Heading } from "@/components/ui/Heading";
import {
	AwsInfraGlobe,
	type GlobePhase,
} from "@/components/ui/aws-infra-globe";
import { cn } from "@/lib/utils";

/** Each → press reveals one layer here and drives the globe to match. */
const LAYERS: {
	icon: LucideIcon;
	title: string;
	stat: string;
	text: string;
}[] = [
	{
		icon: Globe2,
		title: "Regions",
		stat: "30+ worldwide",
		text: "Separate geographic areas, isolated from each other. You choose where your data and workloads live.",
	},
	{
		icon: MapPin,
		title: "Availability Zones",
		stat: "3+ per Region",
		text: "Physically separate data centers with their own power, cooling and network, linked by low-latency fibre.",
	},
	{
		icon: Radio,
		title: "Edge locations",
		stat: "600+ PoPs",
		text: "CloudFront and Route 53 points of presence that serve content close to users to cut latency.",
	},
	{
		icon: Network,
		title: "Global backbone",
		stat: "Private network",
		text: "AWS-owned fibre connects every Region, so inter-Region traffic avoids the public internet.",
	},
];

export function AwsGlobalInfraSlide() {
	const { step } = useStepContext();
	const { mode } = useSlideContext();
	const phase = Math.min(step, LAYERS.length) as GlobePhase;

	return (
		<Slide layout="split" className="h-[720px] grid-cols-[1fr_auto] gap-8 overflow-hidden px-16 py-8">
			<div className="flex flex-col gap-5">
				<Heading gradient>AWS global infrastructure</Heading>

				<ol className="flex flex-col gap-2.5">
					{LAYERS.map(({ icon: Icon, title, stat, text }, i) => (
						<Step as="li" key={title} effect="fade-right" dim>
							<div
								className={cn(
									"flex border-dashed border px-4 py-3 transition-colors duration-500",
									phase === i + 1
										? "border-accent/50 bg-surface shadow-soft"
										: "border-border bg-surface/60",
								)}
							>
								<Icon className="mt-0.5 pr-2 size-6 shrink-0 text-accent" />
								<div>
									<p className="flex items-baseline gap-3 font-display text-xl font-semibold">
										{title}
										<span className="font-mono text-xs font-normal text-accent-2">
											{stat}
										</span>
									</p>
									<p className="text-[15px] leading-snug text-muted">{text}</p>
								</div>
							</div>
						</Step>
					))}
				</ol>

				{phase === 2 && (
					<p className="absolute bottom-8 left-16 flex max-w-[500px] gap-2.5 bg-surface rounded-lg border border-dashed border-border px-3.5 py-2.5 text-sm leading-snug text-muted">
						<Info className="mt-0.5 size-4 shrink-0 text-accent" />
						<span>
							<b className="font-semibold text-fg">Note:</b> AWS has no Region
							or data centre in Algeria. The Region and AZs shown near Algiers
							are hypothetical, only to illustrate how a Region is split into
							AZs.
						</span>
					</p>
				)}

				{phase === 0 && (
					<p className="absolute bottom-8 left-16 font-mono text-sm text-muted">
						Each dot is an AWS Region
					</p>
				)}
			</div>

			<AwsInfraGlobe phase={phase} size={600} still={mode === "thumbnail"} />
		</Slide>
	);
}
