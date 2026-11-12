import {
	Brain,
	Cpu,
	HardDrive,
	Router,
	Server,
	Wind,
	Zap,
	Boxes,
} from "lucide-react";
import type { SlideEntry } from "./types";
import { CardsSlide, FeatureSlide, TableSlide } from "./kit";
import { MetaRequestPathSlide } from "./meta-infra";

export const slides: SlideEntry[] = [
	{
		title: "How Meta serves a request",
		transition: "zoom",
		component: MetaRequestPathSlide,
	},
	{
		title: "Open Compute hardware",
		transition: "slide",
		component: () => (
			<FeatureSlide
				bg="meta"
				title="Hardware Meta designs itself"
				tag="5. Meta (Facebook)"
				cols={4}
				cards={[
					{
						icon: Server,
						title: "Servers",
						text: "Stripped-down sleds with only the parts a workload needs. No paint, no extra ports, easy to repair.",
					},
					{
						icon: HardDrive,
						title: "Storage",
						text: "Dense trays packed with drives for photos, videos and backups, sitting behind cheap compute.",
					},
					{
						icon: Router,
						title: "Network",
						text: "Meta's own switches (Wedge, Minipack) running its own software (FBOSS) instead of closed vendor boxes.",
					},
					{
						icon: Wind,
						title: "Power & cooling",
						text: "Outside-air cooling and custom power supplies keep energy overhead very low.",
					},
				]}
				note="Facebook launched the Open Compute Project (OCP) in 2011 and published these designs for anyone to use."
			/>
		),
	},
	{
		title: "Meta AI infrastructure",
		transition: "slide",
		component: () => (
			<CardsSlide
				bg="meta"
				title="Built for AI at scale"
				tag="5. Meta (Facebook)"
				cols={4}
				cards={[
					{
						icon: Boxes,
						title: "Grand Teton",
						text: "Open GPU server with 8 accelerators, the building block of Meta's AI clusters.",
					},
					{
						icon: Brain,
						title: "Training clusters",
						text: "Tens of thousands of GPUs per cluster, joined by RoCE and InfiniBand fabrics to train Llama.",
					},
					{
						icon: Cpu,
						title: "MTIA chip",
						text: "Meta's own accelerator for ranking and recommendation, the AI behind every feed.",
					},
					{
						icon: Zap,
						title: "Gigawatt campuses",
						text: "Prometheus (Ohio) and Hyperion (Louisiana): data centers sized in gigawatts, not megawatts.",
					},
				]}
				note="AI now shapes how Meta designs servers, networks and whole data centers."
			/>
		),
	},
];
