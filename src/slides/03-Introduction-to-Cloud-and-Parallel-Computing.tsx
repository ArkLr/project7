// import { Slide } from "@/components/deck";
// import { Heading } from "@/components/ui/Heading";

// export default function IntroductiontoCloudandParallelComputing() {
// 	return (
// 		<Slide layout="top">
// 			<Heading>Introduction to Cloud and Parallel Computing</Heading>
// 		</Slide>
// 	);
// }


import { Gauge, Layers, Scale, Shield } from 'lucide-react'
import type { SlideEntry } from './types'
import { CardsSlide, ListSlide } from './kit'

export const slides: SlideEntry[] = [
  {
    title: 'What is cloud computing?', transition: 'blur',
    component: () => (
      <ListSlide title="What is cloud computing?" tag="1. Introduction"
        intro="Computing resources delivered over the Internet, instead of owning and maintaining physical infrastructure."
        items={['Computing power (CPU and GPU)', 'Storage systems', 'Networking resources', 'Databases', 'Software and applications']}
        aside={{ title: 'Example', text: 'Instead of buying and configuring a physical server for a website, you rent a virtual server from Amazon Web Services (AWS).' }} />
    ),
  },
  {
    title: 'What is parallel computing?', transition: 'zoom',
    component: () => (
      <ListSlide title="What is parallel computing?" tag="1. Introduction"
        intro="Multiple processing units run different parts of a problem at the same time, to cut execution time."
        items={['A large task is split into smaller tasks', 'The smaller tasks run concurrently', 'Works best when the workload divides efficiently']}
        aside={{ title: 'Example: one million images', text: 'Sequential: one processor handles them one by one. Parallel: many processors each handle a group at the same time.' }} />
    ),
  },
  {
    title: 'Cloud + parallel', transition: 'fade',
    component: () => (
      <CardsSlide title="Why these architectures matter" tag="1. Introduction" cols={4}
        cards={[
          { icon: Gauge, title: 'Performance', text: 'High computation, high bandwidth, low latency.' },
          { icon: Scale, title: 'Scalability', text: 'Grow capacity with demand.' },
          { icon: Shield, title: 'Fault tolerance', text: 'Keep running when hardware fails.' },
          { icon: Layers, title: 'Efficiency', text: 'Use every resource well.' },
        ]}
        note="Cloud provides the resources; parallel computing uses them efficiently. Amazon and Meta depend on both." />
    ),
  },
]