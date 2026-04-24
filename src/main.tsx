import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/alpha-colors.css' // <-- import palet Alpha
import './styles/macos.css'       // <-- import macOS helpers (added)
import './styles/landing-premium.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <App />
)
