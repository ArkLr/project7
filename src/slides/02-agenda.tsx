import { motion, useReducedMotion } from "motion/react";
import { useId, useLayoutEffect } from "react";
import { Slide, useSlideContext } from "@/components/deck";
import { useStepContext } from "@/components/deck/context";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/utils";
import { useDeckStore } from "@/store/deck";

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

const LAST = sections.length - 1;
const SPRING = { type: "spring", stiffness: 320, damping: 30 } as const;

/**
 * The highlighted row is this slide's build step, so the deck's arrow keys walk the
 * list (step 0 = first row) before moving on to the next slide.
 */
function useActiveSection() {
	const id = useId();
	const { step, register } = useStepContext();
	useLayoutEffect(() => register(id, LAST), [id, register]);
	return Math.min(step, LAST);
}

function RowContent({ title, number, active }: { title: string; number: number; active: boolean }) {
	const reduced = useReducedMotion();
	const transition = reduced ? { duration: 0 } : SPRING;

	return (
		<>
			<span className="flex w-16 shrink-0 items-center" aria-hidden>
				<motion.span
					className={cn(
						"h-0.5 rounded-full transition-colors duration-300",
						active ? "bg-accent" : "bg-muted/50 group-hover:bg-fg",
					)}
					initial={false}
					animate={{ width: active ? 64 : 44 }}
					transition={transition}
				/>
			</span>
			<motion.span
				className="flex items-baseline gap-4"
				initial={false}
				animate={{ x: active ? 8 : 0 }}
				transition={transition}
			>
				<span
					className={cn(
						"font-mono text-base transition-colors duration-300",
						active ? "text-accent" : "text-muted",
					)}
				>
					{String(number).padStart(2, "0")}
				</span>
				<span
					className={cn(
						"text-2xl transition-colors duration-300",
						active ? "font-medium text-fg" : "text-muted group-hover:text-fg",
					)}
				>
					{title}
				</span>
			</motion.span>
		</>
	);
}

export default function Agenda() {
	const { index, mode } = useSlideContext();
	const goTo = useDeckStore((s) => s.goTo);
	const current = useActiveSection();
	const thumbnail = mode === "thumbnail";
	// Thumbnails are not on the stage, so they have no step of their own.
	const active = thumbnail ? 0 : current;
	const rowClass = "group flex h-11 w-full items-center gap-5 text-left";

	return (
		<Slide layout="top">
			<Heading gradient>Our agenda for today</Heading>
			<ol>
				{sections.map((title, i) => (
					<li key={title} className="relative">
						{/* Overview tiles are already buttons, and buttons can't nest. */}
						{thumbnail ? (
							<div className={rowClass}>
								<RowContent title={title} number={i + 1} active={i === active} />
							</div>
						) : (
							<button
								type="button"
								className={cn(rowClass, "cursor-pointer rounded-md")}
								aria-current={i === active ? "step" : undefined}
								// Keep focus off the row after a click, so Space still advances the deck.
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => goTo(index, { step: i })}
							>
								<RowContent title={title} number={i + 1} active={i === active} />
							</button>
						)}
						{i < LAST && (
							<span
								className="pointer-events-none absolute -bottom-px left-0 h-px w-4 bg-muted/30"
								aria-hidden
							/>
						)}
					</li>
				))}
			</ol>
		</Slide>
	);
}
