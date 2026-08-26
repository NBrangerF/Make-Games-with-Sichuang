import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'
import './visual-tokens.css'
import './styles-v4.css'
import './styles-v5.css'
import './styles-v5-1.css'
import './styles-v5-2-brand.css'
import './styles-learning-nodes.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)
