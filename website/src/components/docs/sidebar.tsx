'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { groupBy, sortBy } from 'remeda'
import { allDocs } from '~/content-collections'
import { cn } from '~/utils/cn'
import { ThemeSwitcher } from '../ui/theme-switcher'

export const Sidebar = () => {
  const groupedDocs = groupBy(
    sortBy(
      allDocs.filter((doc) => doc.published),
      [(doc) => doc.order, 'asc'],
    ),
    (doc) => doc.group,
  )
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 hidden max-h-screen flex-1 flex-col gap-8 border-neutral-200 border-r bg-accent/20 px-4 py-8 md:flex dark:border-neutral-700/40">
      <Link href="/">
        <h2 className="font-serif text-3xl italic">tinylight</h2>
      </Link>
      {Object.entries(groupedDocs).map(([group, docs]) => {
        return (
          <div key={group} className="space-y-1">
            <h3 className="mb-3 px-2 font-semibold text-secondary text-sm">
              {group}
            </h3>
            {docs?.map((doc) => {
              return (
                <Link
                  key={doc.slug}
                  href={`/${doc.slug}`}
                  className={cn(
                    'block w-full rounded-lg px-2 transition-colors hover:bg-neutral-300/60 hover:dark:bg-neutral-800',
                    {
                      'bg-neutral-300/60 dark:bg-neutral-800':
                        pathname === `/${doc.slug}`,
                    },
                  )}
                >
                  {doc.title}
                </Link>
              )
            })}
          </div>
        )
      })}
      <div className="mt-auto mb-0">
        <ThemeSwitcher />
      </div>
    </nav>
  )
}
