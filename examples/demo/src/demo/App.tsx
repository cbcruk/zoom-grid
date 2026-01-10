import { useState, useMemo } from 'react'
import { ZoomGrid } from 'zoom-grid'
import styles from './App.module.css'

interface ImageItem {
  id: number
  color: string
}

// Generate sample data
const generateData = (count: number): ImageItem[] => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8B500',
    '#00CED1',
    '#FF69B4',
    '#20B2AA',
    '#FFD700',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
  }))
}

function App() {
  const [columns, setColumns] = useState(3)
  const data = useMemo(() => generateData(500), [])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>ZoomGrid Web Demo</h1>
        <div className={styles.info}>
          <span className={styles.badge}>{columns} columns</span>
          <span className={styles.hint}>Pinch or Ctrl+Scroll to zoom</span>
        </div>
      </header>

      <main className={styles.main}>
        <ZoomGrid
          data={data}
          zoomLevels={[5, 3, 1]}
          initialNumColumns={3}
          gap={4}
          onZoomChange={setColumns}
          renderItem={({ item, size, isPinching }) => (
            <div
              className={styles.item}
              style={{
                backgroundColor: item.color,
                width: size,
                height: size,
              }}
            >
              <span className={styles.itemId}>{item.id}</span>
              {isPinching.current && <div className={styles.zoomOverlay} />}
            </div>
          )}
        />
      </main>
    </div>
  )
}

export default App
