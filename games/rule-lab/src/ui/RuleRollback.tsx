import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Undo2 } from 'lucide-react';
import { previewRuleChange, type ChangePreview, type Design, type RuleChange, type RuleId } from '../core';
import { Dialog } from './Dialog';
import { abilityNames, goalText, ruleNames } from './constants';
import './rule-rollback.css';

interface RollbackSelection { key: string; title: string; change: RuleChange }
export function rollbackOptions(design: Design): RollbackSelection[] {
  const rules: RollbackSelection[] = design.rules.map(rule => ({ key: rule, title: ruleNames[rule], change: { type: 'remove', rule } }));
  const ability = design.abilities.player;
  if (ability) rules.push({ key: `player:${ability}`, title: `你的${abilityNames[ability]}能力`, change: { type: 'ability', side: 'player', ability: null } });
  return rules;
}
function changeName(id: string): string {
  if (id.startsWith('player:')) return `你的${abilityNames[id.slice(7) as keyof typeof abilityNames]}能力`;
  if (id.startsWith('computer:')) return '对手能力';
  return ruleNames[id as RuleId] ?? id;
}

/** Cancels future rules only. The resolved battle and the creation's progress are never rewound. */
export function RuleRollback({ design, onClose, onApply }: {
  design: Design; onClose: () => void; onApply: (preview: ChangePreview, title: string) => void;
}) {
  const [selected, setSelected] = useState<RollbackSelection | null>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const selectedKey = useRef<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const options = rollbackOptions(design);
  const preview = selected ? previewRuleChange(design, selected.change) : null;
  useEffect(() => {
    if (selected) previewHeading.current?.focus();
    else if (selectedKey.current) list.current?.querySelector<HTMLButtonElement>(`[data-rollback-id="${selectedKey.current}"]`)?.focus();
  }, [selected]);
  const back = () => { selectedKey.current = selected?.key ?? null;setSelected(null); };

  return <Dialog title="回退一条规则" subtitle="从第五回合起，可以随时拿掉一项已选变化。" onClose={onClose}>
    {!selected ? <>
      {options.length ? <div className="rollback-list" ref={list} aria-label="可取消的规则">{options.map((option, index) => <button
        key={option.key} className="rollback-option" data-rollback-id={option.key} data-autofocus={index === 0 ? true : undefined} aria-label={`取消${option.title}`}
        onClick={() => setSelected(option)}><span><Undo2 size={18}/>{option.title}</span><ArrowRight size={17}/>
      </button>)}</div> : <div className="rollback-empty"><Undo2 size={30}/><h3>还没有可以取消的规则</h3><p>现在只有最初的玩法。以后选到规则或能力，都可以从这里取消；画风与声音会保留。</p></div>}
      <p className="rollback-footnote">这里只改变接下来的玩法，不改写已经揭晓的结果。</p>
      <div className="dialog-actions"><button className="button-quiet" onClick={onClose}>先不取消</button></div>
    </> : preview && <section className="rollback-confirmation">
      <button className="text-button rollback-back" onClick={back}><ArrowLeft size={15}/>换一条</button>
      <h3 ref={previewHeading} tabIndex={-1}>取消「{selected.title}」</h3>
      <p>这项改动会取消以下内容：</p>
      <ul className="rollback-removals">{preview.removed.map(id => <li key={id}>{changeName(id)}</li>)}</ul>
      {preview.removed.length > 1 && <p className="rollback-dependencies">这些变化依赖你选择取消的规则，需要一起退出。</p>}
      <div className="rollback-restart"><strong>按剩下的规则，重新开始当前场。</strong><p>{goalText(preview.nextDesign)}</p><p>本场生命、气、手牌和能力次数会按剩余规则重置。已揭晓的结果、累计回合和已选记录都会保留；取消过的变化不会重新进入卡池。</p></div>
      {preview.errors.map(error => <p key={error} role="alert" className="error-message">{error}</p>)}
      <div className="dialog-actions"><button className="button-quiet" onClick={onClose}>先不取消</button><button className="button button-primary" disabled={!preview.valid} onClick={() => onApply(preview, selected.title)}>确认取消并重开</button></div>
    </section>}
  </Dialog>;
}
