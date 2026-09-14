import { useId, useState, type ReactNode } from 'react'
import { RaceBoard } from './race-board'
import { resolveRaceMove } from './race-model'
import type { FigureKind, FigureLanguage } from './article-figure-catalog'
import './article-figures.css'

type Translate = (zh: string, en: string) => string
const dice = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
function Options({ label, values, value, onChange }: { label: string; values: string[]; value: number; onChange: (n: number) => void }) {
  return <div className="article-figure__options" role="group" aria-label={label}>{values.map((text, i) => <button key={i} type="button" aria-pressed={value === i} onClick={() => onChange(i)}>{text}</button>)}</div>
}
function Trace({ steps, active }: { steps: string[]; active?: number }) {
  return <ol className="article-figure__trace">{steps.map((step, i) => <li key={i} aria-current={active === i ? 'step' : undefined}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{step}</li>)}</ol>
}
function Inventory({ count, label }: { count: number; label: string }) {
  return <div className="article-figure__inventory" role="img" aria-label={`${label}: ${count}`}><span>{label}</span><div aria-hidden="true">{[0, 1].map(n => <i key={n} className={n < count ? 'is-full' : ''}>{n < count ? '●' : '○'}</i>)}</div><strong>{count} / 2</strong></div>
}
const headings: Record<FigureKind, [string, string]> = {
  landing: ['经过梯子，与停在梯底', 'Passing a ladder or landing on it'],
  turn: ['一回合，走到哪一步才算完？', 'When is the turn actually over?'],
  state: ['位置没变，轮到的人变了', 'Same position, a different player’s turn'],
  choice: ['换一个局面，选择还有差别吗？', 'Does the choice change in another position?'],
  chance: ['把 36 种结果摆出来', 'Lay out all 36 outcomes'],
  reroll: ['花一枚，换一个还不知道的结果', 'Spend one token on an unknown result'],
  space: ['先数格，再沿连接走', 'Count the spaces, then follow the connection'],
  supply: ['同样到 6，手边剩几枚？', 'Same landing at 6. How many tokens remain?'],
  finish: ['只换终点旁的那句规则', 'Change just the rule beside the finish'],
  combine: ['另一颗骰子，还能不能选？', 'Can you still choose the other die?'],
  cooperate: ['你已到达，同伴还差一步', 'You have arrived. Your partner has one step left'],
  components: ['给选中的骰子留一个位置', 'Give the chosen die a place of its own'],
  prototype: ['保持局面不变，检查一次操作', 'Keep the position fixed and check one action'],
}

export function ArticleFigure({ kind, language }: { kind: FigureKind; language: FigureLanguage }) {
  const id = useId()
  const t: Translate = (zh, en) => language === 'en' ? en : zh
  let content: ReactNode
  if (kind === 'chance') content = <Chance t={t}/>
  else if (kind === 'supply') content = <Supply t={t}/>
  else if (kind === 'combine') content = <Combine t={t} language={language}/>
  else if (kind === 'cooperate') content = <Cooperate t={t}/>
  else if (kind === 'reroll') content = <Reroll t={t} language={language}/>
  else if (kind === 'finish') content = <Finish t={t} language={language}/>
  else if (kind === 'turn' || kind === 'state') content = <Turn t={t} language={language} state={kind === 'state'}/>
  else content = <Movement t={t} language={language} kind={kind}/>
  return <figure className="article-figure" aria-labelledby={`${id}-caption`}>
    <figcaption id={`${id}-caption`}><span>{t('看图走一遍 · 二十四格小赛跑', 'Walk through it · The 24-Space Race')}</span><strong>{t(...headings[kind])}</strong></figcaption>
    {content}
    <p className="article-figure__note">{t('这是为讲解预设的局面；图中比较的是规则结果，玩家的实际感受还要通过试玩了解。', 'These are authored examples of rule outcomes. How people experience them still needs playtesting.')}</p>
  </figure>
}

