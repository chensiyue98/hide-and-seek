export function efficiencyMultiplier(questions:number):number { return [1.5,1.4,1.3,1.2,1.1][questions] ?? 1; }
export function calculateScore(distanceKm:number,questions:number):number { return Math.min(10000,Math.round(10000*Math.exp(-distanceKm/60)*efficiencyMultiplier(questions))); }
