'use client'

type TableOfContentsProps = {
  headings?: Array<{ value: string; id: string }>
}

export const TableOfContents = ({ headings }: TableOfContentsProps) => {
  return (
    <div className="sticky top-16 hidden h-fit w-xs pb-2 md:block">
      {headings?.length ? (
        <>
          <div className="flex items-center gap-2 font-medium text-secondary text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M2.75 12H21.25M2.75 5.75H21.25M2.75 18.25H11.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Table of contents
          </div>
          <ul className="mt-4 h-fit space-y-2 border-neutral-200 border-l pl-6 dark:border-neutral-700/40">
            {headings.map((heading) => (
              <li key={heading.value}>
                <a href={`#${heading.id}`}>{heading.value}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}
