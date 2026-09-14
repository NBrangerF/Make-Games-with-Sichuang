import { EXPERIMENT_RULES } from '../experiments/catalog';
import { MessageSquare, MapPin, Coins, ListOrdered, Layers, TriangleAlert, Target, Factory, CloudSun, Handshake } from 'lucide-react';
import { useId, type CSSProperties, type ReactNode } from 'react';
import { Heart, Zap, ShieldCheck, ChevronsUp, MoveRight, Star, Layers2, Volume2, VolumeX, SlidersHorizontal, NotebookText, X, Undo2, Save, ArrowRight } from 'lucide-react';
import { gesturePaths } from './gesture-paths';
import { normalizedAbility, stagePaths } from './stage-paths';
import { normalizeVisualStyle, STYLE_OPTIONS, type VisualStyle } from './themes';
import { pixelGesturePaths, themeScenePaths } from './theme-art';
import './mechanic-previews.css';
export { normalizedAbility } from './stage-paths';
export type { VisualStyle } from './themes';

export type VisualGesture = keyof typeof gesturePaths;
export type VisualAbility = 'tiebreak' | 'insurance' | 'retry' | 'tie' | 'safety' | 'reroll' | 'none' | null;
const experimentAbilityPaths: Record<string,string> = {
  'ability.storyteller':'M10 9L25 19L39 19L54 9L48 39L32 54L16 39ZM20 29L27 33M44 29L37 33M28 42L32 46L36 42',
  'ability.ronin':'M14 50L45 10L52 6L51 16L22 54M12 40L28 54M6 57L14 48M40 39H57M50 32L57 39L50 46',
  'ability.clockmaker':'M32 8A24 24 0 1 1 8 32M8 10V26H24M32 17V32L44 39',
  'ability.scrapper':'M7 46H57L47 55H18ZM11 29H43L36 42H22ZM24 9L46 23L40 31L18 17ZM35 29L27 42',
  'ability.broker':'M12 15L25 8L38 15L25 22ZM12 15V29L25 36L38 29V15M31 32L44 25L57 32L44 39ZM31 32V46L44 53L57 46V32M6 46H21M15 40L21 46L15 52',
  'ability.kite':'M32 6L51 27L32 45L13 27ZM32 6V45M13 27H51M32 45C48 50 20 57 38 60',
  'ability.smith':'M10 44H54L45 54H20ZM20 12H44V23H20ZM29 23V41M35 23V41M10 18L5 11M50 16L57 9',
  'ability.monk':'M14 35C10 20 23 19 32 33C41 19 54 20 50 35C48 48 38 50 32 55C26 50 16 48 14 35ZM32 33V55M32 7L42 14L40 24L32 29L24 24L22 14Z',
  'ability.sheathed':'M14 53L42 17L49 11L51 13L48 23L20 59ZM29 25L42 37M11 15L17 7L23 15L17 23ZM42 48L49 41L56 48L49 55Z',
  'ability.cartographer':'M10 9L26 15L42 8L55 14V54L42 48L26 56L10 50ZM26 15V56M42 8V48M19 38L29 29L38 36L48 25M44 24L48 25L49 30',
};
const expandedAbilities = new Set(['ability.aegis', 'ability.foresight', 'ability.siphon', 'ability.reforge', 'ability.last_stand', 'ability.scissors_ninja', 'ability.rock_guardian', 'ability.paper_trickster']);
export const gestureNames: Record<VisualGesture, string> = { rock: '石头', scissors: '剪刀', paper: '布', lizard: '蜥蜴手', spock: '瓦肯手' };
export function GestureIcon({ gesture, size = 80, className = '' }: { gesture: VisualGesture; size?: number; className?: string }) {
  const shape = gesturePaths[gesture];
  const pixel = pixelGesturePaths[gesture];
  return <svg className={`gesture-icon ${className}`} viewBox="0 0 128 128" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><g className="gesture-vector"><path className="gesture-outline" d={shape.outline} />{shape.details.map((d, i) => <path key={i} d={d} />)}</g><g className="gesture-pixel" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter"><path className="gesture-pixel-outline" d={pixel.outline}/>{pixel.details.map((d,i)=><path key={i} d={d}/>)}</g></svg>;
}
export function AbilityIcon({ ability, size = 32, used = false }: { ability: VisualAbility | string; size?: number; used?: boolean }) {
  const type = normalizedAbility(ability);
  const expanded = expandedAbilities.has(ability ?? '') || !!experimentAbilityPaths[ability ?? ''];
  return <svg className={`ability-icon ${used ? 'is-used' : ''}`} data-ability-icon={ability??'none'} width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {type === 'tiebreak' && <><path d="M16 9H48L55 16V48L48 55H16L9 48V16Z"/><path d="M21 27H43M21 36H43M33 17L39 23M25 42L31 48"/><path opacity=".35" d="M15 16H19M45 48H49"/></>}
    {type === 'insurance' && <><path d="M8 17L31 27L55 16L51 47L31 55L12 45Z"/><path d="M8 17L12 45L31 38L51 47L55 16M31 27V38"/><path opacity=".35" d="M17 25L20 39M48 25L44 39"/></>}
    {type === 'retry' && <><path opacity=".35" d="M17 9H55V47M9 17H47V55H9Z"/><path d="M17 29V23H23M35 23H41V29M41 41V47H35M23 47H17V41"/><path d="M24 33A9 9 0 1 1 24 40M24 29V34H29"/></>}
    {ability === 'ability.aegis' && <><path d="M32 7L53 16L50 36C47 45 39 52 32 56C25 52 17 45 14 36L11 16Z"/><path d="M32 16L44 21L42 35L32 45L22 35L20 21Z"/><path d="M26 30H38M32 24V36"/></>}
    {ability === 'ability.foresight' && <><path d="M5 33Q32 4 59 33Q32 59 5 33Z"/><circle cx="32" cy="33" r="10"/><path d="M29 28H35V34M18 15L15 10M46 15L49 10M32 12V5"/><path opacity=".4" d="M13 49L17 45M51 49L47 45"/></>}
    {ability === 'ability.siphon' && <><path d="M43 8C43 8 33 19 33 25A10 10 0 0 0 53 25C53 19 43 8Z"/><path d="M20 30C20 30 10 41 10 47A10 10 0 0 0 30 47C30 41 20 30Z"/><path d="M49 42C47 51 40 54 34 53M40 48L34 53L39 59M15 21C17 12 24 9 30 10M24 5L30 10L25 15"/></>}
    {ability === 'ability.reforge' && <><path d="M10 18V55H38M17 11H47V48H17Z"/><path d="M23 40H41M27 30L37 20M32 17L40 25M27 25L32 30"/><path d="M47 7L53 4L55 10L61 12L55 15L53 21L50 15L44 13Z"/><path opacity=".4" d="M24 17V20M21 21H25"/></>}
    {ability === 'ability.last_stand' && <><path d="M32 55C22 47 10 39 10 28A12 12 0 0 1 32 22A12 12 0 0 1 54 28C54 39 42 47 32 55Z"/><path d="M32 45C20 40 25 32 29 29C29 34 33 35 33 30C33 24 38 22 38 22C35 31 47 36 32 45Z"/><path d="M31 11L34 5M16 12L12 7M48 12L52 7"/></>}
    {ability === 'ability.scissors_ninja' && <><path d="M17 7L30 29L43 7L49 5L47 15L35 37M29 35L18 48M23 37L7 54M37 38L54 54"/><circle cx="17" cy="48" r="7"/><circle cx="45" cy="48" r="7"/><path d="M9 25L25 19L39 22L56 19L52 31L35 34L20 30L8 33ZM22 25H26M39 27H43"/><path opacity=".4" d="M54 22L61 30L55 37"/></>}
    {ability === 'ability.rock_guardian' && <><path d="M8 10H17V16H26V10H38V16H47V10H56V31L48 47L32 58L16 47L8 31Z"/><path d="M21 38V26H28V22H35V24H42V38L35 47H26L18 39V33H28L31 37M28 27V32M35 26V33"/></>}
    {ability === 'ability.paper_trickster' && <><path d="M7 12L57 7L48 53L32 42L20 57L22 31Z"/><path d="M7 12L32 23L57 7L22 31L32 42L32 23M32 42L48 53L41 31"/><path opacity=".5" d="M9 29L5 44L14 41M39 58L55 59L61 41"/></>}
    {experimentAbilityPaths[ability??'']&&<path d={experimentAbilityPaths[ability??'']}/>}
    {type === 'none' && !expanded && <path d="M17 32H47M32 17V47"/>}
    {used && <path className="spent-slash" d="M9 55L55 9"/>}
  </svg>;
}
export type ResourceKind = 'health' | 'energy' | 'guard' | 'charge' | 'attack' | 'piercing' | 'score' | 'hand' | 'sound' | 'muted' | 'settings' | 'rules' | 'close' | 'undo' | 'save' | 'arrow';
export function ResourceIcon({ kind, size = 24 }: { kind: ResourceKind; size?: number }) {
  if (kind === 'piercing') return <svg className="resource-icon icon-piercing" width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M17 3L25 7L24 12M22 21L17 28L9 21L7 8L12 5M4 16H29M23 10L29 16L23 22"/><path d="M18 8L15 12L19 14M15 19L18 22"/></svg>;
  const icons = { health: Heart, energy: Zap, guard: ShieldCheck, charge: ChevronsUp, attack: MoveRight, score: Star, hand: Layers2, sound: Volume2, muted: VolumeX, settings: SlidersHorizontal, rules: NotebookText, close: X, undo: Undo2, save: Save, arrow: ArrowRight };
  const Icon = icons[kind];
  return <Icon className={`resource-icon icon-${kind}`} size={size} strokeWidth={1.65} aria-hidden="true" focusable="false"/>;
}
export function StageDrawing({ ability, style = 'ink', className = '' }: { ability: VisualAbility | string; style?: VisualStyle | string; className?: string }) {
  const type = normalizedAbility(ability);
  const id = useId().replace(/:/g, '');
  const theme = normalizeVisualStyle(style);
  const blueprint = theme === 'cyanotype';
  const scene = themeScenePaths[theme];
  return <svg className={`stage-drawing stage-drawing--${type} stage-drawing--${theme} ${className}`} viewBox="0 0 1440 960" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs><pattern id={`grid-${id}`} width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".085"/></pattern><pattern id={`dots-${id}`} width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="currentColor" opacity=".16"/></pattern></defs>
    {blueprint && <rect width="1440" height="960" fill={`url(#grid-${id})`}/>}
    {theme==='manga' && <path d="M0 0H520L100 510H0ZM1440 960H940L1320 490H1440Z" fill={`url(#dots-${id})`}/>}
    <g className={`stage-composition stage-composition--${type}`}>{scene ? scene.map((path,index)=><path key={index} data-theme-motif={theme} d={path.d} fill={path.fill==='none'?'none':`var(--${path.fill})`} stroke={path.stroke?`var(--${path.stroke})`:'none'} strokeWidth={path.width} opacity={path.opacity}/>) : stagePaths[type].map((path, index) => <path key={index} className={`stage-layer stage-layer--${path.layer}`} d={path.d} transform={path.transform}/>)}</g>
    {blueprint && <g className="blueprint-registration"><path d="M24 80V32H76M1364 32H1416V80M24 880V928H76M1364 928H1416V880"/><path d="M22 480H38M1402 480H1418M720 24V40M720 920V936"/></g>}
  </svg>;
}
export function Stage({ ability = null, style = 'ink', characterAccent, children, className = '' }: { ability?: VisualAbility | string; style?: VisualStyle | string; characterAccent?: string; children?: ReactNode; className?: string }) {
  const type = normalizedAbility(ability);
  const theme = normalizeVisualStyle(style);
  return <div className={`stage stage--${type} theme-${theme} ${className}`} data-ability={type} data-style={theme} style={{ '--stage-character-accent': characterAccent } as CSSProperties}><StageDrawing ability={ability} style={theme}/><div className="stage-atmosphere" aria-hidden="true"><i/><i/><i/><span/></div><div className="stage-character-field" aria-hidden="true"><svg viewBox="0 0 640 960" preserveAspectRatio="none" focusable="false"><path d="M-150 690C10 950 270 820 625 482M-90 750C65 940 338 788 680 532"/><path d="M-60 790C145 970 415 740 720 624"/><path d="M-180 187L583 752M-218 161L501 725"/></svg></div><div className="stage-content">{children}</div></div>;
}
export function CreationPreview({ kind, style = 'ink' }: { kind: string; style?: VisualStyle | string }) {
  const aliases: Record<string,string> = { 'score.draw_point':'score', 'score.combo':'score', 'score.last_double':'score', 'tempo.short_cap':'score', 'gesture.five':'five', 'gesture.reverse':'reverse', 'match.first_two':'score', 'match.score_five':'score', 'tempo.extend_cap':'score', 'tempo.extend_cap_again':'score', 'action.cooldown':'cooldown', 'life.knockout':'health', 'cards.finite':'hand', 'cards.two_each':'hand', 'cards.exchange_once':'hand', 'energy.gesture_boost':'energy', 'energy.active_charge':'charge', 'energy.wave':'attack', 'energy.guard':'guard', u01:'name', u02:'style', u05:'outcome', u06:'rules', u08:'resources', u10:'reveal', u11:'sound', u14:'ending', u16:'cover', u17:'workshop', u18:'settings', rulesview:'rules', 'five-gestures':'five', gestures:'five', naming:'name', blueprint:'cyanotype' };
  const lower = kind.toLowerCase(); const key=aliases[lower] || lower;
  const mechanic = <MechanicPreview kind={lower}/>;
  const ability = normalizedAbility(kind);
  const expandedAbility = expandedAbilities.has(lower)||!!experimentAbilityPaths[lower];
  const experiment=EXPERIMENT_RULES.find(r=>r.id===lower);
  const isStyle = STYLE_OPTIONS.some(option=>option.id===key) || key==='style';
  const isFive = key === 'five'; const isName = key === 'name';
  const previewCount = lower === 'match.first_two' || lower === 'cards.two_each' ? 2 : lower === 'match.score_five' ? 5 : 3;
  const resource = ['health','energy','guard','charge','attack','score','hand'].find(k=>key===k) as ResourceKind | undefined;
  const previewStyle = normalizeVisualStyle(STYLE_OPTIONS.some(option=>option.id===key)?key:style);
  const decorative = ['outcome','rules','resources','sound','cover','ending','stamp','quiet','reveal','quick','rhythm','reverse','cooldown','workshop','settings'].includes(key);
  return <div className={`creation-preview theme-${previewStyle} preview-kind-${key}`} aria-hidden="true">
    <StageDrawing ability={ability} style={previewStyle}/>
    {lower==='u02' ? <div className="preview-style-family">{STYLE_OPTIONS.map(option=><span key={option.id} className={`style-sample theme-${option.id}`}><GestureIcon gesture="rock" size={33}/></span>)}</div> : expandedAbility ? <div className="preview-character-ability"><AbilityIcon ability={lower} size={92}/></div> : experiment ? <ExperimentPreview group={experiment.group}/> : mechanicPreviewIds.has(lower) ? mechanic : isName ? <div className="preview-name"><span/><i/><span/></div> : resource ? <div className="preview-resource"><ResourceIcon kind={resource} size={40}/><div>{Array.from({length:previewCount},(_,i)=><b key={i}/>)}</div></div> : decorative ? <div className="preview-diagram">
      {key==='settings' ? <ResourceIcon kind="settings" size={60}/> :
       key==='workshop' ? <><ResourceIcon kind="rules" size={48}/><ResourceIcon kind="undo" size={25}/></> :
       ['sound'].includes(key) ? <><ResourceIcon kind="sound" size={32}/><span className="preview-wave">{[12,27,44,22,36,17,8].map((h,i)=><i key={i} style={{height:h}}/>)}</span></> :
       ['rules','reverse'].includes(key) ? <svg viewBox="0 0 160 110" width="145" height="100"><g fill="none" stroke="currentColor" strokeWidth="1.2"><path d={key==='reverse'?'M50 33L42 78H99M109 73L87 30H59':'M52 32H101L121 76H66M58 74L44 46'}/><path d={key==='reverse'?'M36 67L42 78L53 72M63 25L59 30L66 36':'M92 26L101 32L92 38M72 67L66 76L73 83'}/><circle cx="44" cy="29" r="13"/><circle cx="120" cy="82" r="13"/><circle cx="46" cy="85" r="13"/></g></svg> :
       ['reveal','quick','rhythm','cooldown'].includes(key) ? <><span className="preview-beat"/><GestureIcon gesture="rock" size={52}/><span className={`preview-beat ${key==='cooldown'?'preview-cross':''}`}/></> :
       ['ending','stamp','quiet'].includes(key) ? <div className={`preview-ending ${key!=='quiet'?'preview-ending-stamp':''}`}><span/><i/><span/></div> :
       key==='resources' ? <div className="preview-resource"><ResourceIcon kind="health" size={26}/><div><b/><b/><b/></div></div> :
       key==='cover' ? <div className="preview-cover"><GestureIcon gesture="rock" size={27}/><GestureIcon gesture="scissors" size={27}/><GestureIcon gesture="paper" size={27}/></div> :
       <div className={`preview-lines ${key==='history'?'preview-lines-history':''}`}><i/><i/><i/></div>}
    </div> : <div className={`preview-gestures ${isFive ? 'preview-gestures--five' : ''}`}><GestureIcon gesture="rock" size={48}/><GestureIcon gesture="scissors" size={48}/><GestureIcon gesture="paper" size={48}/>{isFive && <><GestureIcon gesture="lizard" size={39}/><GestureIcon gesture="spock" size={39}/></>}</div>}
    {ability !== 'none' && <span className="preview-ability"><AbilityIcon ability={ability} size={26}/></span>}
    {isStyle && lower!=='u02' && <span className="preview-palette"><i/><i/><i/></span>}
  </div>;
}

