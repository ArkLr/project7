import type { ComponentProps, ReactNode } from "react";
import { Lightbulb, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, Slide } from "@/components/deck";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { FeatureCard } from "@/components/ui/feature-section";
import { DecorIcon } from "@/components/ui/decor-icon";
import { Logo3D, type LogoKind } from "./logo3d";
import { cn } from "@/lib/utils";

/** Section tag: accent-tinted pill with a pulsing red dot. */
function Tag({ children }: { children: ReactNode }) {
	return (
		<span className="tag-surface inline-flex w-fit items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 font-mono text-xs font-medium tracking-[0.14em] text-fg/80 uppercase">
			<span className="relative flex size-2">
				<span className="absolute inline-flex size-full rounded-full bg-accent opacity-50 motion-safe:animate-ping" />
				<span className="relative inline-flex size-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
			</span>
			{children}
		</span>
	);
}

/** Puts an interactive 3D logo in the corner of a slide. */
function Frame({ bg, children }: { bg?: LogoKind; children: ReactNode }) {
	return (
		<div className="relative h-full w-full">
			{bg && <Logo3D kind={bg} />}
			<div className="relative z-10 h-full w-full">{children}</div>
		</div>
	);
}

export function CardsSlide(p: {
	title: string;
	tag?: string;
	bg?: LogoKind;
	cards: { icon: LucideIcon; title: string; text: string }[];
	cols?: 2 | 3 | 4;
	note?: string;
}) {
	const grid = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[
		p.cols ?? 3
	];
	return (
		<Frame bg={p.bg}>
			<Slide layout="top">
				{p.tag && <Tag>{p.tag}</Tag>}
				<Heading gradient>{p.title}</Heading>
				<Reveal
					className={`grid ${grid} gap-5`}
					effect="scale"
					delay={0.3}
					stagger={0.1}
				>
					{p.cards.map(({ icon: Icon, title, text }, i) => (
						<Card key={title} className="h-full">
							<motion.span
								className="inline-block cursor-pointer"
								initial={{ scale: 0, rotate: -60 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{
									type: "spring",
									stiffness: 220,
									damping: 12,
									delay: 0.6 + i * 0.1,
								}}
								whileHover={{ rotate: 360, scale: 1.3 }}
							>
								<Icon className="size-7 text-accent" />
							</motion.span>
							<h3 className="mt-3 text-xl font-semibold">{title}</h3>
							<p className="mt-2 text-base text-muted">{text}</p>
						</Card>
					))}
				</Reveal>
				{p.note && <p className="mt-6 text-lg text-accent-2">{p.note}</p>}
			</Slide>
		</Frame>
	);
}

/** Same API as CardsSlide, with blueprint-style feature cards (feature-section.tsx). */
export function FeatureSlide(p: {
	title: string;
	tag?: string;
	bg?: LogoKind;
	cards: { icon: LucideIcon; title: string; text: string; points?: string[] }[];
	cols?: 2 | 3 | 4;
	note?: string;
}) {
	const grid = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[
		p.cols ?? 3
	];
	return (
		<Frame bg={p.bg}>
			<Slide layout="top">
				{p.tag && <Tag>{p.tag}</Tag>}
				<Heading gradient>{p.title}</Heading>
				<Reveal
					className={`mt-2 grid ${grid} gap-4 px-2`}
					itemClassName="h-full"
					effect="scale"
					delay={0.3}
					stagger={0.1}
				>
					{p.cards.map((card, i) => (
						<FeatureCard
							key={card.title}
							feature={card}
							index={i}
							className={p.cols === 2 ? "min-h-64" : "min-h-72"}
						/>
					))}
				</Reveal>
				{p.note && (
					<p className="mt-4 flex items-center gap-3 text-lg text-accent-2">
						<span className="h-px w-8 bg-accent" />
						{p.note}
					</p>
				)}
			</Slide>
		</Frame>
	);
}

export function TableSlide(p: {
	title: string;
	tag?: string;
	bg?: LogoKind;
	head: string[];
	rows: string[][];
	note?: string;
}) {
	return (
		<Frame bg={p.bg}>
			<Slide layout="top" stagger={false}>
				{p.tag && <Tag>{p.tag}</Tag>}
				<Heading gradient>{p.title}</Heading>
				<table className="w-full border-collapse text-left text-lg">
					<thead>
						<tr className="border-b border-border text-accent">
							{p.head.map((h) => (
								<th key={h} className="px-4 py-3 font-semibold">
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{p.rows.map((r, i) => (
							<motion.tr
								key={r[0]}
								className="border-b border-border/60"
								initial={{ opacity: 0, x: -28 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									delay: 0.4 + i * 0.12,
									duration: 0.5,
									ease: [0.22, 1, 0.36, 1],
								}}
								whileHover={{ backgroundColor: "rgba(128,128,128,0.14)" }}
							>
								{r.map((c, k) => (
									<td
										key={k}
										className={`px-4 py-2.5 ${k === 0 ? "font-semibold" : "text-muted"}`}
									>
										{c}
									</td>
								))}
							</motion.tr>
						))}
					</tbody>
				</table>
				{p.note && <p className="mt-5 text-lg text-accent-2">{p.note}</p>}
			</Slide>
		</Frame>
	);
}

export function ListSlide(p: {
	title: string;
	tag?: string;
	bg?: LogoKind;
	intro?: string;
	items: string[];
	/** Rendered as a dashed Note callout; `variant: "card"` uses the plain Card. */
	aside?: { title: string; text: string; variant?: "card" | "note" };
}) {
	return (
		<Frame bg={p.bg}>
			<Slide layout="top">
				{p.tag && <Tag>{p.tag}</Tag>}
				<Heading gradient>{p.title}</Heading>
				{p.intro && <p className="max-w-4xl text-xl text-muted">{p.intro}</p>}
				<div className="grid grid-cols-[1.2fr_1fr] items-start gap-10">
					<Reveal
						as="ul"
						effect="fade-right"
						delay={0.3}
						stagger={0.1}
						className="space-y-3 text-2xl"
					>
						{p.items.map((t) => (
							<li key={t} className="flex gap-3">
								<span className="mt-3 size-2 shrink-0 rounded-full bg-accent" />
								{t}
							</li>
						))}
					</Reveal>
					{p.aside && (
						<Reveal each={false} effect="fade-left" delay={0.6}>
							{p.aside.variant !== "card" ? (
								<Note title={p.aside.title}>{p.aside.text}</Note>
							) : (
								<Card>
									<h3 className="text-xl font-semibold text-accent">
										{p.aside.title}
									</h3>
									<p className="mt-2 text-lg text-muted">{p.aside.text}</p>
								</Card>
							)}
						</Reveal>
					)}
				</div>
			</Slide>
		</Frame>
	);
}

function DashedLine({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("absolute border border-dashed border-border", className)}
			{...props}
		/>
	);
}

/** Blueprint-style callout: dashed frame with "+" corner marks. */
export function Note({
	title,
	icon: Icon = Lightbulb,
	children,
	className,
}: {
	title?: string;
	icon?: LucideIcon;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("group relative bg-surface/60 p-7", className)}>
			{(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
				(pos) => (
					<DecorIcon
						key={pos}
						position={pos}
						className="size-6 stroke-2 stroke-border transition-[stroke] duration-300 group-hover:stroke-accent"
					/>
				),
			)}
			<DashedLine className="-top-[1.5px] right-3 left-3" />
			<DashedLine className="top-3 -right-[1.5px] bottom-3" />
			<DashedLine className="top-3 bottom-3 -left-[1.5px]" />
			<DashedLine className="right-3 -bottom-[1.5px] left-3" />

			{title && (
				<h3 className="flex items-center gap-2.5 text-xl font-semibold text-accent">
					<Icon className="size-6" />
					{title}
				</h3>
			)}
			<div
				className={cn("text-lg leading-relaxed text-muted", title && "mt-3")}
			>
				{children}
			</div>
		</div>
	);
}
