import { createHash } from 'node:crypto'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join, relative } from 'node:path'

const roots = [
  {
    id: 'camp-course-2023',
    title: '桌游设计·光华营地',
    path: '/Users/shawn.fsc/Documents/桌游教学/桌游设计·光华营地',
    include: () => true,
  },
  {
    id: 'original-design-course-2019-2020',
    title: '原创桌游解构与设计课程',
    path: '/Users/shawn.fsc/Library/Mobile Documents/com~apple~CloudDocs/01-项目/游戏化&基于游戏的学习/游戏化及桌面游戏资料/原创桌游与设计教案',
    include: name => /syllabus|class [1-4]|Theme & Conflict|definition_of_a_game|主题调查|什么是策略游戏|原型|机制介绍|如何讲解游戏|桌面游戏反馈表|适合桌游设计的教室玩耍守则/i.test(name),
  },
  {
    id: 'hanzi-board-game-course-2022',
    title: '云谷汉字桌游设计融合课',
    path: '/Users/shawn.fsc/Library/Mobile Documents/com~apple~CloudDocs/01-项目/游戏化&基于游戏的学习/游戏化及桌面游戏资料/云谷汉字桌游设计',
    include: name => /5年级融合课支持方案|创意生成表|如何讲解游戏笔记|桌游反馈表|反馈及修改表格|桌面游戏设计成功标准/i.test(name),
  },
  {
    id: 'social-science-board-game-course-2023',
    title: '桌游公司·桌游×社会科学',
    path: '/Users/shawn.fsc/Library/Mobile Documents/com~apple~CloudDocs/01-项目/游戏化&基于游戏的学习/游戏化及桌面游戏资料/桌游公司（桌游x社会科学） Course introduction课程介绍.pdf',
    include: () => true,
    isFile: true,
  },
]

const excluded = /\.DS_Store$|自动保存|副本|shawn|出借|schedule|合同|对账|报价|数据采集|学生|你的桌面游戏设计/i
const supported = new Set(['.pdf', '.pptx', '.ppt', '.key', '.docx', '.doc', '.pages'])
const outputIndex = process.argv.indexOf('--output')
const outputPath = outputIndex >= 0 ? process.argv[outputIndex + 1] : undefined

let previousRecords = new Map()
if (outputPath) {
  try {
    const previous = JSON.parse(await readFile(outputPath, 'utf8'))
    previousRecords = new Map((previous.records || []).map(item => [`${item.collectionId}/${item.relativePath}`, item]))
  } catch {}
}

async function walk(root, directory = root) {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) result.push(...await walk(root, path))
    else result.push(path)
  }
  return result
}

const records = []
for (const root of roots) {
  const paths = root.isFile ? [root.path] : await walk(root.path)
  for (const path of paths) {
    const name = root.isFile ? basename(path) : relative(root.path, path)
    if (excluded.test(name) || !root.include(name) || !supported.has(extname(path).toLowerCase())) continue
    const info = await stat(path)
    const modifiedAt = info.mtime.toISOString()
    const previous = previousRecords.get(`${root.id}/${name}`)
    const hash = previous?.bytes === info.size && previous.modifiedAt === modifiedAt
      ? previous.sha256
      : createHash('sha256').update(await readFile(path)).digest('hex')
    records.push({
      collectionId: root.id,
      collectionTitle: root.title,
      relativePath: name,
      format: extname(path).slice(1).toLowerCase(),
      bytes: info.size,
      modifiedAt,
      sha256: hash,
      privacy: 'internal_course_material',
      publication: 'summary_only_until_rights_reviewed',
    })
  }
}

records.sort((a, b) => a.collectionId.localeCompare(b.collectionId) || a.relativePath.localeCompare(b.relativePath, 'zh-CN'))
const duplicateGroups = [...records.reduce((groups, item) => {
  const group = groups.get(item.sha256) || []
  group.push(`${item.collectionId}/${item.relativePath}`)
  groups.set(item.sha256, group)
  return groups
}, new Map()).values()].filter(group => group.length > 1)

const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  scope: roots.map(({ id, title }) => ({ id, title })),
  policy: {
    originalFilesCopiedToRepository: false,
    personalAndAdministrativeFilesExcluded: true,
    publicUse: 'Only original summaries and structural observations until rights are reviewed.',
  },
  count: records.length,
  duplicateGroups,
  records,
}

if (outputPath) {
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`)
}
console.log(JSON.stringify(output, null, 2))
