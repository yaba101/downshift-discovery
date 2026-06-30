import * as React from 'react'
import { cn } from '../../lib/utils'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'sage' | 'clay' | 'ink'
}

const toneClasses = {
  neutral: 'border-line bg-white/80 text-muted',
  sage: 'border-sage/25 bg-sage/10 text-sage',
  clay: 'border-clay/25 bg-clay/10 text-clay',
  ink: 'border-ink/15 bg-ink/10 text-ink',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold leading-none',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
