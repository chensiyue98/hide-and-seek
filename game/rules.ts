import {thresholds} from './curses/select';
export function questionCost(base:number,radarTax=false):number{return base+(radarTax?1:0)}
export function canAffordActionPoints(current:number,cost:number):boolean{return current>=cost}
export function deductActionPoints(current:number,cost:number):number{if(!canAffordActionPoints(current,cost))throw new Error('Insufficient Action Points');return current-cost}
export function crossedThreatThreshold(previous:number,next:number):number|undefined{return thresholds.find(value=>previous<value&&next>=value)}
export function crossedThreatThresholds(previous:number,next:number):number[]{return thresholds.filter(value=>previous<value&&next>=value)}
export function jammedRadarResult(distanceKm:number,radiusKm:number):{result:'YES'|'NO'|'UNCERTAIN';constraintRadiusKm:number|null}{const inside=radiusKm*.9,outside=radiusKm*1.1;if(distanceKm<=inside)return{result:'YES',constraintRadiusKm:Math.round(inside*10)/10};if(distanceKm>=outside)return{result:'NO',constraintRadiusKm:Math.round(outside*10)/10};return{result:'UNCERTAIN',constraintRadiusKm:null}}

export function movementCost(distanceKm:number):number{return Math.max(1,Math.ceil(distanceKm/50));}
