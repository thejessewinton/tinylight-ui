'use client'
import './styles.css'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Slot } from '@radix-ui/react-slot'
import React from 'react'
import { Close, NextArrow, PreviousArrow } from './assets'
import { getValidChildren } from './helpers'
import { useIsomorphicLayoutEffect } from './hooks'

interface LightboxItem extends React.ReactElement {
  props: {
    type?: typeof LightboxVideo
    poster?: string
    src?: string
    asChild?: boolean
    children?: React.ReactElement & {
      props: LightboxImageProps | LightboxVideoProps
    }
  }
}

interface LightboxContextValue {
  items: LightboxItem[]
  setItems: (items: LightboxItem[]) => void
  activeItemIndex: number
  setActiveItemIndex: (index: number) => void
  toPrev: () => void
  toNext: () => void
  thumbnailRefs: React.RefObject<React.RefObject<HTMLButtonElement>[]>
}

const LightboxContext = React.createContext<LightboxContextValue | null>(null)

const useLightbox = () => {
  const context = React.useContext(LightboxContext)
  if (!context) {
    throw new Error('useLightbox must be used within a LightboxProvider')
  }
  return context
}

interface LightboxRootProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {}

const LightboxRoot = ({
  open: externalOpen,
  onOpenChange: externalOpenChange,
  ...props
}: LightboxRootProps) => {
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<LightboxContextValue['items']>([])
  const [activeItemIndex, setActiveItemIndex] = React.useState(0)

  const thumbnailRefs = React.useRef<
    (React.RefObject<HTMLButtonElement> | null)[]
  >([])

  React.useEffect(() => {
    thumbnailRefs.current = items.map(
      (_, index) => thumbnailRefs.current[index] || React.createRef(),
    )
  }, [items])

  const toPrev = React.useCallback(() => {
    setActiveItemIndex((current) => {
      const prevIndex = current - 1
      if (prevIndex < 0) {
        return 0
      }
      return prevIndex
    })
  }, [])

  const toNext = React.useCallback(() => {
    setActiveItemIndex((current) => {
      const nextIndex = current + 1
      if (nextIndex >= items.length) {
        return items.length - 1
      }
      return nextIndex
    })
  }, [items.length])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()

        let newIndex = activeItemIndex
        if (event.key === 'ArrowRight') {
          newIndex = Math.min(activeItemIndex + 1, items.length - 1)
          toNext()
        } else if (event.key === 'ArrowLeft') {
          newIndex = Math.max(activeItemIndex - 1, 0)
          toPrev()
        }

        // Focus the corresponding thumbnail
        const newRef = thumbnailRefs.current[newIndex]
        if (newRef?.current) {
          newRef.current.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toPrev, toNext, open, activeItemIndex, items.length])

  const contextValue = React.useMemo(
    () => ({
      items,
      setItems,
      activeItemIndex,
      setActiveItemIndex,
      toPrev,
      toNext,
      thumbnailRefs,
    }),
    [items, activeItemIndex, toPrev, toNext],
  )

  return (
    <LightboxContext.Provider value={contextValue}>
      <DialogPrimitive.Root
        open={externalOpen ?? open}
        onOpenChange={(e) => {
          if (externalOpen === undefined) {
            setOpen(e)
          } else {
            externalOpenChange(e)
          }
          setTimeout(() => {
            setActiveItemIndex(0)
          }, 400)
        }}
        {...props}
      />
    </LightboxContext.Provider>
  )
}

type LightboxTriggerElement = React.ComponentRef<typeof DialogPrimitive.Trigger>

interface LightboxTriggerProps extends DialogPrimitive.DialogTriggerProps {}

const LightboxTrigger = React.forwardRef<
  LightboxTriggerElement,
  LightboxTriggerProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Trigger ref={forwardedRef} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  )
})

LightboxTrigger.displayName = 'LightboxTrigger'

type LightboxContentElement = React.ComponentRef<typeof DialogPrimitive.Content>

