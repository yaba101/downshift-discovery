import * as React from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <article className={cn('rounded-lg border border-line bg-paper shadow-sm', className)} {...props} />
}
