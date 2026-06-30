import * as React from 'react'
import { cn } from '../../lib/utils'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>
}

export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-14 w-full rounded-md border border-line bg-white px-5 text-base text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-ink focus:ring-4 focus:ring-ink/10',
        className,
      )}
      {...props}
    />
  )
}