function Movement({ t, language, kind }: { t: Translate; language: FigureLanguage; kind: FigureKind }) {
  const [scene, setScene] = useState(0)
  const [selected, setSelected] = useState(-1)
  const positions = kind === 'landing' ? [6, 12] : [6, 23, 20]
  const rolls = kind === 'landing' ? [[2, 6], [2, 3]] : [[2, 6], [2, 6], [2, 4]]
  const position = positions[scene]
  const die = rolls[scene][selected]
  const result = die === undefined ? undefined : resolveRaceMove(position, die)
  const scenes = kind === 'landing' ? [t('梯子：从 6 开始', 'Ladder: start at 6'), t('蛇：从 12 开始', 'Snake: start at 12')] : [t('梯子前：6', 'Before a ladder: 6'), t('终点前：23', 'Near the finish: 23'), t('胜负之间：20', 'Win or slide: 20')]
  return <>
    <p>{kind === 'landing' ? t('基本版 B 只掷一颗骰子。这里切换预设骰面，对照“经过”和“落在”的结果，并不是让玩家选骰。', 'Base version B uses one die. Switch between preset rolls to compare passing and landing; the player is not choosing a die.') : t('选择版 C：掷两颗、选一颗，只移动一次。点数已固定，先试一个，再比较另一个。', 'Choice version C: roll two dice, choose one, and move once. Try one of these fixed results, then compare the other.')}</p>
    {(kind === 'landing' || kind === 'choice') && <Options label={t('切换局面', 'Change the situation')} values={scenes} value={scene} onChange={n => { setScene(n); setSelected(-1) }}/>} 
    <RaceBoard language={language} position={position} result={result}/>
    <Options label={t('对照骰子结果', 'Compare die results')} values={rolls[scene].map(n => `${dice[n - 1]} ${kind === 'landing' ? t(`掷出 ${n}`, `Roll ${n}`) : t(`选 ${n}`, `Choose ${n}`)}`)} value={selected} onChange={setSelected}/>
    {kind === 'components' && <div className="article-figure__dice-slots"><div><span>{t('采用一颗', 'Use one')}</span><strong>{die ?? '—'}</strong></div><div><span>{t('这一回合不用', 'Not used this turn')}</span><strong>{selected < 0 ? '—' : rolls[scene][1 - selected]}</strong></div></div>}
    <div className="article-figure__answer" aria-live="polite">{result ? <><Trace steps={[t(`起点 ${position}`, `Start: ${position}`), result.overshoot ? t(`${position} + ${die} 超过 24`, `${position} + ${die} exceeds 24`) : t(`落点 ${result.landed}`, `Land: ${result.landed}`), t(`结算后 ${result.destination}`, `End: ${result.destination}`)]}/><p>{result.won ? t('正好到 24，立即获胜，没有下一位行动者。', 'Exactly 24: win immediately. There is no next player.') : result.overshoot ? t('停在原位也用完这次回合。2 和 6 都留下相同的位置，接着换人。', 'Staying put still uses the turn. Both 2 and 6 leave the same position; play passes to the other player.') : result.landed !== result.destination ? t('最终落在连接入口，才沿蛇或梯子转移。处理完，再换人。', 'Landing on the entrance triggers the snake or ladder. Resolve it, then pass the turn.') : t('经过入口不会触发。停在这个落点，然后换人。', 'Passing an entrance does not trigger it. Stop here, then pass the turn.')}</p></> : <p>{t('先试一个点数。图中的“起”是回合起点，“到”是结算后的位置。', 'Try a result. S marks the start of the turn; E marks the position after resolution.')}</p>}</div>
    {kind === 'components' && <p>{t('若把 2 和 6 相加：6 → 14 → 4。这是误读的结果，不是 C 版允许的动作；放置框只是帮助记住“只用一颗”。', 'Adding 2 and 6 would give 6 → 14 → 4. That is a misreading, not a legal C action. The two spaces above only help remember which single die is used.')}</p>}
  </>
}

