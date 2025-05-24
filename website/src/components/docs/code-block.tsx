import { CommandLineIcon, DocumentIcon } from '@heroicons/react/24/solid'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import type { BundledLanguage } from 'shiki'
import { unified } from 'unified'
import { getCodeFromFile } from '~/utils/code'
import { CopyButton } from './copy-button'

export type CodeRendererProps = {
  title?: string
  lang: BundledLanguage
} & (
  | { children: string; filePath?: never }
  | { filePath: string; children?: never }
)

export const CodeBlock = async ({
  filePath,
  children,
  title,
  lang,
}: CodeRendererProps) => {
  const highlightCode = async (code: string) => {
    return String(
      await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypePrettyCode, {
          defaultLang: 'tsx',
          keepBackground: false,
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
        })
        .use(rehypeStringify)
        .process(code),
    )
  }

  const highlightedCode = await highlightCode(
    children ?? getCodeFromFile(filePath).trim(),
  )

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700/40">
      {title && (
        <div className="flex items-center justify-between gap-2 border-neutral-200 border-b bg-neutral-100 p-4 dark:border-neutral-700/40 dark:bg-neutral-800/40">
          <div className="flex items-center gap-2">
            {lang === 'bash' ? (
              <CommandLineIcon className="size-4 text-tertiary" />
            ) : (
              <DocumentIcon className="size-4 text-tertiary" />
            )}
            <span className="font-medium text-sm text-tertiary">{title}</span>
          </div>
          <CopyButton content={children ?? getCodeFromFile(filePath)} />
        </div>
      )}

      <section
        className="overflow-auto p-4"
        dangerouslySetInnerHTML={{
          __html: highlightedCode,
        }}
      />
    </div>
  )
}
