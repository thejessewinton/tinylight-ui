'use client'

import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid'
import copy from 'copy-to-clipboard'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'

import { useCallback, useState } from 'react'
import { cn } from '~/utils/cn'

const variants = {
  visible: { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
  hidden: { opacity: 0, transform: 'translateY(10px)', filter: 'blur(4px)' },
}

export const CopyButton = ({
  className,
  content,
}: { content: string; className?: string }) => {
  const [copying, setCopying] = useState(0)

  const onCopy = useCallback(() => {
    copy(content)
    setCopying((c) => c + 1)
    setTimeout(() => {
      setCopying((c) => c - 1)
    }, 2000)
  }, [content])

  return (
    <button
      className={cn(
        'cursor-pointer transition-opacity hover:opacity-75',
        className,
      )}
      type="button"
      onClick={onCopy}
    >
      <div aria-label="Copy code">
        <MotionConfig>
          <AnimatePresence initial={false} mode="wait">
            {copying ? (
              <motion.div
                animate="visible"
                exit="hidden"
                initial="hidden"
                key="check"
                variants={variants}
              >
                <CheckIcon className="size-4 text-tertiary" />
              </motion.div>
            ) : (
              <DocumentDuplicateIcon className="size-4 text-tertiary" />
            )}
          </AnimatePresence>
        </MotionConfig>
      </div>
    </button>
  )
}
