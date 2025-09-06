# @tinylight-ui/lightbox

---

## Installation

First, install `@tinylight-ui/lightbox`.

```bash
pnpm install @tinylight-ui/lightbox
```

Then, import it into your app:

```tsx
import { Lightbox } from "@tinylight-ui/lightbox";
```

## Usage

Below is an example in Next.js with the `next/image` component:

```tsx title="LightboxComponent.tsx"
import { Lightbox } from '@tinylight-ui/lightbox'
import Image from 'next/image'

export const LightboxComponent = () => {
  return (
    <Lightbox.Root>
      <Lightbox.Trigger
        className="w-1/2"
        render={<Button variant="light">Example</Button>}
      />

      <Lightbox.Content>
        <Lightbox.Title className="sr-only">Lightbox Example</Lightbox.Title>
        <Lightbox.Description className="sr-only">
          Describe the lightbox.
        </Lightbox.Description>
        <Lightbox.Close aria-label="Close" />
        <Lightbox.Items>
          <Lightbox.Image
            render={
              <Image
                src="https://placehold.co/800x400/png"
                width={800}
                height={400}
                alt="Placeholder"
              />
            }
          />

          <Lightbox.Image
            render={
              <Image
                src="https://placehold.co/1300x500/png"
                width={1300}
                height={500}
                alt="Placeholder"
              />
            }
          />

          <Lightbox.Video
            poster="https://placehold.co/960x540/png"
            controls
            preload="auto"
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
          />
        </Lightbox.Items>
        <Lightbox.Controls>
          <Lightbox.PrevButton />
          <Lightbox.Thumbs />
          <Lightbox.NextButton />
        </Lightbox.Controls>
      </Lightbox.Content>
    </Lightbox.Root>
  );
};
```