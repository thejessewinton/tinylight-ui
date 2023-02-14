'use client';

import React from 'react';
import { create } from 'zustand';

const IS_SERVER = typeof window === 'undefined';
const useIsomorphicLayoutEffect = IS_SERVER
  ? React.useEffect
  : React.useLayoutEffect;

// Create a default state for the lightbox
export interface LightboxState {
  isOpen: boolean;
  items: number[];
  toggleOpen: () => void;
  currentItem: number;
  setCurrentItem: (index: number) => void;
}

// create a Zustand store, declared as a React hook
export const useLightboxStore = create<LightboxState>((set) => ({
  isOpen: false,
  items: [1, 2, 3, 4, 5],
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  currentItem: 0,
  setCurrentItem: (index: number) => set(() => ({ currentItem: index })),
}));

// Lightbox wrapper component
interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Wrapper = ({ children, ...rest }: WrapperProps) => {
  return <div {...rest}>{children}</div>;
};

// Lightbox item component
interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Item = ({ children, ...rest }: ItemProps) => {
  return <div {...rest}>{children}</div>;
};

// Lightbox navigation component
interface NavProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  direction: 'next' | 'previous';
}

const Nav = ({ children, direction, ...rest }: NavProps) => {
  const { items, currentItem, setCurrentItem, toggleOpen } = useLightboxStore();

  const handleNav = () => {
    if (direction === 'next') {
      if (currentItem === 0) {
        toggleOpen();
      }
      setCurrentItem(currentItem - 1);
    }
    if (direction === 'previous') {
      if (currentItem >= items.length - 1) {
        toggleOpen();
      } else {
        setCurrentItem(currentItem + 1);
      }
    }
  };

  return (
    <button onClick={handleNav} {...rest}>
      {children}
    </button>
  );
};

// The whole shebang
export const Tinybox = ({ children }: { children: React.ReactNode }) => {
  return <Wrapper>{children}</Wrapper>;
};

// Export the sub-components as static properties
Tinybox.Item = Item;
Tinybox.Navigation = Nav;
