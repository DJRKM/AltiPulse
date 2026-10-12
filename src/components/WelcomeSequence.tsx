'use client';

import React, { useState, useEffect } from 'react';
import { Mountain, Activity, ChevronRight, Zap } from 'lucide-react';

interface WelcomeSequenceProps {
  onComplete: () => void;
}

export default function WelcomeSequence({ onComplete }: WelcomeSequenceProps) {
  const [step, setStep] = useState<'CALIBRATING' | 'WORDMARK' | 'READY'>('CALIBRATING');
  const [elevationNumber, setElevationNumber] = useState(0);
  const [telemetryText, setTelemetryText] = useState('CALIBRATING BAROMETER...');

  // Telemetry Number Ramp
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 82;
      if (current >= 1236) {
        current = 1236;
        clearInterval(interval);
      }
      setElevationNumber(current);
    }, 40);

    const t1 = setTimeout(() => {
      setTelemetryText('LOCKING TOPO SATELLITE FIX...');
    }, 600);

    const t2 = setTimeout(() => {
      setStep('WORDMARK');
      setTelemetryText('TOBLER PACING ENGINE ONLINE');
    }, 1200);

    const t3 = setTimeout(() => {
      setStep('READY');
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-between p-6 overflow-hidden bg-[#07080d]/92 backdrop-blur-xl select-none transition-all duration-700">
      {/* Top Header Status */}
      <div className="pt-8 flex items-center justify-between text-[10px] tracking-widest text-slate-400 font-mono border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f98513] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f98513]" />
          </span>
          <span className="text-[#f4f1ec] font-bold">ALTIPULSE // BOOT</span>
        </div>
        <button
          onClick={onComplete}
          className="text-[10px] text-slate-400 hover:text-white px-2.5 py-0.5 rounded border border-white/10 hover:border-white/30 transition-colors uppercase font-mono"
        >
          Skip [ESC]
        </button>
      </div>

      {/* Central Visual Telemetry */}
      <div className="flex flex-col items-center justify-center text-center my-auto px-2">
        {/* Luminous Pulsing Dial (Inspired by Image 3 & 7) */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-[#f98513]/30 flex items-center justify-center relative animate-[spin_14s_linear_infinite]">
            <div className="absolute inset-2 rounded-full border border-dashed border-[#00d2ff]/40" />
            <div className="absolute -top-1 w-2.5 h-2.5 bg-[#f98513] rounded-full shadow-[0_0_12px_#f98513]" />
            <div className="absolute -bottom-1 w-2.5 h-2.5 bg-[#00d2ff] rounded-full shadow-[0_0_12px_#00d2ff]" />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Mountain className="w-7 h-7 text-[#f98513] mb-0.5 drop-shadow-[0_0_12px_rgba(249,133,19,0.8)]" />
            <div className="text-2xl font-black text-white font-tabular tracking-tight">
              {elevationNumber}
              <span className="text-xs font-normal text-[#9bacd8] ml-0.5">M</span>
            </div>
            <div className="text-[9px] tracking-widest text-[#9bacd8] uppercase font-mono">
              PEAK VERT
            </div>
          </div>
        </div>

        {/* Brand Wordmark (View Black Slant Typography) */}
        <div className="overflow-hidden py-1">
          <h1
            className={`text-5xl sm:text-6xl tracking-tighter uppercase font-slant transition-all duration-1000 transform ${
              step !== 'CALIBRATING'
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{
              color: '#f4f1ec',
              textShadow: '0 0 25px rgba(249, 133, 19, 0.45), 0 0 50px rgba(239, 68, 68, 0.25)',
              letterSpacing: '-0.02em',
            }}
          >
            ALTIPULSE
          </h1>
        </div>

        {/* Subtitle in Etrixo */}
        <p
          className={`mt-2 text-[11px] font-etrixo text-[#9bacd8] tracking-[0.2em] uppercase transition-all duration-700 delay-200 ${
            step !== 'CALIBRATING' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          3D ORIENTEERING & SUMMIT HUD
        </p>

        {/* Telemetry Status Line */}
        <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-mono text-[#f98513] bg-[#f98513]/10 border border-[#f98513]/25 px-3 py-1 rounded-full">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>{telemetryText}</span>
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="w-full pb-4">
        <button
          onClick={onComplete}
          className="group relative w-full overflow-hidden rounded-full p-[1px] focus:outline-none transition-transform active:scale-95"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#f98513] via-[#ef4444] to-[#00d2ff] animate-[spin_4s_linear_infinite]" />
          <span className="relative flex items-center justify-center gap-2 w-full bg-[#0b0c16] hover:bg-[#121424] text-[#f4f1ec] text-xs font-semibold tracking-wider uppercase py-3.5 px-6 rounded-full transition-colors font-etrixo">
            Enter Field Cockpit
            <ChevronRight className="w-4 h-4 text-[#f98513] group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        <div className="mt-3 flex items-center justify-center gap-3 text-[9px] tracking-wider text-slate-500 uppercase font-mono">
          <span>TOKYO</span> • <span>HEIDELBERG</span> • <span>BARCELONA</span>
        </div>
      </div>
    </div>
  );
}
