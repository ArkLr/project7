import type { SlideEntry } from "./types";
import Title from "./01-title";
import agenda from "./02-agenda";
import IntroductiontoCloudandParallelComputing from "./03-Introduction-to-Cloud-and-Parallel-Computing";
import FundamentalsofCloudArchitecture from "./04-Fundamentals-of-Cloud-Architecture";
import ParallelProcessingandDistributedSystems from "./05-Parallel-Processing-and-Distributed-Systems";
import AmazonAWSInfrastructureandHardware from "./06-Amazon-AWS-Infrastructure-and-Hardware";
import MetaFacebookInfrastructureandHardware from "./07-Meta-Facebook-Infrastructure-and-Hardware";
import NetworkingStorageandVirtualization from "./08-Networking-Storage-and-Virtualization";
import PerformanceScalabilityandFaultTolerance from "./09-Performance-Scalability-and-Fault-Tolerance";
import ComparisonBetweenAWSandMetaArchitectures from "./10-Comparison-Between-AWS-and-Meta-Architectures";
import CurrentTrendsandFutureDirections from "./11-Current-Trends-and-Future-Directions";
import Conclusion from "./12-Conclusion";

/**
 * Slide order. To add a slide: create `src/slides/NN-name.tsx` (default-export a component),
 * import it above, and add one line here.
 */
export const slides: SlideEntry[] = [
	{ component: Title, title: "Title", transition: "fade" },
	{
		component: agenda,
		title: "02-agenda",
		transition: "slide",
	},
	{
		component: IntroductiontoCloudandParallelComputing,
		title: "03-Introduction-to-Cloud-and-Parallel-Computing",
		transition: "zoom",
	},
	{
		component: FundamentalsofCloudArchitecture,
		title: "04-Fundamentals-of-Cloud-Architecture",
		transition: "zoom",
	},
	{
		component: ParallelProcessingandDistributedSystems,
		title: "05-Parallel-Processing-and-Distributed-Systems",
		transition: "zoom",
	},
	{
		component: AmazonAWSInfrastructureandHardware,
		title: "06-Amazon-AWS-Infrastructure-and-Hardware",
		transition: "zoom",
	},
	{
		component: MetaFacebookInfrastructureandHardware,
		title: "07-Meta-Facebook-Infrastructure-and-Hardware",
		transition: "zoom",
	},
	{
		component: NetworkingStorageandVirtualization,
		title: "08-Networking-Storage-and-Virtualization",
		transition: "zoom",
	},
	{
		component: PerformanceScalabilityandFaultTolerance,
		title: "09-Performance-Scalability-and-Fault-Tolerance",
		transition: "zoom",
	},
	{
		component: ComparisonBetweenAWSandMetaArchitectures,
		title: "10-Comparison-Between-AWS-and-Meta-Architectures",
		transition: "zoom",
	},
	{
		component: CurrentTrendsandFutureDirections,
		title: "11-Current-Trends-and-Future-Directions",
		transition: "zoom",
	},
	{
		component: Conclusion,
		title: "12-Conclusion",
		transition: "zoom",
	},
];

export type { SlideEntry };
