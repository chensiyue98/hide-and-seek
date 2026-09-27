import {booleanPointInPolygon, circle, difference, intersect, point} from '@turf/turf';
import type {Feature, FeatureCollection, MultiPolygon, Polygon} from 'geojson';
import type {Clue, LatLng} from '../types';
import {locations} from '../../data/locations';

type Area=Feature<Polygon|MultiPolygon>;
const bounds: [number,number][]=[[3.35,51.25],[3.48,51.55],[3.75,51.72],[3.83,52.05],[4.15,52.2],[4.55,52.35],[4.55,52.75],[4.72,53.0],[4.52,53.28],[4.58,53.48],[5.25,53.55],[6.05,53.55],[6.65,53.45],[7.12,53.35],[7.05,52.95],[6.92,52.5],[6.85,52.05],[6.72,51.8],[6.95,51.55],[6.42,51.48],[6.15,51.2],[5.95,50.78],[5.55,50.75],[5.1,50.82],[4.85,51.0],[4.45,51.12],[4.08,51.3],[3.72,51.38],[3.35,51.25]];
const asCollection=(a:Area,b:Area):FeatureCollection<Polygon|MultiPolygon>=>({type:'FeatureCollection',features:[a,b]});
export function isInsidePlayableRegion(position:{lat:number;lng:number}):boolean{return booleanPointInPolygon(point([position.lng,position.lat]),initialArea());}
const initialArea=():Area=>({type:'Feature',properties:{},geometry:{type:'Polygon',coordinates:[bounds]}});
function clippedHalfPlane(value:(p:[number,number])=>number,keepNegative:boolean):Area|null{
  const input=bounds.slice(0,-1),output:[number,number][]=[];
  for(let i=0;i<input.length;i++){
    const current=input[i]!,next=input[(i+1)%input.length]!;
    const a=value(current),b=value(next),insideA=keepNegative?a<=0:a>=0,insideB=keepNegative?b<=0:b>=0;
    if(insideA)output.push(current);
    if(insideA!==insideB){const t=a/(a-b);output.push([current[0]+(next[0]-current[0])*t,current[1]+(next[1]-current[1])*t]);}
  }
  if(output.length<3)return null;
  output.push(output[0]!);
  return {type:'Feature',properties:{},geometry:{type:'Polygon',coordinates:[output]}};
}
function closerRegion(clue:Extract<Clue,{type:'closer-to'}>):Area|null{
  const a=locations.find(x=>x.id===clue.cityA),b=locations.find(x=>x.id===clue.cityB);
  if(!a||!b)return null;
  const cos=Math.cos(52*Math.PI/180),ax=a.lng*cos,ay=a.lat,bx=b.lng*cos,by=b.lat;
  const value=([lng,lat]:[number,number])=>{const x=lng*cos;return (x-ax)**2+(lat-ay)**2-((x-bx)**2+(lat-by)**2);};
  return clippedHalfPlane(value,clue.winner===clue.cityA);
}
function clueArea(clue:Clue):Area|null{
  if(clue.type==='latitude-half-plane')return clippedHalfPlane(([,lat])=>lat-clue.originLat,clue.validDirection==='south');
  if(clue.type==='longitude-half-plane')return clippedHalfPlane(([lng])=>lng-clue.originLng,clue.validDirection==='west');
  if(clue.type==='closer-to')return closerRegion(clue);
  return null;
}
/** Returns one fused candidate region instead of composited per-clue overlays. */
export function combinePossibleArea(clues:Clue[]):FeatureCollection<Polygon|MultiPolygon>{
  if(!clues.some(clue=>clue.type==='latitude-half-plane'||clue.type==='longitude-half-plane'||clue.type==='radar'||clue.type==='closer-to'))return {type:'FeatureCollection',features:[]};
  let area:Area|null=initialArea();
  for(const clue of clues){
    if(!area)break;
    if(clue.type==='radar'){
      if(clue.result==='UNCERTAIN'||clue.constraintRadiusKm===null)continue;
      const disk=circle([clue.center.lng,clue.center.lat],clue.constraintRadiusKm,{steps:80,units:'kilometers'}) as Area;
      const result=clue.result==='YES'?intersect(asCollection(area,disk)):difference(asCollection(area,disk));
      area=result as Area|null;
      continue;
    }
    const constraint=clueArea(clue);
    if(constraint)area=intersect(asCollection(area,constraint)) as Area|null;
  }
  return {type:'FeatureCollection',features:area?[area]:[]};
}
/** Fuses all clue constraints, then returns the impossible portion of the playable map. */
export function combineExcludedArea(clues:Clue[]):FeatureCollection<Polygon|MultiPolygon>{
  const possible=combinePossibleArea(clues).features[0] as Area|undefined;
  if(!possible)return {type:'FeatureCollection',features:[]};
  const excluded=difference(asCollection(initialArea(),possible)) as Area|null;
  return {type:'FeatureCollection',features:excluded?[excluded]:[]};
}
