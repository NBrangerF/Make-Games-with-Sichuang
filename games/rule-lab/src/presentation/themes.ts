import type { Expression } from '../journey/types';
import { scenePalettes } from './stage-paths';

export type VisualStyle = Expression['style'];
export interface ThemePalette {
  paper: string; ink: string; muted: string; deep: string; mid: string;
  light: string; accent: string; line: string;
}
export const STYLE_OPTIONS = [
  { id: 'ink', label: '朱墨', description: '纸面留白、朱红斩线，手绘墨线安静落下。' },
  { id: 'cyanotype', label: '霓光', description: '深蓝舞台、青色光环，线条像能量透亮。' },
  { id: 'cel', label: '昭和热血', description: '赛璐璐硬阴影、放射速度线，像一格热血动画。' },
  { id: 'manga', label: '黑白漫画', description: '黑白分格、网点纸与粗墨边，让交锋成为漫画。' },
  { id: 'arcade', label: '街机像素', description: '方块手势、阶梯边框与格状能量，回到街机厅。' },
] as const satisfies readonly { id: VisualStyle; label: string; description: string }[];

const palettes: Record<VisualStyle, ThemePalette> = {
  ...scenePalettes,
  cel: { paper: '#fff3d2', ink: '#202b48', muted: '#596177', deep: '#233653', mid: '#f1b447', light: '#ffe3a6', accent: '#bb341f', line: '#344565' },
  manga: { paper: '#f6f5ef', ink: '#171717', muted: '#62625d', deep: '#1c1c1c', mid: '#aaa9a3', light: '#e1e0d9', accent: '#171717', line: '#5f5f59' },
  arcade: { paper: '#12172b', ink: '#f1f4df', muted: '#abb2ce', deep: '#222e53', mid: '#45577e', light: '#1b2340', accent: '#e8f16b', line: '#697aa2' },
};

export function normalizeVisualStyle(style?: string): VisualStyle {
  return STYLE_OPTIONS.some(option => option.id === style) ? style as VisualStyle : 'ink';
}
export function themeLabel(style?: string): string {
  return STYLE_OPTIONS.find(option => option.id === normalizeVisualStyle(style))!.label;
}
export function themeCoverPalette(style?: string): ThemePalette { return palettes[normalizeVisualStyle(style)]; }
export function themeDisplayFont(style?: string): string {
  if (style === 'arcade') return '"SFMono-Regular", Consolas, "PingFang SC", monospace';
  if (style === 'cel' || style === 'manga') return '"Hiragino Sans GB", "PingFang SC", "Microsoft YaHei", sans-serif';
  return '"Songti SC", "Noto Serif CJK SC", "STSong", serif';
}
