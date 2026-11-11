import { Boxes, Cpu, Workflow } from 'lucide-react'
import type { SlideEntry } from './types'
import { CardsSlide, TableSlide } from './kit'

export const slides: SlideEntry[] = [
  {
    title: 'Parallel vs distributed', transition: 'blur',
    component: () => (
      <TableSlide bg="chip" title="Parallel vs. distributed computing" tag="3. Parallel processing"
        head={['', 'Parallel computing', 'Distributed computing']}
        rows={[
          ['Main objective', 'Faster computation', 'Coordinated computation across machines'],
          ['Processing units', 'Multiple cores or processors', 'Multiple independent computers'],
          ['Memory', 'Often shared, can be distributed', 'Usually separate'],
          ['Communication', 'Shared memory or interconnect', 'Network communication'],
          ['Example', 'Multi-core CPU', 'Cloud data center'],
        ]}
        note="Related but not identical: a distributed system can run parallel computations." />
    ),
  },
  // {
  //   title: 'Forms of parallelism', transition: 'zoom',
  //   component: () => (
  //     <CardsSlide bg="chip" title="Forms of parallelism" tag="3. Parallel processing" cols={3}
  //       cards={[
  //         { icon: Boxes, title: 'Data parallelism', text: 'Same operation on different portions of a dataset, e.g. thousands of images on GPU cores.' },
  //         { icon: Workflow, title: 'Task parallelism', text: 'Different tasks run at once: database queries, transactions, network requests.' },
  //         { icon: Cpu, title: 'Instruction-level', text: 'A processor runs or overlaps multiple independent instructions.' },
  //       ]} />
  //   ),
  // },
]
