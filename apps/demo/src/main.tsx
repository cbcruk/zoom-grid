import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@zoom-grid/ui/styles.css'
import './index.css'
import App from './demo/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
