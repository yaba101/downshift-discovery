import * as React from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <article className={cn('rounded-lg border border-line bg-white shadow-sm', className)} {...props} />
}
