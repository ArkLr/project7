import { motion } from "motion/react";
import SplitText from "@/components/reactbits/SplitText";
import { Badge } from "@/components/ui/Badge";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";
import { TextBlurReveal } from "@/components/wensity/text-blur-reveal";
import { Reveal } from "@/components/deck";

export default function TitleSlide() {
	return (
		<div className="relative grid h-full w-full grid-cols-[1fr_auto] items-center gap-4 pl-20">
			{/* Left: title block */}
			<div className="flex flex-col items-start gap-7">
				<Reveal each={false} effect="fade-down" delay={0.1}>
					<Badge>Cloud &amp; Parallel Architectures</Badge>
				</Reveal>

				<h1 className="font-display font-semibold tracking-tight">
					{/* Gradient text can't be split per letter, so this line wipes in as a whole. */}
					<motion.span
						className="block pb-2 text-4xl leading-[1.05] text-balance text-gradient md:text-6xl lg:text-7xl"
						initial={{ clipPath: "inset(0 100% 0 0)", y: 16, opacity: 0 }}
						animate={{ clipPath: "inset(0 0% 0 0)", y: 0, opacity: 1 }}
						transition={{ delay: 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
					>
						Inside the Warehouse-Scale Computer
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

				<TextBlurReveal
					as="p"
					text="How hyperscalers design their own servers, chips and data centers"
					startOnView={false}
					delay={45}
					className="max-w-xl text-xl text-muted"
				/>

				<motion.div
					className="h-px w-40 origin-left bg-linear-to-r from-accent to-transparent"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
				/>
			</div>

			<Reveal
				each={false}
				effect="scale"
				delay={0.3}
				className="mr-[calc(-1*var(--bleed-x,0px))] justify-self-end"
			>
				<GlobeCdn className="w-180" />
			</Reveal>
		</div>
	);
}