interface LightboxContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    'asChild'
  > {
  container?: React.ComponentProps<typeof DialogPrimitive.Portal>['container']
}

const LightboxContent = React.forwardRef<
  LightboxContentElement,
  LightboxContentProps
>(({ children, className, container, ...props }, forwardedRef) => {
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay data-tinylight-overlay="">
        <DialogPrimitive.Content
          data-tinylight-content=""
          ref={forwardedRef}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
})

LightboxContent.displayName = 'LightboxContent'

interface LightboxControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const LightboxControls = ({ children, ...props }: LightboxControlsProps) => {
  return (
    <div data-tinylight-controls="" {...props}>
      {children}
    </div>
  )
}

interface LightboxItemsProps extends React.HTMLAttributes<HTMLDivElement> {}

const LightboxItems = ({ children, ...props }: LightboxItemsProps) => {
  const { setItems, activeItemIndex, setActiveItemIndex } = useLightbox()

  const validChildren = getValidChildren(children)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Update the active slide based on scroll position
  const handleScroll = React.useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const slideWidth = container.firstElementChild?.clientWidth || 0
    const newIndex = Math.round(container.scrollLeft / slideWidth)

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setActiveItemIndex(newIndex)
    }, 50)
  }, [setActiveItemIndex])

  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const activeItem = container.children[activeItemIndex] as HTMLElement

    if (activeItem) {
      container.scrollTo({
        left: activeItem.offsetLeft,
        behavior: 'smooth',
      })
    }
  }, [activeItemIndex])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useIsomorphicLayoutEffect(() => {
    setItems(validChildren)
  }, [])

  return (
    <div data-tinylight-items="" ref={containerRef} {...props}>
      {validChildren.map((child, i) => {
        return (
          <div
            data-tinylight-item=""
            data-tinylight-active-item={activeItemIndex === i}
            key={child.key}
          >
            {React.cloneElement(child, {})}
          </div>
        )
      })}
    </div>
  )
}

interface LightboxImageProps extends React.ComponentPropsWithoutRef<'img'> {
  asChild?: boolean
}

const LightboxImage = ({ asChild, ...props }: LightboxImageProps) => {
  const Component = asChild ? Slot : 'img'
  return <Component {...props} />
}

interface LightboxVideoProps extends React.ComponentPropsWithoutRef<'video'> {
  asChild?: boolean
}

const LightboxVideo = ({ asChild, ...props }: LightboxVideoProps) => {
  const Component = asChild ? Slot : 'video'
  const videoRef = React.useRef<HTMLVideoElement>(null)

  if (
    !videoRef.current?.parentNode.querySelector('[data-tinylight-active-item]')
  ) {
    videoRef.current?.pause()
  }

  return (
    <div data-tinylight-video="">
      <Component {...props} ref={videoRef} />
    </div>
  )
}

interface LightboxThumbsProps
  extends Omit<React.ComponentPropsWithRef<'div'>, 'children'> {}

