import { Reveal, Slide } from "@/components/deck";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
 
const sections = [
	"Introduction to Cloud and Parallel Computing",
	"Fundamentals of Cloud Architecture",
	"Parallel Processing and Distributed Systems",
	"Amazon AWS Infrastructure and Hardware",
	"Meta (Facebook) Infrastructure and Hardware",
	"Networking, Storage and Virtualization",
	"Performance, Scalability and Fault Tolerance",
	"Comparison Between AWS and Meta Architectures",
	"Current Trends and Future Directions",
	"Conclusion",
];
 
export default function Agenda() {
	return (
		<Slide layout="top">
			<Heading gradient>Our agenda for today</Heading>
			<Reveal
				className="grid grid-cols-5 gap-4"
				effect="fade-up"
				delay={0.3}
				stagger={0.08}
			>
				{sections.map((title, i) => (
					<Card key={title} className="h-48">
						<p className="font-mono text-3xl text-accent">
							{String(i + 1).padStart(2, "0")}
						</p>
						<h3 className="mt-3 text-lg font-semibold leading-snug">{title}</h3>
					</Card>
				))}
			</Reveal>
		</Slide>
	);
}
