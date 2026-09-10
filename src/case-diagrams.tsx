import { useId, useState } from 'react'
import type { ReadingLanguage } from './reading-navigation'
import { sixNimmtComparison, singleTargetDrawChance } from './case-experiments'

export function CaseDiagram({ id, language = 'zh-CN', compact = false }: { id: string; language?: ReadingLanguage; compact?: boolean }) {
  const uid = useId()
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const labels: Record<string, string> = {
    carcassonne: t('同一张板块，完成已有区域或另起一个承诺', 'One tile: finish a feature or start another commitment'),
    pandemic: t('同一组有限行动，需要协调治疗、交换与研发', 'A limited action budget connects treatment, sharing and research'),
    dominion: t('新牌进入弃牌堆，经洗牌再次进入手牌', 'A gained card enters the discard pile and reaches your hand after a shuffle'),
    'six-nimmt': t('同时选牌，按数字顺序依次落入四行', 'Choose together, then place cards in numerical order across four rows'),
    hanabi: t('能看见别人的牌，不能看见自己的牌', 'You see the other hands, but not your own'),
    wingspan: t('三种栖息地把食物、蛋和抽牌组织成不同动作行', 'Three habitats organize food, eggs and card draws into action rows'),
    agricola: t('新增成员本轮需要食物，下一轮才增加行动', 'A newborn needs food this harvest and adds an action next round'),
    'cant-stop': t('本轮临时进度与停手后保留的进度分开记录', 'Temporary progress is separate from progress secured by stopping'),
    'for-sale': t('竞价获得房屋，再用房屋换取支票', 'Bid for properties, then exchange properties for checks'),
  }
  const box = (x: number, y: number, label: string, fill = '#f6f3eb', w = 62) => <g key={`${x}-${y}`}><rect x={x} y={y} width={w} height={72} rx="5" fill={fill} stroke="#697c70" strokeWidth="1.3"/><text x={x + w / 2} y={y + 45} textAnchor="middle" fontSize="25" fill="#183b41">{label}</text></g>
  return <figure className={`case-diagram case-diagram--${id}${compact ? ' case-diagram--compact' : ''}`}>
    <svg viewBox="0 0 520 300" role="img" aria-labelledby={`${uid}-title`}>
      <title id={`${uid}-title`}>{labels[id]}</title>
      <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="#183b41" strokeWidth="1.5"/></marker></defs>
      {id === 'carcassonne' && <g><g transform="translate(88 38) rotate(-5 175 100)">{[[92,0],[0,92],[92,92],[184,92]].map(([x,y]) => <g key={`${x}-${y}`}><rect x={x} y={y} width="88" height="88" rx="3" fill="#eee7cd" stroke="#8b9980" strokeWidth="2"/><path d={`M ${x + 44} ${y} L ${x + 44} ${y + 44} L ${x + 88} ${y + 44}`} fill="none" stroke="#b8c7a0" strokeWidth="24"/><path d={`M ${x + 5} ${y + 68} L ${x + 75} ${y + 68}`} stroke="#ae9877" strokeWidth="3" strokeDasharray="3 3"/></g>)}<rect x="278" y="92" width="88" height="88" rx="3" fill="none" stroke="#6a8270" strokeWidth="2" strokeDasharray="7 6"/><circle cx="136" cy="136" r="15" fill="#b84628"/><path d="M 281 198 Q 340 227 359 189" fill="none" stroke="#183b41" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`}/></g><text x="260" y="279" textAnchor="middle" fontSize="17">{t('完成现有区域 ↔ 开始新的区域', 'Complete a feature ↔ start another')}</text></g>}
      {id === 'pandemic' && <g>{[[92,90,245,152],[245,152,415,82],[245,152,105,240],[245,152,385,235],[92,90,415,82]].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#95aaa1" strokeWidth="3"/>)}{[[92,90],[245,152],[415,82],[105,240],[385,235]].map(([cx,cy],i) => <g key={i}><circle cx={cx} cy={cy} r={i === 1 ? 25 : 16} fill={i === 1 ? '#b84628' : '#f6f3eb'} stroke="#183b41" strokeWidth="2"/>{i === 1 && <text x={cx} y={cy + 7} textAnchor="middle" fill="white" fontSize="20">4</text>}</g>)}<text x="260" y="32" textAnchor="middle" fontSize="18">{t('一回合，四个行动', 'One turn, four actions')}</text><text x="260" y="281" textAnchor="middle" fontSize="16">{t('治疗 · 交换 · 研发 · 移动', 'Treat · share · research · move')}</text></g>}
      {id === 'dominion' && <g>{box(52,90,t('抽', 'Draw'),'#f6f3eb',105)}{box(213,90,t('手', 'Hand'),'#f6f3eb',105)}{box(375,90,t('弃', 'Discard'),'#e6d8bb',105)}<path d="M 166 126 L 199 126 M 326 126 L 362 126 M 428 178 C 428 265 105 265 105 178" stroke="#183b41" strokeWidth="2" fill="none" markerEnd={`url(#${uid}-arrow)`}/><text x="266" y="267" textAnchor="middle" fontSize="17">{t('牌库不足时，把弃牌洗回去', 'Shuffle the discard when needed')}</text><text x="426" y="55" textAnchor="middle" fontSize="18" fill="#b84628">{t('获得新牌 ↓', 'Gain a card ↓')}</text></g>}
      {id === 'six-nimmt' && <g>{[[12,25,39,45],[17,22,28,33],[61,68,73,79],[85,91,98,101]].map((row,i) => <g key={i} transform={`translate(0 ${i*61})`}>{row.map((v,j) => <g key={v}><rect x={67+j*81} y="23" width="66" height="46" rx="4" fill="#f6f3eb" stroke="#7b8170"/><text x={100+j*81} y="55" textAnchor="middle" fontSize="23">{v}</text></g>)}</g>)}<path d="M 414 46 L 479 46" fill="none" stroke="#b84628" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`}/><text x="260" y="290" textAnchor="middle" fontSize="16">{t('先选牌，再按数字结算', 'Choose first, resolve by number')}</text></g>}
      {id === 'hanabi' && <g>{[0,1,2,3].map(i => <g key={i} transform={`translate(${83+i*92} 47) rotate(${(i-1.5)*4} 40 68)`}><rect width="79" height="111" rx="6" fill="#214b50" stroke="#f6f3eb" strokeWidth="3"/><text x="40" y="75" textAnchor="middle" fontSize="51" fill="#f6f3eb">?</text></g>)}<text x="260" y="195" textAnchor="middle" fontSize="18">{t('自己的手牌，朝向别人', 'Your cards face the other players')}</text><path d="M 70 242 H 190 M 330 242 H 453" stroke="#697c70" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`}/><text x="260" y="247" textAnchor="middle" fontSize="16">{t('有限提示', 'Limited clues')}</text></g>}
      {id === 'wingspan' && <g>{[[t('森林', 'Forest'),t('食物', 'Food'),'#c5d0b0'],[t('草原', 'Grassland'),t('蛋', 'Eggs'),'#e4d4a3'],[t('湿地', 'Wetland'),t('牌', 'Cards'),'#b9d1d2']].map(([habitat,action,color],i) => <g key={habitat}><rect x="35" y={23+i*83} width="450" height="71" rx="4" fill={color}/><text x="54" y={65+i*83} fontSize="19">{habitat}</text>{[0,1,2].map(j => <rect key={j} x={165+j*61} y={33+i*83} width="47" height="51" rx="2" fill="#f6f3eb" stroke="#7b8877"/>)}<text x="395" y={65+i*83} fontSize="18">{action}</text></g>)}</g>}
      {id === 'agricola' && <g>
        <text x="142" y="48" textAnchor="middle" fontSize="20">{t('本轮', 'This round')}</text>
        <text x="385" y="48" textAnchor="middle" fontSize="20">{t('下一轮', 'Next round')}</text>
        {[85,140].map(x => <circle key={x} cx={x} cy="116" r="20" fill="#214b50"/>)}
        <circle cx="195" cy="116" r="20" fill="#e4d4a3" stroke="#697c70" strokeWidth="2"/>
        <path d="M 233 116 H 293" stroke="#183b41" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`}/>
        {[330,385,440].map(x => <circle key={x} cx={x} cy="116" r="20" fill="#214b50"/>)}
        <text x="140" y="170" textAnchor="middle" fontSize="17">{t('2名已有成员＋1名新生', '2 existing + 1 newborn')}</text>
        <text x="385" y="170" textAnchor="middle" fontSize="17">{t('3名成员可行动', '3 people can act')}</text>
        <text x="260" y="242" textAnchor="middle" fontSize="19">{t('本轮喂养：2＋2＋1＝5食物', 'Feeding now: 2 + 2 + 1 = 5 food')}</text>
      </g>}
      {id === 'cant-stop' && <g>
        <text x="260" y="42" textAnchor="middle" fontSize="19">{t('临时进度，何时才算保住？', 'When is temporary progress secure?')}</text>
        <line x1="80" y1="125" x2="440" y2="125" stroke="#95aaa1" strokeWidth="4"/>
        <circle cx="120" cy="125" r="19" fill="#214b50"/>
        <circle cx="375" cy="125" r="19" fill="#e4d4a3" stroke="#697c70" strokeWidth="2"/>
        <text x="120" y="173" textAnchor="middle" fontSize="17">{t('已保留', 'Secured')}</text>
        <text x="375" y="173" textAnchor="middle" fontSize="17">{t('本轮临时', 'Temporary')}</text>
        <path d="M 350 203 Q 245 268 140 203" fill="none" stroke="#b84628" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`}/>
        <text x="260" y="279" textAnchor="middle" fontSize="17">{t('失败撤回本轮推进；停手才保留', 'A bust loses this turn’s gains; stop to secure')}</text>
      </g>}
      {id === 'for-sale' && <g>
        {box(31,85,t('现金', 'Cash'),'#c5d0b0',126)}
        {box(198,85,t('房屋', 'Property'),'#e6d8bb',126)}
        {box(365,85,t('支票', 'Checks'),'#b9d1d2',126)}
        <path d="M 166 120 H 188 M 334 120 H 355" fill="none" stroke="#183b41" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`}/>
        <text x="260" y="51" textAnchor="middle" fontSize="19">{t('两次比较，使用不同资源', 'Two contests, different resources')}</text>
        <text x="260" y="218" textAnchor="middle" fontSize="17">{t('先竞价购买，再同时选牌出售', 'First bid to buy, then choose together to sell')}</text>
        <text x="260" y="258" textAnchor="middle" fontSize="17">{t('余款也留到终局', 'Unspent cash remains at the end')}</text>
      </g>}
    </svg>
    {!compact && <figcaption>{t('为解释关系绘制的示意图，不还原实际组件与完整局面。', 'A diagram of relationships, not a reproduction of components or a complete game state.')}</figcaption>}
  </figure>
}

export function DeckExperiment({ language }: { language: ReadingLanguage }) {
  const [extra, setExtra] = useState(0)
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const total = 11 + extra
  return <section className="case-experiment" aria-labelledby="deck-experiment-title"><h2 id="deck-experiment-title">{t('试着只改变牌库的厚度', 'Change only the size of the deck')}</h2><p>{t('构造比较：整副牌刚洗匀，只有一张目标银币，下一手抽五张。新增的牌都不是目标牌，也不提供额外抽牌。', 'Constructed comparison: a fully shuffled deck contains one target Silver. Draw five cards. Added cards are not targets and provide no extra draws.')}</p><label htmlFor="deck-extra">{t('增加几张非目标牌', 'Extra non-target cards')}: {extra}</label><input id="deck-extra" type="range" min="0" max="9" step="1" value={extra} onChange={event => setExtra(Number(event.target.value))}/><div className="case-experiment__result" role="status"><strong>{(100 * singleTargetDrawChance(total)).toFixed(1)}%</strong><span>{t(`五张手牌中见到这张银币的概率：5 ÷ ${total}`, `Chance of seeing the Silver in five cards: 5 ÷ ${total}`)}</span></div><p>{t('卡牌效果、第二张目标牌、额外抽牌或中途才洗牌，都会改变比较条件。概率不直接等于胜率或卡牌价值。', 'Card effects, a second target, extra draws, or shuffling partway through a draw change the conditions. This probability is not a win rate or a measure of card value.')}</p><button type="button" onClick={() => setExtra(0)}>{t('重置比较', 'Reset comparison')}</button></section>
}

export function SimultaneousExperiment({ language }: { language: ReadingLanguage }) {
  const [otherCard, setOtherCard] = useState<10 | 46>(46)
  const [step, setStep] = useState(0)
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const state = sixNimmtComparison(otherCard, step)
  const event = state.events.at(-1)
  return <section className="case-experiment simultaneous-experiment" aria-labelledby="simultaneous-title"><h2 id="simultaneous-title">{t('让同一张 48，走过两种结果', 'Follow the same 48 through two outcomes')}</h2><p>{t('自行构造的局部比较。你已选48，改变对手的牌，再逐张结算。选择10的分支中，约定对手主动收走B行，不表示这是最优策略。', 'A constructed local comparison. You have chosen 48. Change the other card, then resolve each card. In the 10 branch, the other player chooses to take row B; this is not a claim that it is the best move.')}</p><div className="simultaneous-controls" role="group" aria-label={t('对手的牌', 'The other player’s card')}>{([46,10] as const).map(card => <button key={card} aria-pressed={otherCard === card} onClick={() => { setOtherCard(card); setStep(0) }}>{t(`对手选 ${card}`, `Other player: ${card}`)}</button>)}</div><div className="simultaneous-board" aria-label={t('当前四行牌', 'The four current rows')}>{state.rows.map((row, i) => <div className={`simultaneous-row${event?.row === i ? ' simultaneous-row--changed' : ''}`} key={i}><strong>{'ABCD'[i]}</strong>{row.map(card => <span key={card} className={card === event?.card ? 'simultaneous-card--new' : ''}>{card}</span>)}</div>)}</div><p className="simultaneous-event" role="status">{event ? t(`第 ${step} 步：${event.card} 放入 ${'ABCD'[event.row]} 行${event.taken.length ? `，收走 ${event.taken.join('、')}，计 ${event.points} 罚分` : '，没有收牌'}。`, `Step ${step}: ${event.card} goes into row ${'ABCD'[event.row]}${event.taken.length ? `, taking ${event.taken.join(', ')} for ${event.points} penalty points` : ', without taking cards'}.`) : t('还未结算。只看当前局面，48预计是B行第五张。', 'Nothing resolved yet. On this board, 48 appears to be the fifth card in row B.')}</p><div className="simultaneous-controls"><button onClick={() => setStep(value => Math.min(2, value + 1))} disabled={step === 2}>{step === 2 ? t('本次比较结束', 'Comparison complete') : t('结算下一张', 'Resolve next card')}</button><button onClick={() => setStep(0)}>{t('回到原局面', 'Reset this board')}</button></div></section>
}
