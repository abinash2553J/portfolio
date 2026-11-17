import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

const fonts = ['400 12px Geist', '500 12px Geist', '400 12px "Geist Mono"', '400 40px "Instrument Serif"'].map((f) => document.fonts.load(f))
const ready = Promise.race([Promise.all(fonts), new Promise((r) => setTimeout(r, 900))])

ready.then(() => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
))