const LightboxThumbs = ({ className, ...props }: LightboxThumbsProps) => {
  const { items, activeItemIndex, setActiveItemIndex, thumbnailRefs } =
    useLightbox()
  const containerRef = React.useRef<HTMLDivElement>(null)

  const centerActiveThumb = React.useCallback(() => {
    if (containerRef.current && items.length > 0) {
      const container = containerRef.current
      const activeChild = container.children[activeItemIndex] as HTMLElement
      const containerCenter = container.offsetWidth / 2
      const childCenter = activeChild.offsetLeft + activeChild.offsetWidth / 2

      container.scrollTo({
        left: childCenter - containerCenter,
        behavior: 'smooth',
      })
    }
  }, [activeItemIndex, items.length])

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(centerActiveThumb)

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [centerActiveThumb])

  React.useEffect(() => {
    if (containerRef.current && items.length > 0) {
      const container = containerRef.current
      const activeChild = container.children[activeItemIndex] as HTMLElement
      const containerCenter = container.offsetWidth / 2
      const childCenter = activeChild.offsetLeft + activeChild.offsetWidth / 2

      container.scrollTo({
        left: childCenter - containerCenter,
        behavior: 'smooth',
      })
    }
  }, [activeItemIndex, items.length])

  return (
    <div data-tinylight-thumbs="" ref={containerRef} {...props}>
      {items.map((item, index) => {
        const isLightboxVideoProps = (
          props: LightboxVideoProps | LightboxImageProps,
        ): props is LightboxVideoProps => {
          return 'poster' in props
        }

        const { asChild, ...props } = item.props

        const isVideo = item.type === LightboxVideo
        const Comp = asChild ? Slot : 'img'

        const imgSrc = isVideo
          ? item.props.poster
          : asChild && item.props.children
            ? isLightboxVideoProps(item.props.children.props)
              ? item.props.children.props.poster
              : item.props.children.props.src
            : item.props.src

        return (
          <button
            onClick={() => setActiveItemIndex(index)}
            type="button"
            key={item.key}
            tabIndex={0}
            ref={thumbnailRefs.current[index]}
            data-tinylight-thumb=""
            data-tinylight-active-thumb={activeItemIndex === index}
            style={{ '--stagger': `${index * 50}ms` } as React.CSSProperties}
          >
            <Comp {...props} src={imgSrc} alt="" />
          </button>
        )
      })}
    </div>
  )
}

interface LightboxCloseProps
  extends Omit<
    React.ComponentPropsWithRef<typeof DialogPrimitive.Close>,
    'asChild' | 'children'
  > {
  children?: never
  icon?: React.ReactNode
}

const LightboxClose = ({ icon: Icon, ref, ...props }: LightboxCloseProps) => {
  return (
    <DialogPrimitive.Close data-tinylight-close-button="" ref={ref} {...props}>
      {Icon ?? <Close />}
    </DialogPrimitive.Close>
  )
}

interface LightboxPrevButtonProps
  extends Omit<React.ComponentPropsWithRef<'button'>, 'children'> {
  children?: never
  icon?: React.ReactNode
}

const LightboxPrevButton = ({
  icon: Icon,
  ref,
  ...props
}: LightboxPrevButtonProps) => {
  const { toPrev, activeItemIndex } = useLightbox()

  return (
    <button
      onClick={toPrev}
      ref={ref}
      disabled={activeItemIndex === 0}
      aria-label="Previous item"
      data-tinylight-prev-button=""
      data-tinylight-nav-button=""
      {...props}
    >
      {Icon ?? <PreviousArrow />}
    </button>
  )
}

interface LightboxNextButtonProps
  extends Omit<React.ComponentPropsWithRef<'button'>, 'children'> {
  children?: never
  icon?: React.ReactNode
}

const LightboxNextButton = ({
  icon: Icon,
  ref,
  ...props
}: LightboxNextButtonProps) => {
  const { toNext, activeItemIndex, items } = useLightbox()

  return (
    <button
      onClick={toNext}
      ref={ref}
      disabled={activeItemIndex === items.length - 1}
      aria-label="Next item"
      data-tinylight-next-button=""
      data-tinylight-nav-button=""
      {...props}
    >
      {Icon ?? <NextArrow />}
    </button>
  )
}

export const Lightbox = {
  Root: LightboxRoot,
  Trigger: LightboxTrigger,
  Content: LightboxContent,
  Controls: LightboxControls,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
  Items: LightboxItems,
  Image: LightboxImage,
  Video: LightboxVideo,
  Thumbs: LightboxThumbs,
  Close: LightboxClose,
  PrevButton: LightboxPrevButton,
  NextButton: LightboxNextButton,
}

export type {
  LightboxContentProps as ContentProps,
  LightboxItemsProps as ItemsProps,
  LightboxRootProps as RootProps,
  LightboxThumbsProps as ThumbsProps,
  LightboxTriggerProps as TriggerProps,
  LightboxImageProps as ImageProps,
  LightboxVideoProps as VideoProps,
  LightboxCloseProps as CloseProps,
  LightboxNextButtonProps as NextButtonProps,
}
