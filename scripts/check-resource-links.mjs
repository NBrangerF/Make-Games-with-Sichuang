import { mkdir, readFile, writeFile } from 'node:fs/promises'

const resourcesUrl = new URL('../content/resources.json', import.meta.url)
const outputUrl = new URL('../docs/research/resource-health.json', import.meta.url)
const resources = JSON.parse(await readFile(resourcesUrl, 'utf8'))
const failOnDead = process.argv.includes('--fail-on-dead')
const concurrency = 6
const timeoutMs = 15_000

async function request(url, method) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'TabletopDesignWorkshop-LinkReview/1.0 (+human review required)',
        accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8',
      },
    })
  } finally {
    clearTimeout(timeout)
  }
}

function classify(status) {
  if (status >= 200 && status < 400) return 'reachable'
  if ([401, 403, 429].includes(status)) return 'blocked'
  if ([404, 410].includes(status)) return 'dead'
  return 'error'
}

async function check(resource) {
  const checkedAt = new Date().toISOString()
  try {
    let response = await request(resource.href, 'HEAD')
    if (response.status >= 400) response = await request(resource.href, 'GET')
    const outcome = classify(response.status)
    const note = outcome === 'blocked'
      ? '服务器要求登录、拒绝自动访问或触发限流；需要人工打开复核。'
      : outcome === 'dead'
        ? '服务器明确返回未找到或已移除；保留历史记录并人工寻找归档/替代链接。'
        : outcome === 'error'
          ? '服务器返回错误状态；不能据此自动删除资源。'
          : '自动请求可到达；仍不代表正文、许可或本站摘要没有变化。'
    const result = { resourceId: resource.id, url: resource.href, finalUrl: response.url || resource.href, status: response.status, outcome, checkedAt, note }
    await response.body?.cancel()
    return result
  } catch (error) {
    const note = error?.name === 'AbortError'
      ? `请求超过 ${timeoutMs / 1000} 秒；需要人工复核。`
      : `网络或协议错误：${error instanceof Error ? error.message : String(error)}`
    return { resourceId: resource.id, url: resource.href, finalUrl: resource.href, status: null, outcome: 'error', checkedAt, note }
  }
}

const results = new Array(resources.length)
let cursor = 0
async function worker() {
  while (cursor < resources.length) {
    const index = cursor++
    results[index] = await check(resources[index])
    process.stdout.write(`${results[index].outcome.padEnd(9)} ${resources[index].id}\n`)
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, resources.length) }, worker))

const counts = Object.fromEntries(['reachable', 'blocked', 'dead', 'error'].map(outcome => [outcome, results.filter(result => result.outcome === outcome).length]))
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  policy: {
    automatedDeletion: false,
    humanReviewRequiredFor: ['blocked', 'dead', 'error'],
    note: '网络健康结果与 content/resources.json 的人工内容核验日期是两套独立信号。',
  },
  counts,
  results,
}

await mkdir(new URL('../docs/research/', import.meta.url), { recursive: true })
await writeFile(outputUrl, `${JSON.stringify(report, null, 2)}\n`)
console.log(`\nresource health: ${JSON.stringify(counts)} -> docs/research/resource-health.json`)

if (failOnDead && counts.dead > 0) process.exitCode = 1
