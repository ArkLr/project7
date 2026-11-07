// import { Slide } from "@/components/deck";
// import { Heading } from "@/components/ui/Heading";

// export default function MetaFacebookInfrastructureandHardware() {
// 	return (
// 		<Slide layout="top">
// 			<Heading>Meta Facebook Infrastructure and Hardware</Heading>
// 		</Slide>
// 	);
// }

import { Brain, Network, Server } from 'lucide-react'
import type { SlideEntry } from './types'
import { CardsSlide, ListSlide } from './kit'

export const slides: SlideEntry[] = [
  {
    title: 'Meta data centers & OCP', transition: 'zoom',
    component: () => (
      <ListSlide title="Meta: data centers and OCP" tag="5. Meta (Facebook)"
        intro="Unlike AWS, Meta mainly builds infrastructure for its own products: Facebook, Instagram, WhatsApp and AI services."
        items={['Open Compute Project started by Facebook in 2011', 'Lower costs and better energy efficiency', 'Simpler, more scalable hardware', 'Open designs for servers, storage, switches, power and cooling']}
        aside={{ title: 'Why open?', text: 'Sharing designs encourages hardware innovation across the whole industry.' }} />
    ),
  },
  {
    title: 'Meta servers, network & AI', transition: 'slide',
    component: () => (
      <CardsSlide title="Meta servers, network and AI" tag="5. Meta (Facebook)" cols={3}
        cards={[
          { icon: Server, title: 'Servers', text: 'CPUs, GPUs, memory, storage and fast networking for web, databases, content delivery, AI and analytics.' },
          { icon: Network, title: 'Network fabric', text: 'High bandwidth, low latency and fault tolerance across thousands of servers.' },
          { icon: Brain, title: 'AI infrastructure', text: 'GPU clusters running operations in parallel, linked by high-speed interconnects.' },
        ]}
        note="Meta focuses on efficient, scalable infrastructure optimized for its own applications and AI." />
    ),
  },
]