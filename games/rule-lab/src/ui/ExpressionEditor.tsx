import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { ChoiceCard } from '../content/catalog';
import type { CompiledDesign, MatchState } from '../core/types';
import { validateName, type Expression } from '../journey';
import { audio } from '../presentation/audio';
import { CreationPreview } from '../presentation/visuals';
import { STYLE_OPTIONS, type VisualStyle } from '../presentation/themes';
import { generateCoverSVG } from '../presentation/cover';
import { DuelReveal, revealDurationMs } from '../presentation/DuelReveal';
import { Dialog } from './Dialog';
import { RulesView } from './RulesView';
import { goalText, actionNames } from './constants';

const variants: Partial<Record<keyof Expression, { value: string; label: string; description: string }[]>> = {
  style: STYLE_OPTIONS.map(({id,label,description})=>({value:id,label,description})),
  sound: [{ value: 'paper', label: '纸与木', description: '短促、柔和的落点。' }, { value: 'electronic', label: '电子', description: '清脆、简短的脉冲。' }],
  rulesView: [{ value: 'graph', label: '画出关系', description: '顺着箭头看谁胜过谁。' }, { value: 'list', label: '逐条读', description: '从自己的手势开始读。' }],
  ending: [{ value: 'quiet', label: '安静收束', description: '让结果停在留白里。' }, { value: 'stamp', label: '落一枚印', description: '为这一场留下一个记号。' }],
  cover: [{ value: 'centered', label: '居中', description: '平衡地摆出你的手势。' }, { value: 'diagonal', label: '斜向', description: '让手势沿一道斜线展开。' }],
  outcome: [{ value: 'compact', label: '简洁', description: '先看到结果与关键原因。' }, { value: 'detailed', label: '细说', description: '展开原始交锋与能力变化。' }],
  resources: [{ value: 'blocks', label: '一格一格', description: '把余量画成可以数的格子。' }, { value: 'numbers', label: '直接读数', description: '数值和上限一眼可见。' }],
  reveal: [{ value: 'quick', label: '轻快', description: '三次短促轻拍，同时打开。' }, { value: 'rhythm', label: '留一拍', description: '把共同节拍放慢一点，再一起打开。' }],
};

