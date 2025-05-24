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

Create a map using the `createMap` function. The function takes an object with the following properties:
- `width`: The width of the map in pixels.
- `height`: The height of the map in pixels.
- `markers`: An array of objects representing the markers to be placed on the map. Each object should have `lat` and `lng` properties, as well as an optional `size` property, which can be used to render custom markers of different sizes. `createMap` also accepts a generic type for additional properties on the marker. This can be useful for creating tooltips, or other customizations.
- `mapSamples`: The number of samples to be taken from the map. This is used to create the map's points.

```typescript
const { points, markers } = createMap({
  width: 1200,
  height: 600,
  markers: [
    {
      lat: 40.7128,
      lng: -74.006,
      size: 8,
    }, // New York
    {

      lat: 34.0522,
      lng: -118.2437,
    }, // Los Angeles
    {
      lat: 51.5074,
      lng: -0.1278,
    }, // London
    {
      lat: -33.8688,
      lng: 151.2093,
    }, // Sydney
  ],
  mapSamples: 4500,
});
```

After creating a map, render it as an SVG however you'd like:

```tsx
const Map = () => {
  return (
    <svg viewBox={`0 0 1200 600`} className="h-full w-full">
      {points.map((point) => {
        return (
          <circle
            cx={point.x}
            cy={point.y}
            r={5}
            fill="#eee"
          />
        );
      })}
      {markers.map((marker) => {
        return (
          <circle
            cx={marker.x}
            cy={marker.y}
            r={5}
            fill="#000"
          />
        );
      })}
    </svg>
  );
};
```