function Turn({ t, language, state }: { t: Translate; language: FigureLanguage; state: boolean }) {
  const [step, setStep] = useState(0)
  const position = state ? 23 : 6
  const positions = state ? [23, 23, 23, 23] : [6, 6, 8, 17, 17]
  const labels = state ? [t('轮到你', 'Your turn'), t('选定 2', 'Choose 2'), t('超过，留在 23', 'Overshoot: stay at 23'), t('轮到同伴', 'Partner’s turn')] : [t('掷出 2 和 6', 'Roll 2 and 6'), t('选定 2，放下 6', 'Choose 2; set 6 aside'), t('前进到 8', 'Move to 8'), t('沿梯子到 17', 'Climb to 17'), t('回合结束，换人', 'End the turn; switch players')]
  return <><p>{t(`选择版 C，棋子在 ${position}。点一步，看位置、处理阶段和行动者怎样变化。`, `Choice version C, starting at ${position}. Step through the position, resolution, and whose turn it is.`)}</p><RaceBoard language={language} position={position} result={step ? { destination: positions[step] } : undefined}/><Trace steps={labels} active={step}/><div className="article-figure__options"><button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>{t('上一步', 'Back')}</button><button type="button" onClick={() => setStep(Math.min(labels.length - 1, step + 1))} disabled={step === labels.length - 1}>{t('下一步', 'Next')}</button><button type="button" onClick={() => setStep(0)}>{t('重看', 'Reset')}</button></div><p className="article-figure__answer" aria-live="polite">{t(`第 ${step + 1} 步：${labels[step]}。当前位置 ${positions[step]}。`, `Step ${step + 1}: ${labels[step]}. Current position: ${positions[step]}.`)} {step === labels.length - 1 ? t('现在由同伴开始新的回合。', 'Your partner now starts a new turn.') : t('你的回合还未结束。', 'Your turn is not over yet.')}</p></>
}

function Chance({ t }: { t: Translate }) {
  const [mode, setMode] = useState(1)
  return <><p>{t('棋子固定在 23。假设两颗公平六面骰相互独立；每格是一组有顺序的结果，✓ 表示这次能到 24。', 'Start at 23. Assume two fair, independent six-sided dice. Each cell is an ordered pair; ✓ marks a result that can reach 24.')}</p><Options label={t('比较用骰方式', 'Compare dice rules')} values={[t('只用第一颗', 'Use only die 1'), t('两颗选一颗', 'Choose either die')]} value={mode} onChange={setMode}/><div className="article-figure__probability" role="img" aria-label={t(mode ? '36 组结果中，第一颗或第二颗为 1 的 11 组可到达终点。其中 1、1 只算一次。' : '36 组结果中，只看第一颗为 1 的 6 组，所以机会是 6/36，等于 1/6。', mode ? '11 of 36 pairs have a 1 on either die. The pair 1, 1 is counted once.' : '6 of 36 pairs have a 1 on the first die: 6/36 equals 1/6.')}><span aria-hidden="true">{t('行：第一颗 ↓　列：第二颗 →', 'Rows: die 1 ↓　Columns: die 2 →')}</span><div aria-hidden="true">{Array.from({ length: 36 }, (_, i) => { const a = Math.floor(i / 6) + 1, b = i % 6 + 1, win = a === 1 || Boolean(mode && b === 1); return <span className={win ? 'is-hit' : ''} key={i}>{a},{b}<b>{win ? '✓' : '·'}</b></span> })}</div></div><p className="article-figure__answer" aria-live="polite"><strong>{mode ? '11 / 36' : '6 / 36 = 1 / 6'}</strong> {t('这是在 23、下一次自己的回合到达终点的机会，不是整局胜率。', 'This is the chance to finish on your next turn from 23, not the chance of winning the whole game.')}</p><p>{t('两颗都为 1 的左上格只有一格，不能重复计算。这里没有运行随机模拟。', 'The top-left pair, 1 and 1, is one outcome, not two. This diagram does not run a random simulation.')}</p></>
}

