import { EXPERIMENT_ABILITIES } from '../experiments/catalog';
import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { isPassiveAbility } from '../core';
import type { AbilityId, ActionKind, Gesture } from '../core/types';
import { AbilityIcon } from './visuals';
import './characters.css';

export const characters: Record<AbilityId, { name: string; epithet: string; image: string; color: string; line: string; effect: string }> = {
  ...Object.fromEntries(EXPERIMENT_ABILITIES.map((a,i)=>[a.id,{name:a.name,epithet:a.title,image:a.image,color:['#a94a36','#687c6f','#79709c','#b18643'][i%4]!,line:a.question,effect:a.description}])) as Record<import('../experiments/catalog').ExperimentAbilityId,{name:string;epithet:string;image:string;color:string;line:string;effect:string}>,
  'ability.claim_draw': { name: '绛刃', epithet: '抢平', image: 'showa/claim-draw.png', color: '#e44839', line: '平手之际，先行半步。', effect: '每场一次，随手势声明。双方出手势且原本打平时，变成你赢。' },
  'ability.insurance': { name: '青垒', epithet: '保底', image: 'showa/insurance.png', color: '#22bca5', line: '守住这一手，再找下一次机会。', effect: '每场一次，随手势声明。原本输掉时，变成平局；不能挡波。' },
  'ability.retry': { name: '逐光', epithet: '再搏', image: 'showa/retry.png', color: '#e9ab36', line: '还没有结束，再来一次。', effect: '每场一次，随手势声明。双方出手势且原本输掉时，作废这次尝试，重新出这一手。' },
  'ability.aegis': { name: '青岚', epithet: '护身', image: 'showa/aegis.png', color: '#229a98', line: '这一击，我接下了。', effect: '每场一次，随合法手势声明。立即获得一层护盾，本手就能抵挡 1 点伤害；护盾最多一层。' },
  'ability.foresight': { name: '星瞳', epithet: '先见', image: 'showa/foresight.png', color: '#6867c8', line: '下一步，已经看见了。', effect: '每场一次，随合法手势声明。下一有效手，提前看见对手锁定的动作种类；强化和押注仍不公开。' },
  'ability.siphon': { name: '紫电', epithet: '夺气', image: 'showa/siphon.png', color: '#a264cb', line: '借你的力量，完成我的一击。', effect: '每场一次，随合法手势声明。本手回气之后，从对手转移至多 2 气给自己；自己需要有剩余容量。' },
  'ability.reforge': { name: '铸火', epithet: '重铸', image: 'showa/reforge.png', color: '#ba862d', line: '空手之处，再造可能。', effect: '每场一次，随合法手势声明。本手结算后，把自己库存为零的各类手势补到 1 张；已有手牌保留。' },
  'ability.last_stand': { name: '焰心', epithet: '续命', image: 'showa/last-stand.png', color: '#d94a42', line: '心里的火，还没有灭。', effect: '每场一次，随合法手势声明。本手如果受到致死伤害，保留 1 点生命；没有致死伤害也会消耗能力。' },
  'ability.scissors_ninja': { name: '绯影', epithet: '剪刀忍者', image: 'showa/scissors-ninja.png', color: '#bd3c42', line: '把胜负，剪出一道锋芒。', effect: '常驻特性，无需声明。剪刀最终获胜时，基础伤害变为 2，再加手势强化；与背水一战的基础 2 伤不叠加。剪刀的克制关系保持不变。' },
  'ability.rock_guardian': { name: '磐岳', epithet: '岩拳卫士', image: 'showa/rock-guardian.png', color: '#ad7935', line: '赢下这一拳，守住下一拳。', effect: '常驻特性，无需声明。石头最终获胜后获得 1 层护盾，从下一手起抵挡 1 点伤害；护盾最多 1 层，已有护盾不叠加。' },
  'ability.paper_trickster': { name: '白羽', epithet: '纸影术士', image: 'showa/paper-trickster.png', color: '#6862a7', line: '同一张纸，藏着不同的答案。', effect: '常驻特性，无需声明。布与布打平时，对手受到 1 点伤害，交锋结果仍为平局。若有“平局也受伤”，对手合计受到 2 点、自己受到 1 点，统一按护盾减伤。' },
};

const passiveHints: Partial<Record<AbilityId,{gesture:Gesture;hint:string;summary:string}>> = {
  'ability.scissors_ninja': { gesture:'scissors', hint:'获胜基础伤害 2', summary:'剪刀获胜基础 2 伤，再加强化；不与背水基础伤害叠加。' },
  'ability.rock_guardian': { gesture:'rock', hint:'获胜后得 1 盾', summary:'石头获胜后得 1 盾，下一手起保护，上限 1 层。' },
  'ability.paper_trickster': { gesture:'paper', hint:'与布打平 · 对手受 1 伤', summary:'布与布打平，对手额外受 1 伤；仍为平局，护盾可减伤。' },
};
export function passiveActionHint(ability:AbilityId|null,kind:ActionKind):string|null {
  const hint=ability?passiveHints[ability]:undefined;
  return hint?.gesture===kind?hint.hint:null;
}
export function passiveCharacterSummary(ability:AbilityId):string|undefined { return passiveHints[ability]?.summary??EXPERIMENT_ABILITIES.find(a=>a.id===ability)?.description; }

export function CharacterArt({ ability, className = '' }: { ability: AbilityId; className?: string }) {
  const character = characters[ability];
  const cutout = character.image.startsWith('showa-cutout/');
  return <div className={`character-art character-art--${cutout ? 'cutout' : 'illustrated'} ${className}`} style={{ '--character-accent': character.color } as CSSProperties}>
    <span className="character-halo" aria-hidden="true"/>
    <span className="character-ground" aria-hidden="true"/>
    <img src={`${import.meta.env.BASE_URL}art/characters/${character.image}`} alt={`${character.name} · ${character.epithet}角色立绘`} width="1024" height="1536" loading="lazy" decoding="async"/>
  </div>;
}

export function CharacterStand({ ability, remaining, armed, triggered, reduced, onOpen, disabled = false }: { ability: AbilityId; remaining: number; armed: boolean; triggered: boolean; reduced: boolean; onOpen?: () => void; disabled?: boolean }) {
  const character = characters[ability];
  const passive = isPassiveAbility(ability);
  return <motion.aside className={`character-ribbon ${passive ? 'is-passive' : ''} ${armed && !passive ? 'is-armed' : ''} ${!remaining && !passive ? 'is-spent' : ''} ${triggered ? 'is-triggered' : ''}`} aria-label={`你的角色：${character.name}`} style={{ '--character-accent': character.color } as CSSProperties}
    initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .3 }}>
    <button className="character-ribbon-button" onClick={onOpen} disabled={disabled} aria-label={`查看角色：${character.name}`} aria-haspopup="dialog">
      <span className="character-avatar" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}art/characters/${character.image}`} alt="" width="64" height="64" decoding="async"/></span>
      <span className="character-ribbon-copy"><strong>{character.name}<span>{character.epithet}</span></strong><small>{triggered ? '刚刚生效' : passive ? '常驻 · 自动触发' : armed ? '这手发动' : remaining ? '本场可用一次' : '本场已使用'}</small></span>
      <span className="character-ribbon-open" aria-hidden="true">立绘与能力 ↗</span>
    </button>
  </motion.aside>;
}
