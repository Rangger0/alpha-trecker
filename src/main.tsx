import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/rajdhani/400.css'
import '@fontsource/rajdhani/700.css'
import './styles/alpha-colors.css' // <-- import palet Alpha
import './styles/landing-premium.css'
import './styles/macos.css'       // <-- import macOS helpers (added)
import './styles/landing-redesign.css' // <-- landing redesign
import App from './App'

createRoot(document.getElementById('root')!).render(
  <App />
)
