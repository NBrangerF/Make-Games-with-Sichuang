import { useState } from 'react'
import type { ReadingLanguage } from './reading-navigation'
import { LOCAL_STORAGE_PREFIX } from './deployment'
import readingExamples from '../content/reading-examples.json'

type Pair = Record<ReadingLanguage, string>
type Field = { label: Pair; example: Pair }
const field = (zh: string, en: string, exampleZh: string, exampleEn: string): Field => ({ label: { 'zh-CN': zh, en }, example: { 'zh-CN': exampleZh, en: exampleEn } })
export const worksheets = {
  observe: [
    field('刚才发生的动作', 'The action you observed', '小兔花一块木板，从起点走到第一块踏脚石。', 'Rabbit spends one plank to move from the starting bank to the first stepping stone.'),
    field('局面发生的变化', 'What changed in the game', '小兔离开起点，公共木板从四块变成三块。', 'Rabbit leaves the starting bank; the shared supply falls from four planks to three.'),
    field('我的解释，以及另一种可能', 'Your interpretation and an alternative', '可能是在按共同计划前进，也可能只是想让自己先过河；需要听玩家解释。', 'They may be following a shared plan, or simply trying to cross first. Ask the player before deciding.'),
  ],
  intent: [
    field('谁会在什么场合玩', 'Who will play, and in what setting', '两个第一次接触这份草稿的人，在一张小桌上玩。', 'Two people new to this draft, playing at a small table.'),
    field('希望他们遇到的具体选择', 'A choice you want them to face', '自己先走一步，还是留在起点收集两块公共木板。', 'Move one step, or remain at the starting bank to collect two shared planks.'),
    field('试玩时看哪一刻', 'What to watch during play', '记录一次玩家比较两种做法的时刻，再问他们当时在顾虑什么。', 'Note a moment when a player compares the two options, then ask what they were considering.'),
  ],
  loop: [
    field('动作前：玩家能看到什么', 'Before the action: what is visible', '小兔还在起点岸，公共区有四块木板。', 'Rabbit is at the starting bank; four shared planks are available.'),
    field('动作与结算', 'Action and resolution', '支付一块公共木板，小兔前进一步，用过的木板放到一旁。', 'Spend one shared plank, move Rabbit one step forward, and put the used plank aside.'),
    field('变化怎样影响下次选择', 'How the change affects the next choice', '下次小兔还能前进或等待，但离开起点后不能再收集。', 'Next turn Rabbit can move or wait, but can no longer collect after leaving the starting bank.'),
  ],
  choices: [
    field('玩家此刻的目标', 'The player’s immediate goal', '让两个角色都抵达对岸，同时保留足够的公共木板。', 'Get both characters across while keeping enough shared planks.'),
    field('选择 A：收益与代价', 'Choice A: benefit and cost', '现在前进一步：离对岸更近，花一块公共木板，并失去以后收集的资格。', 'Move now: get closer to the far bank, spend a shared plank, and lose the ability to collect later.'),
    field('选择 B：收益与代价', 'Choice B: benefit and cost', '留在起点收集：增加两块公共木板，但这次机会不能前进。', 'Stay and collect: add two shared planks, but give up moving on this turn.'),
  ],
  resources: [
    field('资源从哪里进入', 'Where the resource enters', '准备时公共区有四块木板；仍在起点的人可从备用区一次收集两块。', 'Four shared planks are available at setup. A character still at the starting bank can collect two from the reserve.'),
    field('谁在什么条件下花掉它', 'Who spends it, and under what conditions', '轮到的人每前进一步，支付一块公共木板；支付后不能在这一局再次使用。', 'On their turn, a player spends one shared plank per forward step. Used planks cannot be reused during this game.'),
    field('耗尽或积累后发生什么', 'What happens when it runs out or builds up', '木板用尽时不能前进。检查是否仍有人留在起点，以及剩下几轮。', 'Moving is impossible without planks. Check whether anyone is still at the starting bank and how many rounds remain.'),
  ],
  theme: [
    field('主题让人期待什么', 'What the theme leads players to expect', '两个小动物互相帮助过河，让人期待双方都有需要被照顾的处境。', 'Two animals helping each other cross suggests that both characters’ needs matter.'),
    field('哪条规则支持这种期待', 'A rule that supports the expectation', '木板是公用的，而且只有两个角色都到岸才共同获胜。', 'Planks are shared, and the players win together only when both characters reach the far bank.'),
    field('哪里可能讲了另一种故事', 'Where the rules might tell another story', '如果只奖励第一个过河的人，玩家可能把木板留给自己。要选择想表达的关系。', 'If only the first character across is rewarded, players may keep planks for themselves. Decide which relationship the game should express.'),
  ],
  access: [
    field('想完成的一个动作', 'One action to carry out', '辨认哪些纸片是可用木板，哪些已经用过。', 'Distinguish available planks from used ones.'),
    field('可能遇到的障碍', 'A possible barrier', '如果只用浅绿与深绿区分状态，有人可能看不清。此处是待验证的担忧。', 'If light and dark green alone distinguish states, someone may not see the difference. This is a concern to check.'),
    field('要比较的改法与观察', 'A change to compare and what to observe', '加上不同形状与文字标记，让参与者指出可用木板，记录是否需要额外解释。', 'Add distinct shapes and labels. Ask participants to identify available planks and note any additional explanation needed.'),
  ],
  test: [
    field('这一轮只回答的问题', 'The question for this test', '玩家能否在不听设计者补充的情况下完成一次收集？', 'Can a player complete one collection action without the designer adding instructions?'),
    field('给他们的最小材料与任务', 'Minimum materials and task', '操作说明、起点棋子、公共区和备用区；请完成一次合法收集。', 'Instructions, a character at the starting bank, and shared and reserve supplies. Ask for one legal collection action.'),
    field('这次准备记什么', 'What to record this time', '记录停顿、查找说明的位置和求助原话；试玩前不填结果。', 'Record pauses, where they look in the instructions, and their exact requests for help. Leave results blank before the test.'),
  ],
  review: [
    field('目前看到了什么', 'What you have seen so far', '尚未试玩。目前只有“收集要从哪里拿木板可能不清楚”这个担忧。', 'No playtest yet. There is only a concern that the source of collected planks may be unclear.'),
    field('至少两种可能的解释', 'At least two possible explanations', '可能是说明没写清；也可能是备用区与公共区的标记不明显。', 'The instruction may be unclear, or the reserve and shared areas may be hard to distinguish.'),
    field('下一次只改变什么', 'One change for the next comparison', '先强化备用区标记，保留其他规则；再观察是否仍需口头提示。', 'First strengthen the reserve-area label and keep other rules the same. Observe whether verbal help is still needed.'),
  ],
} satisfies Record<string, Field[]>
export type WorksheetId = keyof typeof worksheets
type Draft = { schemaVersion: 1; sourceId: string; worksheetId: WorksheetId; values: string[]; basedOnExample: boolean }
const sessionDrafts = new Map<string, Draft>()
const storageKey = (id: string) => `${LOCAL_STORAGE_PREFIX}reading-note-v1-${id}`

