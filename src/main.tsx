import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// After index.css on purpose: Lenis ships `html.lenis { height: auto }` to undo
// the `height: 100%` in our base layer, plus the automatic
// `.lenis-stopped { overflow: clip }` lock. Loading it last keeps those wins.
import 'lenis/dist/lenis.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
