/// <reference types="node" />
// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { generateCoverSVG } from '../src/presentation/cover';
import { gesturePaths } from '../src/presentation/gesture-paths';
import { normalizedAbility, stagePaths, scenePalettes } from '../src/presentation/stage-paths';

const parse = (svg: string) => new DOMParser().parseFromString(svg, 'image/svg+xml');

describe('presentation assets remain faithful to visible facts', () => {
  it('treats a user title as XML text and never creates executable markup', () => {
    const title = '<script>x</script>&"\'';
    const document = parse(generateCoverSVG({ name: title, subtitle: '<>&"\'' }));
    expect(document.querySelector('parsererror')).toBeNull();
    expect(document.documentElement.getAttribute('aria-label')).toBe(title);
    expect(document.querySelectorAll('script, image, foreignObject')).toHaveLength(0);
    for (const element of document.querySelectorAll('*')) {
      expect([...element.attributes].some(attribute => /^on/i.test(attribute.name))).toBe(false);
    }
    const texts = [...document.querySelectorAll('text')];
    expect(texts.filter(t => Number(t.getAttribute('y')) < 300).map(t => t.textContent).join('')).toBe(title);
    expect(texts.find(t => t.getAttribute('y') === '758')?.textContent).toBe('<>&"\'');
  });

  it('keeps unnamed covers visibly untitled and changes only composition between layouts', () => {
    const spec = { name: '   ', subtitle: '先赢两手 · 最多五手', style: 'cyanotype' as const, ability: 'ability.insurance', gestures: ['rock', 'scissors', 'paper', 'lizard', 'spock'] as const };
    const make = (layout: 'centered' | 'diagonal') => parse(generateCoverSVG({ ...spec, gestures: [...spec.gestures], layout }));
    const centered = make('centered'), diagonal = make('diagonal');
    for (const document of [centered, diagonal]) {
      expect([...document.querySelectorAll('text')].filter(t => Number(t.getAttribute('y')) < 300)).toHaveLength(0);
      expect(document.querySelector('text[y="758"]')?.textContent).toBe(spec.subtitle);
      expect(document.querySelector('rect')?.getAttribute('fill')).toBe(scenePalettes.cyanotype.paper);
      for (const gesture of spec.gestures) expect([...document.querySelectorAll('path')].filter(p => p.getAttribute('d') === gesturePaths[gesture].outline)).toHaveLength(1);
    }
    const transforms = (document: Document) => [...document.querySelectorAll('g')].map(g => g.getAttribute('transform'));
    expect(transforms(centered)).toHaveLength(5);
    expect(transforms(centered)).not.toEqual(transforms(diagonal));
  });

  describe('original files, prepared separately from content assertions', () => {
    const stages = new Map<string,string>();
    const waveFiles = new Map<string,Buffer>();
    let entries: {event:string;tone:string;durationSeconds:number;source:string;runtime:string}[] = [];

    // iCloud may hydrate these very small originals on first read. Only fixture I/O gets
    // a longer deadline; every SVG/PCM assertion below keeps Vitest's default 5 seconds.
    beforeAll(async()=>{
      const started=performance.now();let stageMs=0,audioMs=0;
      await Promise.all([
        (async()=>{
          const paths=['none','tiebreak','insurance','retry'].flatMap(key=>['ink','cyanotype'].map(style=>resolve(`art-source/stages/${key}-${style}.svg`)));
          await Promise.all(paths.map(async path=>{stages.set(path,await readFile(path,'utf8'));}));
          stageMs=performance.now()-started;
        })(),
        (async()=>{
          entries=JSON.parse(await readFile(resolve('art-source/audio/manifest.json'),'utf8'));
          await Promise.all(entries.flatMap(entry=>[entry.runtime,entry.source]).map(async file=>{
            const path=resolve(file);waveFiles.set(path,await readFile(path));
          }));
          audioMs=performance.now()-started;
        })(),
      ]);
      console.info(`[presentation fixture I/O] ${stages.size} SVGs: ${stageMs.toFixed(0)}ms; ${waveFiles.size} WAVs + manifest: ${audioMs.toFixed(0)}ms; parallel total: ${(performance.now()-started).toFixed(0)}ms`);
    },120_000);

  it('uses the same capability-specific stage geometry in both themes and covers', () => {
    const cases = [['none', null], ['tiebreak', 'ability.claim_draw'], ['insurance', 'ability.insurance'], ['retry', 'ability.retry']] as const;
    expect(stagePaths.none).toHaveLength(0);
    expect(new Set(cases.slice(1).map(([key]) => stagePaths[key].map(p => p.d).join(' '))).size).toBe(3);
    for (const [key, ability] of cases) for (const style of ['ink', 'cyanotype'] as const) {
      const document = parse(generateCoverSVG({ ability, style }));
      expect(document.querySelector('parsererror')).toBeNull();
      expect(normalizedAbility(ability)).toBe(key);
      for (const layer of stagePaths[key]) expect([...document.querySelectorAll('path')].some(path => path.getAttribute('d') === layer.d)).toBe(true);
      const file = stages.get(resolve(`art-source/stages/${key}-${style}.svg`))!;
      for (const layer of stagePaths[key]) expect(file).toContain(layer.d);
    }
  });

  it('delivers distinct, non-silent 48 kHz WAV files for every event in both tones', () => {
    expect(entries).toHaveLength(32);
    const groups = new Map<string, Buffer[]>(); let runtimeBytes = 0;
    for (const entry of entries) {
      const runtime = waveFiles.get(resolve(entry.runtime))!; const master = waveFiles.get(resolve(entry.source))!;
      for (const [buffer, bits] of [[runtime,16], [master,24]] as const) {
        expect(buffer.toString('ascii',0,4)).toBe('RIFF'); expect(buffer.toString('ascii',8,12)).toBe('WAVE');
        expect(buffer.readUInt16LE(20)).toBe(1); expect(buffer.readUInt16LE(22)).toBe(1);
        expect(buffer.readUInt32LE(24)).toBe(48000); expect(buffer.readUInt16LE(34)).toBe(bits);
      }
      const samples: number[]=[]; for(let i=44;i<runtime.length;i+=2) samples.push(runtime.readInt16LE(i)/32768);
      expect(samples.length/48000).toBeCloseTo(entry.durationSeconds,4);
      const peak=Math.max(...samples.map(Math.abs)); const rms=Math.sqrt(samples.reduce((sum,x)=>sum+x*x,0)/samples.length);
      expect(peak).toBeGreaterThan(.08); expect(peak).toBeLessThan(.9); expect(rms).toBeGreaterThan(.005);
      expect(Math.abs(samples[0])).toBeLessThan(.001); expect(Math.abs(samples.at(-1)!)).toBeLessThan(.001);
      runtimeBytes += runtime.length; groups.set(entry.event,[...(groups.get(entry.event)||[]),runtime]);
    }
    expect(runtimeBytes).toBeLessThan(1024*1024);
    expect(groups.size).toBe(16);
    for(const files of groups.values()) { expect(files).toHaveLength(2); expect(files[0].equals(files[1])).toBe(false); }
  });
  });
});
