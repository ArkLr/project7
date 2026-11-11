// import { Slide } from "@/components/deck";
// import { Heading } from "@/components/ui/Heading";

// export default function CurrentTrendsandFutureDirections() {
// 	return (
// 		<Slide layout="top">
// 			<Heading>Current Trends and Future Directions</Heading>
// 		</Slide>
// 	);
// }

// import { AlertTriangle, Brain, Cpu, HardDrive, Leaf, Package, Radio, Snowflake, Wrench } from 'lucide-react'
// import type { SlideEntry } from './types'
// import { CardsSlide } from './kit'

// export const slides: SlideEntry[] = [
//   {
//     title: 'Trends', transition: 'zoom',
//     component: () => (
//       <CardsSlide title="Current trends" tag="Trends" cols={3}
//         cards={[
//           { icon: Brain, title: 'AI and GPUs', text: 'Meta has described clusters of 24,576 NVIDIA H100 GPUs for generative AI.' },
//           { icon: Cpu, title: 'Custom processors', text: 'AWS Graviton, Trainium and Inferentia; Meta MTIA.' },
//           { icon: Leaf, title: 'Energy efficiency', text: 'Efficient chips, advanced and liquid cooling, renewable energy.' },
//           { icon: Radio, title: 'Edge computing', text: 'Process data near its source: lower latency and network traffic.' },
//           { icon: Snowflake, title: 'High-speed networking', text: 'Ethernet, InfiniBand, RDMA, optical interconnects. Meta\u2019s October 2026 OCP announcements include AI fabrics and liquid-cooled network gear.' },
//           { icon: HardDrive, title: 'Disaggregation', text: 'Separating compute, memory and storage so each can scale on its own.' },
//         ]} />
//     ),
//   },
//   {
//     title: 'Challenges', transition: 'fade',
//     component: () => (
//       <CardsSlide title="Future challenges" tag="Trends" cols={4}
//         cards={[
//           { icon: Package, title: 'Cost', text: 'Rising infrastructure costs.' },
//           { icon: Leaf, title: 'Energy', text: 'Growing power consumption.' },
//           { icon: Wrench, title: 'Complexity', text: 'Hardware failures and complexity.' },
//           { icon: AlertTriangle, title: 'Security', text: 'Cyber threats, data privacy, network bottlenecks.' },
//         ]} />
//     ),
//   },
// ]

import {
	AlertTriangle,
	Brain,
	Cpu,
	HardDrive,
	Leaf,
	Package,
	Radio,
	Snowflake,
	Wrench,
} from "lucide-react";
import type { SlideEntry } from "./types";
import { CardsSlide } from "./kit";
import { FeatureSection } from "@/components/ui/feature-08";

export const slides: SlideEntry[] = [
	{
		title: "Trends",
		transition: "fade",
		component: () => <FeatureSection />,
	},
	{
		title: "Challenges",
		transition: "slide",
		component: () => (
			<CardsSlide
				bg="chip"
				title="Future challenges"
				tag="Trends"
				cols={4}
				cards={[
					{
						icon: Package,
						title: "Cost",
						text: "Rising infrastructure costs.",
					},
					{ icon: Leaf, title: "Energy", text: "Growing power consumption." },
					{
						icon: Wrench,
						title: "Complexity",
						text: "Hardware failures and complexity.",
					},
					{
						icon: AlertTriangle,
						title: "Security",
						text: "Cyber threats, data privacy, network bottlenecks.",
					},
				]}
			/>
		),
	},
];
