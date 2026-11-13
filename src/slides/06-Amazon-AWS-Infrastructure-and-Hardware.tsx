// import { Slide } from "@/components/deck";
// import { Heading } from "@/components/ui/Heading";

// export default function AmazonAWSInfrastructureandHardware() {
// 	return (
// 		<Slide layout="top">
// 			<Heading>Amazon AWS Infrastructure and Hardware</Heading>
// 		</Slide>
// 	);
// }

// ----------------------- OLD Version -----------------------

// import { Cpu, Globe, MapPin, Radio, Server, Zap } from 'lucide-react'
// import type { SlideEntry } from './types'
// import { CardsSlide, TableSlide } from './kit'

// export const slides: SlideEntry[] = [
//   {
//     title: 'AWS global infrastructure', transition: 'slide',
//     component: () => (
//       <CardsSlide title="AWS global infrastructure" tag="4. Amazon AWS" cols={4}
//         cards={[
//           { icon: Globe, title: 'Regions', text: 'Separate geographical areas where AWS runs its cloud.' },
//           { icon: MapPin, title: 'Availability Zones', text: 'Physically separate data centers with independent infrastructure, inside a Region.' },
//           { icon: Radio, title: 'Edge locations', text: 'Deliver content closer to users to reduce latency.' },
//           { icon: Server, title: 'Amazon EC2', text: 'Virtual servers: general, compute, memory, storage-optimized and GPU instances.' },
//         ]} />
//     ),
//   },
//   {
//     title: 'Graviton & Nitro', transition: 'blur',
//     component: () => (
//       <CardsSlide title="AWS custom hardware" tag="4. Amazon AWS" cols={2}
//         cards={[
//           { icon: Cpu, title: 'Graviton processors', text: 'Arm-based chips designed by Amazon: energy efficiency, tuned performance, tight integration with AWS.' },
//           { icon: Zap, title: 'Nitro System', text: 'Dedicated hardware and software for virtualization, networking, storage and security, freeing the main CPU for customer workloads.' },
//         ]} />
//     ),
//   },
//   {
//     title: 'AWS storage & networking', transition: 'fade',
//     component: () => (
//       <TableSlide title="AWS storage and networking" tag="4. Amazon AWS"
//         head={['Service', 'Purpose']}
//         rows={[
//           ['Amazon S3', 'Object storage'],
//           ['Amazon EBS', 'Block storage for EC2'],
//           ['Amazon EFS', 'Managed file storage'],
//           ['Amazon FSx', 'Managed file systems'],
//           ['Networking', 'Amazon VPC, Elastic Load Balancing, AWS Direct Connect, Amazon CloudFront'],
//         ]}
//         note="AWS combines specialized hardware, virtualization, networking and distributed infrastructure to deliver scalable cloud services." />
//     ),
//   },
// ]

// ----------------------- OLD Version -----------------------

import { Cpu, Zap } from "lucide-react";
import type { SlideEntry } from "./types";
import { FeatureSlide, TableSlide } from "./kit";
import { AwsGlobalInfraSlide } from "./aws-global-infra";

export const slides: SlideEntry[] = [
	{
		title: "AWS global infrastructure",
		transition: "slide",
		component: AwsGlobalInfraSlide,
	},
	{
		title: "Graviton & Nitro",
		transition: "fade",
		component: () => (
			<FeatureSlide
				bg="aws"
				title="AWS custom hardware"
				tag="4. Amazon AWS"
				cols={2}
				cards={[
					{
						icon: Cpu,
						title: "Graviton processors",
						text: "Amazon designs its own Arm-based server chips to get more performance per dollar and per watt.",
						points: [
							"Better price-performance than comparable x86 instances",
							"Uses less energy for the same work, lowering cost and carbon",
							"Chip and AWS software are designed together, so they are tuned as one",
						],
					},
					{
						icon: Zap,
						title: "Nitro System",
						text: "AWS moves virtualization, networking, storage and security onto dedicated hardware, so the host CPU and memory go almost entirely to customer workloads.",
						points: [
							"Nitro Cards handle network (VPC) and storage (EBS) traffic",
							"A lightweight hypervisor gives near bare-metal performance",
							"The Nitro Security Chip keeps hardware and firmware locked down",
						],
					},
				]}
			/>
		),
	},
	{
		title: "AWS storage & networking",
		transition: "slide",
		component: () => (
			<TableSlide
				bg="aws"
				title="AWS storage and networking"
				tag="4. Amazon AWS"
				head={["Service", "Purpose"]}
				rows={[
					["Amazon S3", "Object storage"],
					["Amazon EBS", "Block storage for EC2"],
					["Amazon EFS", "Managed file storage"],
					["Amazon FSx", "Managed file systems"],
					[
						"Networking",
						"Amazon VPC, Elastic Load Balancing, AWS Direct Connect, Amazon CloudFront",
					],
				]}
				note="AWS combines specialized hardware, virtualization, networking and distributed infrastructure to deliver scalable cloud services."
			/>
		),
	},
];
