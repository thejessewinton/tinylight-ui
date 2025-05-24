import Link, { type LinkProps } from 'next/link'
import type { ComponentPropsWithRef, ReactNode } from 'react'

import { type VariantProps, cva } from 'cva'
import { cn } from '~/utils/cn'

const button = cva(
  'relative flex min-h-12 w-fit cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-md px-3 no-underline outline-hidden outline-offset-2 transition-colors focus:ring-1 focus:ring-sky-600/75 disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      variant: {
        dark: 'bg-neutral-800 hover:bg-neutral-950 text-neutral-200',
        light: 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900',
      },
    },
    defaultVariants: {
      variant: 'dark',
    },
  },
)

type Variant = VariantProps<typeof button>['variant']

type ButtonProps =
  | ({
      variant?: Variant
      href?: never
      icon?: ReactNode
    } & ComponentPropsWithRef<'button'>)
  | ({
      variant?: Variant
      href: string
      icon?: ReactNode
    } & ComponentPropsWithRef<'a'> &
      LinkProps<string>)

export const Button = ({
  children,
  icon,
  className,
  variant,
  ...props
}: ButtonProps) => {
  if (props.href === undefined) {
    return (
      <button className={cn(button({ variant }), className)} {...props}>
        {icon ? icon : null}
        {children}
      </button>
    )
  }

  return (
    <Link className={cn(button({ variant }), className)} {...props}>
      {icon ? icon : null}
      {children}
    </Link>
  )
}
