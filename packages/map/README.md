# @tinylight-ui/map

A lightweight utility to create good looking, stylized SVG maps. Heavily based on the 

---

## Installation

First, install `@tinylight-ui/map`.

```bash
pnpm install @tinylight-ui/map
```

Then, import it into your app:

```tsx
import { createMap } from "@tinylight-ui/map";
```

## Usage

```typescript
const { points, markers } = createMap({
  width: 1200,
  height: 600,
  markers: [
    {
      latitude: 40.7128,
      longitude: -74.006,
    }, // New York
    {

      latitude: 34.0522,
      longitude: -118.2437,
    }, // Los Angeles
    {
      latitude: 51.5074,
      longitude: -0.1278,
    }, // London
    {
      latitude: -33.8688,
      longitude: 151.2093,
    }, // Sydney
  ],
  mapSamples: 4500,
});
```