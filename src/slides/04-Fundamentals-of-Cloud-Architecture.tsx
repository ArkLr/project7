// import { Slide } from "@/components/deck";
// import { Heading } from "@/components/ui/Heading";

// export default function FundamentalsofCloudArchitecture() {
// 	return (
// 		<Slide layout="top">
// 			<Heading>Fundamentals of Cloud Architecture</Heading>
// 		</Slide>
// 	);
// }

import { Cloud, Layers, Server, Workflow } from "lucide-react";
import type { SlideEntry } from "./types";
import { FeatureSlide, TableSlide } from "./kit";

export const slides: SlideEntry[] = [
	{
		title: "Cloud architecture layers",
		transition: "slide",
		component: () => (
			<FeatureSlide
				title="Cloud architecture: four layers"
				tag="2. Fundamentals"
				cols={4}
				cards={[
					{
						icon: Server,
						title: "Physical infrastructure",
						text: "Servers, CPUs/GPUs, RAM, SSD/HDD, switches, power and cooling.",
					},
					{
						icon: Layers,
						title: "Virtualization",
						text: "A hypervisor shares one machine between isolated virtual machines.",
					},
					{
						icon: Workflow,
						title: "Resource management",
						text: "CPU, memory, storage, bandwidth and workload scheduling.",
					},
					{
						icon: Cloud,
						title: "Services",
						text: "VMs, databases, object storage, web hosting, AI/ML.",
					},
				]}
				note="Type 1 hypervisors run on the hardware and Type 2 run on top of a host OS."
			/>
		),
	},
	{
		title: "Service & deployment models",
		transition: "blur",
		component: () => (
			<TableSlide
				title="Cloud service models"
				tag="2. Fundamentals"
				head={["Model", "Description", "Example"]}
				rows={[
					[
						"IaaS",
						"Infrastructure as a Service: rent computing infrastructure",
						"Amazon EC2",
					],
					[
						"PaaS",
						"Platform as a Service: deploy apps without managing the infrastructure",
						"AWS Elastic Beanstalk",
					],
					[
						"SaaS",
						"Software as a Service: ready-to-use software over the Internet",
						"Web-based applications",
					],
				]}
				note="Deployment: public, private, hybrid, or multi-cloud."
			/>
		),
	},
];
