<div align="center">

# Hyperscale Data Centers

### Dedicated Hardware and Parallel Architectures at Meta and Amazon

An interactive slide deck on **cloud and parallel architectures**: how Meta (Facebook) and Amazon Web Services design their own servers, chips, networks and data centers.

Built with **React · TypeScript · Vite · Tailwind CSS v4**

</div>

---

## Authors

- Laroui Riadh Brahim
- Bader Mohammed Chakib

## What the presentation covers

23 slides in 10 sections, from the basics of cloud and parallel computing to a comparison of AWS and Meta.

| # | Section | Slides |
| -- | --- | -- |
| 1 | Title and agenda | 2 |
| 2 | Introduction to Cloud and Parallel Computing | 3 |
| 3 | Fundamentals of Cloud Architecture | 2 |
| 4 | Parallel Processing and Distributed Systems | 2 |
| 5 | Amazon AWS: Infrastructure and Hardware (Graviton, Nitro, storage) | 3 |
| 6 | Meta (Facebook): Infrastructure and Hardware (OCP, network fabric, AI) | 2 |
| 7 | Networking, Storage and Virtualization (VMs vs containers) | 3 |
| 8 | Performance, Scalability and Fault Tolerance | 1 |
| 9 | Comparison between AWS and Meta architectures | 2 |
| 10 | Current Trends and Future Directions | 2 |
| 11 | Conclusion | 1 |

## Features

- Smooth slide transitions (fade, slide, zoom, blur, flip), set per slide
- Step-by-step reveals and staggered entrance animations
- Interactive 3D logos (cloud, AWS, Meta, chip) that tilt toward the mouse
- Interactive globe on the title slide (drag to rotate)
- Light and dark themes
- Overview grid, fullscreen mode, touch swipe, and a URL hash that keeps your place on refresh
- Respects `prefers-reduced-motion`

## Getting started

Requires [Node.js](https://nodejs.org) 20+ and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/ArkLr/project7.git
cd project7
pnpm install
pnpm dev        # http://localhost:5173
```

Other commands:

```bash
pnpm build      # type-check + production build into dist/
pnpm preview    # serve the production build
```

## Controls

| Key | Action |
| --- | --- |
| → ↓ Space Enter PageDown | Next step / slide |
| ← ↑ Backspace PageUp | Previous |
| Home / End | First / last slide |
| F | Fullscreen |
| T | Toggle light / dark theme |
| Esc or O | Overview grid (arrow keys to move, Enter to open) |

Touch screens: swipe up or down. The control bar and cursor hide when the pointer is idle.

## Project structure

```
src/
├── slides/
│   ├── index.ts                 slide order, titles and transitions
│   ├── 01-title.tsx             title slide (globe)
│   ├── 02-agenda.tsx            10-card agenda
│   ├── 03-… to 12-Conclusion    one file per section, each exports a `slides` list
│   ├── kit.tsx                  slide templates: CardsSlide, TableSlide, ListSlide
│   └── logo3d.tsx               extruded 3D logos (cloud, aws, meta, chip)
├── components/                  deck API (Slide, Reveal, Step), UI, effects
├── engine/                      presentation runtime and transitions
├── hooks/  store/  lib/         navigation, theme, state helpers
└── deck.config.ts               title, canvas size, default transition
```

Slides are laid out on a fixed **1280 × 720** canvas that scales to fit any screen.

## Editing the content

Most slides are written as data using the templates in `kit.tsx`. To change a slide's text, open its section file and edit it:

```tsx
<CardsSlide bg="aws" title="AWS custom hardware" tag="4. Amazon AWS" cols={2}
  cards={[
    { icon: Cpu, title: 'Graviton processors', text: '…' },
    { icon: Zap, title: 'Nitro System',        text: '…' },
  ]} />
```

| Template | Use it for |
| --- | --- |
| `CardsSlide` | A grid of 2 to 6 cards with icon, heading and text |
| `TableSlide` | Comparisons, with rows that animate in |
| `ListSlide` | Bullet points with an optional side box |

Template options:

- `bg`: the 3D logo in the corner (`cloud`, `aws`, `meta`, `chip`, `compare`)
- `tag`: the small section label above the title
- `note`: a highlighted closing line

**Add a slide:** add an entry to a section file's `slides` list. Each entry has a `title`, a `transition` (`fade` · `slide` · `zoom` · `blur` · `flip` · `none`) and a `component`.

**Add a new section:** create `NN-name.tsx` that exports `slides`, import it in `src/slides/index.ts`, and spread it into the array.

**Custom slide:** write a normal component with `<Slide>`, `<Reveal>` and `<Step>` from `@/components/deck`, then register it in `index.ts` as `{ component: MySlide, title: '…', transition: '…' }`.

Keep each slide to roughly the height of the canvas: content taller than 720px makes a scroll bar appear.

## Theming

Light and dark themes are CSS variables in `src/index.css`. They are used as Tailwind classes such as `bg-bg`, `text-fg`, `text-muted`, `bg-surface`, `border-border`, `text-accent`. The deck follows the system theme until you toggle it, and then remembers your choice.

## Built with

- [React](https://react.dev), [TypeScript](https://www.typescriptlang.org), [Vite](https://vite.dev), [Tailwind CSS](https://tailwindcss.com)
- [Motion](https://motion.dev) for animation, [Lenis](https://lenis.darkroom.engineering) for smooth scrolling, [Zustand](https://zustand.docs.pmnd.rs) for state
- [cobe](https://github.com/shuding/cobe) for the globe, [Lucide](https://lucide.dev) for icons
- [React Bits](https://reactbits.dev) and [Wensity](https://wensity.com) for text effects

## Notes

- AWS, Amazon, Meta and Facebook are trademarks of their respective owners. The 3D logos in this project are simplified drawings made for an educational presentation.
- Figures and product names come from the authors' course material and public information from AWS and Meta (for example Graviton, Nitro, and the Open Compute Project). Check them against current sources before reusing.
