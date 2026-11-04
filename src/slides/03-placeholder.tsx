import { Box, Layers, Sparkles } from 'lucide-react'
import { Reveal, Slide } from '@/components/deck'
import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'

// Placeholder — shows a staggered <Reveal> group and hover cards.
export default function PlaceholderReveal() {
  return (
    <Slide layout="top">
      <Heading gradient>Placeholder</Heading>
      <Reveal className="grid grid-cols-3 gap-6" effect="scale" delay={0.45} stagger={0.12}>
        {[Box, Layers, Sparkles].map((Icon, i) => (
          <Card key={i} className="h-56">
            <Icon className="size-8 text-accent" />
            <p className="mt-4 font-mono text-sm text-muted">Card {i + 1}</p>
          </Card>
        ))}
      </Reveal>
    </Slide>
  )
}
