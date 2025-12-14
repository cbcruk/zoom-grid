# ZoomGrid

Pinch-to-zoom grid component for React with smooth transitions between zoom levels.

## Structure

```
packages/
  zoom-grid-ui/     # @zoom-grid/ui - Core component library
apps/
  demo/             # @zoom-grid/demo - Demo application
```

## Development

```bash
# Install dependencies
pnpm install

# Build UI package
pnpm build:ui

# Run demo app
pnpm dev
```

## Scripts

| Command           | Description             |
| ----------------- | ----------------------- |
| `pnpm dev`        | Run demo app dev server |
| `pnpm build`      | Build all packages      |
| `pnpm build:ui`   | Build UI package only   |
| `pnpm build:demo` | Build demo app only     |
| `pnpm preview`    | Preview demo build      |

## Usage

```tsx
import { ZoomGrid } from '@zoom-grid/ui'

function App() {
  return (
    <ZoomGrid
      data={items}
      zoomLevels={[5, 3, 1]}
      initialNumColumns={3}
      gap={4}
      renderItem={({ item, size }) => (
        <div style={{ width: size, height: size }}>{item.id}</div>
      )}
    />
  )
}
```

## Tech Stack

- @tanstack/react-virtual
- @use-gesture/react
- framer-motion
