import { expect, it } from 'vitest';
import { handFan } from '../../src/cards/hand-fan';

it.each([296, 366, 766, 1064])('keeps all cards within a %i px hand, including rotated corners', width => {
  for (const count of [0, 1, 5, 9, 15, 19, 28]) {
    const fan = handFan(count, width);
    expect(fan.cards).toHaveLength(count);
    fan.cards.forEach((card, index) => {
      const r = Math.abs(card.angle) * Math.PI / 180;
      const halfWidth = (fan.cardWidth * Math.cos(r) + fan.cardHeight * Math.sin(r)) / 2;
      const halfHeight = (fan.cardHeight * Math.cos(r) + fan.cardWidth * Math.sin(r)) / 2;
      expect(card.x - halfWidth).toBeGreaterThanOrEqual(0);
      expect(card.x + halfWidth).toBeLessThanOrEqual(width);
      expect(card.y + fan.cardHeight / 2 - halfHeight).toBeGreaterThanOrEqual(0);
      expect(card.y + fan.cardHeight / 2 + halfHeight).toBeLessThanOrEqual(fan.height);
      if (index) expect(card.x).toBeGreaterThan(fan.cards[index - 1]!.x);
    });
  }
});
