import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';
import { synthesizeCue } from '../../src/minitool/sound';
const code = transformSync(fs.readFileSync('src/minitool/compat.ts','utf8'), {loader:'ts',format:'iife',globalName:'Compat',target:['es2017','chrome61']}).code;
describe('offline minitool compatibility', () => {
  it('supports the actual state operations when post-ES2017 builtins are absent', () => {
    const context=vm.createContext({});
    vm.runInContext('delete Object.fromEntries;delete Object.hasOwn;delete Array.prototype.at;delete Array.prototype.flatMap;delete Promise.prototype.finally;',context);
    vm.runInContext(code+';Compat.installLocalFallbacks(globalThis);',context);
    const result=vm.runInContext(`JSON.stringify({last:[1,2,3].at(-1),outside:[1].at(2),flat:[1,2].flatMap(x=>[x,x]),map:Object.fromEntries([['x',2]]),own:Object.hasOwn({x:1},'x')})`,context);
    expect(JSON.parse(result)).toEqual({last:3,flat:[1,1,2,2],map:{x:2},own:true});
    expect(vm.runInContext(`const x={list:[1,undefined],value:Infinity};x.self=x;const y=structuredClone(x);y.list[0]=9;x.list[0]===1&&y.self===y&&y.list[1]===undefined&&y.value===Infinity`,context)).toBe(true);
    expect(vm.runInContext(`Object.getPrototypeOf(Object.fromEntries([['__proto__',{bad:true}]]))===Object.prototype`,context)).toBe(true);
  });
  it('preserves promise results and errors in the local finally implementation',async()=>{
    const context=vm.createContext({});vm.runInContext('delete Promise.prototype.finally;',context);
    vm.runInContext(code+';Compat.installLocalFallbacks(globalThis);',context);
    expect(await vm.runInContext('Promise.resolve(7).finally(()=>99)',context)).toBe(7);
    expect(await vm.runInContext('Promise.reject("original").finally(()=>99).catch(x=>x)',context)).toBe('original');
  });
  it('synthesizes every cue locally with bounded duration and signal amplitude',()=>{
    const buffers:Float32Array[]=[];
    const context={createBuffer:(_channels:number,length:number,rate:number)=>{expect(rate).toBe(22050);expect(length).toBeLessThanOrEqual(6615);const data=new Float32Array(length);buffers.push(data);return {getChannelData:()=>data};}} as unknown as AudioContext;
    for(const tone of ['paper','electronic'] as const)for(const event of ['select','reveal','win','lose','draw','install','undo','name','style','claim_draw','insurance','retry','charge','attack','guard','save'])synthesizeCue(context,event,tone);
    expect(buffers).toHaveLength(32);
    for(const buffer of buffers){expect(buffer.some(v=>Math.abs(v)>.01)).toBe(true);expect(buffer.every(v=>Number.isFinite(v)&&Math.abs(v)<.4)).toBe(true);}
  });
});
