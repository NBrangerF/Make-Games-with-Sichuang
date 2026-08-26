import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(root, 'docs/product/tabletop-visual-tokens-v5-1.json')
const outputPath = path.join(root, 'src/visual-tokens.css')
const tokens = JSON.parse(await readFile(sourcePath, 'utf8'))

const px = value => `${value}px`
const css = `/* Generated from docs/product/tabletop-visual-tokens-v5-1.json. */
:root {
  --ot-canvas: ${tokens.color.canvas};
  --ot-surface: ${tokens.color.surface};
  --ot-surface-raised: ${tokens.color.surfaceRaised};
  --ot-surface-inverse: ${tokens.color.surfaceInverse};
  --ot-ink: ${tokens.color.ink};
  --ot-ink-inverse: ${tokens.color.inkInverse};
  --ot-muted: ${tokens.color.muted};
  --ot-muted-inverse: ${tokens.color.mutedInverse};
  --ot-rule: ${tokens.color.rule};
  --ot-rule-strong: ${tokens.color.ruleStrong};
  --ot-action: ${tokens.color.primary};
  --ot-action-hover: ${tokens.color.primaryHover};
  --ot-action-soft: ${tokens.color.primarySoft};
  --ot-editorial: ${tokens.color.danger};
  --ot-editorial-hover: ${tokens.color.dangerHover};
  --ot-editorial-soft: ${tokens.color.dangerSoft};
  --ot-discovery: ${tokens.color.warning};
  --ot-discovery-hover: ${tokens.color.warning};
  --ot-discovery-ink: ${tokens.color.warningInk};
  --ot-discovery-soft: ${tokens.color.warningSoft};
  --ot-focus: ${tokens.color.focus};
  --ot-focus-inverse: ${tokens.color.focusInverse};
  --ot-focus-halo: ${tokens.color.focusHalo};
  --ot-error: ${tokens.color.danger};
  --ot-error-soft: ${tokens.color.dangerSoft};
  --ot-success: ${tokens.color.success};
  --ot-success-hover: ${tokens.color.successHover};
  --ot-success-soft: ${tokens.color.successSoft};
  --ot-blue: ${tokens.color.primary};
  --ot-ochre: ${tokens.color.warning};
  --ot-terracotta: ${tokens.color.danger};
  --ot-moss: ${tokens.color.success};
  --ot-yellow: ${tokens.color.warning};
  --ot-green: ${tokens.color.success};
  --ot-red: ${tokens.color.danger};
  --ot-navy: ${tokens.color.surfaceInverse};
  --ot-paper: ${tokens.color.surface};
  --ot-font-ui: ${tokens.typography.families.ui};
  --ot-font-display: ${tokens.typography.families.display};
  --ot-font-editorial: ${tokens.typography.families.editorial};
  --ot-font-numeral: ${tokens.typography.families.numeral};
  --ot-space-1: ${px(tokens.spacePx['1'])};
  --ot-space-2: ${px(tokens.spacePx['2'])};
  --ot-space-3: ${px(tokens.spacePx['3'])};
  --ot-space-4: ${px(tokens.spacePx['4'])};
  --ot-space-6: ${px(tokens.spacePx['6'])};
  --ot-space-8: ${px(tokens.spacePx['8'])};
  --ot-space-12: ${px(tokens.spacePx['12'])};
  --ot-space-16: ${px(tokens.spacePx['16'])};
  --ot-space-20: ${px(tokens.spacePx['20'])};
  --ot-space-24: ${px(tokens.spacePx['24'])};
  --ot-radius-control: ${px(tokens.radius.controlPx)};
  --ot-radius-panel: ${px(tokens.radius.panelPx)};
  --ot-border: ${px(tokens.border.hairlinePx)};
  --ot-border-strong: ${px(tokens.border.emphasisPx)};
  --ot-focus-width: ${px(tokens.border.focusPx)};
  --ot-focus-offset: ${px(tokens.border.focusOffsetPx)};
  --ot-entry-shape: ${px(tokens.interaction.preferredPrimaryTargetPx)};
  --ot-entry-shape-mobile: ${px(tokens.interaction.minimumTargetPx)};
  --ot-dot: ${px(tokens.graphic.routeNodePx)};
  --ot-shadow-board-small: ${tokens.shadow.mounted};
  --ot-shadow-board: ${tokens.shadow.workbench};
  --ot-shadow-pressed: ${tokens.shadow.default};
  --ot-motion-fast: ${tokens.motionMs.fast}ms;
  --ot-motion-standard: ${tokens.motionMs.standard}ms;
  --ot-motion-disclosure: ${tokens.motionMs.disclosure}ms;
  --ot-reading-width: ${px(tokens.layout.contentWidthPx.readingText)};
  --ot-reading-shell: ${px(tokens.layout.contentWidthPx.readingShell)};
  --ot-resource-detail: ${px(tokens.layout.contentWidthPx.resourceDetail)};
  --ot-decision-entry: ${px(tokens.layout.contentWidthPx.home)};
  --ot-index-detail: ${px(tokens.layout.contentWidthPx.methods)};
  --ot-tool-width: ${px(tokens.layout.contentWidthPx.tool)};
  --ot-gutter-wide: ${px(tokens.layout.pageGutterPx.wide)};
  --ot-gutter-medium: ${px(tokens.layout.pageGutterPx.medium)};
  --ot-gutter-narrow: ${px(tokens.layout.pageGutterPx.narrow)};
  --ot-gutter-minimum: ${px(tokens.layout.pageGutterPx.minimum)};
  --ot-rail-wide: ${px(tokens.layout.readingRailPx.wide)};
  --ot-rail-medium: ${px(tokens.layout.readingRailPx.medium)};
  --ot-header-height: ${px(tokens.layout.headerPx.desktopMinimumHeight)};

  /* Compatibility aliases while the V2 components migrate. */
  --ink: var(--ot-ink);
  --blue: var(--ot-action);
  --red: var(--ot-editorial);
  --line: var(--ot-rule);
  --muted: var(--ot-muted);
  --paper: var(--ot-canvas);
  --paper-strong: var(--ot-surface);
}
`

if (process.argv.includes('--check')) {
  const current = await readFile(outputPath, 'utf8').catch(() => '')
  if (current !== css) {
    console.error('visual-tokens.css is out of sync. Run pnpm visual:tokens.')
    process.exit(1)
  }
  console.log('visual tokens are synchronized')
} else {
  await writeFile(outputPath, css)
  console.log(`generated ${path.relative(root, outputPath)}`)
}
