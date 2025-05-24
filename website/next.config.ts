import { withContentCollections } from '@content-collections/next'
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'placehold.co' },
      { hostname: 'images.unsplash.com' },
    ],
  },
}

export default withContentCollections(config)
