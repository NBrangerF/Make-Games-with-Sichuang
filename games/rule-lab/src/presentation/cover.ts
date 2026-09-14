import { gesturePaths } from './gesture-paths';
import { normalizedAbility, stagePaths } from './stage-paths';
import { normalizeVisualStyle, themeCoverPalette, themeDisplayFont, type VisualStyle } from './themes';
import { pixelGesturePaths, themeScenePaths } from './theme-art';
export type CoverSpec = {
  name?: string;
  subtitle?: string;
  style?: VisualStyle;
  ability?: string | null;
  gestures?: (keyof typeof gesturePaths)[];
  layout?: 'centered' | 'triptych' | 'diagonal';
};
const WIDTH = 1440, HEIGHT = 960;
function xml(value: string): string { return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!)); }
function clean(value = '') { return value.normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, '').trim(); }
function glyphs(value: string): string[] {
  return typeof Intl.Segmenter === 'function' ? [...new Intl.Segmenter('zh', { granularity:'grapheme' }).segment(value)].map(part => part.segment) : Array.from(value);
}
function wrap(value: string, max: number, lines: number) {
 const chars=glyphs(clean(value)); return Array.from({length: Math.min(lines, Math.ceil(chars.length/max))}, (_,i) => chars.slice(i*max, (i+1)*max).join(''));
}
/** Dedicated composition built from the same paths and palette as the playable scene. */
export function generateCoverSVG(spec: CoverSpec = {}): string {
  const theme = normalizeVisualStyle(spec.style);
  const colors = themeCoverPalette(theme); const ability=normalizedAbility(spec.ability);
  const themeScene = themeScenePaths[theme];
  const gestures=[...new Set(spec.gestures?.filter(g => g in gesturePaths) || ['rock','scissors','paper'])].slice(0,5) as (keyof typeof gesturePaths)[];
  const title=wrap(spec.name || '', 14, 2); const subtitle=wrap(spec.subtitle || '', 34, 2);
  const layers=themeScene ? themeScene.map(({d,fill,stroke,width,opacity})=>`<path data-theme-motif="${theme}" d="${d}" fill="${fill==='none'?'none':colors[fill]}" stroke="${stroke&&stroke!=='none'?colors[stroke]:'none'}" stroke-width="${width??1}" opacity="${opacity??1}"/>`).join('') : stagePaths[ability].map(({d,layer,transform}) => {
    const fill = ['deep','mid','light','paper'].includes(layer) ? colors[layer as 'deep'|'mid'|'light'|'paper'] : 'none';
    const stroke = fill==='none' ? (layer==='stamp' ? colors.accent : colors.line) : 'none';
    return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${layer==='stamp'?3:1.6}"${transform?` transform="${transform}"`:''}/>`;
  }).join('');
  const layout=spec.layout || 'centered';
  const marks=gestures.map((gesture, i) => {
    const count=gestures.length; const size=count>3 ? 132:178;
    let x=720+(i-(count-1)/2)*(count>3?205:290)-size/2; let y=400;
    if(layout==='diagonal') { x=320+i*(count>3?195:330)-size/2; y=450+(i-(count-1)/2)*56; }
    if(layout==='triptych' && count>3) { x=720+((i<3?i:i-3)-(i<3?1:.5))*230-size/2; y=i<3?355:535; }
    const shape=theme==='arcade'?pixelGesturePaths[gesture]:gesturePaths[gesture];
    const strokeWidth=theme==='cel'||theme==='manga'?7:theme==='arcade'?6:5.5;
    const shadow=theme==='cel'?`<path d="${shape.outline}" transform="translate(7 9)" stroke="none" fill="${colors.accent}"/>`:'';
    return `<g transform="translate(${x} ${y}) scale(${size/128})" fill="none" stroke="${colors.ink}" stroke-width="${strokeWidth}" stroke-linecap="${theme==='arcade'?'square':'round'}" stroke-linejoin="${theme==='arcade'?'miter':'round'}">${shadow}<path fill="${colors.paper}" d="${shape.outline}"/>${shape.details.map(d=>`<path d="${d}"/>`).join('')}</g>`;
  }).join('');
  const text = title.map((line,i) => `<text x="720" y="${190+i*69}" text-anchor="middle" font-family="${xml(themeDisplayFont(theme))}" font-weight="${theme==='cel'||theme==='manga'?900:600}" font-size="${glyphs(line).length>10?49:60}" letter-spacing="5" fill="${colors.ink}">${xml(line)}</text>`).join('');
  const description=subtitle.map((line,i)=>`<text x="720" y="${758+i*34}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" fill="${colors.muted}">${xml(line)}</text>`).join('');
  const grid=theme==='cyanotype' ? '<defs><pattern id="cover-grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#f4f2df" stroke-width=".7" opacity=".1"/></pattern></defs><rect width="1440" height="960" fill="url(#cover-grid)"/>' : theme==='manga' ? `<defs><pattern id="cover-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="${colors.ink}" opacity=".16"/></pattern></defs><path d="M0 0H520L100 510H0ZM1440 960H940L1320 490H1440Z" fill="url(#cover-dots)"/>` : theme==='arcade' ? `<defs><pattern id="cover-scan" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8H8" stroke="${colors.ink}" opacity=".035"/></pattern></defs><rect width="1440" height="960" fill="url(#cover-scan)"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${xml(clean(spec.name) || '未命名作品封面')}"><rect width="1440" height="960" fill="${colors.paper}"/>${grid}${layers}${marks}${text}${description}<path d="M665 854H775" stroke="${colors.line}" stroke-width="1"/><text x="720" y="900" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" letter-spacing="5" fill="${colors.muted}">规则试验场 · 一个不断生长的游戏</text></svg>`;
}
