import type { ReactNode } from 'react'
import { MobileSidebar } from '~/components/docs/mobile-sidebar'
import { Sidebar } from '~/components/docs/sidebar'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-screen grid-cols-1 gap-4 md:[grid-template-columns:_240px_1fr]">
      <MobileSidebar />
      <Sidebar />
      <div className="flex gap-4 px-4 lg:px-8 lg:py-16 lg:pl-0">{children}</div>
    </div>
  )
}
