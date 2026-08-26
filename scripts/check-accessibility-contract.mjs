import { readFileSync, readdirSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const sourceFiles = readdirSync(new URL('src/', root)).filter(name => /\.(tsx?|css)$/.test(name))
const sources = Object.fromEntries(sourceFiles.map(name => [name, read(`src/${name}`)]))
const allSource = Object.values(sources).join('\n')
const app = sources['App.tsx']
const styles = sources['styles.css']
const html = read('index.html')
const contract = read('docs/product/ACCESSIBILITY_HARD_GATE.md')
const packageJson = JSON.parse(read('package.json'))
const topLevelPageFiles = new Set([
  'complete-translation-page.tsx',
  'resource-start-v2.tsx',
  'resource-v2-detail.tsx',
  'resource-problems-v2.tsx',
  'learning-node-map.tsx',
  'learning-node-page.tsx',
])

const guards = []
const guard = (name, pass, detail = '') => guards.push({ name, pass: Boolean(pass), detail })

const pageMains = [app, ...[...topLevelPageFiles].map(name => sources[name])]
  .flatMap(source => [...source.matchAll(/<main\b[^>]*>/g)].map(match => match[0]))
const nestedToolMains = Object.entries(sources)
  .filter(([name]) => name.endsWith('.tsx') && name !== 'App.tsx' && !topLevelPageFiles.has(name))
  .flatMap(([name, source]) => [...source.matchAll(/<main\b[^>]*>/g)].map(match => `${name}: ${match[0]}`))

guard('document language is Chinese', html.includes('<html lang="zh-CN">'))
guard('every routable page main has one shared target and programmatic focus', pageMains.length >= 5 && pageMains.every(tag => tag.includes('id="main-content"') && tag.includes('tabIndex={-1}')), `${pageMains.length} page main variants`)
guard('tool workbenches do not create nested main landmarks', nestedToolMains.length === 0, nestedToolMains.join(' | '))
guard('skip link preserves the active hash route and focuses current main', app.includes('href={serializeRoute(route)}') && app.includes("event.preventDefault(); document.getElementById('main-content')?.focus()"))
guard('skip link is visually revealed on focus', styles.includes('.skip-link:focus { transform: translateY(0); }'))
guard('all common interactive elements receive visible focus', styles.includes('button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible'))
guard('reduced motion preference disables motion', styles.includes('@media (prefers-reduced-motion: reduce)'))
guard('primary navigation exposes label and current page', app.includes('<nav aria-label="主导航">') && app.includes("aria-current={link.isActive ? 'page' : undefined}"))
guard('step and tab controls expose pressed state', (app.match(/aria-pressed=/g) || []).length >= 10)
guard('dialogs expose role, modality, and name', allSource.includes('role="dialog"') && allSource.includes('aria-modal="true"') && (allSource.includes('aria-label=') || allSource.includes('aria-labelledby=')))
guard('dynamic feedback includes live status and explicit alerts', allSource.includes('aria-live="polite"') && allSource.includes('role="alert"'))
guard('decorative SVGs are hidden from assistive technology', [...allSource.matchAll(/<svg\b[^>]*>/g)].every(match => match[0].includes('aria-hidden="true"')))
guard('no positive tabindex changes source order', !/tabIndex=\{?[1-9]/.test(allSource))
guard('no static div/span is promoted to an unnamed click control', !/<(?:div|span)\b[^>]*\bonClick=/.test(allSource) && !/role="button"/.test(allSource))
guard('mobile primary navigation is a three-target row while local work rails remain scrollable', styles.includes('.header nav { gap: 0; grid-column: 1 / -1; grid-row: 2; overflow: visible; }') && sources['styles-learning-nodes.css'].includes('.header .nav-link { flex-basis: 33.333%;') && styles.includes('.method-tabs { display: flex; overflow-x: auto;') && !styles.includes('.tool-tabs'))
guard('hard-gate document cites primary WCAG criteria', ['WCAG22/Understanding/bypass-blocks', 'WCAG22/Understanding/keyboard', 'WCAG22/Understanding/focus-order', 'WCAG22/Understanding/name-role-value'].every(token => contract.includes(token)))
guard('hard-gate separates automation, keyboard, and screen-reader evidence', ['机器门', '键盘门', '屏幕阅读器门', '不能证明'].every(token => contract.includes(token)))
guard('accessibility checker is part of content validation', packageJson.scripts?.['qa:a11y-contract'] === 'node scripts/check-accessibility-contract.mjs' && packageJson.scripts?.['content:check']?.includes('qa:a11y-contract'))

for (const item of guards) console.log(`${item.pass ? 'PASS' : 'FAIL'}  ${item.name}${item.detail ? ` — ${item.detail}` : ''}`)
const failed = guards.filter(item => !item.pass)
console.log(`\n${guards.length - failed.length}/${guards.length} accessibility contract guards passed.`)
if (failed.length) process.exit(1)