function readDraft(sourceId: string, worksheetId: WorksheetId): Draft {
  const cached = sessionDrafts.get(sourceId)
  if (cached?.worksheetId === worksheetId) return cached
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(sourceId)) || 'null') as Draft | null
    if (saved?.schemaVersion === 1 && saved.sourceId === sourceId && saved.worksheetId === worksheetId && Array.isArray(saved.values) && saved.values.length === worksheets[worksheetId].length && saved.values.every(value => typeof value === 'string' && value.length <= 4000)) return saved
  } catch { /* A missing or unreadable draft must not prevent reading. */ }
  return { schemaVersion: 1, sourceId, worksheetId, values: worksheets[worksheetId].map(() => ''), basedOnExample: false }
}

export function ReadingWorksheet({ sourceId, worksheetId, title, reason, language }: { sourceId: string; worksheetId: WorksheetId; title: string; reason: string; language: ReadingLanguage }) {
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const fields = worksheets[worksheetId]
  const chapterExample = readingExamples.chapters.find(chapter => chapter.chapterId === sourceId)?.values[language]
  const [draft, setDraft] = useState(() => readDraft(sourceId, worksheetId))
  const [status, setStatus] = useState('')
  const [clearArmed, setClearArmed] = useState(false)
  const changed = (next: Draft) => { setDraft(next); sessionDrafts.set(sourceId, next); setStatus(t('有未保存的修改。', 'Changes have not been saved.')); setClearArmed(false) }
  const save = () => {
    try { localStorage.setItem(storageKey(sourceId), JSON.stringify(draft)); setStatus(t('已保存到这个浏览器，刷新后可以继续。', 'Saved in this browser. You can continue after reloading.')) }
    catch { setStatus(t('浏览器无法保存，请下载一份记录。', 'This browser could not save the note. Download a copy instead.')) }
  }
  const download = () => {
    const text = [`# ${title}`, reason, t('阅读练习，不是试玩结果。', 'A reading exercise, not a playtest result.'), draft.basedOnExample ? t('包含或改写自本章教学示例。', 'Contains or adapts this chapter’s teaching example.') : '', ...fields.flatMap((item, i) => [`## ${item.label[language]}`, draft.values[i] || t('尚未填写', 'Not filled in')]), `Source: ${sourceId}`].filter(Boolean).join('\n\n') + '\n'
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${sourceId}-${language}-note.md`; anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus(t('已准备下载；请保留自己的副本。', 'Your download is ready. Keep your own copy.'))
  }
  const clear = () => {
    if (!clearArmed) { setClearArmed(true); return }
    try { localStorage.removeItem(storageKey(sourceId)) } catch { setStatus(t('无法清除已保存的记录。', 'The saved note could not be removed.')); return }
    changed({ schemaVersion: 1, sourceId, worksheetId, values: fields.map(() => ''), basedOnExample: false })
    setStatus(t('本章练习已清空。', 'This exercise has been cleared.'))
  }
  return <section className="reading-worksheet" id={`worksheet-${sourceId}`} aria-labelledby={`worksheet-title-${sourceId}`}>
    <details className="reading-worksheet__disclosure">
    <summary id={`worksheet-title-${sourceId}`}><span className="reading-worksheet__label">{t('小练习', 'Exercise')}</span><strong>{title}</strong><span className="reading-worksheet__toggle">{t('展开 / 收起', 'Open / close')}</span></summary>
    <p>{reason}</p>
    <div className="reading-worksheet__fields">{fields.map((item, i) => <label key={i} htmlFor={`${sourceId}-field-${i}`}><span>{item.label[language]}</span><textarea id={`${sourceId}-field-${i}`} rows={2} maxLength={4000} value={draft.values[i]} placeholder={t('用自己的游戏填写，或载入下方示例', 'Use your own game, or load the example below')} onChange={event => changed({ ...draft, values: draft.values.map((value, j) => i === j ? event.target.value : value) })} /></label>)}</div>
    {draft.basedOnExample && <p className="reading-worksheet__example-note">{t('已载入教学示例，可在此改写。示例中的情境为讲解编写。', 'Teaching example loaded; edit it here. Its situation was written for the lesson.')}</p>}
    <div className="reading-worksheet__actions"><button type="button" onClick={() => changed({ ...draft, values: chapterExample ? [...chapterExample] : fields.map(item => item.example[language]), basedOnExample: true })}>{t('载入本章示例', 'Load chapter example')}</button><button type="button" className="reading-worksheet__save" onClick={save}>{t('保存到此浏览器', 'Save in this browser')}</button><button type="button" onClick={download}>{t('下载我的记录', 'Download my note')}</button></div>
    <div className="reading-worksheet__foot"><p>{t('点击保存，留在当前浏览器。切换语言会保留你填写的原文。', 'Select Save to keep this in the current browser. Switching languages keeps your own text as written.')}</p><button type="button" onClick={clear}>{clearArmed ? t('确认清空本章练习', 'Confirm: clear this exercise') : t('清空', 'Clear')}</button>{clearArmed && <button type="button" onClick={() => setClearArmed(false)}>{t('取消', 'Cancel')}</button>}</div>
    <p className="reading-worksheet__status" role="status">{status}</p>
    </details>
  </section>
}
