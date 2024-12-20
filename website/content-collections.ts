import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import rehypePrettyCode, { type Options } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { capitalize } from 'remeda'
import { visit } from 'unist-util-visit'

const options: Options = {
  defaultLang: 'tsx',
  keepBackground: false,
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
}

const docs = defineCollection({
  name: 'docs',
  directory: 'src/docs',
  include: '**/*.mdx',
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
  transform: async (doc, ctx) => {
    const mdx = await compileMDX(ctx, doc, {
      rehypePlugins: [
        rehypeSlug,
        [rehypePrettyCode, options],
        () => (tree) => {
          visit(tree, 'element', (node, _, parent) => {
            if (node.tagName === 'code' && node.data && node.data.meta) {
              const meta = node.data.meta as string
              const filenameMatch = meta.match(/filename="([^"]+)"/)

              if (filenameMatch && parent?.tagName === 'pre') {
                if (!parent.properties) {
                  parent.properties = {}
                }
                parent.properties.filename = filenameMatch[1]
              }
            }
          })
        },
      ],
    })

    const getTableOfContents = (markdown: string) => {
      const headings = markdown.match(/#+\s.+/g) || []
      return headings.map((heading) => ({
        value: heading.replace(/#+\s/, ''),
        id: heading.replace(/#+\s/, '').toLowerCase().replace(/ /g, '-'),
      }))
    }

    return {
      ...doc,
      mdx,
      slug: doc.title.toLowerCase().replace(/ /g, '-'),
      group: capitalize(doc._meta.directory),
      tableOfContents: getTableOfContents(doc.content),
    }
  },
})

export default defineConfig({
  collections: [docs],
})
