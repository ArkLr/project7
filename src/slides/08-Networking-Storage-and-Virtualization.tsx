import { Database, Network, Zap } from 'lucide-react'
import type { SlideEntry } from './types'
import { CardsSlide, TableSlide } from './kit'

export const slides: SlideEntry[] = [
  // {
  //   title: 'Networking technologies', transition: 'flip',
  //   component: () => (
  //     <CardsSlide bg="cloud" title="Data center networking" tag="6. Networking, storage, virtualization" cols={3}
  //       cards={[
  //         { icon: Network, title: 'Ethernet', text: 'Widely used to connect servers, switches and storage.' },
  //         { icon: Zap, title: 'InfiniBand', text: 'Low latency, high bandwidth; key in HPC and some AI clusters.' },
  //         { icon: Database, title: 'RDMA', text: 'Access remote memory without the remote CPU handling each transfer: less overhead, lower latency.' },
  //       ]} />
  //   ),
  // },
  {
    title: 'Storage types', transition: 'fade',
    component: () => (
      <TableSlide bg="cloud" title="Distributed storage" tag="6. Networking, storage, virtualization"
        head={['Type', 'Description', 'Example']}
        rows={[
          ['Block storage', 'Fixed-size blocks', 'Amazon EBS'],
          ['File storage', 'Files and directories', 'Amazon EFS'],
          ['Object storage', 'Objects with metadata', 'Amazon S3'],
        ]}
        note="Spreading data over many devices gives scalability, redundancy, fault tolerance and availability, essential for billions of photos and videos." />
    ),
  },
  {
    title: 'VMs vs containers', transition: 'slide',
    component: () => (
      <TableSlide bg="cloud" title="Virtual machines vs. containers" tag="6. Networking, storage, virtualization"
        head={['Feature', 'Virtual machines', 'Containers']}
        rows={[
          ['Operating system', 'Each VM has its own guest OS', 'Share the host OS kernel'],
          ['Resource use', 'Generally higher', 'Generally lower'],
          ['Startup time', 'Usually longer', 'Usually shorter'],
          ['Isolation', 'Hardware-level virtualization', 'OS-level isolation'],
          ['Example', 'VMware, KVM', 'Docker'],
        ]}
        note="Containers don't replace every VM: both are used in modern cloud infrastructure." />
    ),
  },
]
