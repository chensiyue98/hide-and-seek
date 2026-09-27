'use client';
import {useState} from 'react';
import type {QuestionCard as Card,QuestionKind} from '../game/types';
import {useGameStore} from '../store/gameStore';
import {haversineKm} from '../game/geo/calculations';

const effect:Record<QuestionKind,string>={
  'north-south':'Find out whether the hidden place is north or south of your current position.',
  'east-west':'Find out whether the hidden place is east or west of your current position.',
  'radar-100':'Check whether the hidden place is within 100 km of your Searcher. Signal Jam can make the result uncertain.',
  'radar-50':'Check whether the hidden place is within 50 km of your Searcher. Signal Jam can make the result uncertain.',
  'radar-25':'Check whether the hidden place is within 25 km of your Searcher. Signal Jam can make the result uncertain.',
  'closer-to':'Choose two cities; learn which one is closer to the hidden place.',
  population:'Learn the hidden municipality’s population bracket.',
  coast:'Learn the hidden place’s distance-to-coast bracket.',
  province:'Learn whether the hidden place shares a province with the nearest mapped town to your position.',
  region:'Learn which broad region contains the hidden place.',
  thermometer:'Compare your current position with your previous one: HOTTER or COLDER.'
};
export default function QuestionCard({card,index,selected,onPreview,onChoose}:{card:Card;index:number;selected:boolean;onPreview?:(kind:QuestionKind|null)=>void;onChoose:(cardId:string)=>void}){
  const ap=useGameStore(s=>s.actionPoints),curses=useGameStore(s=>s.curses),status=useGameStore(s=>s.status),thermometerAvailable=useGameStore(s=>s.thermometerAvailable),previousSearcher=useGameStore(s=>s.previousSearcher),searcher=useGameStore(s=>s.searcher),[hovered,setHovered]=useState(false);
  const force=curses.find(c=>c.type==='forced-move'),forcedMove=force?.type==='forced-move'&&haversineKm(force.origin,searcher)<30,disabled=status!=='playing'||ap<card.cost||(card.kind==='thermometer'&&!thermometerAvailable)||!!forcedMove,showEffect=hovered||selected;
  return <button className={`question-card ${disabled?'is-disabled':''} ${selected?'is-selected':''} ${showEffect?'shows-effect':''}`} onMouseEnter={()=>{setHovered(true);onPreview?.(card.kind)}} onMouseLeave={()=>{setHovered(false);onPreview?.(null)}} onFocus={()=>{setHovered(true);onPreview?.(card.kind)}} onBlur={()=>{setHovered(false);onPreview?.(null)}} onClick={()=>{if(!disabled)onChoose(card.id)}} aria-disabled={disabled} aria-label={`${card.label}, costs ${card.cost} action points. ${effect[card.kind]}`}><span className="card-index">0{index+1} / {selected?'SELECTED':card.category.toUpperCase()}</span><strong>{card.label}</strong>{showEffect&&<span className="card-effect">{effect[card.kind]}</span>}<span className="card-bottom"><span>{card.cost} AP</span><span>↗</span></span>{card.kind==='thermometer'&&!thermometerAvailable&&<span className="lock-mark">{previousSearcher?'MOVE AGAIN':'MOVE FIRST'}</span>}{forcedMove&&<span className="lock-mark">MOVE 30 KM FIRST</span>}</button>
}
