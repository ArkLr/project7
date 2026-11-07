import { motion } from "motion/react";
import SplitText from "@/components/reactbits/SplitText";
import TechText from "@/components/reactbits/TechText";
import { WireGlobe } from "@/components/ui/wire-globe";

/** Presenters shown under the title. Edit names / roles here. */
const AUTHORS: { name: string; role?: string }[] = [
	{ name: "Laroui riadh brahim", role: "" },
	{ name: "Bader Mohammed Chakib", role: "" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function TitleSlide() {
	return (
		<div className="relative h-full w-full">
			{/* Horizon globe: bleeds to the window edges and fades in at the top. */}
			<motion.div
				aria-hidden
				className="pointer-events-none absolute -bottom-(--bleed-y,0px) -inset-x-(--bleed-x,0px) h-[calc(62%+var(--bleed-y,0px))] mask-[linear-gradient(to_bottom,transparent,black_30%)]"
				initial={{ opacity: 0, y: 60 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 1.6, ease }}
			>
				<WireGlobe />
			</motion.div>

			{/* Title block */}
			<header className="relative z-10 flex flex-col items-start pt-10 pl-10">
				{/* Course name (kicker). The canvas is invisible to screen readers, so mirror it as text. */}
				<p className="sr-only">Cloud &amp; Parallel Architectures</p>
				{/* The canvas bleeds 24px left/right and 12px top/bottom so the dashed outlines and
				    selection handles aren't clipped; `gutter` puts the letters back on the text edge. */}
				<div aria-hidden className="relative -mx-6 -my-3 h-20 w-[calc(100%+3rem)] font-display">
					<TechText
						text="Cloud &amp; Parallel Architectures"
						fontWeight={600}
						fontSize={50}
						reveal="letter"
						dashLength={4}
						dashGap={2}
						specks={15}
						intro="assemble"
						introDuration={2}
						clickKick
						guides={false}
						fontFamily=""
						letterSpacing={-0.05}
						accentColor="currentColor"
						reach={200}
						softness={0.7}
						lineStyle="dashed"
						strokeWidth={1.5}
						speed={1}
						bounce={0.4}
						selection
						labels
						color="currentColor"
						align="left"
						gutter={24}
						draggable
						sweep
					/>
				</div>

				{/* Main title. Gradient text can't be split per letter, so it wipes in as a whole. */}
				<h1 className="mt-1 font-display font-semibold tracking-tight">
					<motion.span
						className="block pb-1 text-4xl leading-[1.05] text-balance text-gradient md:text-6xl lg:text-7xl"
						initial={{ clipPath: "inset(0 100% 0 0)", y: 16, opacity: 0 }}
						animate={{ clipPath: "inset(0 0% 0 0)", y: 0, opacity: 1 }}
						transition={{ delay: 0.25, duration: 1, ease }}
					>
						Hyperscale Data Centers
					</motion.span>
				</h1>

				{/* Subtitle */}
				<SplitText
					text="Dedicated Hardware and Parallel Architectures at Meta and Amazon"
					tag="p"
					trigger="load"
					effect="rise"
					splitType="words"
					delay={120}
					textAlign="left"
					className="mt-3 block max-w-4xl font-display text-lg leading-snug text-fg md:text-2xl"
				/>

				<motion.div
					className="mt-6 h-px w-40 origin-left bg-linear-to-r from-accent to-transparent"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 1.2, duration: 0.9, ease }}
				/>

				{/* Authors */}
				<motion.ul
					aria-label="Authors"
					className="mt-5 flex flex-wrap gap-x-10 gap-y-2"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.4, duration: 0.7, ease }}
				>
					{AUTHORS.map((a, i) => (
						<li key={i} className="flex flex-col">
							<span className="text-base font-medium text-fg">{a.name}</span>
							{a.role && <span className="text-sm text-muted">{a.role}</span>}
						</li>
					))}
				</motion.ul>
			</header>
		</div>
	);
}
