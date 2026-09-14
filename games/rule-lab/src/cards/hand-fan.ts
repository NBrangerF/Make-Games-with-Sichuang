/** Keep the entire fan inside its measured width, including rotated card corners. */
export function handFan(count: number, width: number, availableHeight = Infinity) {
  const cardWidth = Math.min(144, Math.max(56, Math.min(width * .25, (availableHeight - 42) / 1.46)));
  const cardHeight = Math.round(cardWidth * 1.46);
  const angle = count > 1 ? 8 : 0;
  const edge = (cardWidth * Math.cos(angle * Math.PI / 180) + cardHeight * Math.sin(angle * Math.PI / 180)) / 2 + 6;
  const spread = Math.min(Math.max(0, width - edge * 2), Math.max(0, count - 1) * cardWidth * .64);
  return { cardWidth, cardHeight, height: cardHeight + 42, cards: Array.from({length: count}, (_, index) => {
    const t = count < 2 ? 0 : index / (count - 1) * 2 - 1;
    return { x: width / 2 + t * spread / 2, y: 16 + t * t * 15, angle: t * angle };
  }) };
}
