import { existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = fileURLToPath(new URL('../', import.meta.url))
const game = resolve(root, 'games/rule-lab')
function run(command, args) {
  const result = spawnSync(command, args, { cwd: game, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
}
if (!existsSync(resolve(game, 'node_modules/.bin/vite'))) run('npm', ['ci', '--no-audit', '--no-fund'])
run('npm', ['run', 'build', '--', '--outDir', '../../public/play/rule-lab', '--emptyOutDir', '--base', './'])
const notices = resolve(root, 'public/play/rule-lab/licenses')
mkdirSync(notices, { recursive: true })
copyFileSync(resolve(game, 'licenses/lucide-ISC-MIT.txt'), resolve(notices, 'lucide-ISC-MIT.txt'))
console.log('Rule Lab: built the pinned game and its same-origin art and audio.')
