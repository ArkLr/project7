// import type { SlideEntry } from "./types";
// import Title from "./01-title";
// import agenda from "./02-agenda";
// import IntroductiontoCloudandParallelComputing from "./03-Introduction-to-Cloud-and-Parallel-Computing";
// import FundamentalsofCloudArchitecture from "./04-Fundamentals-of-Cloud-Architecture";
// import ParallelProcessingandDistributedSystems from "./05-Parallel-Processing-and-Distributed-Systems";
// import AmazonAWSInfrastructureandHardware from "./06-Amazon-AWS-Infrastructure-and-Hardware";
// import MetaFacebookInfrastructureandHardware from "./07-Meta-Facebook-Infrastructure-and-Hardware";
// import NetworkingStorageandVirtualization from "./08-Networking-Storage-and-Virtualization";
// import PerformanceScalabilityandFaultTolerance from "./09-Performance-Scalability-and-Fault-Tolerance";
// import ComparisonBetweenAWSandMetaArchitectures from "./10-Comparison-Between-AWS-and-Meta-Architectures";
// import CurrentTrendsandFutureDirections from "./11-Current-Trends-and-Future-Directions";
// import Conclusion from "./12-Conclusion";

// /**
//  * Slide order. To add a slide: create `src/slides/NN-name.tsx` (default-export a component),
//  * import it above, and add one line here.
//  */
// export const slides: SlideEntry[] = [
// 	{ component: Title, title: "Title", transition: "fade" },
// 	{
// 		component: agenda,
// 		title: "02-agenda",
// 		transition: "slide",
// 	},
// 	{
// 		component: IntroductiontoCloudandParallelComputing,
// 		title: "03-Introduction-to-Cloud-and-Parallel-Computing",
// 		transition: "zoom",
// 	},
// 	{
// 		component: FundamentalsofCloudArchitecture,
// 		title: "04-Fundamentals-of-Cloud-Architecture",
// 		transition: "zoom",
// 	},
// 	{
// 		component: ParallelProcessingandDistributedSystems,
// 		title: "05-Parallel-Processing-and-Distributed-Systems",
// 		transition: "zoom",
// 	},
// 	{
// 		component: AmazonAWSInfrastructureandHardware,
// 		title: "06-Amazon-AWS-Infrastructure-and-Hardware",
// 		transition: "zoom",
// 	},
// 	{
// 		component: MetaFacebookInfrastructureandHardware,
// 		title: "07-Meta-Facebook-Infrastructure-and-Hardware",
// 		transition: "zoom",
// 	},
// 	{
// 		component: NetworkingStorageandVirtualization,
// 		title: "08-Networking-Storage-and-Virtualization",
// 		transition: "zoom",
// 	},
// 	{
// 		component: PerformanceScalabilityandFaultTolerance,
// 		title: "09-Performance-Scalability-and-Fault-Tolerance",
// 		transition: "zoom",
// 	},
// 	{
// 		component: ComparisonBetweenAWSandMetaArchitectures,
// 		title: "10-Comparison-Between-AWS-and-Meta-Architectures",
// 		transition: "zoom",
// 	},
// 	{
// 		component: CurrentTrendsandFutureDirections,
// 		title: "11-Current-Trends-and-Future-Directions",
// 		transition: "zoom",
// 	},
// 	{
// 		component: Conclusion,
// 		title: "12-Conclusion",
// 		transition: "zoom",
// 	},
// ];

// export type { SlideEntry };



import type { SlideEntry } from './types'
import Title from './01-title'
import agenda from './02-agenda'
import { slides as s03 } from './03-Introduction-to-Cloud-and-Parallel-Computing'
import { slides as s04 } from './04-Fundamentals-of-Cloud-Architecture'
import { slides as s05 } from './05-Parallel-Processing-and-Distributed-Systems'
import { slides as s06 } from './06-Amazon-AWS-Infrastructure-and-Hardware'
import { slides as s07 } from './07-Meta-Facebook-Infrastructure-and-Hardware'
import { slides as s08 } from './08-Networking-Storage-and-Virtualization'
import { slides as s09 } from './09-Performance-Scalability-and-Fault-Tolerance'
import { slides as s10 } from './10-Comparison-Between-AWS-and-Meta-Architectures'
import { slides as s11 } from './11-Current-Trends-and-Future-Directions'
import { slides as s12 } from './12-Conclusion'

/**
 * Slide order. Each section file (03–12) exports a `slides` array built with the
 * templates in `kit.tsx`; they are spread in here in order.
 */
export const slides: SlideEntry[] = [
  { component: Title, title: 'Title', transition: 'fade' },
  { component: agenda, title: 'Agenda', transition: 'slide' },
  ...s03,
  ...s04,
  ...s05,
  ...s06,
  ...s07,
  ...s08,
  ...s09,
  ...s10,
  ...s11,
  ...s12,
]

export type { SlideEntry }