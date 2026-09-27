import type {QuestionCard} from '../types';

const catalog:Omit<QuestionCard,'id'>[]=[
  {kind:'north-south',cost:1,label:'NORTH / SOUTH',category:'Direction'},
  {kind:'east-west',cost:1,label:'EAST / WEST',category:'Direction'},
  {kind:'radar-100',cost:2,label:'RADAR 100 KM',category:'Radar'},
  {kind:'radar-50',cost:3,label:'RADAR 50 KM',category:'Radar'},
  {kind:'radar-25',cost:4,label:'RADAR 25 KM',category:'Radar'},
  {kind:'closer-to',cost:2,label:'CLOSER TO',category:'Comparison'},
  {kind:'population',cost:2,label:'POPULATION',category:'Profile'},
  {kind:'coast',cost:2,label:'COAST DISTANCE',category:'Profile'},
  {kind:'province',cost:2,label:'PROVINCE CHECK',category:'Profile'},
  {kind:'region',cost:2,label:'REGION',category:'Profile'},
  {kind:'thermometer',cost:2,label:'THERMOMETER',category:'Profile'}
];

/** Every question type is available from the start; AP and curses govern reuse. */
export function createQuestionCatalog():QuestionCard[]{return catalog.map((card,index)=>({...card,id:`question-${index+1}`}));}
