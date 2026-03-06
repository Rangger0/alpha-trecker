import '@fontsource/bebas-neue/400.css';
import '@fontsource/rajdhani/500.css';
import '@fontsource/rajdhani/600.css';
import '@fontsource/rajdhani/700.css';

import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/alpha-colors.css' // <-- import palet Alpha
import './styles/macos.css'       // <-- import macOS helpers (added)
import App from './App'

createRoot(document.getElementById('root')!).render(
  <App />
)
