import { Gauge, Scale, Shield } from "lucide-react";
import type { SlideEntry } from "./types";
import { CardsSlide } from "./kit";

export const slides: SlideEntry[] = [
	{
		title: "Performance, scalability, fault tolerance",
		transition: "blur",
		component: () => (
			<CardsSlide
				bg="chip"
				title="Performance, scalability and fault tolerance"
				tag="Essential characteristics"
				cols={3}
				cards={[
					{
						icon: Gauge,
						title: "Performance",
						text: "High computational performance, high network bandwidth and low communication latency.",
					},
					{
						icon: Scale,
						title: "Scalability and elasticity",
						text: "Add or release resources on demand and pay for what you use.",
					},
					{
						icon: Shield,
						title: "Fault tolerance",
						text: "High availability through redundancy, so hardware failures don\u2019t stop the service.",
					},
				]}
				note="Modern cloud also provides self-service (users get resources without asking a human), measured usage (you pay for what you consume), and security and isolation."
			/>
		),
	},
];