export function ExpressionEditor({ choice, expression, compiled, match, busy, reduced = false, onClose, onApply }: {
  choice: ChoiceCard; expression: Expression; compiled: CompiledDesign; match: MatchState; busy: boolean; reduced?: boolean;
  onClose: () => void; onApply: (expression: Expression) => Promise<void>;
}) {
  const key = choice.expressionKey!;
  const [draft, setDraft] = useState(()=>{
    const alternate=variants[key]?.find(option=>option.value!==expression[key]);
    return alternate&&!choice.unlockUI?{...expression,[key]:alternate.value}:expression;
  });
  const [error, setError] = useState('');
  const [beat, setBeat] = useState(0);
  const [sampleRevealed, setSampleRevealed] = useState(true);
  const sampleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const systemReduced = useReducedMotion();
  const reducePreview = reduced || !!systemReduced;
  const sampleRecord = match.history.at(-1);
  const cancelSound = useRef<(() => void) | null>(null);
  useEffect(() => () => { cancelSound.current?.(); if(sampleTimer.current)clearTimeout(sampleTimer.current); }, []);
  const stopPreview = () => { if(sampleTimer.current)clearTimeout(sampleTimer.current);sampleTimer.current=null;setSampleRevealed(true); };
  const replayReveal = () => {
    if(!sampleRecord)return;
    if(sampleTimer.current)clearTimeout(sampleTimer.current);
    setBeat(previous=>previous+1);setSampleRevealed(false);
    sampleTimer.current=setTimeout(()=>{sampleTimer.current=null;setSampleRevealed(true);},revealDurationMs(draft.reveal,reducePreview));
  };
  const submit = async () => {
    const name = validateName(draft.name ?? '');
    if (!name.ok) { setError(name.error); return; }
    if(key==='name'&&!name.name){setError('写下一个名字，或先保持留白。');return;}
    await onApply({ ...draft, name: name.name });
  };
  const hasChange=!!choice.unlockUI || draft[key]!==expression[key];
  return <Dialog title={choice.title} subtitle={choice.question} onClose={onClose} wide={key === 'rulesView' || key === 'style'}>
    {key === 'name' ? <div className="name-editor">
      <label className="form-field">作品名称<input data-autofocus value={draft.name ?? ''} onChange={e => { setDraft({ ...draft, name: e.target.value }); setError(''); }} placeholder="写下你想留下的名字" onKeyDown={e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing) void submit();}} /></label>
      <p className="muted small">最多 24 个字形。只有提交之后，名字才会出现在你的游戏里。</p>
      <div className="name-preview">{draft.name?.trim() || <span className="muted">留白，也是一种选择。</span>}</div>
    </div> : <>
      <div className={`variant-grid ${key==='style'?'style-variants':''}`}>{variants[key]?.map(option => <button key={option.value} className={`variant-card ${key==='style'?`theme-${option.value}`:''} ${draft[key] === option.value ? 'selected' : ''}`} aria-pressed={draft[key] === option.value}
        onClick={() => { stopPreview();setDraft({ ...draft, [key]: option.value }); if (key==='sound') { cancelSound.current?.();cancelSound.current=audio.preview(option.value as 'paper'|'electronic'); } }}>
        {(key==='style'||key==='ending'||key==='reveal')&&<CreationPreview kind={key === 'style' ? 'style' : option.value} style={key === 'style' ? option.value as VisualStyle : draft.style}/>}
        <strong>{option.label}</strong><span>{option.description}</span><span className="variant-check">{draft[key]===option.value?'✓ 已选':'选择'}</span>
      </button>)}</div>
      <div className="expression-preview">
        {key==='rulesView' && <RulesView compiled={compiled} view={draft.rulesView}/>}
        {key==='cover' && <div className="cover-preview" dangerouslySetInnerHTML={{__html:generateCoverSVG({name:draft.name??undefined,style:draft.style,ability:compiled.abilities.player,gestures:compiled.gestures,layout:draft.cover,subtitle:goalText(compiled.design)})}}/>}
        {key==='sound' && <button className="button" onClick={()=>{cancelSound.current?.();cancelSound.current=audio.preview(draft.sound);}}>试听一次</button>}
        {key==='ending' && <><div className={`ending-preview ${draft.ending==='stamp'?'result-stamp':''}`}>{match.result?.winner==='draw'?'平局':match.result?.winner==='computer'?'这一场，对手获胜':match.result?.winner==='player'?'这一场，你获胜':'这一场，结束了'}</div>{!match.result&&<p className="muted small">构图示意。真正的结束由这一场的结果决定。</p>}</>}
        {key==='resources' && <div className="resource-preview">{compiled.life&&<ResourceMeter label="生命" value={match.fighters.player.life} max={3} variant={draft.resources}/>} {compiled.energy&&<ResourceMeter label="气" value={match.fighters.player.energy} max={compiled.energyCap} variant={draft.resources}/>} {compiled.finiteCards&&<ResourceMeter label={actionNames[compiled.gestures[0]]} value={match.fighters.player.cards[compiled.gestures[0]]} max={compiled.cardsPerGesture} variant={draft.resources} inventory/>}</div>}
        {key==='outcome'&&<div><p>{match.history.at(-1)?.outcome==='draw'?'这一手打平':match.history.at(-1)?.outcome==='player'?'这一手你赢了':'这一手对手赢了'}</p>{draft.outcome==='detailed'&&<ul className="event-list">{match.history.at(-1)?.events.filter(e=>e.type!=='committed').map(e=><li key={e.id}>{e.text}</li>)}</ul>}</div>}
        {key==='reveal'&&<>{sampleRecord&&<DuelReveal key={beat} record={sampleRecord} revealed={sampleRevealed} reduced={reducePreview} tempo={draft.reveal} playerAbility={compiled.abilities.player} computerAbility={compiled.abilities.computer}/>}<button className="button" disabled={!sampleRecord||!sampleRevealed} onClick={replayReveal}>{sampleRevealed?'预览节奏':'正在预览'}</button><p className="muted small">重放刚才已经揭晓的双方动作。</p></>}
      </div>
    </>}
    {error&&<p role="alert" className="error-message">{error}</p>}
    <div className="dialog-actions"><button className="button-quiet" onClick={onClose}>先不改</button><button className="button button-primary" disabled={busy||!hasChange} onClick={()=>void submit()}>留下这个选择</button></div>
  </Dialog>;
}

export function ResourceMeter({ label, value, max, variant, inventory = false }: { label: string; value: number; max: number; variant: Expression['resources']; inventory?: boolean }) {
  return <span className={`resource-meter ${variant}`} aria-label={inventory?`${label} ${value} 张`:`${label} ${value} / ${max}`}><span className="resource-label">{label}</span>{variant==='numbers'?<strong>{value}<small>{inventory?' 张':` / ${max}`}</small></strong>:<span className="resource-blocks" aria-hidden="true">{Array.from({length:Math.max(max,value)},(_,i)=><i key={i} className={i<value?'filled':''}/>)}</span>}</span>;
}
