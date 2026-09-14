import { ExperimentWorld, ExperimentOutcomes } from './experiments/Interface';
import { declarationsNeeded, hasExperiment, validateExperiment, loanCredit } from './experiments/engine';
import type { ExperimentInput } from './experiments/types';
import { sealInformation } from './core/match';
import { CardExchange } from './cards/CardExchange';
import { CardTable, CardReport } from './cards/CardTable';
import { cardMode, craftCard, mulliganCard } from './cards/engine';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'motion/react';
import { BookOpen, Settings2, Undo2, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { createDesign, experimentNotes, compileDesign, createMatch, commitComputer, legalActions, resolveAttempt, advanceMatch, exchangeCards, previewRuleChange, normalizePlayerOnlyDesign, isGesture, isPassiveAbility, rawOutcome, compareReplay, commitRuleChange, actionCost, chargeTradeCard } from './core';
import type { Action, ActionKind, ChangePreview, CompiledDesign, Design, Gesture, MatchState, RuleChange, RuleId, Side } from './core';
import { ALL_CHOICES, evaluateChoice, drawChoices, getUnlockedUI, type ChoiceCard, type ChoiceDraw } from './content';
import { canRollbackRules, createJourney, defaultExpression, defaultPreferences, observeMatch, recordChoice, snapshotVersion, type Expression, type JourneyState, type Preferences } from './journey';
import { Stage, GestureIcon, AbilityIcon, CreationPreview, ResourceIcon } from './presentation/visuals';
import { DuelReveal, revealDurationMs } from './presentation/DuelReveal';
import { audio } from './presentation/audio';
import { CharacterArt, CharacterStand, characters, passiveActionHint, passiveCharacterSummary } from './presentation/Character';
import { themeLabel } from './presentation/themes';
import './ui/mechanics.css';
import { generateCoverSVG } from './presentation/cover';
import { Dialog } from './ui/Dialog';
import { RulesView } from './ui/RulesView';
import { MatchProgress, PublicRuleStatus } from './ui/MatchProgress';
import { ExpressionEditor, ResourceMeter } from './ui/ExpressionEditor';
import { RuleLibrary } from './ui/RuleLibrary';
import { RuleRollback } from './ui/RuleRollback';
import { actionNames, abilityNames, goalText, ruleNames } from './ui/constants';

interface Work { design: Design; expression: Expression; match: MatchState; journey: JourneyState; preferences: Preferences }
type Panel = null | 'choices' | 'library' | 'character' | 'rules' | 'workshop' | 'settings' | 'awakening' | 'catalog' | 'restart' | 'cover' | 'rollback'
  | { type: 'expression'; choice: ChoiceCard }
  | { type: 'preview'; title: string; preview: ChangePreview; choice?: ChoiceCard };

const freshSeed = () => crypto.getRandomValues(new Uint32Array(1))[0];
let experimentSequence = 0;
function ready(match: MatchState): MatchState {
  if (match.phase !== 'preparing') return match;
  const c = compileDesign(match.design);
  if(declarationsNeeded(match))return match;
  const canExchange = c.exchange && !match.preparationComplete && match.fighters.player.exchangeRemaining > 0 && c.gestures.some(g => match.fighters.player.cards[g] >= 2);
  return canExchange ? match : commitComputer(match);
}
function newExperiment(design: Design): MatchState {
  const match = createMatch(design, freshSeed());
  const seededId = match.id;
  // A seed describes the same random sequence, not the same play session.
  // Distinct launches must still count when crypto happens to repeat a seed.
  match.id = `${seededId}:play-${++experimentSequence}`;
  match.events = match.events.map(event => ({ ...event, id: event.id.replace(`${seededId}:`, `${match.id}:`) }));
  return ready(match);
}
function initialWork(): Work {
  const design = createDesign();
  return { design, expression: { ...defaultExpression }, match: newExperiment(design), journey: createJourney(), preferences: { ...defaultPreferences } };
}
const resultLabel = (result: 'player'|'computer'|'draw') => result==='player'?'你赢了':result==='computer'?'对手赢了':'打平了';

export function App() {
  const [work, setWork] = useState<Work>(initialWork);
  const workRef = useRef(work);
  const [panel, setPanel] = useState<Panel>(null);
  const [offer, setOffer] = useState<ChoiceDraw & { key: string } | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const choiceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const choiceLock = useRef(false);
  const choiceRandom = useRef<{ seed: number; draw: number } | null>(null);
  const chosenRound = useRef<string | null>(null);
  const [declared, setDeclared] = useState(false);
  const [boost, setBoost] = useState<0 | 1 | 2>(0);
  const [wager, setWager] = useState(false);
  const [experimentInput,setExperimentInput]=useState<ExperimentInput>({});
  useEffect(()=>setExperimentInput({}),[work.match.id,work.match.attempt]);
  const [revealing, setRevealing] = useState(false);
  const revealLock = useRef(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rulesMode, setRulesMode] = useState<'graph'|'list'>(work.expression.rulesView);
  const [comparisonDesign, setComparisonDesign] = useState<Design|null>(null);
  const [lastExperiment, setLastExperiment] = useState<MatchState|null>(null);
  const systemReduced = useReducedMotion();
  const reduced = work.preferences.reducedMotion || !!systemReduced;
  const compiled = useMemo(()=>compileDesign(work.design),[work.design]);
  const passiveCharacter=isPassiveAbility(work.design.abilities.player);
  const activeAbility=!!work.design.abilities.player&&!passiveCharacter;
  const context = { design:work.design, match:work.match, journey:work.journey, expression:work.expression };
  const ui = getUnlockedUI(work.journey);
  const workshopWasUnlocked = useRef(ui.workshop);
  const simple = work.design.rules.length===0 && !work.design.abilities.player && !work.design.abilities.computer;
  const currentRecord = work.match.history.at(-1);
  const disclosedHands = work.journey.completedHands - Number(revealing && !!currentRecord && !currentRecord.voided);
  const rollbackUnlocked = canRollbackRules({ completedHands: disclosedHands });
  const hasHeader = !!work.expression.name || ui.rules || ui.workshop || ui.settings || ui.cover || rollbackUnlocked;
  const displayMatch = revealing && currentRecord ? { ...work.match, experiment:currentRecord.experimentBefore, fighters: currentRecord.before, hand: currentRecord.hand - 1, phase: 'awaitingPlayer' as const, overtimeActive: !compiled.healthOnly && currentRecord.hand > compiled.cap, effectiveCap: !compiled.healthOnly && currentRecord.hand > compiled.cap ? compiled.cap + 3 : compiled.cap, result: null } : work.match;
  const settled = !revealing && (work.match.phase==='presenting'||work.match.phase==='finished');
  const changeAvailable = !!work.match.result && chosenRound.current!==`${work.match.id}:${work.match.attempt}`;
  const actions = legalActions(work.match, 'player');
  const awaiting = work.match.phase==='awaitingPlayer'&&!revealing;
  const visibleRecord = settled ? currentRecord : undefined;
  const characterTriggered=!!visibleRecord&&(passiveCharacter
    ? !visibleRecord.voided&&visibleRecord.events.some(event=>event.type==='passive_triggered'&&event.side==='player'&&event.ability===work.design.abilities.player&&(event.amount??0)>0)
    : !!visibleRecord.player.ability&&(visibleRecord.voided||visibleRecord.rawOutcome!==visibleRecord.outcome||visibleRecord.events.some(event=>['shield_gained','foresight_granted','energy_transferred','cards_reforged','last_stand_triggered','passive_triggered'].includes(event.type)&&event.side==='player'&&event.ability===work.design.abilities.player&&(event.amount??0)>0)));

  const update = (next: Work) => { workRef.current=next;setWork(next); };
  const announce = (text: string) => { setMessage(text); };
  const close = () => { if(choiceTimer.current) clearTimeout(choiceTimer.current);choiceLock.current=false;setSelectedCard(null);setPanel(null);setComparisonDesign(null);setError(''); };
  const guard = (fn:()=>void) => { try {setError('');fn();} catch(e) {setError(e instanceof Error?e.message:'这一步暂时没有完成，请再试一次。');} };

  useEffect(()=>{ if(ui.workshop&&!workshopWasUnlocked.current) announce('第三条玩法规则已加入 · 我的作品已开启');workshopWasUnlocked.current=ui.workshop; },[ui.workshop]);
  useEffect(()=>{ document.title=work.expression.name??'石头剪刀布'; },[work.expression.name]);
  useEffect(()=>{
    audio.setMuted(work.preferences.muted);audio.setVolume(work.preferences.volume);audio.setTone(work.expression.sound);
  },[work.preferences.muted,work.preferences.volume,work.expression.sound]);
  useEffect(()=>{setRulesMode(work.expression.rulesView);},[work.expression.rulesView]);
  useEffect(()=>()=>{if(revealTimer.current) clearTimeout(revealTimer.current);if(choiceTimer.current)clearTimeout(choiceTimer.current);audio.cancelAll();},[]);
  useEffect(()=>{ if(!message)return;const timer=setTimeout(()=>setMessage(''),3800);return()=>clearTimeout(timer);},[message]);
  useEffect(()=>{
    const listener=(event:KeyboardEvent)=>{
      if(panel||revealLock.current||event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
      if((event.target as HTMLElement)?.closest('input,select,textarea,button,[contenteditable="true"]'))return;
      const index=Number(event.key)-1;
      if(!cardMode(work.match)&&index>=0&&index<compiled.actions.length){event.preventDefault();submit(compiled.actions[index]);}
    };
    window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);
  });

  function submit(kind: ActionKind, cardId?:string) {
    if(revealLock.current||workRef.current.match.phase!=='awaitingPlayer')return;
    const sealed=workRef.current.match.experiment?.sealedPlayer;
    const action:Action=sealed?{...sealed,experiment:{...sealed.experiment,...(experimentInput.insurance?{insurance:experimentInput.insurance}:{})}}:{kind,cardId,boost:isGesture(kind)?boost:0,ability:isGesture(kind)&&declared&&!passiveCharacter,wager:isGesture(kind)&&wager,...(workRef.current.match.experiment?{experiment:experimentInput}:{})};
    guard(()=>{
      const current=workRef.current;
      if(hasExperiment(current.match,'information')&&!current.match.experiment?.sealedPlayer){update({...current,match:sealInformation(current.match,action)});return;}
      const nextMatch=resolveAttempt(current.match,action,{matchId:current.match.id,attemptId:current.match.attempt,commandId:`${current.match.id}:${current.match.attempt}:player`});
      revealLock.current=true;setRevealing(true);setDeclared(false);setBoost(0);setWager(false);
      const journey=observeMatch(current.journey,nextMatch);
      update({...current,match:nextMatch,journey});
      audio.prepareReveal({tempo:current.expression.reveal,reduced});
      const delay=revealDurationMs(current.expression.reveal,reduced);
      revealTimer.current=setTimeout(()=>{
        revealLock.current=false;setRevealing(false);
        const record=nextMatch.history.at(-1)!;
        audio.playResolution(record);
      },delay);
    });
  }
  function nextMatch() {
    if(revealLock.current)return;
    audio.cancelAll();
    guard(()=>{
      const current=workRef.current;
      if(current.match.result) setLastExperiment(current.match);
      const match=current.match.result?newExperiment(current.design):ready(advanceMatch(current.match));
      update({...current,match,journey:observeMatch(current.journey,match)});setDeclared(false);setBoost(0);setWager(false);close();
    });
  }
  function openChoices() {
    if(revealLock.current || !workRef.current.match.result || chosenRound.current===`${workRef.current.match.id}:${workRef.current.match.attempt}`)return;
    const current=workRef.current;
    const key=`${current.match.id}:${current.match.attempt}:${current.journey.choices.length}`;
    if(offer?.key!==key){
      choiceRandom.current ??= {seed:freshSeed(),draw:0};
      const draw=drawChoices(current,choiceRandom.current);
      choiceRandom.current.draw+=1;
      setOffer({...draw,key});
    }
    audio.cancelAll();setSelectedCard(null);setPanel('choices');
  }
  function choose(card: ChoiceCard, free = false) {
    guard(()=>{
      const current=workRef.current;
      const eligibility=evaluateChoice(card,current,{free});
      if(!eligibility.eligible){setError(eligibility.reasons.join(' '));return;}
      if(card.kind==='expression'){
        if(card.expressionKey){setPanel({type:'expression',choice:card});return;}
        const journey=recordChoice(snapshotVersion(current.journey,current.design,current.expression,`${card.title}之前`),card.id,card.kind);
        chosenRound.current=`${current.match.id}:${current.match.attempt}`;
        update({...current,journey});close();audio.play('install');return;
      }
      const design=normalizePlayerOnlyDesign(commitRuleChange(current.design,eligibility.preview!));
      const journey=recordChoice(snapshotVersion(current.journey,current.design,current.expression,`${card.title}之前`),card.id,card.kind);
      chosenRound.current=`${current.match.id}:${current.match.attempt}`;
      if(current.match.history.length)setLastExperiment(current.match);
      update({...current,design,journey,match:newExperiment(design)});
      setDeclared(false);setBoost(0);setWager(false);close();audio.play('install');
      if(card.kind==='ability')setPanel('awakening');
    });
  }
  function selectCard(card:ChoiceCard){
    if(choiceLock.current||panel!=='choices'||!offer?.cards.some(item=>item.id===card.id))return;
    choiceLock.current=true;setSelectedCard(card.id);
    choiceTimer.current=setTimeout(()=>{choiceLock.current=false;setSelectedCard(null);choose(card);},reduced?0:260);
  }
  function previewChange(change:RuleChange,title:string){guard(()=>{setComparisonDesign(null);setPanel({type:'preview',title,preview:previewRuleChange(workRef.current.design,change)});});}
  function openRollback() {
    if(revealLock.current||choiceLock.current||panel!==null||!canRollbackRules(workRef.current.journey))return;
    audio.cancelAll();setError('');setPanel('rollback');
  }
  function applyRollback(preview:ChangePreview,title:string) {
    if(revealLock.current||choiceLock.current||panel!=='rollback'||!canRollbackRules(workRef.current.journey))return;
    guard(()=>{
      const current=workRef.current;
      const design=normalizePlayerOnlyDesign(commitRuleChange(current.design,preview));
      const journey=snapshotVersion(current.journey,current.design,current.expression,`取消${title}之前`);
      if(current.match.history.length)setLastExperiment(current.match);
      audio.cancelAll();
      update({...current,design,journey,match:newExperiment(design)});
      setDeclared(false);setBoost(0);setWager(false);setOffer(null);close();audio.play('undo');
      announce(`已取消${title}。按剩下的规则重新开始这一场。`);
    });
  }
  function install() {
    if(typeof panel!=='object'||panel?.type!=='preview')return;
    guard(()=>{
      const current=workRef.current;
      const design=normalizePlayerOnlyDesign(commitRuleChange(current.design,panel.preview));
      let journey=snapshotVersion(current.journey,current.design,current.expression,`${panel.title}之前`);
      if(panel.choice)journey=recordChoice(journey,panel.choice.id,panel.choice.kind);
      if(current.match.history.length)setLastExperiment(current.match);
      update({...current,design,journey,match:newExperiment(design)});
      setDeclared(false);setBoost(0);setWager(false);close();audio.play('install');announce(`已改变：${panel.title}。从这一场试起。`);
    });
  }
  async function express(expression:Expression) {
    const current=workRef.current;
    const choice=typeof panel==='object'&&panel?.type==='expression'?panel.choice:undefined;
    if(!choice||!evaluateChoice(choice,current).eligible)return;
    const journey=recordChoice(snapshotVersion(current.journey,current.design,current.expression,`${choice.title}之前`),choice.id,choice.kind);
    chosenRound.current=`${current.match.id}:${current.match.attempt}`;
    update({...current,expression,journey});close();audio.play(choice.id==='U01'?'name':'style');
  }
  function restoreVersion(id:string){guard(()=>{
    const current=workRef.current;const version=current.journey.versions.find(v=>v.id===id);if(!version)return;
    const journey=snapshotVersion(current.journey,current.design,current.expression,'撤回之前');
    if(current.match.history.length)setLastExperiment(current.match);
    const restored=normalizePlayerOnlyDesign(version.design);
    const sameMechanics=compileDesign(current.design).hash===compileDesign(restored).hash;
    update({...current,design:restored,expression:version.expression,journey,match:sameMechanics?current.match:newExperiment(restored)});
    if(!sameMechanics){setDeclared(false);setBoost(0);setWager(false);}close();audio.play('undo');announce(sameMechanics?'表达回到这一版，当前实验保持原样。':'回到这个版本，重新试一场。');
  });}
  function setPreferences(patch:Partial<Preferences>){const current=workRef.current;update({...current,preferences:{...current.preferences,...patch}});}
  const comparisonSource=work.match.history.length?work.match:lastExperiment;

  const playControls = awaiting&&!work.match.experiment?.sealedPlayer&&(activeAbility||work.design.rules.includes('energy.gesture_boost')||compiled.wager)&&<div className="ability-controls">
            {activeAbility&&work.design.abilities.player&&<button className={`ability-toggle ${declared?'active':''}`} aria-pressed={declared} disabled={work.match.fighters.player.abilityRemaining===0} onClick={()=>{setDeclared(!declared);void audio.init().then(()=>audio.play('select'));}}><AbilityIcon ability={work.design.abilities.player} size={26}/><span>{abilityNames[work.design.abilities.player]} <small>{work.match.fighters.player.abilityRemaining===0?'本场已用尽':declared?'这手发动':'这手先留着'}</small></span><span className="toggle-indicator">{declared?'✓':'+'}</span></button>}
            {work.design.rules.includes('energy.gesture_boost')&&<div className="boost-selector" role="group" aria-label="强化手势"><span><ResourceIcon kind="energy" size={20}/>强化手势</span><div>{([0,1,2] as const).filter(n=>n<=compiled.maxBoost).map(n=><button key={n} className={boost===n?'active':''} aria-pressed={boost===n} disabled={work.match.fighters.player.energy<n+Number(wager)} onClick={()=>setBoost(n)}>{n===0?'不强化':`${n} 气 · +${n} 伤`}</button>)}</div><small>{compiled.life?'只有手势获胜才加伤；失败和平局仍付费。':'当前没有生命：强化照常花气，但不会改变胜负。'}</small></div>}
            {compiled.wager&&<button className={`wager-toggle ${wager?'active':''}`} aria-pressed={wager} disabled={!wager&&work.match.fighters.player.energy<boost+1} onClick={()=>setWager(!wager)}><ResourceIcon kind="energy" size={24}/><span><strong>{wager?'已押 1 气':'押一气'}</strong><small>仅手势 · 胜返 2 / 平返 1 / 负返 0 · 受容量限制</small></span><b aria-hidden="true">{wager?'✓':'+'}</b></button>}
          </div>;
  const playContent = (revealing||visibleRecord)&&currentRecord?<div className="reveal-panel" key={`${work.match.id}-${currentRecord.attempt}`}>
            <DuelReveal record={currentRecord} revealed={!revealing} reduced={reduced} tempo={work.expression.reveal} playerAbility={work.design.abilities.player} computerAbility={work.design.abilities.computer}/>
            <div className="result-copy" aria-live="polite">{visibleRecord&&<>
              <motion.h2 initial={reduced?false:{opacity:0,y:5}} animate={{opacity:1,y:0}} className={work.match.result&&work.expression.ending==='stamp'?'result-stamp':''}>{visibleRecord.voided?'这一次，重新来。':work.match.result&&compiled.challenge?work.match.result.winner==='player'?'挑战成功。':'这次，挑战未完成。':work.match.result&&compiled.cap>1?work.match.result.winner==='draw'?'这一场，平局。':work.match.result.winner==='player'?'这一场，你赢了。':'这一场，对手赢了。':resultLabel(visibleRecord.outcome)}</motion.h2>
              {(visibleRecord.voided||visibleRecord.rawOutcome!==visibleRecord.outcome)&&<p className="ability-result-note">{visibleRecord.voided?'再搏生效 · 保留资源，重新出手':visibleRecord.rawOutcome==='draw'?'抢平生效 · 平局变为你赢':'保底生效 · 失败变为平局'}</p>}
              <CardReport compact={cardMode(work.match)}><MechanicOutcomes record={visibleRecord}/><ExperimentOutcomes match={work.match}/>
              {work.match.result&&compiled.challenge&&<p className="challenge-result-reason">{work.match.result.text}</p>}{ui.outcome&&<><p className="result-reason">{visibleRecord.voided?'这次尝试作废。气、手牌和生命都保留。':visibleRecord.rawOutcome!==visibleRecord.outcome?`原本${resultLabel(visibleRecord.rawOutcome)}，${visibleRecord.rawOutcome==='draw'?'抢平':'保底'}改变了结果。`:work.match.result&&compiled.cap>1?work.match.result.text:''}</p><details className="outcome-details" open={work.expression.outcome==='detailed'}><summary>这一手为什么这样</summary><ul className="event-list">{visibleRecord.events.map(e=><li key={e.id}>{e.text}</li>)}</ul></details></>}</CardReport>
            </>}</div>
          </div>:work.match.phase==='preparing'?<div className="preparation-panel"><p className="eyebrow">出手之前</p><h2>要换一张牌吗？</h2><p className="muted">本场一次，用两张相同手牌换一张不同手势。完成后，双方锁定。</p><CardReport compact={cardMode(work.match)} title="换牌"><CardExchange match={work.match} compiled={compiled} onExchange={(from,to)=>guard(()=>{const current=workRef.current;update({...current,match:exchangeCards(current.match,'player',from,to)});announce('已交换。准备完成后开始出手。');})}/></CardReport><button className="button button-primary" onClick={()=>guard(()=>{const current=workRef.current;const match=commitComputer(current.match);update({...current,match,journey:observeMatch(current.journey,match)});})}>准备好了 <ArrowRight size={16}/></button></div>:cardMode(work.match)?null:<>
            {!simple&&<p className="turn-prompt">{work.match.experiment?.sealedPlayer?'动作已封存。':currentRecord?.voided?'同一手，再选一次。':'选一个动作。'}</p>}
            <div className={`actions-row actions-${compiled.actions.length}`} aria-label="选择你的动作">{compiled.actions.map((kind,index)=>{
              const action:Action={kind,boost:isGesture(kind)?boost:0,ability:isGesture(kind)&&declared&&!passiveCharacter,wager:isGesture(kind)&&wager};
              if(work.match.experiment)action.experiment=experimentInput;
              const credit=loanCredit(work.match,'player',action,compiled);
              const candidates=credit?legalActions(work.match,'player',credit):actions;
              let legal=candidates.some(a=>a.kind===action.kind&&a.boost===action.boost&&a.ability===action.ability&&!!a.wager===!!action.wager);
              let extraError='';try{validateExperiment(work.match,'player',action,compiled,actionCost(action,compiled));}catch(e){extraError=e instanceof Error?e.message:'附加选择不合法';}
              const cost=actionCost(action,compiled);
              const traded=compiled.chargeTrade&&kind==='charge'?chargeTradeCard(compiled,work.match.fighters.player):null;
              const unavailable=extraError|| (isGesture(kind)&&compiled.finiteCards&&work.match.fighters.player.cards[kind]===0?'已用尽':isGesture(kind)&&compiled.cooldown&&work.match.fighters.player.lastAction===kind?'本手冷却':compiled.specialCooldown&&!isGesture(kind)&&work.match.fighters.player.lastAction===kind?'本手冷却':compiled.chargeTrade&&kind==='charge'&&!traded?'需要一张手牌':cost>work.match.fighters.player.energy?`需要 ${cost} 气`:!legal?'当前不能使用':'');
              return <motion.button key={kind} className={`action-button ${!isGesture(kind)?'special-action':''}`} aria-label={`出${actionNames[kind]}`} disabled={!awaiting||!legal||!!work.match.experiment?.sealedPlayer} whileHover={reduced?undefined:{y:-8}} whileTap={reduced?undefined:{scale:.95}} onClick={()=>submit(kind)}><ActionPicture kind={kind}/><span className="gesture-label">{actionNames[kind]}</span>{passiveActionHint(work.design.abilities.player,kind)&&<span className="action-passive-hint">{passiveActionHint(work.design.abilities.player,kind)}</span>}{isGesture(kind)&&(compiled.ui.fiveGestures||compiled.reverse||compiled.publicTrump||compiled.gestures.length<3)&&<span className="action-matchups">胜 {compiled.gestures.filter(other=>rawOutcome(kind,other,compiled.reverse,work.match.publicTrump)==='player').map(other=>actionNames[other]).join('、')||'无'}</span>}{(compiled.finiteCards||compiled.cooldown||compiled.energy||extraError||!legal)&&<span className="action-meta">{extraError?'附加选择需调整':!legal?unavailable:!isGesture(kind)?kind==='charge'?traded?`弃 ${actionNames[traded]} · +2 气`:'+1 气':kind==='guard'?`${cost} 气 · 挡波`:`${cost} 气${kind==='piercing_wave'?' · 破防':''}`:[compiled.finiteCards?`余 ${work.match.fighters.player.cards[kind]} 张`:'',boost?`${boost} 气 · 胜时 +${boost} 伤`:'',wager?'押 1 气':''].filter(Boolean).join(' · ')}</span>}{ui.settings&&<kbd aria-hidden="true">{index+1}</kbd>}</motion.button>;
            })}</div>
          </>;
  const playFooter = (revealing||settled)&&<div className="result-actions-space">{settled&&<motion.div className="result-actions" initial={reduced?false:{opacity:0}} animate={{opacity:1}}><button className="button" onClick={nextMatch}>{visibleRecord?.voided?'重新出这一手':work.match.result?'再来一次':'下一手'}</button>{changeAvailable&&<button className="button button-primary" onClick={openChoices}>变化一下</button>}</motion.div>}</div>;

  return <MotionConfig reducedMotion={reduced?'always':'never'}><div className={`app-shell theme-${work.expression.style} ${reduced?'reduce-motion':''}`} data-theme={work.expression.style}>
    <Stage style={work.expression.style} ability={null} className={`${cardMode(work.match)?'card-game-stage':''} ${simple?'pristine-stage':''} ${work.design.abilities.player?'with-character':''} ${work.match.experiment?'with-experiments':''} ${work.journey.choices.includes('U02')?'style-awakened':''}`}>
      {hasHeader&&<header className="game-header"><div className="work-identity">{work.expression.name&&<h1>{work.expression.name}</h1>}{ui.workshop&&<span className="edition-note">{work.journey.choices.length} 次小小的改变</span>}</div>{(ui.rules||ui.workshop||ui.settings||ui.cover||rollbackUnlocked)&&<nav className="nav-actions" aria-label="作品工具">
        {rollbackUnlocked&&<button className="text-button rollback-entry" disabled={revealing||panel!==null} onClick={openRollback}><Undo2 size={16}/><span>回退</span></button>}
        {ui.rules&&<button className="text-button" disabled={revealing} onClick={()=>{setRulesMode(work.expression.rulesView);setPanel('rules');}}><BookOpen size={16}/><span>规则</span></button>}
        {ui.cover&&<button className="text-button" disabled={revealing} onClick={()=>setPanel('cover')}>封面</button>}
        {ui.workshop&&<button className="text-button" disabled={revealing} onClick={()=>setPanel('workshop')}>我的作品</button>}
        {ui.settings&&<button className="icon-button" disabled={revealing} aria-label="设置" onClick={()=>setPanel('settings')}><Settings2 size={18}/></button>}
      </nav>}</header>}
      <main className={`arena ${!hasHeader?'arena-no-header':''} ${simple&&!hasHeader?'arena-pristine':''} ${settled?'arena-settled':''}`}>
        {work.design.abilities.player&&<CharacterStand key={work.design.abilities.player} ability={work.design.abilities.player} remaining={displayMatch.fighters.player.abilityRemaining} armed={declared&&!passiveCharacter} triggered={characterTriggered} reduced={reduced} disabled={revealing} onOpen={()=>setPanel('character')}/>}
        {!simple&&compiled.goal==='single'&&<p className="single-experiment-goal">一手定胜负 · 每场资源重新开始</p>}
        {compiled.ui.series&&<MatchProgress match={displayMatch} compiled={compiled} settled={settled} voided={currentRecord?.voided}/>}
        <PublicRuleStatus match={displayMatch} compiled={compiled}/>
        {(compiled.ui.abilities&&!work.match.experiment||compiled.life||compiled.energy||compiled.finiteCards||compiled.combo||compiled.shield||compiled.threeStyles||!!displayMatch.fighters.player.shield||!!displayMatch.fighters.computer.shield)&&<div className="duel-hud">{(['player','computer'] as const).map(side=><FighterPanel key={side} side={side} compiled={compiled} match={displayMatch} expression={work.expression}/>)}</div>}
        {!cardMode(work.match)&&<ExperimentWorld match={displayMatch} compiled={compiled} revealed={settled} input={experimentInput} onChange={awaiting?setExperimentInput:undefined}/>}

        {awaiting&&work.match.experiment?.sealedPlayer&&<button className="button button-primary sealed-confirm" onClick={()=>submit(work.match.experiment!.sealedPlayer!.kind)}>{hasExperiment(work.match,'insurance')?'确认保险，共同揭晓':'共同揭晓'}</button>}
        <div className={`play-center ${awaiting?'is-awaiting':''}`}>
          {cardMode(work.match)?<CardTable key={work.match.id} match={displayMatch} compiled={compiled} legal={actions.filter(a=>a.boost===(isGesture(a.kind)?boost:0)&&a.ability===(isGesture(a.kind)&&declared&&!passiveCharacter)&&!!a.wager===(isGesture(a.kind)&&wager))} battle={playContent} controls={playControls} footer={playFooter} awaiting={awaiting} revealing={revealing} input={experimentInput} onInput={awaiting?setExperimentInput:undefined} onPlay={submit} onCraft={(definition,removeId)=>guard(()=>{const current=workRef.current;update({...current,match:craftCard(current.match,definition,removeId)});audio.play('install');})} onMulligan={id=>guard(()=>{const current=workRef.current;update({...current,match:mulliganCard(current.match,id)});audio.play('select');})}/>:<>{playControls}{playContent}{playFooter}</>}
        </div>
        {error&&<p role="alert" className="error-message">{error}</p>}
      </main>
      {(ui.sound||ui.settings)&&<button className="icon-button sound-control" aria-label={work.preferences.muted?'开启声音':'静音'} onClick={()=>{void audio.init();setPreferences({muted:!work.preferences.muted});}}>{work.preferences.muted?<VolumeX size={16}/>:<Volume2 size={16}/>}</button>}
    </Stage>
    <div className="toast-region" aria-live="polite">{message&&<motion.p className="toast" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>{message}</motion.p>}</div>

    {panel==='library'&&<RuleLibrary context={context} onClose={()=>setPanel('choices')} onChoose={card=>{if(changeAvailable)choose(card,true);}}/>}
    {panel==='rollback'&&<RuleRollback design={work.design} onClose={close} onApply={applyRollback}/>}

    {panel==='choices'&&<Dialog title="变化一下" subtitle={offer?.poolState==='complete'?'这一轮的变化都试过了，继续玩你创造的版本吧。':offer?.poolState==='awaiting_experience'?'新玩法还需要一些经历，先沿着现在的规则再玩一局。':offer?.poolState==='expression_only'?'暂时没有合适的新玩法，这次可以留下一种表达。也可以先继续玩。':offer?.poolState==='short_gameplay'?'当前适合的玩法先放在这里；选一张，或者继续体验。':'随机相遇新的可能。选一张，看看会发生什么。选过的不会再来。'} onClose={close} wide>
      <div className="choice-grid" data-offer-key={offer?.key}>{offer?.cards.map((card,index)=><ChoiceTile key={card.id} card={card} index={index} style={work.expression.style} impact={evaluateChoice(card,context).preview?.removed.map(displayChange)} disabled={!!selectedCard} selected={selectedCard===card.id} leaving={!!selectedCard&&selectedCard!==card.id} reduced={reduced} onClick={()=>selectCard(card)}/>)}</div>
      <div className="dialog-actions"><button className="button-quiet" onClick={close}>先保持这样</button></div>
    <div className="library-entry"><span>想试一个自己的组合？</span><button className="text-button" onClick={()=>setPanel('library')}>自由组合</button></div></Dialog>}
    {typeof panel==='object'&&panel?.type==='expression'&&<ExpressionEditor key={panel.choice.id} choice={panel.choice} expression={work.expression} compiled={compiled} match={work.match} busy={false} reduced={reduced} onClose={()=>{setSelectedCard(null);setError('');setPanel('choices');}} onApply={express}/>}
    {typeof panel==='object'&&panel?.type==='preview'&&<Dialog title={panel.title} subtitle={panel.choice?.question??'看看这个改变会把作品带到哪里。'} onClose={close}>
      <CreationPreview kind={panel.choice?.id??'rule'} style={work.expression.style}/><p>{panel.choice?.description}</p><div className="change-summary"><p className="rule-goal">{goalText(panel.preview.nextDesign)}</p>{panel.preview.added.length>0&&<p><span>加入</span>{panel.preview.added.map(displayChange).join('、')}</p>}{panel.preview.removed.length>0&&<p><span>退出</span>{panel.preview.removed.map(displayChange).join('、')}</p>}{panel.preview.abilities.player&&<p><span>你的能力</span>{abilityNames[panel.preview.abilities.player]}</p>}{panel.preview.notes.map(note=><p key={note} className="muted small">{note}</p>)}</div>
      {panel.preview.errors.map(e=><p key={e} className="error-message">{e}</p>)}
      {comparisonSource&&panel.preview.valid&&<details className="comparison-details"><summary>用刚才的出手对照一下</summary><Comparison source={comparisonSource} target={panel.preview.nextDesign}/></details>}
      <p className="muted small">规则变化从新的一场开始。刚才的版本可在本次试玩的「改动记录」里撤回。</p><div className="dialog-actions"><button className="button-quiet" onClick={close}>先不改</button><button className="button button-primary" disabled={!panel.preview.valid} onClick={install}>从这一场试起 <ArrowRight size={16}/></button></div>
    </Dialog>}
    {(panel==='awakening'||panel==='character')&&work.design.abilities.player&&<Dialog title={panel==='character'?'你的角色':passiveCharacter?'你的角色，加入了':'你的能力，觉醒了'} onClose={close} wide><div className="character-introduction"><CharacterArt ability={work.design.abilities.player}/><div><span className="character-tag">{characters[work.design.abilities.player].epithet} · {passiveCharacter?'常驻特性':'每场一次 · 主动能力'}</span><h3>{characters[work.design.abilities.player].name}</h3><blockquote>{characters[work.design.abilities.player].line}</blockquote><p>{characters[work.design.abilities.player].effect}</p><p className="small">{experimentNotes(work.design).filter(note=>note.startsWith('当前没有生命')).join(' ')}</p><p className="small">{passiveCharacter?'装备后自动生效，无需点击发动，也不消耗每场次数。换角色时会替换当前角色。':'先点击能力，再提交合法手势。提交后消耗次数，即使触发条件没有发生；每场重新获得一次。'}</p><button className="button button-primary" onClick={close}>{passiveCharacter?'带着特性，出手':'带着能力，出手'} <ArrowRight size={17}/></button></div></div></Dialog>}
    {panel==='rules'&&<Dialog title="这一版，怎么玩" onClose={close}><div className="segmented"><button aria-pressed={rulesMode==='graph'} onClick={()=>setRulesMode('graph')}>关系图</button><button aria-pressed={rulesMode==='list'} onClick={()=>setRulesMode('list')}>逐条读</button></div><RulesView compiled={compiled} view={rulesMode} publicTrump={work.match.publicTrump}/></Dialog>}
    {panel==='catalog'&&<Dialog title="可能的变化" subtitle="变化会在每次随机选择中相遇。这里记录它们的条件。" onClose={close} wide><div className="catalog-list">{ALL_CHOICES.map(card=>{const eligibility=evaluateChoice(card,context);return <div key={card.id} className="catalog-row"><span><small>{work.journey.choices.includes(card.id)?'已经选过':card.kind==='rule'?'规则':card.kind==='ability'?'能力':'表达'}</small><strong>{card.title}</strong></span><p>{eligibility.eligible?card.description:eligibility.reasons[0]}</p></div>;})}</div></Dialog>}
    {panel==='workshop'&&<Dialog title={work.expression.name??'你的作品'} subtitle="从一个熟悉的动作，慢慢长成你的游戏。" onClose={close} wide><div className="workshop-grid"><section><h3>这一版</h3><p>{goalText(work.design)}</p><p className="muted">{themeLabel(work.expression.style)} · {work.expression.sound==='paper'?'纸木短音':'电子短音'}</p><div className="workshop-actions"><button className="button" onClick={openChoices} disabled={!changeAvailable}>变化一下 <ArrowRight size={16}/></button>{ui.cover&&<button className="button-quiet" onClick={()=>setPanel('cover')}>看作品封面</button>}</div><h3>现在的规则</h3>{work.design.rules.length===0?<p className="muted">还是最初的三种手势。一手定胜负。</p>:work.design.rules.map(id=><div className="rule-row" key={id}><span>{ruleNames[id]}</span><button className="text-button" onClick={()=>previewChange({type:'remove',rule:id},`撤回${ruleNames[id]}`)} aria-label={`撤回${ruleNames[id]}`}><Undo2 size={14}/>撤回</button></div>)}{(['player'] as const).map(side=>work.design.abilities[side]&&<div className="rule-row" key={side}><span>{side==='player'?'你':'对手'} · {abilityNames[work.design.abilities[side]!]}</span><button className="text-button" onClick={()=>previewChange({type:'ability',side,ability:null},`移除${side==='player'?'你的':'对手的'}能力`)}>移除</button></div>)}</section><section><h3>改动记录 <span className="muted small">仅本次试玩</span></h3>{work.journey.versions.length===0?<p className="muted">你的第一个选择，会从这里开始留下痕迹。</p>:<div className="version-list">{[...work.journey.versions].reverse().slice(0,8).map(version=><div className="version-row" key={version.id}><strong>{version.label}</strong><span className="muted small">{goalText(version.design)} · {themeLabel(version.expression.style)}</span><div><button className="text-button" onClick={()=>restoreVersion(version.id)}>试回这一版</button>{comparisonSource&&<button className="text-button" onClick={()=>setComparisonDesign(version.design)}>同出手对照</button>}</div></div>)}</div>}{comparisonDesign&&comparisonSource&&<Comparison source={comparisonSource} target={comparisonDesign}/>}</section></div><div className="dialog-actions spread"><button className="text-button" onClick={()=>setPanel('catalog')}>所有可尝试的变化</button><button className="text-button muted" onClick={()=>setPanel('restart')}>回到第一手</button></div></Dialog>}
    {panel==='cover'&&<Dialog title="此刻的作品" subtitle="由你现在的手势、名字和画风组成。" onClose={close}><div className="cover-preview" dangerouslySetInnerHTML={{__html:generateCoverSVG({name:work.expression.name??undefined,style:work.expression.style,ability:work.design.abilities.player,gestures:compiled.gestures,layout:work.expression.cover,subtitle:goalText(work.design)})}}/><div className="dialog-actions"><button className="button-primary button" onClick={close}>继续玩</button></div></Dialog>}
    {panel==='settings'&&<Dialog title="按你的习惯" onClose={close}><label className="setting-row"><span>声音</span><input type="checkbox" checked={!work.preferences.muted} onChange={e=>{void audio.init();setPreferences({muted:!e.target.checked});}}/></label><label className="form-field setting-volume">音量<input type="range" min="0" max="1" step="0.05" value={work.preferences.volume} onChange={e=>setPreferences({volume:Number(e.target.value)})}/></label><label className="setting-row"><span>减少动态效果</span><input type="checkbox" checked={work.preferences.reducedMotion||!!systemReduced} disabled={!!systemReduced} onChange={e=>setPreferences({reducedMotion:e.target.checked})}/></label><p className="muted small">使用 Tab 移动焦点，空格或回车确认。也可按数字 1–{compiled.actions.length} 出手。Esc 关闭面板。</p><p className="muted small">每次打开，都是一次新的创作。不保存进度。刷新页面会从第一手重新开始。</p><button className="text-button" onClick={()=>setPanel('restart')}>重新开始</button></Dialog>}
    {panel==='restart'&&<Dialog title="重新回到第一手" subtitle="当前试玩中的名字、规则与改动记录会一起清空。" onClose={close}><div className="dialog-actions"><button className="button-quiet" onClick={close}>继续这一版</button><button className="button button-primary" onClick={()=>{const fresh=initialWork();fresh.preferences=work.preferences;update(fresh);setDeclared(false);setBoost(0);setWager(false);setLastExperiment(null);setOffer(null);choiceRandom.current=null;chosenRound.current=null;close();audio.play('undo');}}>开始一张白纸</button></div></Dialog>}
  </div></MotionConfig>;
}

function MechanicOutcomes({record}:{record:NonNullable<MatchState['history'][number]>}) {
  const types=['card_effect','shield_gained','shield_absorbed','shield_broken','wager_resolved','cards_captured','combo_refund','cards_converted','energy_transferred','cards_reforged','last_stand_triggered','foresight_granted','passive_triggered'];
  const triggeredPassives=new Set(record.events.filter(e=>e.type==='passive_triggered'&&e.side==='player'&&(e.amount??0)>0).map(e=>e.ability));
  const effects=record.events.filter(e=>types.includes(e.type)
    && (!['passive_triggered','shield_gained','energy_transferred','cards_reforged'].includes(e.type)||(e.amount??0)>0)
    && (e.type!=='passive_triggered'||e.side==='player')
    && (e.type!=='shield_gained'||e.side!=='player'||!e.ability||!triggeredPassives.has(e.ability)));
  if(record.voided||!effects.length)return null;
  return <div className="mechanic-outcomes" aria-label="本手效果">{effects.map(e=><span key={e.id}>{e.text}</span>)}</div>;
}
function displayChange(id:string){if(id.includes(':')){const [side,ability]=id.split(':');return `${side==='player'?'你':'对手'}的${abilityNames[ability as keyof typeof abilityNames]??ability}`;}return ruleNames[id as RuleId]??id;}
function ActionPicture({kind}:{kind:ActionKind}){return isGesture(kind)?<GestureIcon gesture={kind} size={148}/>:<ResourceIcon kind={kind==='piercing_wave'?'piercing':kind==='wave'?'attack':kind==='charge'?'charge':'guard'} size={100}/>;}
function ChoiceTile({card,index,style,impact,disabled,selected,leaving,reduced,onClick}:{card:ChoiceCard;index:number;style:Expression['style'];impact?:string[];disabled:boolean;selected:boolean;leaving:boolean;reduced:boolean;onClick:()=>void}){
  return <motion.button className={`choice-card ${selected?'choice-selected':''}`} data-choice-id={card.id} aria-label={card.title} aria-describedby={`choice-description-${card.id}`} disabled={disabled} initial={reduced?false:{opacity:0,y:32,rotate:(index-1)*3}} animate={leaving?{opacity:0,y:14,scale:.95}:selected?{opacity:1,y:-8,rotate:0,scale:1.025}:{opacity:1,y:0,rotate:0,scale:1}} transition={{duration:reduced?0:.26,delay:selected||leaving?0:index*.085}} whileHover={disabled||reduced?undefined:{y:-6}} whileTap={reduced?undefined:{scale:.98}} onClick={onClick}><div className="choice-topline"><span>{card.kind==='rule'?'改一条规则':card.kind==='ability'?'唤醒你的角色':'改变界面与感受'}</span><span>0{index+1}</span></div>{card.kind==='ability'?<CharacterArt ability={card.id as NonNullable<Design['abilities']['player']>} className="ability-card-art"/>:<CreationPreview kind={card.id} style={style}/>}<h3>{card.title}</h3><p id={`choice-description-${card.id}`}>{card.description}</p>{!!impact?.length&&<p className="choice-impact">同时替换：{impact.join('、')}。</p>}<span className="choice-arrow"><ArrowRight size={20}/></span></motion.button>;
}
function FighterPanel({side,compiled:c,match,expression}:{side:Side;compiled:CompiledDesign;match:MatchState;expression:Expression}){const f=match.fighters[side],a=side==='player'?c.abilities.player:null;const showShield=f.shield>0||c.threeStyles||c.guardStore||c.overflowShield||a==='ability.aegis'||a==='ability.rock_guardian';return <section className={`player-panel ${side}`} aria-label={side==='player'?'你的状态':'对手的状态'}><div className="player-identity"><span>{side==='player'?'你':'对手'}</span>{a&&<><AbilityIcon ability={a} size={23} used={!isPassiveAbility(a)&&!f.abilityRemaining}/><strong>{abilityNames[a]}</strong><small>{isPassiveAbility(a)?'常驻':`${f.abilityRemaining} / 1`}</small></>}</div>{a&&isPassiveAbility(a)&&<p className="passive-state-note">{c.life||a.startsWith('ability.')&&!['ability.scissors_ninja','ability.rock_guardian','ability.paper_trickster'].includes(a)?passiveCharacterSummary(a):'当前无生命 · 伤害暂不影响胜负'}</p>}<div className="fighter-resources">{(c.combo||c.comboRefund)&&<span className="streak-meter">连胜 {f.winStreak}</span>}{showShield&&<span className={`shield-meter ${f.shield?'is-ready':''}`} aria-label={`护盾 ${f.shield} / 1`}><ResourceIcon kind="guard" size={21}/>护盾 {f.shield} / 1</span>}{c.life&&<ResourceMeter label="生命" value={f.life} max={3} variant={expression.resources}/>} {c.energy&&<ResourceMeter label="气" value={f.energy} max={c.energyCap} variant={expression.resources}/>}</div>{c.threeStyles&&<div className="gesture-chain" aria-label="三招成势进度"><span>三招成势</span>{[0,1,2].map(i=><span key={i} className={f.gestureChain[i]?'chain-filled':''}>{f.gestureChain[i]?<GestureIcon gesture={f.gestureChain[i]} size={21}/>:i+1}</span>)}</div>}{c.finiteCards&&<div className="inventory-strip">{c.gestures.map(g=><ResourceMeter key={g} label={actionNames[g]} value={f.cards[g]} max={Math.max(c.cardsPerGesture,f.cards[g])} variant={expression.resources} inventory/>)}</div>}</section>;}

function Comparison({source,target}:{source:MatchState;target:Design}){const comparison=useMemo(()=>compareReplay(source,target),[source,target]);return <div className="comparison"><p className="muted small">复用双方已经出过的动作，按另一套规则结算。目标：{goalText(target)}。</p><table><thead><tr><th>尝试</th><th>原来</th><th>对照后</th></tr></thead><tbody>{comparison.rows.map(row=><tr key={row.attempt}><td>{row.attempt}</td><td>{row.originalVoided?'作废':resultLabel(row.original)}</td><td>{row.compared===null?'行动不合法':row.comparedVoided?'作废':resultLabel(row.compared)}</td></tr>)}</tbody></table>{comparison.reason&&<p className="muted small">{comparison.reason}</p>}{comparison.rows.length>0&&!comparison.stopped&&<p className="muted small">相同行动，{comparison.rows.some(r=>r.original!==r.compared)?'胜负发生了变化。':'这几手的胜负保持相同。'}</p>}</div>;}
