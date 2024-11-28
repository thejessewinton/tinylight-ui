import { withContentCollections } from '@content-collections/next'
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'picsum.photos' }],
  },
}

export default withContentCollections(config)
