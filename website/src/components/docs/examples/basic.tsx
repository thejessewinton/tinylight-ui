"use client";

import { Lightbox } from "@tinylight-ui/lightbox";
import Image from "next/image";
import { Button } from "~/components/shared/button";

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
                src="https://cdn.cosmos.so/65cd27ef-b482-4cd3-a8e5-cecc35f79ef5?format=jpeg"
                width={320}
                height={401}
                alt="Placeholder"
              />
            }
          />

          <Lightbox.Image
            render={
              <Image
                src="https://cdn.cosmos.so/bf3439ac-28c9-4941-9f70-ca018165e1f9?format=jpeg"
                width={1300}
                height={500}
                alt="Placeholder"
              />
            }
          />

          <Lightbox.Video
            poster="https://cdn.cosmos.so/53ec796f-1c29-4f6c-8d49-eab5d3cdd640?format=jpeg"
            controls
            preload="auto"
            src="https://cdn.cosmos.so/906315b1-eaa5-4f99-8606-368d6d9232b5.mp4"
          />
        </Lightbox.Items>
        <Lightbox.Controls>
          <Lightbox.PrevButton />
          <Lightbox.Bullets />
          <Lightbox.NextButton />
        </Lightbox.Controls>
      </Lightbox.Content>
    </Lightbox.Root>
  );
};