function Reroll({ t, language }: { t: Translate; language: FigureLanguage }) {
  const [option, setOption] = useState(-1)
  const die = [6, 2, 1][option]
  const result = die ? resolveRaceMove(6, die) : undefined
  return <><p>{t('重掷版 R：在 6，手边两枚标记，初次掷出 6。下面展示“接受”以及两种预设重掷结果；实际花费时还不知道会掷出几。', 'Reroll version R: start at 6 with two tokens and an initial roll of 6. Compare keeping it with two preset rerolls. You would not know the new result when spending.')}</p><Inventory count={option > 0 ? 1 : 2} label={t('剩余标记', 'Tokens left')}/><RaceBoard language={language} result={result}/><Options label={t('查看可能分支', 'Inspect a possible branch')} values={[t('接受原来的 6', 'Keep the original 6'), t('花一枚，假设重掷得 2', 'Spend one; suppose you roll 2'), t('花一枚，假设重掷得 1', 'Spend one; suppose you roll 1')]} value={option} onChange={setOption}/><p className="article-figure__answer" aria-live="polite">{result ? t(`最后到 ${result.destination}，剩 ${option > 0 ? 1 : 2} 枚。`, `Finish at ${result.destination} with ${option > 0 ? '1 token' : '2 tokens'}.`) : t('同一份起始状态，三个独立分支；切换按钮不会累积花费。', 'Three independent branches from the same starting state. Switching does not spend more tokens.')} {option > 0 && t('原来的 6 已放弃。这回合必须接受新结果，不能再花第二枚。', 'The original 6 is gone. Accept the new result; no second reroll this turn.')}</p></>
}

function Supply({ t }: { t: Translate }) {
  const [version, setVersion] = useState(0)
  const [full, setFull] = useState(0)
  const start = full ? 2 : 1, spent = full ? 0 : 1, before = start - spent
  const end = version ? Math.min(2, before + 1) : before
  return <><p>{t('把同一段过程放到两份单骰草稿中。E 版只多一条：实际移动后最终停在 6，补一枚，上限两枚。', 'Compare the same trace in two one-die drafts. E adds one rule: after a move ending at 6, gain one token, up to two.')}</p><Options label={t('版本', 'Version')} values={[t('R：不补充', 'R: no refill'), t('E：在 6 补给', 'E: refill at 6')]} value={version} onChange={setVersion}/><Options label={t('起始情况', 'Starting situation')} values={[t('剩一枚，花掉后到 6', 'Spend the last token; reach 6'), t('已有两枚，直接到 6', 'Keep both tokens; reach 6')]} value={full} onChange={setFull}/><div className="article-figure__stock-flow"><Inventory count={start} label={t('移动前', 'Before')}/><span aria-hidden="true">→</span><Inventory count={before} label={t('付费后', 'After spending')}/><span aria-hidden="true">→</span><Inventory count={end} label={t('到 6 并结算后', 'After reaching 6')}/></div><Trace steps={full ? [t('起点 4，持有两枚', 'Start at 4 with two tokens'), t('直接采用 2，不花标记', 'Use a 2; spend nothing'), t('实际移动到 6', 'Move to 6')] : [t('起点 4，原骰为 1', 'Start at 4; first roll is 1'), t('花一枚，预设重掷为 2', 'Spend one; preset reroll is 2'), t('实际移动到 6', 'Move to 6')]}/><p className="article-figure__answer" aria-live="polite">{version ? full ? t('手上已满两枚，不能领取第三枚。', 'Already at the two-token limit: no third token.') : t('先花掉，再补回，最后一枚。补给增加了来源，不等于没有付过费。', 'Spend first, then refill: one token remains. A new source does not erase the earlier cost.') : t(`没有补给来源，最后剩 ${end} 枚。`, `No refill source: ${end} tokens remain.`)} {t('留在 6 不动不会再次领取。', 'Staying at 6 does not trigger another refill.')}</p></>
}

function Finish({ t, language }: { t: Translate; language: FigureLanguage }) {
  const [rule, setRule] = useState(0)
  const [dieIndex, setDieIndex] = useState(-1)
  const move = dieIndex < 0 ? undefined : resolveRaceMove(23, dieIndex + 1)
  const destination = move && (rule ? 24 : move.destination)
  return <><p>{t('单骰基本版 B，从 23 开始。保持骰面和棋盘不变，只换结束条件。', 'One-die base version B, starting at 23. Keep the roll and board fixed; change only the ending rule.')}</p><Options label={t('结束条件', 'Ending rule')} values={[t('必须正好到 24', 'Exactly 24'), t('达到或超过 24', 'Reach or pass 24')]} value={rule} onChange={setRule}/><RaceBoard language={language} position={23} result={destination === undefined ? undefined : { destination }}/><Options label={t('预设骰面', 'Preset roll')} values={dice.map((face, i) => `${face} ${i + 1}`)} value={dieIndex} onChange={setDieIndex}/><p className="article-figure__answer" aria-live="polite">{destination === undefined ? t('选一个骰面，再切换两条规则。', 'Choose a roll, then switch rules.') : destination === 24 ? t('本回合到达，立即获胜。', 'Finish this turn and win immediately.') : t('点数超过 24，停在 23，回合交给对方。', 'The roll exceeds 24. Stay at 23 and pass the turn.')} {t('这一处结束实验没有加入重掷或第二颗骰子。', 'This ending experiment adds neither rerolls nor a second die.')}</p></>
}

