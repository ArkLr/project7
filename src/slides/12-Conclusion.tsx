// import { Slide } from "@/components/deck";
// import { Heading } from "@/components/ui/Heading";

// export default function Conclusion() {
// 	return (
// 		<Slide layout="top">
// 			<Heading>Conclusion</Heading>
// 		</Slide>
// 	);
// }

import type { SlideEntry } from './types'
import { ListSlide } from './kit'
 
export const slides: SlideEntry[] = [
  {
    title: 'Conclusion', transition: 'blur',
    component: () => (
      <ListSlide title="Conclusion" tag="Cloud & Parallel Architectures"
        items={['Cloud gives scalable access to compute, storage and networking', 'Parallel computing runs many operations at once', 'AWS serves customers; Meta optimizes for its own platforms and AI', 'Both rely on specialized hardware, distributed systems, fast networks and fault tolerance']}
        aside={{ title: 'The future', text: 'Specialized hardware, parallel processing, distributed architectures, AI and energy-efficient data centers will shape how applications run at global scale.' }} />
    ),
  },
]
 
