// @vitest-environment jsdom
import { useState } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { RuleLabAudio, type SoundTone } from '../../src/presentation/audio';
import { ExpressionEditor } from '../../src/ui/ExpressionEditor';
import { getChoice } from '../../src/content';
import { defaultExpression } from '../../src/journey';
import { createDesign, createMatch, commitComputer, compileDesign, resolveAttempt } from '../../src/core';

const harness = vi.hoisted(()=>({current:null as import('../../src/presentation/audio').RuleLabAudio|null}));
vi.mock('../../src/presentation/audio',async importOriginal=>{
  const real=await importOriginal<typeof import('../../src/presentation/audio')>();
  return {...real,audio:{
    init:()=>harness.current!.init(),
    preview:(tone:SoundTone)=>harness.current!.preview(tone),
  }};
});

class Parameter { value=0;cancelScheduledValues=vi.fn();setTargetAtTime=vi.fn(); }
class AudioNode { connect=vi.fn();disconnect=vi.fn(); }
class Source extends AudioNode {
  buffer:{key:string}|null=null;playbackRate=new Parameter();onended:(()=>void)|null=null;stopped=false;
  start=vi.fn(()=>played.push(this.buffer!.key));
  stop=vi.fn(()=>{this.stopped=true;this.onended?.();});
}
let played:string[]=[];
let contexts:DeferredAudioContext[]=[];
class DeferredAudioContext {
  state='suspended';destination={};sources:Source[]=[];resumes:(()=>void)[]=[];
  constructor(){contexts.push(this);}
  get currentTime(){return performance.now()/1000;}
  resume=()=>new Promise<void>(resolve=>this.resumes.push(resolve));
  unlock(){this.state='running';this.resumes.splice(0).forEach(resolve=>resolve());}
  close=async()=>{this.state='closed';};
  createGain=()=>Object.assign(new AudioNode(),{gain:new Parameter()});
  createDynamicsCompressor=()=>Object.assign(new AudioNode(),{threshold:new Parameter(),knee:new Parameter(),ratio:new Parameter(),attack:new Parameter(),release:new Parameter()});
  createBufferSource=()=>{const source=new Source();this.sources.push(source);return source;};
  decodeAudioData=async(bytes:ArrayBuffer&{key:string})=>({key:bytes.key,duration:.25});
}

beforeAll(()=>{
  Object.defineProperty(window,'matchMedia',{configurable:true,value:(query:string):MediaQueryList=>({matches:false,media:query,onchange:null,addListener:()=>{},removeListener:()=>{},addEventListener:()=>{},removeEventListener:()=>{},dispatchEvent:()=>true})});
  HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  HTMLDialogElement.prototype.close=function(){this.open=false;};
});
beforeEach(()=>{
  vi.useFakeTimers({toFake:['setTimeout','clearTimeout','performance']});played=[];contexts=[];
  Object.defineProperty(window,'AudioContext',{configurable:true,value:DeferredAudioContext});
  Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});
  vi.stubGlobal('fetch',vi.fn(async(url:string)=>({ok:true,arrayBuffer:async()=>Object.assign(new ArrayBuffer(1),{key:String(url).split('audio/')[1]!.replace('.wav','')})})));
  harness.current=new RuleLabAudio();
});
afterEach(()=>{cleanup();harness.current?.dispose();harness.current=null;vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks();});

function SoundEditor(){
  const [open,setOpen]=useState(true);
  const design=createDesign();
  const match=resolveAttempt(commitComputer(createMatch(design,24)),{kind:'scissors',boost:0,ability:false},'sound-editor');
  return open?<ExpressionEditor choice={getChoice('U11')!} expression={defaultExpression} compiled={compileDesign(design)} match={match} busy={false} onClose={()=>setOpen(false)} onApply={async()=>{}}/>:null;
}
const click=(name:string|RegExp)=>fireEvent.click(screen.getByRole('button',{name}));
const tick=async(ms:number)=>act(async()=>{await vi.advanceTimersByTimeAsync(ms);});
const unlock=async()=>{await act(async()=>{contexts.forEach(context=>context.unlock());await vi.advanceTimersByTimeAsync(0);});};

describe('sound editor owns the real audition cancellation immediately',()=>{
  it('never starts audio after the editor closes while its first user unlock is still pending',async()=>{
    render(<SoundEditor/>);click('试听一次');
    expect(contexts).toHaveLength(1);expect(contexts[0]!.state).toBe('suspended');
    click('先不改');expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await tick(250);await unlock();await tick(1200);
    expect(played).toEqual([]);expect(contexts[0]!.sources).toHaveLength(0);
  });

  it('keeps only the final selected tone when switching before audio unlock resolves',async()=>{
    render(<SoundEditor/>);click(/^电子/);click(/^纸与木/);
    expect(played).toEqual([]);await unlock();await tick(1200);
    expect(played).toEqual(['paper/select','paper/reveal','paper/win']);
  });

  it('cancels the old audition tail when changing tone after the first cue has already played',async()=>{
    render(<SoundEditor/>);click('试听一次');await unlock();
    expect(played).toEqual(['paper/select']);
    await tick(110);click(/^电子/);await tick(1200);
    expect(played).toEqual(['paper/select','electronic/select','electronic/reveal','electronic/win']);
    expect(contexts[0]!.sources[0]!.stopped).toBe(true);
  });

  it('stops the active cue and cancels scheduled cues when unmounted during an audition',async()=>{
    const {unmount}=render(<SoundEditor/>);click('试听一次');await unlock();
    expect(played).toEqual(['paper/select']);await tick(100);unmount();await tick(1200);
    expect(played).toEqual(['paper/select']);expect(contexts[0]!.sources[0]!.stopped).toBe(true);
  });
});
