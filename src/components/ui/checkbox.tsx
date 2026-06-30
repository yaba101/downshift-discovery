import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'grid size-5 place-items-center rounded border border-line bg-white text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink data-[state=checked]:border-ink data-[state=checked]:bg-ink',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
