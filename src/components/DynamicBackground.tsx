'use client';

import React, { useRef, useEffect } from 'react';

interface DynamicBackgroundProps {
  paused?: boolean;
}

export default function DynamicBackground({ paused = false }: DynamicBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (paused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  }, [paused]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#050204]">
      {/* Base Layer: running_man_hor Video with Super Ambient Blur */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-center select-none ${
          paused ? 'video-ambient-home' : 'video-ambient-blur'
        }`}
      >
        <source src="/running_man_hor.mp4" type="video/mp4" />
      </video>

      {/* Fluted Glass Refractive Texture */}
      <div className="absolute inset-0 fluted-glass-overlay opacity-35 mix-blend-overlay pointer-events-none" />

      {/* Peripheral Obsidian Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: paused
            ? 'radial-gradient(circle at 50% 50%, rgba(5,2,4,0.55) 10%, rgba(5,2,4,0.9) 65%, rgba(5,2,4,0.98) 100%)'
            : 'radial-gradient(circle at 50% 50%, rgba(5,2,4,0.25) 20%, rgba(5,2,4,0.65) 68%, rgba(5,2,4,0.95) 100%)',
          transition: 'background 1.5s ease'
        }}
      />
    </div>
  );
}
