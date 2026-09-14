import { EXPERIMENT_RULES, visibleExperimentGroups } from '../experiments/catalog';
import { useState } from 'react';
import { ALL_CHOICES, evaluateChoice, type ChoiceCard, type ChoiceContext } from '../content';
import { Dialog } from './Dialog';

/** Random offers are invitations. This shelf leaves the experiment to its author. */
export function RuleLibrary({ context, onChoose, onClose }: { context: ChoiceContext; onChoose: (card: ChoiceCard) => void; onClose: () => void }) {
  const [group,setGroup]=useState('全部');
  const [filter, setFilter] = useState('');
  const [kind, setKind] = useState<'rule' | 'ability'>('rule');
  const cards = ALL_CHOICES.filter(card => card.kind === kind && (group==='全部'||group==='基础规则'&&!card.id.startsWith('experiment.')||EXPERIMENT_RULES.some(r=>r.id===card.id&&r.group===group)) && `${card.title}${card.description}`.includes(filter.trim()));
  return <Dialog title="自由组合" subtitle="选一条想验证的变化。没有配套规则也可以加入，效果由实际对局决定。" onClose={onClose}>
    <div className="library-tools"><div className="segmented"><button aria-pressed={kind === 'rule'} onClick={() => setKind('rule')}>玩法规则</button><button aria-pressed={kind === 'ability'} onClick={() => {setKind('ability');setGroup('全部');}}>角色能力</button></div><label className="form-field">查找变化<input type="search" value={filter} onChange={event => setFilter(event.target.value)} placeholder="例如：气、波、手牌"/></label></div>
    <div className="library-categories" aria-label="机制分类">{['全部',...(kind==='rule'?['基础规则',...visibleExperimentGroups]:[])].map(name=><button key={name} aria-pressed={group===name} onClick={()=>setGroup(name)}>{name}</button>)}</div><div className="rule-library">{cards.map(card => {
      const result = evaluateChoice(card, context, { free: true });
      return <div className="rule-row" key={card.id}><div><strong>{card.title}</strong><p>{card.description}</p><small>{result.eligible ? result.preview?.notes[0] : result.reasons[0]}</small></div><button className="button button-quiet" disabled={!result.eligible} aria-label={`试试${card.title}`} onClick={() => onChoose(card)}>试试</button></div>;
    })}{!cards.length && <p className="muted">没有找到对应变化。</p>}</div>
  </Dialog>;
}
