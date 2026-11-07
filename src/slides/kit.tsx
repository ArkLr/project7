import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Reveal, Slide } from '@/components/deck'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Backdrop, type BackdropVariant } from './backdrop'

/** Section tag with a green "active" dot. */
function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-sm text-muted">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full rounded-full bg-green-500 opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
      {children}
    </span>
  )
}

/** Puts an animated, mouse-reactive background behind a slide. */
function Frame({ bg, children }: { bg?: BackdropVariant; children: ReactNode }) {
  return (
    <div className="relative h-full w-full">
      {bg && <Backdrop variant={bg} />}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}

/** Reusable slide templates, sized for the 1280×720 canvas. */

export function CardsSlide(p: {
  title: string
  tag?: string
  bg?: BackdropVariant
  cards: { icon: LucideIcon; title: string; text: string }[]
  cols?: 2 | 3 | 4
  note?: string
}) {
  const grid = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[p.cols ?? 3]
  return (
    <Frame bg={p.bg}>
      <Slide layout="top">
        {p.tag && <Tag>{p.tag}</Tag>}
        <Heading gradient>{p.title}</Heading>
        <Reveal className={`grid ${grid} gap-5`} effect="scale" delay={0.3} stagger={0.1}>
          {p.cards.map(({ icon: Icon, title, text }, i) => (
            <Card key={title} className="h-full">
              {/* Icon pops in, and spins when hovered */}
              <motion.span
                className="inline-block cursor-pointer"
                initial={{ scale: 0, rotate: -60 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.6 + i * 0.1 }}
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
  )
}

export function TableSlide(p: { title: string; tag?: string; bg?: BackdropVariant; head: string[]; rows: string[][]; note?: string }) {
  return (
    <Frame bg={p.bg}>
      <Slide layout="top" stagger={false}>
        {p.tag && <Tag>{p.tag}</Tag>}
        <Heading gradient>{p.title}</Heading>
        <table className="w-full border-collapse text-left text-lg">
          <thead>
            <tr className="border-b border-border text-accent">
              {p.head.map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
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
                transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ backgroundColor: 'rgba(128,128,128,0.14)' }}
              >
                {r.map((c, k) => (
                  <td key={k} className={`px-4 py-2.5 ${k === 0 ? 'font-semibold' : 'text-muted'}`}>{c}</td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
        {p.note && <p className="mt-5 text-lg text-accent-2">{p.note}</p>}
      </Slide>
    </Frame>
  )
}

export function ListSlide(p: { title: string; tag?: string; bg?: BackdropVariant; intro?: string; items: string[]; aside?: { title: string; text: string } }) {
  return (
    <Frame bg={p.bg}>
      <Slide layout="top">
        {p.tag && <Tag>{p.tag}</Tag>}
        <Heading gradient>{p.title}</Heading>
        {p.intro && <p className="max-w-4xl text-xl text-muted">{p.intro}</p>}
        <div className="grid grid-cols-[1.2fr_1fr] items-start gap-10">
          <Reveal as="ul" effect="fade-right" delay={0.3} stagger={0.1} className="space-y-3 text-2xl">
            {p.items.map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-3 size-2 shrink-0 rounded-full bg-accent" />
                {t}
              </li>
            ))}
          </Reveal>
          {p.aside && (
            <Reveal each={false} effect="fade-left" delay={0.6}>
              <Card>
                <h3 className="text-xl font-semibold text-accent">{p.aside.title}</h3>
                <p className="mt-2 text-lg text-muted">{p.aside.text}</p>
              </Card>
            </Reveal>
          )}
        </div>
      </Slide>
    </Frame>
  )
}