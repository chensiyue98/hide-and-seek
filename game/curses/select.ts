import type { Category, CurseType } from '../types';
import { seededRandom } from '../seed';
export const thresholds=[3,5,7,9];
export const strategicCurses:CurseType[]=['signal-jam','question-tax','forced-move','information-blackout','burn-card'];
export function chooseCurseOptions(seed:string,history:CurseType[]):[CurseType,CurseType]{
  const pool=strategicCurses.filter(type=>type!==history.at(-1));
  const random=seededRandom(seed);
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j]!,pool[i]!];}
  return [pool[0]!,pool[1]!];
}
export const questionCategories:Category[]=['Direction','Radar','Comparison','Profile'];
