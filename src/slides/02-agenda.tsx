import { Slide, Step } from "@/components/deck";
import { Heading } from "@/components/ui/Heading";

// Placeholder — shows step-by-step builds. Press → to reveal each <Step>.
export default function agenda() {
	return (
		<Slide layout="top">
			<Heading>Our agenda for today</Heading>
			<div className="grid grid-cols-3 gap-6">
				{[1, 2, 3].map((n) => (
					<Step key={n} effect="fade-up" dim>
						<div className="grid h-56 place-items-center rounded-2xl border border-dashed border-border bg-surface font-mono text-muted">
							Step {n}
						</div>
					</Step>
				))}
			</div>
		</Slide>
	);
}
