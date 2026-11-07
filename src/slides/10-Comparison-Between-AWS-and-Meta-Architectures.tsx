// import { Slide } from "@/components/deck";
// import { Heading } from "@/components/ui/Heading";

// export default function ComparisonBetweenAWSandMetaArchitectures() {
// 	return (
// 		<Slide layout="top">
// 			<Heading>Comparison Between AWS and Meta Architectures</Heading>
// 		</Slide>
// 	);
// }

import { Cloud, Layers, Network } from 'lucide-react'
import type { SlideEntry } from './types'
import { CardsSlide, TableSlide } from './kit'

export const slides: SlideEntry[] = [
  {
    title: 'AWS vs Meta', transition: 'slide',
    component: () => (
      <TableSlide title="Amazon AWS vs. Meta" tag="Comparison"
        head={['', 'Amazon AWS', 'Meta']}
        rows={[
          ['Objective', 'Provide cloud services to customers', 'Run global platforms and AI services'],
          ['Users', 'Businesses, developers, organizations', 'Facebook, Instagram, WhatsApp, AI'],
          ['Computing', 'CPU and GPU instances', 'CPU and GPU clusters'],
          ['Storage', 'S3, EBS, EFS and others', 'Large-scale internal distributed storage'],
          ['Hardware', 'Graviton, Nitro, server platforms', 'Custom hardware and OCP designs'],
          ['Scaling', 'Driven by customer demand', 'Driven by internal workloads'],
        ]} />
    ),
  },
  {
    title: 'Differences & similarities', transition: 'blur',
    component: () => (
      <CardsSlide title="Different goals, shared principles" tag="Comparison" cols={3}
        cards={[
          { icon: Cloud, title: 'AWS', text: 'Flexible infrastructure for a wide variety of customers. A cloud service provider.' },
          { icon: Network, title: 'Meta', text: 'Infrastructure shaped around its own apps: social, messaging, recommendations, AI.' },
          { icon: Layers, title: 'Both', text: 'Distributed computing, specialized hardware, fast networking, automation, redundancy, energy efficiency.' },
        ]}
        note="No architecture is universally better: it depends on workload, performance, cost, scalability and goals." />
    ),
  },
]