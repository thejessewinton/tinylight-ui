import { Button } from './button'
import { Example } from './docs/example'

export const Hero = () => {
  return (
    <div className="mx-auto mb-20 w-full text-center">
      <h1 className="group relative inline-block w-full text-center font-medium font-serif text-3xl italic">
        tinylight
      </h1>
      <span>A beautifully designed lightbox primitive for React.</span>

      <div className="mt-8 flex justify-center gap-4">
        <Example />
        <Button
          href="https://github.com/thejessewinton/tinylight"
          className="w-1/2"
        >
          GitHub
        </Button>
      </div>
    </div>
  )
}
