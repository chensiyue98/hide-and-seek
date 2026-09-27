export function hashSeed(seed:string):number { let h=2166136261; for(const c of seed){h^=c.charCodeAt(0);h=Math.imul(h,16777619);} return h>>>0; }
export function seededRandom(seed:string):()=>number { let state=hashSeed(seed)||1; return ()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}; }
export function shuffle<T>(items:T[],random:()=>number):T[] {const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
