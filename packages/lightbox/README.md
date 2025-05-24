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
      <Lightbox.Trigger>
        <Image
          src="https://placehold.co/800x400/png"
          width={800}
          height={400}
          alt="Placeholder"
        />
      </Lightbox.Trigger>

      <Lightbox.Content>
      <Lightbox.Title>Lightbox title</Lightbox.Title>
      <Lightbox.Description>Lightbox description</Lightbox.Description>
        <Lightbox.Close aria-label="Close" />
        <Lightbox.Items>
          <Lightbox.Image asChild>
            <Image
              src="https://placehold.co/800x400/png"
              width={800}
              height={400}
              alt="Placeholder"
            />
          </Lightbox.Image>
          <Lightbox.Image asChild>
            <Image
              src="https://placehold.co/800x400/png"
              width={800}
              height={400}
              alt="Placeholder"
            />
          </Lightbox.Image>
          <Lightbox.Video
            poster="https://placehold.co/1920x1080/png"
            controls
            src="https://www.w3schools.com/html/mov_bbb.mp4"
          />
        </Lightbox.Items>
        <div className="flex justify-between">
          <Lightbox.PrevButton />
          <Lightbox.Thumbs />
          <Lightbox.NextButton />
        </div>
      </Lightbox.Content>
    </Lightbox.Root>
  )
}
```