'use client';
import {useGameStore} from '../store/gameStore';
export default function ClueHistory(){const clues=useGameStore(s=>s.clues);return <section className="evidence"><div className="section-heading"><span>FIELD NOTES</span><span>{String(clues.length).padStart(2,'0')}</span></div>{clues.length===0?<p className="empty-note">No evidence yet. Every question leaves a mark.</p>:<ol>{clues.map((c,i)=><li key={c.id}><span>{String(i+1).padStart(2,'0')}</span><b>{c.label}</b></li>)}</ol>}</section>}
