"use client";
import "./styles.css";

import { Dialog, useRender } from "@base-ui-components/react";
import React from "react";
import { Close, NextArrow, PreviousArrow } from "./assets";
import { getValidChildren } from "./helpers";
import { useIsomorphicLayoutEffect } from "./hooks";

interface LightboxItem extends React.ReactElement {
  props: {
    type?: typeof LightboxVideo;
    poster?: string;
    src?: string;
    render?: useRender.ComponentProps<"div">["render"];
    children?: React.ReactElement & {
      props: LightboxImageProps | LightboxVideoProps;
    };
  };
}

interface LightboxContextValue {
  items: LightboxItem[];
  setItems: (items: LightboxItem[]) => void;
  activeItemIndex: number;
  setActiveItemIndex: (index: number) => void;
  toPrev: () => void;
  toNext: () => void;
  thumbnailRefs: React.RefObject<React.RefObject<HTMLButtonElement>[]>;
}

const LightboxContext = React.createContext<LightboxContextValue | null>(null);

const useLightbox = () => {
  const context = React.useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
};

interface LightboxRootProps extends Dialog.Root.Props {}

const LightboxRoot = ({
  open: externalOpen,
  onOpenChange: externalOpenChange,
  ...rest
}: LightboxRootProps) => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<LightboxContextValue["items"]>([]);
  const [activeItemIndex, setActiveItemIndex] = React.useState(0);

  const thumbnailRefs = React.useRef<
    (React.RefObject<HTMLButtonElement> | null)[]
  >([]);

  const isOpen = externalOpen ?? open;

  React.useEffect(() => {
    thumbnailRefs.current = items.map(
      (_, index) => thumbnailRefs.current[index] || React.createRef()
    );
  }, [items]);

  const toPrev = React.useCallback(() => {
    setActiveItemIndex((current) => {
      const prevIndex = current - 1;
      if (prevIndex < 0) {
        return 0;
      }
      return prevIndex;
    });
  }, []);

  const toNext = React.useCallback(() => {
    setActiveItemIndex((current) => {
      const nextIndex = current + 1;
      if (nextIndex >= items.length) {
        return items.length - 1;
      }
      return nextIndex;
    });
  }, [items.length]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();

        let newIndex = activeItemIndex;
        if (event.key === "ArrowRight") {
          newIndex = Math.min(activeItemIndex + 1, items.length - 1);
        } else if (event.key === "ArrowLeft") {
          newIndex = Math.max(activeItemIndex - 1, 0);
        }

        if (newIndex !== activeItemIndex) {
          setActiveItemIndex(newIndex);
        }

        // Focus the corresponding thumbnail
        setTimeout(() => {
          const newRef = thumbnailRefs.current[newIndex];
          if (newRef?.current) {
            newRef.current.focus();
          }
        }, 0);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [activeItemIndex, items.length, isOpen]);

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
    [items, activeItemIndex, toPrev, toNext]
  );

  return (
    <LightboxContext.Provider value={contextValue}>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(open, eventData) => {
          if (externalOpen !== undefined) {
            externalOpenChange(open, eventData);
          } else {
            setOpen(open);
          }

          requestAnimationFrame(() => {
            setActiveItemIndex(0);
          });
        }}
        {...rest}
      />
    </LightboxContext.Provider>
  );
};

interface LightboxTriggerProps extends Dialog.Trigger.Props {}

const LightboxTrigger = ({ children, ...rest }: LightboxTriggerProps) => {
  return <Dialog.Trigger {...rest}>{children}</Dialog.Trigger>;
};

interface LightboxContentProps extends Dialog.Popup.Props {
  container?: Dialog.Portal.Props["container"];
}

const LightboxContent = ({
  children,
  className,
  container,
  ...rest
}: LightboxContentProps) => {
  return (
    <Dialog.Portal container={container}>
      <Dialog.Backdrop data-tinylight-overlay="">
        <Dialog.Popup data-tinylight-content="" {...rest}>
          {children}
        </Dialog.Popup>
      </Dialog.Backdrop>
    </Dialog.Portal>
  );
};

interface LightboxControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const LightboxControls = ({ children, ...rest }: LightboxControlsProps) => {
  return (
    <div data-tinylight-controls="" {...rest}>
      {children}
    </div>
  );
};

interface LightboxItemsProps extends React.HTMLAttributes<HTMLDivElement> {}

const LightboxItems = ({ children, ...rest }: LightboxItemsProps) => {
  const { setItems, activeItemIndex, setActiveItemIndex } = useLightbox();

  const validChildren = getValidChildren(children);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Update the active slide based on scroll position
  const handleScroll = React.useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const slideWidth = container.firstElementChild?.clientWidth || 0;
    const newIndex = Math.round(container.scrollLeft / slideWidth);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setActiveItemIndex(newIndex);
    }, 50);
  }, [setActiveItemIndex]);

  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const activeItem = container.children[activeItemIndex] as HTMLElement;

    if (activeItem) {
      container.scrollTo({
        left: activeItem.offsetLeft,
        behavior: "smooth",
      });
    }
  }, [activeItemIndex]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useIsomorphicLayoutEffect(() => {
    setItems(validChildren);
  }, []);

  return (
    <div data-tinylight-items="" ref={containerRef} {...rest}>
      {validChildren.map((child, i) => {
        return (
          <div
            data-tinylight-item=""
            data-tinylight-active-item={activeItemIndex === i}
            key={child.key}
          >
            {React.cloneElement(child, {})}
          </div>
        );
      })}
    </div>
  );
};