function ExperimentPreview({group}:{group:typeof EXPERIMENT_RULES[number]['group']}){
  const icons={'信息与承诺':MessageSquare,'位置与空间':MapPin,'争夺与经济':Coins,'时间与计划':ListOrdered,'手牌与构筑':Layers,'风险与收益':TriangleAlert,'动机与奖励':Target,'建造与生产':Factory,'公共环境':CloudSun,'交易与信任':Handshake};
  const Icon=icons[group];
  return <div className="mechanic-preview"><div className="mechanic-preview-art"><Icon size={64} strokeWidth={1.3}/></div><span className="mechanic-preview-caption">{group} · 同时行动</span></div>;
}

const mechanicPreviewIds = new Set([
  'ending.bounded_overtime', 'goal.collect_three', 'goal.draw_three', 'goal.streak_two', 'goal.first_five_points', 'goal.fewest_points', 'goal.efficient_wins',
  'gesture.remove_rock', 'gesture.public_trump', 'life.draw_damage', 'life.win_heal', 'life.survive', 'life.last_hit_double', 'life.desperation', 'cards.draw_refund', 'cards.dealer_refill',
  'energy.guard_paid', 'energy.piercing_wave', 'energy.cheap_wave', 'energy.opening_two', 'energy.leak_thirds', 'energy.loss_charge', 'energy.cap_five', 'energy.double_boost',
  'cards.charge_trade', 'energy.wager', 'combo.three_styles', 'cards.capture', 'cards.combo_refund', 'shield.guard_store', 'energy.overflow_shield', 'energy.restraint', 'action.special_cooldown', 'shield.piercing_boost',
]);

