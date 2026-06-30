import * as React from 'react'
import { cn } from '../../lib/utils'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'sage' | 'clay' | 'ink' | 'cobalt' | 'plum'
}

const toneClasses = {
  neutral: 'border-transparent bg-sage-button text-olive',
  sage: 'border-transparent bg-sage-button text-olive',
  clay: 'border-transparent bg-white text-olive',
  ink: 'border-transparent bg-olive text-white',
  cobalt: 'border-transparent bg-sage-button text-olive',
  plum: 'border-transparent bg-sage-button text-olive',
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
