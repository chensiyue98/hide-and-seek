import { distance as turfDistance, point } from '@turf/turf';
import type { LatLng } from '../types';
export function haversineKm(a:LatLng,b:LatLng):number { return turfDistance(point([a.lng,a.lat]),point([b.lng,b.lat]),{units:'kilometers'}); }
export function northSouth(hidden:LatLng,target:LatLng):'NORTH'|'SOUTH' { return hidden.lat >= target.lat ? 'NORTH':'SOUTH'; }
export function eastWest(hidden:LatLng,target:LatLng):'EAST'|'WEST' { return hidden.lng >= target.lng ? 'EAST':'WEST'; }
export function insideRadar(hidden:LatLng,center:LatLng,radiusKm:number):boolean { return haversineKm(hidden,center)<=radiusKm; }
export function closerCity(hidden:LatLng,a:LatLng,b:LatLng):'A'|'B' { return haversineKm(hidden,a)<=haversineKm(hidden,b)?'A':'B'; }
export function bisectorLine(a:LatLng,b:LatLng):[[number,number],[number,number]] { const mid={lat:(a.lat+b.lat)/2,lng:(a.lng+b.lng)/2}; const dx=b.lng-a.lng,dy=b.lat-a.lat; const scale=2.5; return [[mid.lng-dy*scale,mid.lat+dx*scale],[mid.lng+dy*scale,mid.lat-dx*scale]]; }

export function thermometerTrend(hidden:LatLng,previous:LatLng,current:LatLng):'HOTTER'|'COLDER'{return haversineKm(current,hidden)<haversineKm(previous,hidden)?'HOTTER':'COLDER';}
