'use client'

import { Lightbox } from '@tinylight-ui/lightbox'
import Image from 'next/image'
import { Button } from '~/components/shared/button'

export const LightboxComponent = () => {
  return (
    <Lightbox.Root>
      <Lightbox.Trigger className="w-1/2" asChild>
        <Button variant="light">Example</Button>
      </Lightbox.Trigger>

      <Lightbox.Content>
        <Lightbox.Title className="sr-only">Lightbox Example</Lightbox.Title>
        <Lightbox.Description className="sr-only">
          Describe the lightbox.
        </Lightbox.Description>
        <Lightbox.Close aria-label="Close" />
        <Lightbox.Items>
          <Lightbox.Image asChild>
            <Image
              src="https://placehold.co/1400x2200/png"
              width={1400}
              height={2200}
              alt="Placeholder"
            />
          </Lightbox.Image>
          <Lightbox.Image asChild>
            <Image
              src="https://placehold.co/1300x500/png"
              width={1300}
              height={500}
              alt="Placeholder"
            />
          </Lightbox.Image>
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
  )
}
