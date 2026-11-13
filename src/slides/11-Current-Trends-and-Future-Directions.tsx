import type { SlideEntry } from "./types";
import { FeatureSection } from "@/components/ui/feature-08";

export const slides: SlideEntry[] = [
	{
		title: "Trends",
		transition: "fade",
		component: () => <FeatureSection />,
	},
	// {
	// 	title: "Challenges",
	// 	transition: "slide",
	// 	component: () => (
	// 		<CardsSlide
	// 			bg="chip"
	// 			title="Future challenges"
	// 			tag="Trends"
	// 			cols={4}
	// 			cards={[
	// 				{
	// 					icon: Package,
	// 					title: "Cost",
	// 					text: "Rising infrastructure costs.",
	// 				},
	// 				{ icon: Leaf, title: "Energy", text: "Growing power consumption." },
	// 				{
	// 					icon: Wrench,
	// 					title: "Complexity",
	// 					text: "Hardware failures and complexity.",
	// 				},
	// 				{
	// 					icon: AlertTriangle,
	// 					title: "Security",
	// 					text: "Cyber threats, data privacy, network bottlenecks.",
	// 				},
	// 			]}
	// 		/>
	// 	),
	// },
];
