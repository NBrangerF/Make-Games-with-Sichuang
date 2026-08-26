import type { GuideToolId } from './data'

export const loadProductionLedgerTool = () => import('./production-ledger-tool')

export function preloadToolSurface(toolId: GuideToolId) {
  if (toolId === 'production-ledger') void loadProductionLedgerTool()
}
