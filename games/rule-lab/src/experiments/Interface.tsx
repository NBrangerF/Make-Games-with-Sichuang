import type { CompiledDesign, MatchState } from '../core/types';
import { PositionBoard, PositionOutcomes } from './PositionBoard';
import type { ExperimentInput } from './types';
import './experiments.css';
export function ExperimentWorld({match,compiled,revealed=false,input,onChange}:{match:MatchState;compiled:CompiledDesign;revealed?:boolean;input?:ExperimentInput;onChange?:(input:ExperimentInput)=>void}) {
return <PositionBoard match={match} compiled={compiled} revealed={revealed} input={input} onChange={onChange}/>;
}
export function ExperimentOutcomes({match}:{match:MatchState}) {return <PositionOutcomes match={match}/>;}
