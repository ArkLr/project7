// import { Slide } from "@/components/deck";
// import { Heading } from "@/components/ui/Heading";

// export default function PerformanceScalabilityandFaultTolerance() {
// 	return (
// 		<Slide layout="top">
// 			<Heading>Performance Scalability and Fault Tolerance</Heading>
// 		</Slide>
// 	);
// }


import { Gauge, Scale, Shield } from 'lucide-react'
import type { SlideEntry } from './types'
import { CardsSlide } from './kit'

export const slides: SlideEntry[] = [
  {
    title: 'Performance, scalability, fault tolerance', transition: 'zoom',
    component: () => (
      <CardsSlide title="Performance, scalability and fault tolerance" tag="Essential characteristics" cols={3}
        cards={[
          { icon: Gauge, title: 'Performance', text: 'High computational performance, high network bandwidth and low communication latency.' },
          { icon: Scale, title: 'Scalability and elasticity', text: 'Add or release resources on demand and pay for what you use.' },
          { icon: Shield, title: 'Fault tolerance', text: 'High availability through redundancy, so hardware failures don\u2019t stop the service.' },
        ]}
        note="Also expected from a modern cloud: resource pooling, on-demand self-service, measured service, security and isolation." />
    ),
  },
]