import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { WorkspaceRuntimeProvider } from './workspace-runtime'
import './styles.css'
import './visual-tokens.css'
import './styles-v4.css'
import './styles-v5.css'
import './styles-v5-1.css'
import './styles-v5-2-brand.css'
import './styles-learning-nodes.css'
import './styles-workbench-v3.css'
import './styles-course-v3.css'
import './styles-reading-studio.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><WorkspaceRuntimeProvider><App /></WorkspaceRuntimeProvider></StrictMode>,
)
