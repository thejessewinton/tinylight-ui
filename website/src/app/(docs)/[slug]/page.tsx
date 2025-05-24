import { MDXContent } from '@content-collections/mdx/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TableOfContents } from '~/components/docs/table-of-contents'
import { allDocs } from '~/content-collections'
import { components } from '~/mdx-components'

type DocsPageParams = {
  params: Promise<{
    slug: string
  }>
}

export const generateMetadata = async ({
  params,
}: DocsPageParams): Promise<Metadata> => {
  const slug = (await params).slug
  const content = allDocs.find((doc) => doc.slug === slug)

  if (!content) {
    notFound()
  }

  return {
    title: content.title,
    description: content.description,
  }
}

export default async function DocsPage({ params }: DocsPageParams) {
  const slug = (await params).slug
  const content = allDocs.find((doc) => doc.slug === slug)

  if (!content) {
    notFound()
  }

  return (
    <>
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-3 font-semibold text-4xl lg:mb-4">{content.title}</h1>

        <div className="space-y-8">
          <p className="text-lg text-secondary">{content.description}</p>
          <div className="mt-16 space-y-8">
            <MDXContent code={content.mdx} components={components} />
          </div>
        </div>
      </div>
      <TableOfContents headings={content.tableOfContents} />
    </>
  )
}
