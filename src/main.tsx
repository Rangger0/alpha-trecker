import { createRoot } from 'react-dom/client'
import './index.css'

import './styles/alpha-colors.css' // <-- import palet Alpha
import './styles/landing-premium.css'
import './styles/animations.css'   // <-- import smooth animations
import './styles/macos.css'       // <-- import macOS helpers (added)
import './styles/clarity.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <App />
)
