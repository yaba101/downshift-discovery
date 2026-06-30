import * as React from 'react'
import { cn } from '../../lib/utils'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'sage' | 'clay' | 'ink' | 'cobalt' | 'plum'
}

const toneClasses = {
  neutral: 'border-line bg-paper text-muted',
  sage: 'border-sage/25 bg-sage/10 text-sage',
  clay: 'border-clay/25 bg-clay/10 text-clay',
  ink: 'border-ink/15 bg-ink/10 text-ink',
  cobalt: 'border-cobalt/25 bg-cobalt/10 text-cobalt',
  plum: 'border-plum/25 bg-plum/10 text-plum',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold leading-none',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