interface LightboxImageProps extends useRender.ComponentProps<"img"> {}

const LightboxImage = ({ render, ...rest }: LightboxImageProps) => {
  const element = useRender({
    defaultTagName: "img",
    render,
    props: rest,
  });

  return element;
};

interface LightboxVideoProps extends useRender.ComponentProps<"video"> {}

const LightboxVideo = ({ render, ...rest }: LightboxVideoProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const element = useRender({
    defaultTagName: "video",
    render,
    ref: videoRef,
    props: rest,
  });

  if (
    !videoRef.current?.parentNode.querySelector("[data-tinylight-active-item]")
  ) {
    videoRef.current?.pause();
  }

  return <div data-tinylight-video="">{element}</div>;
};

interface LightboxThumbProps extends useRender.ComponentProps<"img"> {}

const LightboxThumb = ({ render, ...rest }: LightboxThumbProps) => {
  const element = useRender({
    defaultTagName: "img",
    render,
    props: rest,
  });

  return element;
};

interface LightboxThumbsProps
  extends Omit<useRender.ComponentProps<"div">, "children"> {}

const LightboxThumbs = ({
  className,
  render,
  ...rest
}: LightboxThumbsProps) => {
  const { items, activeItemIndex, setActiveItemIndex, thumbnailRefs } =
    useLightbox();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const centerActiveThumb = React.useCallback(() => {
    if (containerRef.current && items.length > 0) {
      const container = containerRef.current;
      const activeChild = container.children[activeItemIndex] as HTMLElement;
      const containerCenter = container.offsetWidth / 2;
      const childCenter = activeChild.offsetLeft + activeChild.offsetWidth / 2;

      container.scrollTo({
        left: childCenter - containerCenter,
        behavior: "smooth",
      });
    }
  }, [activeItemIndex, items.length]);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(centerActiveThumb);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [centerActiveThumb]);

  React.useEffect(() => {
    if (containerRef.current && items.length > 0) {
      const container = containerRef.current;
      const activeChild = container.children[activeItemIndex] as HTMLElement;
      const containerCenter = container.offsetWidth / 2;
      const childCenter = activeChild.offsetLeft + activeChild.offsetWidth / 2;

      container.scrollTo({
        left: childCenter - containerCenter,
        behavior: "smooth",
      });
    }
  }, [activeItemIndex, items.length]);

  return (
    <div data-tinylight-thumbs="" ref={containerRef} {...rest}>
      {items.map((item, index) => {
        const isLightboxVideoProps = (
          props: LightboxVideoProps | LightboxImageProps
        ): props is LightboxVideoProps => {
          return "poster" in props;
        };

        const { render, ...rest } = item.props;

        const isVideo = item.type === LightboxVideo;

        const imgSrc = isVideo
          ? item.props.poster
          : render && item.props.children
          ? isLightboxVideoProps(item.props.children.props)
            ? item.props.children.props.poster
            : item.props.children.props.src
          : item.props.src;

        return (
          <button
            onClick={() => setActiveItemIndex(index)}
            type="button"
            key={item.key}
            tabIndex={0}
            ref={thumbnailRefs.current[index]}
            data-tinylight-thumb=""
            data-tinylight-active-thumb={activeItemIndex === index}
            style={{ "--stagger": `${index * 50}ms` } as React.CSSProperties}
          >
            <LightboxThumb render={render} src={imgSrc} {...rest} />
          </button>
        );
      })}
    </div>
  );
};

interface LightboxCloseProps
  extends Omit<Dialog.Close.Props, "render" | "children"> {
  children?: never;
  icon?: React.ReactNode;
}

const LightboxClose = ({ icon: Icon, ...rest }: LightboxCloseProps) => {
  return (
    <Dialog.Close data-tinylight-close-button="" {...rest}>
      {Icon ?? <Close />}
    </Dialog.Close>
  );
};

interface LightboxPrevButtonProps
  extends Omit<React.ComponentPropsWithRef<"button">, "children"> {
  children?: never;
  icon?: React.ReactNode;
}

const LightboxPrevButton = ({
  icon: Icon,
  ref,
  ...rest
}: LightboxPrevButtonProps) => {
  const { toPrev, activeItemIndex } = useLightbox();

  return (
    <button
      onClick={toPrev}
      ref={ref}
      disabled={activeItemIndex === 0}
      aria-label="Previous item"
      data-tinylight-prev-button=""
      data-tinylight-nav-button=""
      {...rest}
    >
      {Icon ?? <PreviousArrow />}
    </button>
  );
};

interface LightboxNextButtonProps
  extends Omit<React.ComponentPropsWithRef<"button">, "children"> {
  children?: never;
  icon?: React.ReactNode;
}

const LightboxNextButton = ({
  icon: Icon,
  ref,
  ...rest
}: LightboxNextButtonProps) => {
  const { toNext, activeItemIndex, items } = useLightbox();

  return (
    <button
      onClick={toNext}
      ref={ref}
      disabled={activeItemIndex === items.length - 1}
      aria-label="Next item"
      data-tinylight-next-button=""
      data-tinylight-nav-button=""
      {...rest}
    >
      {Icon ?? <NextArrow />}
    </button>
  );
};

export const Lightbox = {
  Root: LightboxRoot,
  Trigger: LightboxTrigger,
  Content: LightboxContent,
  Controls: LightboxControls,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Items: LightboxItems,
  Image: LightboxImage,
  Video: LightboxVideo,
  Thumbs: LightboxThumbs,
  Close: LightboxClose,
  PrevButton: LightboxPrevButton,
  NextButton: LightboxNextButton,
};

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
};