/** These are rule diagrams, not fabricated match state. Card text remains the accessible explanation. */
function MechanicPreview({ kind }: { kind: string }) {
  const resource = (icon: ResourceKind, caption?: string) => <span className="mechanic-symbol"><ResourceIcon kind={icon} size={38}/>{caption && <small>{caption}</small>}</span>;
  const pips = (count: number, filled = count) => <span className="mechanic-pips">{Array.from({ length: count }, (_, i) => <i key={i} className={i < filled ? 'is-filled' : ''}/>)}</span>;
  const gestures = (mode: 'collect' | 'remove' | 'trump') => <div className={`mechanic-gestures mechanic-gestures--${mode}`}>{(['rock','scissors','paper'] as const).map((gesture, i) => <span key={gesture} className={i === 0 ? 'mechanic-focus' : ''}>{mode === 'trump' && i === 0 && <svg className="mechanic-crown" width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 7L8 11L13 3L18 11L23 7L21 16H5ZM5 19H21"/></svg>}<GestureIcon gesture={gesture} size={43}/>{mode === 'collect' && <small>✓</small>}</span>)}</div>;
  let diagram: ReactNode;
  let caption: string;
  switch (kind) {
    case 'ending.bounded_overtime': diagram = <><span className="mechanic-end">C</span><span className="mechanic-operator">＋</span>{pips(3,0)}</>; caption = '平分后 · 最多加三手'; break;
    case 'goal.collect_three': diagram = gestures('collect'); caption = '石 · 剪 · 布，各赢一次'; break;
    case 'goal.draw_three': diagram = <div className="mechanic-markers"><b>＝</b><b>＝</b><b>＝</b></div>; caption = '三次平局 · 你的目标'; break;
    case 'goal.streak_two': diagram = <div className="mechanic-chain">{resource('score')}<span/><ResourceIcon kind="score" size={38}/></div>; caption = '连续两胜 · 中断归零'; break;
    case 'goal.first_five_points': diagram = <>{resource('score')}<b className="mechanic-number">5</b><span className="mechanic-finish">先到</span></>; caption = '争先达到五分'; break;
    case 'goal.fewest_points': diagram = <><span className="mechanic-score is-preferred">1</span><b className="mechanic-operator">＜</b><span className="mechanic-score">3</span></>; caption = '交锋胜者加分 · 终局低分胜'; break;
    case 'goal.efficient_wins': diagram = <>{resource('score','至少两胜')}<span className="mechanic-divider"/>{resource('energy','费用 ≤ 3')}</>; caption = '坚持到期，再核对预算'; break;
    case 'gesture.remove_rock': diagram = gestures('remove'); caption = '移除石头 · 剪刀与布留下'; break;
    case 'gesture.public_trump': diagram = gestures('trump'); caption = '公开王牌 · 每有效手轮换'; break;
    case 'life.draw_damage': diagram = <>{resource('health','−1')}<b className="mechanic-operator">＝</b>{resource('health','−1')}</>; caption = '平局 · 双方受伤'; break;
    case 'life.win_heal': diagram = <>{resource('score')}<ResourceIcon kind="arrow"/>{resource('health','＋1')}</>; caption = '胜利回血 · 不超过三'; break;
    case 'life.survive': diagram = <><span className="mechanic-protected">{resource('health')}</span><ResourceIcon kind="arrow"/><span className="mechanic-end">C</span></>; caption = '活到终点 · 或提前击倒'; break;
    case 'life.last_hit_double': diagram = <><span className="mechanic-end">C</span>{resource('attack')}<b className="mechanic-number">×2</b></>; caption = '最后一手 · 伤害翻倍'; break;
    case 'life.desperation': diagram = <><span className="mechanic-stack">{resource('health')}{pips(3,1)}</span><ResourceIcon kind="arrow"/>{resource('attack','基础伤害 2')}</>; caption = '一血出手 · 获胜更重'; break;
    case 'cards.draw_refund': diagram = <>{resource('hand')}<span className="mechanic-refund"><b>＝</b><ResourceIcon kind="undo" size={32}/></span>{resource('hand')}</>; caption = '平局 · 当手耗牌退回'; break;
    case 'cards.dealer_refill': diagram = <>{resource('hand','对手库存')}<ResourceIcon kind="undo"/><span className="mechanic-stack">{pips(3)}<small>补满</small></span></>; caption = '对手无手势 · 下手公开补牌'; break;
    case 'energy.guard_paid': diagram = <>{resource('guard')}<span className="mechanic-divider"/>{resource('energy','费用 1')}</>; caption = '防御也要付出代价'; break;
    case 'energy.piercing_wave': diagram = <>{resource('piercing')}<span className="mechanic-stack">{resource('energy')}{pips(3)}</span></>; caption = '三气 · 穿过防御'; break;
    case 'energy.cheap_wave': diagram = <>{resource('attack')}<span className="mechanic-old-cost">2</span><ResourceIcon kind="arrow"/><b className="mechanic-number">1</b>{resource('energy')}</>; caption = '普通波 · 费用变低'; break;
    case 'energy.opening_two': diagram = <><span className="mechanic-finish">开场</span>{resource('energy')}{pips(2)}</>; caption = '新场双方带着两气'; break;
    case 'energy.leak_thirds': diagram = <><div className="mechanic-markers"><b>1</b><b>2</b><b className="is-accent">3</b></div>{resource('energy','−1')}</>; caption = '每第三手 · 各漏一气'; break;
    case 'energy.loss_charge': diagram = <><span className="mechanic-defeat">失手</span><ResourceIcon kind="arrow"/>{resource('energy','＋1')}</>; caption = '最终败者 · 获得一气'; break;
    case 'energy.cap_five': diagram = <span className="mechanic-stack">{resource('energy')}{pips(5,3)}</span>; caption = '容量三变五 · 不赠气'; break;
    case 'energy.double_boost': diagram = <>{resource('attack','获胜 ＋2')}<span className="mechanic-divider"/>{resource('energy','费用 2')}</>; caption = '强化多一档 · 赢才加伤'; break;
    case 'cards.charge_trade': diagram = <>{resource('hand','弃一张')}<ResourceIcon kind="arrow"/>{resource('energy','＋2')}</>; caption = '弃最多库存 · 无牌不能蓄气'; break;
    case 'energy.wager': diagram = <>{resource('energy','押 1')}<ResourceIcon kind="arrow"/><span className="mechanic-stack"><span className="mechanic-markers"><b>2</b><b>1</b><b>0</b></span><small>胜 · 平 · 负返气</small></span></>; caption = '押注与强化 · 合计预付'; break;
    case 'combo.three_styles': diagram = <><span className="mechanic-stack"><span className="mechanic-markers"><b>石</b><b>剪</b><b>布</b></span><small>连续三种不同手势</small></span><ResourceIcon kind="arrow"/>{resource('guard')}</>; caption = '完成后得盾 · 下手起保护'; break;
    case 'cards.capture': diagram = <>{resource('hand','对手本手')}<ResourceIcon kind="arrow"/>{resource('hand','胜者库存')}</>; caption = '双方出手势 · 胜者缴获'; break;
    case 'cards.combo_refund': diagram = <><GestureIcon gesture="rock" size={38}/><span className="mechanic-operator">→</span><GestureIcon gesture="scissors" size={38}/>{resource('undo')}</>; caption = '换招且连胜 · 退回本手牌'; break;
    case 'shield.guard_store': diagram = <>{resource('guard')}<span className="mechanic-operator">＝</span>{resource('attack')}<ResourceIcon kind="arrow"/>{resource('guard')}</>; caption = '挡住普通波 · 留盾给下手'; break;
    case 'energy.overflow_shield': diagram = <><span className="mechanic-stack">{resource('energy')}{pips(3)}</span><span className="mechanic-operator">＋</span>{resource('guard')}</>; caption = '回气溢出 · 伤害后得盾'; break;
    case 'energy.restraint': diagram = <><span className="mechanic-stack"><GestureIcon gesture="rock" size={38}/><small>不强化 · 获胜</small></span><ResourceIcon kind="arrow"/>{resource('energy','＋1')}</>; caption = '省下这一拳 · 为下手蓄力'; break;
    case 'action.special_cooldown': diagram = <>{resource('attack')}<ResourceIcon kind="arrow"/><span className="mechanic-unavailable">{resource('attack')}</span></>; caption = '相同气动作 · 下一手冷却'; break;
    case 'shield.piercing_boost': diagram = <><span className="mechanic-stack"><GestureIcon gesture="rock" size={38}/><small>强化获胜</small></span><ResourceIcon kind="arrow"/><span className="mechanic-unavailable">{resource('guard')}</span></>; caption = '消耗对手盾 · 伤害不减免'; break;
    default: return null;
  }
  return <div className="mechanic-preview" data-mechanic={kind}><div className="mechanic-preview-art">{diagram}</div><span className="mechanic-preview-caption">{caption}</span></div>;
}