function Combine({ t, language }: { t: Translate; language: FigureLanguage }) {
  const [proposal, setProposal] = useState(0)
  const destination = proposal ? 12 : 7
  return <><p>{t('两份演示提案，均从 6 开始，初骰为 2 和 6，花一枚重掷原来的 2，预设新结果为 1。改变的是：另一颗 6 是否还可选。它们都不是交付版 C。', 'Two demonstration proposals start at 6, roll 2 and 6, spend one token to reroll the 2, and get a preset 1. The difference: is the other 6 still available? Neither proposal is the delivered C version.')}</p><Options label={t('组合提案', 'Combination proposal')} values={[t('先选定，另一颗不用', 'Commit; discard the other die'), t('保留另一颗，再选择', 'Keep the other die; choose later')]} value={proposal} onChange={setProposal}/><Trace steps={proposal ? [t('保留 6', 'Keep 6 available'), t('花一枚：2 重掷为 1', 'Spend one: reroll 2 as 1'), t('在 1 和 6 中选 6', 'Choose 6 from 1 and 6')] : [t('选定 2，6 不再可用', 'Commit to 2; discard 6'), t('花一枚：2 重掷为 1', 'Spend one: reroll 2 as 1'), t('必须接受 1', 'Must accept 1')]}/><RaceBoard language={language} result={{ destination }}/><p className="article-figure__answer" aria-live="polite">{t(`最后到 ${destination}。同样花一枚，`, `Finish at ${destination}. The cost is one token in both proposals; `)}{proposal ? t('保留的 6 提供了后备落点。', 'the kept 6 provides a fallback landing.') : t('已知的 6 不再能拿回来。', 'the known 6 cannot be taken back.')} {t('这一条轨迹展示组合条件的差别，不证明哪份提案更好玩。', 'This trace shows a difference in combination rules, not which proposal is more enjoyable.')}</p></>
}

function Cooperate({ t }: { t: Translate }) {
  const [roll, setRoll] = useState(-1)
  return <><p>{t('合作实验 S，第 9 轮结束。你在 24，同伴在 23。第 10 轮是最后一轮，已到的人跳过行动。', 'Cooperative experiment S, after round 9. You are at 24; your partner is at 23. Round 10 is the last; a finished player skips their action.')}</p><div className="article-figure__partners"><div><span>{t('你', 'You')}</span><strong>24</strong><p>{t('已经到达 · 跳过行动', 'Finished · skip your action')}</p></div><div><span>{t('同伴', 'Partner')}</span><strong>{roll === 0 ? 24 : 23}</strong><p>{t('最后一次掷骰机会', 'One final roll')}</p></div></div><Options label={t('同伴最后一骰的预设结果', 'Partner’s preset final roll')} values={[t('掷出 1', 'Roll 1'), t('掷出 2', 'Roll 2')]} value={roll} onChange={setRoll}/><p className="article-figure__answer" aria-live="polite">{roll < 0 ? t('你关心这一骰，但 S 没有让你改变它的帮助动作。', 'You care about this roll, but S gives you no helping action to change it.') : roll === 0 ? t('两人都到 24，一起成功。', 'Both reach 24: shared success.') : t('同伴超过终点，仍在 23；第 10 轮结束，两人一起失败。', 'Your partner overshoots and stays at 23. Round 10 ends: shared failure.')} {t('共同胜负改变了关注对象，还没有增加协商或帮助的选择。', 'A shared outcome changes what you care about without adding a choice to negotiate or help.')}</p></>
}
