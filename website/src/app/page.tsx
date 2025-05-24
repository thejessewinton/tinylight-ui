import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { LightboxComponent } from '~/components/docs/examples/basic'
import { Button } from '~/components/shared/button'

export default function Home() {
  return (
    <div className="mx-auto mb-20 px-4 text-center">
      <>
        <h1 className="group relative inline-block w-full text-center font-medium font-serif text-3xl italic">
          tinylight
        </h1>
        <span>A beautifully designed lightbox primitive for React.</span>

        <div className="mt-8 flex justify-center gap-4">
          <LightboxComponent />
          <Button
            href="https://github.com/thejessewinton/tinylight-ui"
            className="w-1/2"
          >
            GitHub
          </Button>
        </div>
        <Link
          href="/getting-started"
          className="mt-4 flex items-center justify-center gap-1"
        >
          Documentation
          <ChevronRightIcon className="size-3" />
        </Link>
      </>
    </div>
  )
}
