# Cloud and Parallel Architectures slide deck

A presentation engine built with Vite, React, TypeScript and Tailwind v4. Each slide is a React component.

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm build     # type-check + production build into dist/
pnpm preview   # serve the production build
```

## Add a slide

1. Create `src/slides/04-my-slide.tsx`:

   ```tsx
   import { Slide, Reveal, Step } from '@/components/deck'
   import { Heading } from '@/components/ui/Heading'

   export default function MySlide() {
     return (
       <Slide layout="top">
         <Heading>My title</Heading>
         <Reveal effect="fade-up">            {/* children appear one after another */}
           <p>First</p>
           <p>Second</p>
         </Reveal>
         <Step>Shown on the 1st → press</Step>
         <Step dim>Shown on the 2nd → press (and dims after)</Step>
       </Slide>
     )
   }
   ```

2. Register it in `src/slides/index.ts`. Add the import, then one line in the array:

   ```ts
   import MySlide from './04-my-slide'
   // …
   { component: MySlide, title: 'My slide', transition: 'blur' },
   ```

The array order is the slide order. `title` is the label shown in the overview grid.

## Change a transition

Set `transition` on the slide's entry in `src/slides/index.ts`:

| value   | effect                               |
| ------- | ------------------------------------ |
| `fade`  | cross-fade (default)                 |
| `slide` | push along the deck's axis (up/down) |
| `zoom`  | scale in/out                         |
| `blur`  | blur + fade                          |
| `flip`  | 3D turn over the horizontal axis     |
| `none`  | instant cut                          |

The entering slide's transition is used going forward. Going back, the leaving slide's transition plays in reverse.
Slides move **vertically** (↓ / ↑, swipe up/down); set `orientation: 'horizontal'` in `src/deck.config.ts` for left/right. To change the fallback transition, edit `defaultTransition` there too. To tweak timings or add a new transition, edit `src/engine/transitions.ts`.

## Authoring API (`@/components/deck`)

| Component | Props | Notes |
| --- | --- | --- |
| `<Slide>` | `layout` (`center` · `top` · `split`), `stagger`, `effect`, `staggerDelay`, `delay`, `className` | Root of every slide. Animates its direct children one after another. Long content scrolls smoothly with Lenis. Use `stagger={false}` to stop it wrapping children. |
| `<Reveal>` | `effect`, `delay`, `stagger`, `as` (`div` · `section` · `ul` · `ol`), `each`, `itemClassName` | Staggered entrance for any group. Use `each={false}` to animate the block as a whole. |
| `<Step>` | `at`, `effect`, `dim`, `as` (`div` · `li` · `span`) | Step-by-step builds. Steps are numbered automatically in document order. Give several steps the same `at` to show them together. |
| `<ScrollArea>` | `className`, `contentClassName` | Smooth (Lenis) scrolling for overflowing content. |

Effects: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `scale`, `blur`, `flip`.

Slides are laid out on a fixed **1280×720** canvas that scales to fit any screen. Size things for that canvas.

Ready-made extras:
- `@/components/ui`: `Heading` (with a `gradient` option), `Card` (hover lift and a spotlight that follows the cursor), `Badge`, `GlobeCdn` (dark dotted [cobe](https://github.com/shuding/cobe) globe with a red/white rim light, red location dots and labels; drag to spin and tilt). Change the locations by passing `locations` / `links`, or edit the defaults in `src/components/ui/cobe-globe-cdn.tsx`.
- `@/components/wensity`: `TextBlurReveal`, `TextShimmer`. Add more with `pnpm dlx wensity add <slug>` (`pnpm dlx wensity list` shows what's available).
- `@/components/reactbits/SplitText`: inside slides, use `trigger="load"` because slides don't scroll into view. Add more with `pnpm dlx shadcn@latest add @react-bits/<Name>-JS-CSS`.
- Icons come from `lucide-react`.

## Controls

| Key | Action |
| --- | --- |
| → ↓ Space PageDown Enter | next step / slide |
| ← ↑ Shift+Space PageUp Backspace | previous |
| Home / End | first / last slide |
| F | fullscreen |
| T | toggle theme |
| Esc / O | overview grid (arrow keys move the highlight, Enter opens a slide) |

Clicking the slide does nothing (set `clickToNavigate: true` in `src/deck.config.ts` to turn click-to-advance back on). You can also swipe on touch screens or use the floating control bar. The bar and cursor hide when the pointer is idle.
The URL hash (`#3`) follows the current slide, so a refresh keeps your place.

## Themes

Light and dark themes are CSS variables in `src/index.css` (`:root` and `[data-theme="dark"]`). Tailwind exposes them as `bg-bg`, `text-fg`, `text-muted`, `bg-surface`, `border-border`, `text-accent`, `text-accent-2` and so on.
The deck follows the system theme until you toggle it. Your choice is then saved in `localStorage` under `deck-theme`; delete that key to follow the system again. An inline script in `index.html` sets the theme before the first paint, so there's no flash. Toggling plays a circular reveal using the View Transitions API.

`prefers-reduced-motion` is respected: slide transitions become fades, entrance transforms are disabled, and the globe stops auto-rotating.

## Configuration (`src/deck.config.ts`)

`title`, `subtitle`, canvas `width`/`height`, `orientation`, `defaultTransition`, `clickToNavigate`, `idleTimeout`.

## Project structure

```
src/
├── slides/                 ← your content
│   ├── index.ts            slide registry (order, title, transition)
│   ├── types.ts
│   └── 01-title.tsx …      one component per slide
├── components/
│   ├── deck/               authoring API: Slide, Reveal, Step, ScrollArea, contexts
│   ├── ui/                 Heading, Card, Badge, cobe-globe-cdn
│   ├── wensity/            Wensity components (installed via CLI)
│   └── reactbits/          React Bits components (installed via shadcn)
├── engine/                 the presentation runtime
│   ├── Deck.tsx            AnimatePresence stage + transitions
│   ├── Stage.tsx           scales the 1280×720 canvas to the viewport
│   ├── SlideRenderer.tsx   wraps a slide with its contexts
│   ├── transitions.ts      fade / slide / zoom / blur / flip / none
│   ├── Overview.tsx        thumbnail grid
│   └── Controls.tsx, ProgressBar.tsx, SlideCounter.tsx, ThemeToggle.tsx, IconButton.tsx
├── hooks/                  useSlides, useKeyboardNav, useTheme, useFullscreen,
│                           useHashSync, useSwipeNav, useIdle, useElementSize, …
├── store/                  zustand stores (deck position/steps, theme)
├── lib/                    cn(), hash parsing, overview layout
├── deck.config.ts
├── index.css               Tailwind + theme tokens
└── App.tsx
```
