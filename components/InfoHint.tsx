'use client';
import {useState} from 'react';

export default function InfoHint({label,text}:{label:string;text:string}){
  const [open,setOpen]=useState(false),[pinned,setPinned]=useState(false);
  return <span className="info-hint" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>{if(!pinned)setOpen(false)}}>
    <button type="button" className="info-hint-button" aria-label={`Explain ${label}`} aria-expanded={open} onFocus={()=>setOpen(true)} onBlur={()=>{if(!pinned)setOpen(false)}} onClick={()=>{const next=!pinned;setPinned(next);setOpen(next)}} onKeyDown={event=>{if(event.key==='Escape'){setPinned(false);setOpen(false)}}}>?</button>
    {open&&<span className="info-tooltip" role="tooltip">{text}</span>}
  </span>;
}
