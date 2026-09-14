// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { CreationPreview } from '../../src/presentation/visuals';

afterEach(cleanup);

describe('mechanic card diagrams',()=>{
  it.each([
    ['ending.bounded_overtime','最多加三手'], ['goal.collect_three','各赢一次'], ['goal.draw_three','三次平局'], ['goal.streak_two','连续两胜'],
    ['goal.first_five_points','达到五分'], ['goal.fewest_points','低分胜'], ['goal.efficient_wins','核对预算'], ['gesture.remove_rock','移除石头'],
    ['gesture.public_trump','每有效手轮换'], ['life.draw_damage','双方受伤'], ['life.win_heal','胜利回血'], ['life.survive','活到终点'],
    ['life.last_hit_double','伤害翻倍'], ['life.desperation','一血出手'], ['cards.draw_refund','耗牌退回'], ['cards.dealer_refill','下手公开补牌'],
    ['energy.guard_paid','防御也要付出'], ['energy.piercing_wave','穿过防御'], ['energy.cheap_wave','费用变低'], ['energy.opening_two','双方带着两气'],
    ['energy.leak_thirds','每第三手'], ['energy.loss_charge','最终败者'], ['energy.cap_five','不赠气'], ['energy.double_boost','赢才加伤'],
  ])('%s shows its actual change instead of falling back to three gestures',(kind,caption)=>{
    const {container}=render(<CreationPreview kind={kind}/>);
    expect(container.querySelector('.mechanic-preview')).toHaveTextContent(caption!);
    expect(container.querySelector('.preview-gestures')).toBeNull();
    expect(container.querySelector('.creation-preview')).toHaveAttribute('aria-hidden','true');
  });

  it('distinguishes removal, collection, and a public trump through the affected gesture objects',()=>{
    const {container,rerender}=render(<CreationPreview kind="gesture.remove_rock"/>);
    expect(container.querySelectorAll('.mechanic-gestures--remove .gesture-icon')).toHaveLength(3);
    expect(container.querySelectorAll('.mechanic-gestures--remove .mechanic-focus')).toHaveLength(1);
    rerender(<CreationPreview kind="goal.collect_three"/>);
    expect(container.querySelectorAll('.mechanic-gestures--collect small')).toHaveLength(3);
    rerender(<CreationPreview kind="gesture.public_trump"/>);
    expect(container.querySelectorAll('.mechanic-crown')).toHaveLength(1);
    expect(container.querySelector('.mechanic-gestures--trump')).toBeInTheDocument();
  });

  it('depicts added capacity as empty and the piercing action with its own icon',()=>{
    const {container,rerender}=render(<CreationPreview kind="energy.cap_five"/>);
    expect(container.querySelectorAll('.mechanic-pips i')).toHaveLength(5);
    expect(container.querySelectorAll('.mechanic-pips .is-filled')).toHaveLength(3);
    rerender(<CreationPreview kind="energy.piercing_wave"/>);
    expect(container.querySelector('.icon-piercing')).toBeInTheDocument();
    expect(container.querySelectorAll('.mechanic-pips i')).toHaveLength(3);
  });
});
