import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/utils/cn'

const Root = ({ className, ...props }: ComponentPropsWithoutRef<'table'>) => {
  return (
    <table
      className={cn('w-full overflow-hidden rounded-lg', className)}
      {...props}
    />
  )
}

const Body = ({ className, ...props }: ComponentPropsWithoutRef<'tbody'>) => {
  return <tbody className={cn(className)} {...props} />
}

const Head = ({ className, ...props }: ComponentPropsWithoutRef<'thead'>) => {
  return <thead className={cn(className)} {...props} />
}

const Row = ({ className, ...props }: ComponentPropsWithoutRef<'tr'>) => {
  return <tr className={cn(className)} {...props} />
}

const Cell = ({ className, ...props }: ComponentPropsWithoutRef<'td'>) => {
  return <td className={cn('px-6 py-1.5', className)} {...props} />
}

const Header = ({ className, ...props }: ComponentPropsWithoutRef<'th'>) => {
  return (
    <th
      className={cn(
        'border-neutral-200 border-b bg-neutral-100 px-6 py-1.5 text-left text-secondary first-of-type:w-[37%] dark:border-neutral-700/40 dark:bg-neutral-800/40',
        className,
      )}
      {...props}
    />
  )
}

export const Table = {
  Root,
  Body,
  Head,
  Row,
  Cell,
  Header,
}
