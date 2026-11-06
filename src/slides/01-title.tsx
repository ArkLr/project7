import { motion } from "motion/react";
import SplitText from "@/components/reactbits/SplitText";
import TechText from "@/components/reactbits/TechText";
import { WireGlobe } from "@/components/ui/wire-globe";
import { TextBlurReveal } from "@/components/wensity/text-blur-reveal";

export default function TitleSlide() {
	return (
		<div className="relative h-full w-full">
			{/* Horizon globe: bleeds to the window edges and fades in at the top. */}
			<motion.div
				aria-hidden
				className="pointer-events-none absolute -bottom-(--bleed-y,0px) -inset-x-(--bleed-x,0px) h-[calc(62%+var(--bleed-y,0px))] mask-[linear-gradient(to_bottom,transparent,black_30%)]"
				initial={{ opacity: 0, y: 60 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
			>
				<WireGlobe />
			</motion.div>

			{/* Title block */}
			<div className="relative z-10 flex flex-col items-start gap-4 pt-10 pl-10">
				{/* <Reveal each={false} effect="fade-down" delay={0.1}>
					<Badge>Cloud &amp; Parallel Architectures</Badge>
				</Reveal> */}

				<div className="relative h-24 w-full font-display">
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
						inset={0}
						draggable
						sweep
					/>
				</div>

				<h1 className="font-display font-semibold tracking-tight">
					{/* Gradient text can't be split per letter, so this line wipes in as a whole. */}
					<motion.span
						className="block pb-2 text-4xl leading-[1.05] text-balance text-gradient md:text-6xl lg:text-7xl"
						initial={{ clipPath: "inset(0 100% 0 0)", y: 16, opacity: 0 }}
						animate={{ clipPath: "inset(0 0% 0 0)", y: 0, opacity: 1 }}
						transition={{ delay: 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
					>
						Hyperscale Data Centers
					</motion.span>
					<SplitText
						text="Dedicated Hardware and Parallel Architectures at Meta and Amazon"
						tag="span"
						trigger="load"
						effect="rise"
						splitType="words"
						delay={120}
						textAlign="left"
						className="mt-4 block max-w-3xl text-lg font-normal leading-snug tracking-normal text-fg md:text-2xl"
					/>
				</h1>

				<motion.div
					className="h-px w-40 origin-left bg-linear-to-r from-accent to-transparent"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
				/>
			</div>
		</div>
	);
}
