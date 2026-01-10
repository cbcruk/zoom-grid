# zoom-grid

[![npm version](https://img.shields.io/npm/v/zoom-grid.svg)](https://www.npmjs.com/package/zoom-grid)

Pinch-to-zoom grid component for React with smooth transitions between zoom levels.

## Installation

```bash
npm install zoom-grid
```

## Usage

```tsx
import { ZoomGrid } from 'zoom-grid'
import 'zoom-grid/styles.css'

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

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `T[]` | required | Array of data items to display |
| `renderItem` | `(props: RenderItemProps<T>) => ReactNode` | required | Function to render each grid item |
| `zoomLevels` | `number[]` | `[5, 3, 1]` | Available zoom levels as column counts |
| `initialNumColumns` | `number` | `3` | Initial number of columns |
| `gap` | `number` | `2` | Gap between grid items in pixels |
| `onZoomChange` | `(columns: number) => void` | - | Callback fired when zoom level changes |
| `contentInsets` | `{ top?: number, bottom?: number }` | - | Content insets for padding |
| `style` | `CSSProperties` | - | Custom styles for the container |

### RenderItemProps

| Prop | Type | Description |
| --- | --- | --- |
| `item` | `T` | The data item to render |
| `index` | `number` | Index of the item in the data array |
| `size` | `number` | Calculated size (width/height) of the item in pixels |
| `isTarget` | `boolean` | Whether this item is the current zoom target |
| `isPinching` | `MutableRefObject<boolean>` | Ref indicating whether a pinch gesture is in progress |

## Features

- Pinch-to-zoom gesture support
- Ctrl+Scroll zoom on desktop
- Smooth transitions between zoom levels
- Virtualized rendering for large datasets

## License

MIT
