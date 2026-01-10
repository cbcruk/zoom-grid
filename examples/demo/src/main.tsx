import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'zoom-grid/styles.css'
import './index.css'
import App from './demo/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
