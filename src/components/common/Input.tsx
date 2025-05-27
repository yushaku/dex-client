import { cn } from '@/utils'
import React from 'react'

type Props = React.ComponentProps<'input'> & {
  error?: string
}

export const Input = ({ className, error, ...props }: Props) => {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-gray-700 bg-layer p-3  focus:border-gray-500 focus:outline-hidden',
        className,
        {
          'border-red-400': error
        }
      )}
      {...props}
    />
  )
}
