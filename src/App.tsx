import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import { deckConfig } from "@/deck.config";
import { Controls } from "@/engine/Controls";
import { Deck } from "@/engine/Deck";
import { Overview } from "@/engine/Overview";
import { ProgressBar } from "@/engine/ProgressBar";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useHashSync } from "@/hooks/useHashSync";
import { useIdle } from "@/hooks/useIdle";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { cn } from "@/lib/utils";
import { slides } from "@/slides";
import { useDeckStore } from "@/store/deck";

useDeckStore.getState().setTotal(slides.length);

export default function App() {
	const index = useDeckStore((s) => s.index);
	const idle = useIdle(deckConfig.idleTimeout);
	const { toggle: toggleFullscreen } = useFullscreen();

	useHashSync();
	useKeyboardNav({
		onToggleFullscreen: toggleFullscreen,
	});

	useEffect(() => {
		const title = slides[index]?.title;
		document.title = `${index + 1}/${slides.length}${title ? ` · ${title}` : ""} ${deckConfig.title}`;
	}, [index]);

	return (
		<MotionConfig reducedMotion="user">
			<div
				className={cn(
					"relative h-dvh w-screen overflow-hidden bg-bg text-fg",
					idle && "cursor-none",
				)}
			>
				<ProgressBar />
				<Deck />
				<Overview />
				<Controls idle={idle} />
			</div>
		</MotionConfig>
	);
}
