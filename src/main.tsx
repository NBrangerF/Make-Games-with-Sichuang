import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Legacy layers load first; the app's own sheets (original-reading.css via App) and the lab
// design system come after them, so equal-weight lab rules win.
import './styles.css'
import './visual-tokens.css'
import './styles-v4.css'
import './styles-v5.css'
import './styles-v5-1.css'
import './styles-v5-2-brand.css'
import './styles-learning-nodes.css'
import './styles-workbench-v3.css'
import './styles-course-v3.css'
import { App } from './App'
import { WorkspaceRuntimeProvider } from './workspace-runtime'
import './lab/fonts'
import './lab/tokens.css'
import './lab/legacy-bridge.css'
import './lab/shell.css'
import './lab/interactives.css'
import './lab/surfaces.css'
import './lab/workbench.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><WorkspaceRuntimeProvider><App /></WorkspaceRuntimeProvider></StrictMode>,
)
