import { useDeferredValue, useMemo, useState } from 'react'
import { designMaterialPrinciple, mechanicMaterials, mechanicSearchText, themeMaterials, themeSearchText, type MechanicMaterial, type ThemeMaterial } from './design-material-catalog'
import { seedFirstTabletopMaterial } from './first-tabletop-challenge'

type DesignMaterialsLibraryProps = {
  kind: 'mechanics' | 'themes'
  onBack: () => void
  onOpenKind: (kind: 'mechanics' | 'themes') => void
  onStartChallenge: () => void
}

type MaterialCardProps = {
  item: MechanicMaterial | ThemeMaterial
  kind: 'mechanics' | 'themes'
  onChoose: () => void
  onOpenRelated: (kind: 'mechanics' | 'themes') => void
}

function MaterialCard({ item, kind, onChoose, onOpenRelated }: MaterialCardProps) {
  if (kind === 'mechanics') {
    const mechanic = item as MechanicMaterial
    return <article className="design-material-card">
      <header><p className="learning-eyebrow">Mechanic · {mechanic.materialTags.join(' / ')}</p><h2>{mechanic.name}</h2><p>{mechanic.summary}</p></header>
      <dl><div><dt>玩家反复做</dt><dd>{mechanic.playerVerb}</dd></div><div><dt>桌面会改变</dt><dd>{mechanic.tableChange}</dd></div><div><dt>取舍来自</dt><dd>{mechanic.tension}</dd></div></dl>
      <details><summary>打开风险与小练习</summary><div><strong>先留意</strong><p>{mechanic.watchFor}</p><strong>10—20 分钟练习</strong><p>{mechanic.exercise}</p><p className="design-material-card__aliases">也常被称为：{mechanic.aliases.join('、')}</p></div></details>
      <footer><button type="button" onClick={onChoose}>带这张牌去第一次落桌</button><button type="button" onClick={() => onOpenRelated('themes')}>去 theme 牌中比较关系 →</button></footer>
    </article>
  }
  const theme = item as ThemeMaterial
  return <article className="design-material-card design-material-card--theme">
    <header><p className="learning-eyebrow">Theme · {theme.toneTags.join(' / ')}</p><h2>{theme.name}</h2><p>{theme.premise}</p></header>
    <dl><div><dt>玩家处在</dt><dd>{theme.playerPosition}</dd></div><div><dt>玩家反复做</dt><dd>{theme.repeatedActions}</dd></div><div><dt>系统压力</dt><dd>{theme.systemPressure}</dd></div></dl>
    <blockquote>{theme.systemQuestion}</blockquote>
    <details><summary>打开注意事项与小练习</summary><div><strong>先留意</strong><p>{theme.care}</p><strong>10—20 分钟练习</strong><p>{theme.exercise}</p></div></details>
    <footer><button type="button" onClick={onChoose}>带这张牌去第一次落桌</button><button type="button" onClick={() => onOpenRelated('mechanics')}>去 mechanic 牌中比较动作 →</button></footer>
  </article>
}

export function DesignMaterialsLibrary({ kind, onBack, onOpenKind, onStartChallenge }: DesignMaterialsLibraryProps) {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('全部')
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase('zh-CN'))
  const isMechanics = kind === 'mechanics'
  const items = isMechanics ? mechanicMaterials : themeMaterials
  const tags = useMemo(() => [...new Set(items.flatMap(item => isMechanics
    ? [...(item as MechanicMaterial).materialTags, ...(item as MechanicMaterial).interactionTags]
    : [...(item as ThemeMaterial).contextTags, ...(item as ThemeMaterial).toneTags]))].sort((a, b) => a.localeCompare(b, 'zh-CN')), [isMechanics, items])
  const filtered = useMemo(() => items.filter(item => {
    const searchText = isMechanics ? mechanicSearchText(item as MechanicMaterial) : themeSearchText(item as ThemeMaterial)
    const tagsForItem = isMechanics
      ? [...(item as MechanicMaterial).materialTags, ...(item as MechanicMaterial).interactionTags]
      : [...(item as ThemeMaterial).contextTags, ...(item as ThemeMaterial).toneTags]
    return (!deferredQuery || searchText.includes(deferredQuery)) && (tag === '全部' || tagsForItem.includes(tag))
  }), [deferredQuery, isMechanics, items, tag])

  const choose = (id: string) => {
    seedFirstTabletopMaterial(isMechanics ? 'mechanic' : 'theme', id)
    onStartChallenge()
  }

  return <main className="learning-map design-materials-page" id="main-content" tabIndex={-1}>
    <nav className="learning-node-page__top" aria-label="设计材料导航"><button type="button" onClick={onBack}>← 返回学习首页</button><span>{isMechanics ? `${mechanicMaterials.length} 张 mechanic` : `${themeMaterials.length} 张 theme`}</span></nav>
    <header className={isMechanics ? 'design-materials-page__hero' : 'design-materials-page__hero is-theme'}>
      <p className="learning-eyebrow">设计材料库 · {isMechanics ? '玩家动作与状态' : '玩家位置与系统关系'}</p>
      <h1>{isMechanics ? 'Mechanic 不是名字，\n是玩家反复做的事。' : 'Theme 不是皮肤，\n是玩家被放进的关系。'}</h1>
      <p>{isMechanics ? '先看玩家做什么、桌面怎样改变、选择为何为难，再决定是否值得做成原型。' : '先看玩家代表谁、反复执行什么、哪些关系被奖励或省略，再选择表达方式。'}</p>
      <aside><strong>使用边界</strong><p>{designMaterialPrinciple}</p></aside>
    </header>

    <section className="design-materials-filter" aria-label="筛选设计材料">
      <label><span>搜索动作、关系或材料</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={isMechanics ? '例如：交换、地图、同时行动' : '例如：社区、照护、环境'} /></label>
      <label><span>只看一个标签</span><select value={tag} onChange={event => setTag(event.target.value)}><option>全部</option>{tags.map(item => <option key={item}>{item}</option>)}</select></label>
      <button type="button" onClick={() => onOpenKind(isMechanics ? 'themes' : 'mechanics')}>切换到 {isMechanics ? 'theme' : 'mechanic'} 材料</button>
    </section>

    <section className="design-materials-results" aria-labelledby="design-material-results-title">
      <div className="learning-section-heading"><div><p className="learning-eyebrow">{filtered.length} 个候选</p><h2 id="design-material-results-title">先展开一张，再做一个小练习</h2></div><p>筛选结果不是推荐顺序。</p></div>
      {filtered.length > 0 ? <div className="design-materials-grid">{filtered.map(item => <MaterialCard key={item.id} item={item} kind={kind} onChoose={() => choose(item.id)} onOpenRelated={onOpenKind} />)}</div> : <div className="design-materials-empty"><h2>没有完全相符的材料</h2><p>换一个动作、关系或标签；没有结果不表示这个设计起点不存在。</p><button type="button" onClick={() => { setQuery(''); setTag('全部') }}>清除筛选</button></div>}
    </section>
  </main>
}
