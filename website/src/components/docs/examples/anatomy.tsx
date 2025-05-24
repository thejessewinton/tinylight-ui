import { Lightbox } from '@tinylight-ui/lightbox'

export const LightboxComponent = () => {
  return (
    <Lightbox.Root>
      <Lightbox.Trigger />
      <Lightbox.Content>
        <Lightbox.Title />
        <Lightbox.Description />
        <Lightbox.Close />
        <Lightbox.Items>
          <Lightbox.Image />
          <Lightbox.Video />
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
