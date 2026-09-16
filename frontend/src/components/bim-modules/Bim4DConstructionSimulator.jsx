import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Calendar, CheckCircle2, Clock, Activity } from 'lucide-react';

export const Bim4DConstructionSimulator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDay, setCurrentDay] = useState(65);
  const totalDays = 365;

  const phases = [
    { id: 'P1', name: 'Substructure & Foundation Piles', start: 1, end: 60, status: 'Completed', color: '#10b981', progress: 100 },
    { id: 'P2', name: 'Superstructure Core (L1-L5)', start: 45, end: 140, status: 'In Progress', color: '#38bdf8', progress: 65 },
    { id: 'P3', name: 'Curtain Wall Facade Glazing', start: 110, end: 220, status: 'Upcoming', color: '#a855f7', progress: 15 },
    { id: 'P4', name: 'MEP Primary Riser & HVAC Fit-out', start: 130, end: 280, status: 'Upcoming', color: '#f59e0b', progress: 0 },
    { id: 'P5', name: 'Internal Architectural Finishes', start: 200, end: 330, status: 'Upcoming', color: '#ec4899', progress: 0 },
    { id: 'P6', name: 'Commissioning & Handover', start: 310, end: 365, status: 'Upcoming', color: '#64748b', progress: 0 }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentDay(d => {
          if (d >= totalDays) {
            setIsPlaying(false);
            return totalDays;
          }
          return d + 1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 210px)', overflowY: 'auto' }}>
      
      {/* 4D Simulation Control Center */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>4D CONSTRUCTION TIMELINE</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} /> Day {currentDay} of {totalDays}
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>
                ({((currentDay / totalDays) * 100).toFixed(1)}% Project Completion)
              </span>
            </div>
          </div>

          {/* Timeline Playback Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setCurrentDay(1)}
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              <RotateCcw size={14} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? '#ef4444' : 'linear-gradient(135deg, #38bdf8, #2563eb)',
                border: 'none',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isPlaying ? <><Pause size={14} /> Pause 4D Phasing</> : <><Play size={14} /> Play 4D Construction</>}
            </button>
            <button 
              onClick={() => setCurrentDay(d => Math.min(totalDays, d + 30))}
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#38bdf8', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
            >
              <FastForward size={14} /> +30 Days
            </button>
          </div>
        </div>

        {/* Timeline Scrub Slider */}
        <input 
          type="range" 
          min="1" 
          max={totalDays} 
          value={currentDay}
          onChange={e => setCurrentDay(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
        />

      </div>

      {/* Gantt Phase Visualizer */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
          📅 Construction Work Breakdown Structure (WBS)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {phases.map(phase => {
            const isCompleted = currentDay >= phase.end;
            const isCurrent = currentDay >= phase.start && currentDay < phase.end;
            const calculatedProgress = isCompleted ? 100 : isCurrent ? Math.min(100, Math.round(((currentDay - phase.start) / (phase.end - phase.start)) * 100)) : 0;

            return (
              <div key={phase.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>{phase.id}</span>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>{phase.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Days {phase.start}–{phase.end}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                      background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isCurrent ? 'rgba(56, 189, 248, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                      color: isCompleted ? '#34d399' : isCurrent ? '#38bdf8' : '#94a3b8'
                    }}>
                      {isCompleted ? '✓ Completed' : isCurrent ? '⚡ In Progress' : 'Upcoming'} ({calculatedProgress}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{
                      width: `${calculatedProgress}%`,
                      height: '100%',
                      background: isCompleted ? '#10b981' : isCurrent ? 'linear-gradient(90deg, #38bdf8, #818cf8)' : 'transparent',
                      transition: 'width 0.2s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
