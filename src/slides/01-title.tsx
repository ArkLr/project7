import { motion } from "motion/react";
import SplitText from "@/components/reactbits/SplitText";
import { Badge } from "@/components/ui/Badge";
import { GlobeCdn } from "@/components/ui/cobe-globe-cdn";
import { TextBlurReveal } from "@/components/wensity/text-blur-reveal";
import { Reveal } from "@/components/deck";

export default function TitleSlide() {
	return (
		<div className="relative grid h-full grid-cols-[1.1fr_1fr] items-center gap-8 px-24">
			{/* Left: title block */}
			<div className="flex flex-col items-start gap-7">
				<Reveal each={false} effect="fade-down" delay={0.1}>
					<Badge>Cloud &amp; Parallel Architectures</Badge>
				</Reveal>

				<h1 className="font-display font-semibold leading-[1.02] tracking-tight">
					{/* Gradient text can't be split per letter, so this line wipes in as a whole. */}
					<motion.span
						className="block pb-2 text-7xl text-gradient"
						initial={{ clipPath: "inset(0 100% 0 0)", y: 16, opacity: 0 }}
						animate={{ clipPath: "inset(0 0% 0 0)", y: 0, opacity: 1 }}
						transition={{ delay: 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] }}
					>
						Facebook &amp; Amazon
					</motion.span>
					<SplitText
						text="Dedicated Hardware Architectures"
						tag="span"
						trigger="load"
						effect="rise"
						splitType="words"
						delay={120}
						textAlign="left"
						className="block text-5xl text-fg"
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

			{/* Right: globe */}
			<Reveal
				each={false}
				effect="scale"
				delay={0.3}
				className="relative mx-auto w-full max-w-530"
			>
				<GlobeCdn className="w-xl" />
			</Reveal>
		</div>
	);
}
