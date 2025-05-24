'use client'

import { Bars2Icon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { groupBy, sortBy } from 'remeda'
import { Drawer } from 'vaul'
import { allDocs } from '~/content-collections'
import { cn } from '~/utils/cn'
import { ThemeSwitcher } from '../ui/theme-switcher'

export const MobileSidebar = () => {
  const groupedDocs = groupBy(
    sortBy(
      allDocs.filter((doc) => doc.published),
      [(doc) => doc.order, 'asc'],
    ),
    (doc) => doc.group,
  )
  const pathname = usePathname()

  return (
    <header className="mb-12 flex items-center justify-between border-neutral-200 border-b bg-neutral-100 px-4 py-3 lg:hidden dark:border-neutral-700/40 dark:bg-neutral-800/40">
      <Link href="/">
        <h2 className="font-serif text-2xl italic">tinylight</h2>
      </Link>

      <Drawer.Root direction="right">
        <Drawer.Title className="sr-only">Mobile sidebar</Drawer.Title>
        <Drawer.Description className="sr-only">
          This is the mobile sidebar
        </Drawer.Description>
        <Drawer.Trigger>
          <Bars2Icon className="size-6" />
        </Drawer.Trigger>

        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
        <Drawer.Content className="fixed top-0 right-0 bottom-0 z-10 flex outline-none">
          <nav className="mt-2 mr-2 mb-2 flex w-[260px] flex-1 flex-col rounded-xl bg-main px-4 py-8">
            {Object.entries(groupedDocs).map(([group, docs]) => {
              return (
                <div key={group} className="w-full space-y-1">
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
        </Drawer.Content>
      </Drawer.Root>
    </header>
  )
}
