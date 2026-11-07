import type { LucideIcon } from 'lucide-react'
import { Reveal, Slide } from '@/components/deck'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'

/** Reusable slide templates, sized for the 1280×720 canvas. */

export function CardsSlide(p: {
  title: string
  tag?: string
  cards: { icon: LucideIcon; title: string; text: string }[]
  cols?: 2 | 3 | 4
  note?: string
}) {
  const grid = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[p.cols ?? 3]
  return (
    <Slide layout="top">
      {p.tag && <Badge>{p.tag}</Badge>}
      <Heading gradient>{p.title}</Heading>
      <Reveal className={`grid ${grid} gap-5`} effect="scale" delay={0.3} stagger={0.1}>
        {p.cards.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="h-full">
            <Icon className="size-7 text-accent" />
            <h3 className="mt-3 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-base text-muted">{text}</p>
          </Card>
        ))}
      </Reveal>
      {p.note && <p className="mt-6 text-lg text-accent-2">{p.note}</p>}
    </Slide>
  )
}

export function TableSlide(p: { title: string; tag?: string; head: string[]; rows: string[][]; note?: string }) {
  return (
    <Slide layout="top" stagger={false}>
      {p.tag && <Badge>{p.tag}</Badge>}
      <Heading gradient>{p.title}</Heading>
      <Reveal each={false} effect="fade-up" delay={0.3}>
        <table className="w-full border-collapse text-left text-lg">
          <thead>
            <tr className="border-b border-border text-accent">
              {p.head.map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.rows.map((r) => (
              <tr key={r[0]} className="border-b border-border/60">
                {r.map((c, i) => (
                  <td key={i} className={`px-4 py-2.5 ${i === 0 ? 'font-semibold' : 'text-muted'}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      {p.note && <p className="mt-5 text-lg text-accent-2">{p.note}</p>}
    </Slide>
  )
}

export function ListSlide(p: { title: string; tag?: string; intro?: string; items: string[]; aside?: { title: string; text: string } }) {
  return (
    <Slide layout="top">
      {p.tag && <Badge>{p.tag}</Badge>}
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
  )
}