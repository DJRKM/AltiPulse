'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Compass,
  Layers,
  Camera,
  Flag,
  Clock,
  Flame,
  Footprints,
  Heart,
  Mountain,
  Navigation,
  CloudRain,
  Wind,
  Sun,
  CloudSun,
  Sparkles,
  Award,
  Upload,
  CheckCircle2,
  X,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  ExternalLink,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import TopographicCompassMap, { DifficultyLevel } from './TopographicCompassMap';
import RealLeafletMap from './RealLeafletMap';

interface StartExplorationScreenProps {
  onBack: () => void;
  userScore: number;
}

export default function StartExplorationScreen({
  onBack,
  userScore: initialUserScore
}: StartExplorationScreenProps) {
  // Navigation & View Mode
  const [mapMode, setMapMode] = useState<'3d_topo' | 'carto_gps'>('3d_topo');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('alpine');
  
  // Live Active Trek State
  const [isLiveTrekActive, setIsLiveTrekActive] = useState<boolean>(false);
  const [trekTimerSec, setTrekTimerSec] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(initialUserScore);

  // Directions Modal
  const [showDirectionsModal, setShowDirectionsModal] = useState<boolean>(false);

  // Checkpoint Reached & 5-Min Break Modal
  const [showBreakModal, setShowBreakModal] = useState<boolean>(false);
  const [breakTimerSec, setBreakTimerSec] = useState<number>(300); // 5 minutes
  const [isPhotoUploaded, setIsPhotoUploaded] = useState<boolean>(false);
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState<boolean>(false);

  // Live Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLiveTrekActive && !isTimerPaused) {
      interval = setInterval(() => {
        setTrekTimerSec((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLiveTrekActive, isTimerPaused]);

  // Break Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (showBreakModal && breakTimerSec > 0) {
      interval = setInterval(() => {
        setBreakTimerSec((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showBreakModal, breakTimerSec]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Difficulty Multiplier Calculations
  const diffMultiplier = {
    casual: 1.3,
    alpine: 1.0,
    speed: 0.75,
    technical: 1.15
  }[difficulty];

  const estimatedDurationFormatted =
    difficulty === 'casual'
      ? '4h 50m'
      : difficulty === 'speed'
      ? '2h 45m'
      : difficulty === 'technical'
      ? '4h 15m'
      : '3h 45m';

  const estimatedCalories = Math.round(1640 * (difficulty === 'speed' ? 1.2 : diffMultiplier));
  const estimatedPace =
    difficulty === 'casual'
      ? '16:10 /km'
      : difficulty === 'speed'
      ? '10:45 /km'
      : difficulty === 'technical'
      ? '14:50 /km'
      : '13:20 /km';

  // Handle Photo Point Upload & Verification
  const handleUploadPhoto = () => {
    setIsVerifyingPhoto(true);
    setTimeout(() => {
      setIsVerifyingPhoto(false);
      setIsPhotoUploaded(true);
      setCurrentScore((prev) => prev + 500);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#f61d57', '#a3e635', '#ffffff']
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1800);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden text-white font-brand select-none">
      
      {/* ============================================================ */}
      {/*  TOP NAVIGATION & SECTOR TELEMETRY HEADER                    */}
      {/* ============================================================ */}
      <header className="flex items-center justify-between py-1.5 px-3 rounded-2xl map-hud-glass border border-white/10 mb-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-white/10 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#f61d57]" />
            <span>Trails Hub</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f61d57] animate-ping" />
            <span className="font-mono-data text-[11px] text-[#f61d57] font-bold tracking-wider">
              SECTOR PACIFIC-NW / CAS-04
            </span>
          </div>

          <div className="hidden md:block border-l border-white/10 pl-3">
            <h1 className="text-sm font-extrabold text-white tracking-wide uppercase">
              Mount Si Trail <span className="text-white/40 text-xs font-normal">· Cascades, Washington</span>
            </h1>
          </div>
        </div>

        {/* View Mode Toggle: 3D Topo vs CARTO GPS */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-black/40 border border-white/15 p-0.5">
            <button
              type="button"
              onClick={() => setMapMode('3d_topo')}
              className={`px-3 py-1 rounded-lg text-xs font-mono-data font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                mapMode === '3d_topo'
                  ? 'bg-gradient-to-r from-[#f61d57] to-[#FFE600] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>3D Topo Compass</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('carto_gps')}
              className={`px-3 py-1 rounded-lg text-xs font-mono-data font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                mapMode === 'carto_gps'
                  ? 'bg-gradient-to-r from-[#f61d57] to-[#FFE600] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>CARTO Voyager</span>
            </button>
          </div>

          {/* User Live Score Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#080407]/92 border border-[#FFE600]/40 text-xs font-mono-data font-bold text-[#FFE600] shadow-lg">
            <Award className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{currentScore} PTS</span>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/*  MAIN SPLIT CONTENT: MAP PANE (TOP/LEFT) & INTEL PANE (RIGHT) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 items-stretch overflow-hidden">
        
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: 3D TOPOGRAPHIC COMPASS MAP & DIFFICULTY (7 COLS) */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-2 h-full min-h-0">
          
          {/* Map Container (~82% of column) */}
          <div className="relative flex-1 w-full min-h-[420px] max-h-[540px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {mapMode === '3d_topo' ? (
              <TopographicCompassMap
                difficulty={difficulty}
                onToggleViewMode={() => setMapMode('carto_gps')}
              />
            ) : (
              <RealLeafletMap
                selectedTrailId="mount_si"
                is3DMode={false}
                mapLayer="voyager"
                onSelectTrail={() => {}}
                onBackToHome={onBack}
                onToggle3D={() => {}}
                onToggleLayer={() => {}}
                activeFilter="All"
                onSelectFilter={() => {}}
              />
            )}
          </div>

          {/* Difficulty Level Chooser directly below the map */}
          <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl map-hud-glass border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-data font-bold text-white/50 uppercase tracking-wider">
                DIFFICULTY MODE:
              </span>
            </div>

            {/* 4 Level Switchers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full sm:w-auto">
              {[
                { id: 'casual', label: 'Casual Explorer', badge: '+30% Time', color: 'border-emerald-500/50 text-emerald-400' },
                { id: 'alpine', label: 'Alpine Pace', badge: 'Standard 1.0x', color: 'border-blue-500/50 text-blue-400' },
                { id: 'speed', label: 'Speed Ascent', badge: '-25% Fast', color: 'border-[#FFE600]/60 text-[#FFE600]' },
                { id: 'technical', label: 'Technical Ridge', badge: '+750 PTS', color: 'border-[#f61d57]/60 text-[#f61d57]' }
              ].map((lvl) => {
                const isActive = difficulty === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDifficulty(lvl.id as DifficultyLevel)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isActive
                        ? 'bg-white/15 border-[#FFE600] text-white shadow-lg ring-1 ring-[#FFE600]/50'
                        : 'bg-black/30 border-white/10 text-white/60 hover:text-white hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-bold block leading-none">{lvl.label}</span>
                    </div>
                    <span className="text-[9px] font-mono-data text-white/45 block mt-0.5">{lvl.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: METRICS, HOURLY WEATHER, PHOTO POINTS (5 COLS) */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-2.5 h-full min-h-0 overflow-y-auto pr-1">
          
          {/* Key Metrics 6-Box Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2.5 rounded-xl map-hud-glass border border-white/10 shadow-lg flex-shrink-0">
            <div className="text-center">
              <span className="text-[9px] font-mono-data text-white/40 block">DISTANCE</span>
              <span className="text-xs font-bold font-mono-data text-white mt-0.5 block">18.0 km</span>
            </div>
            <div className="text-center border-l border-white/10">
              <span className="text-[9px] font-mono-data text-white/40 block">VERT GAIN</span>
              <span className="text-xs font-bold font-mono-data text-[#FFE600] mt-0.5 block">+1,280m</span>
            </div>
            <div className="text-center border-l border-white/10">
              <span className="text-[9px] font-mono-data text-white/40 block">EST DURATION</span>
              <span className="text-xs font-bold font-mono-data text-white mt-0.5 block">{estimatedDurationFormatted}</span>
            </div>
            <div className="text-center border-l border-white/10">
              <span className="text-[9px] font-mono-data text-white/40 block">AVG USER HR</span>
              <span className="text-xs font-bold font-mono-data text-[#f61d57] mt-0.5 flex items-center justify-center gap-0.5">
                <Heart className="w-2.5 h-2.5 fill-[#f61d57]" />
                152 bpm
              </span>
            </div>
            <div className="text-center border-l border-white/10">
              <span className="text-[9px] font-mono-data text-white/40 block">EST STEPS</span>
              <span className="text-xs font-bold font-mono-data text-white mt-0.5 block">14,800</span>
            </div>
            <div className="text-center border-l border-white/10">
              <span className="text-[9px] font-mono-data text-white/40 block">CALORIES</span>
              <span className="text-xs font-bold font-mono-data text-[#FFE600] mt-0.5 block">{estimatedCalories} kcal</span>
            </div>
          </div>

          {/* Hourly Weather Conditions for Trek Duration (4-Hour Chunks) */}
          <div className="p-3 rounded-xl map-hud-glass border border-white/10 shadow-lg flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-[#FFE600]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Trek Duration Hourly Weather
                </span>
              </div>
              <span className="text-[10px] font-mono-data text-white/50">
                Altitude Forecast (Base → Summit)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { hour: 'Hour 1 (Base)', alt: '150m', temp: '18°C', cond: 'Sunny / Mild', rain: '5%', wind: '12 km/h', icon: Sun },
                { hour: 'Hour 2 (Mid)', alt: '790m', temp: '15°C', cond: 'Ridge Breeze', rain: '10%', wind: '18 km/h', icon: CloudSun },
                { hour: 'Hour 3 (Talus)', alt: '1,120m', temp: '11°C', cond: 'Mountain Wind', rain: '25%', wind: '28 km/h', icon: Wind },
                { hour: 'Hour 4 (Peak)', alt: '1,270m', temp: '8°C', cond: 'Alpine Chill', rain: '15%', wind: '36 km/h', icon: CloudRain }
              ].map((w, idx) => {
                const Icon = w.icon;
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-data text-white/60 font-semibold">{w.hour}</span>
                      <Icon className="w-3 h-3 text-[#FFE600]" />
                    </div>
                    <div className="my-1">
                      <span className="text-sm font-bold text-white block leading-tight">{w.temp}</span>
                      <span className="text-[9.5px] text-white/70 block">{w.cond}</span>
                    </div>
                    <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[9px] font-mono-data text-white/50">
                      <span>Rain: <strong className="text-white/80">{w.rain}</strong></span>
                      <span>Wind: <strong className="text-white/80">{w.wind}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* USP PHOTO POINTS CHALLENGE SHOWCASE */}
          <div className="p-3 rounded-xl map-hud-glass border border-[#a3e635]/30 bg-gradient-to-r from-[#a3e635]/10 via-transparent to-transparent shadow-lg flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#a3e635] text-black flex items-center justify-center font-bold">
                  <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    USP: Scenic Photo Points
                    <span className="px-1.5 py-0.2 rounded bg-[#a3e635]/20 text-[#a3e635] text-[9px] font-mono-data font-bold">
                      VERIFIED REWARDS
                    </span>
                  </h3>
                  <p className="text-[10px] text-white/60">
                    Snap & upload scenic vistas to earn +500 PTS and verified summit recognition.
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Preview Card */}
            <div className="relative rounded-lg overflow-hidden border border-white/20 h-28 group">
              <img
                src="/images/photopoint_mount_si.jpg"
                alt="Scenic Mount Si Photo Point"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                <span className="text-[11px] font-bold text-white tracking-wide">
                  Eagle Crest Overlook (Photo Point 1)
                </span>
                <span className="text-[9.5px] text-white/70 font-mono-data flex items-center gap-2 mt-0.5">
                  <span>Target Angle: 215° SW facing Mt. Rainier</span>
                  <span className="text-[#a3e635] font-bold">+350 PTS</span>
                </span>
              </div>
            </div>
          </div>

          {/* Community Climber Reviews (Generated with OpenRouter DeepSeek) */}
          <div className="p-3 rounded-xl map-hud-glass border border-white/10 shadow-lg flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Verified Climber Reviews
              </span>
              <div className="flex items-center gap-1 text-[11px] text-[#FFE600] font-bold">
                <Star className="w-3 h-3 fill-[#FFE600]" />
                <span>4.9 / 5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Review 1 */}
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex items-start gap-2">
                <img
                  src="/images/avatar_emma.jpg"
                  alt="Emma Carter"
                  className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">Emma Carter</span>
                    <span className="text-[9px] font-mono-data text-[#a3e635]">Trailblazer</span>
                  </div>
                  <p className="text-[9.5px] text-white/70 mt-0.5 line-clamp-2">
                    "Mount Si offers an epic climb with panoramic views of the Snoqualmie Valley. Photo point at the ridge was unbeatable at sunrise!"
                  </p>
                </div>
              </div>

              {/* Review 2 */}
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 flex items-start gap-2">
                <img
                  src="/images/avatar_jason.jpg"
                  alt="Jason Miller"
                  className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">Jason Miller</span>
                    <span className="text-[9px] font-mono-data text-[#FFE600]">Peakbagger</span>
                  </div>
                  <p className="text-[9.5px] text-white/70 mt-0.5 line-clamp-2">
                    "Steep and well-maintained. The new Photo Point challenge makes pacing fun. Bring layers for the breezy haystack summit!"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row: START EXPEDITION Button or LIVE TREK HUD */}
          <div className="pt-1 flex-shrink-0">
            {!isLiveTrekActive ? (
              <button
                type="button"
                onClick={() => setIsLiveTrekActive(true)}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#f61d57] via-[#ff456e] to-[#FFE600] text-black font-extrabold text-sm tracking-wider uppercase flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(246,29,87,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Navigation className="w-4 h-4 fill-black" />
                <span>Start Expedition ({difficulty.toUpperCase()} MODE)</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              /* ACTIVE LIVE TREK HUD */
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#0d0710] to-[#160a14] border border-[#f61d57] shadow-[0_0_30px_rgba(246,29,87,0.4)] flex flex-col gap-2 anim-slide-down">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f61d57] animate-ping" />
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono-data">
                      EXPEDITION LIVE · {formatTime(trekTimerSec)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsTimerPaused(!isTimerPaused)}
                      className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
                      title={isTimerPaused ? 'Resume Trek' : 'Pause Trek'}
                    >
                      {isTimerPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLiveTrekActive(false)}
                      className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white/70 text-[10px] cursor-pointer"
                    >
                      End
                    </button>
                  </div>
                </div>

                {/* Milestone Target & Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
                  <div>
                    <span className="text-[10px] font-mono-data text-white/50 block">NEXT TARGET</span>
                    <span className="text-xs font-bold text-[#FFE600] flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#a3e635]" />
                      Eagle Crest Vista · 14m remaining
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDirectionsModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer shadow-md"
                    >
                      <Navigation className="w-3 h-3 text-[#f61d57]" />
                      <span>Directions</span>
                    </button>

                    {/* Simulate Reaching Point X */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowBreakModal(true);
                        setBreakTimerSec(300);
                        setIsPhotoUploaded(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#a3e635] hover:bg-[#bef264] text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                      title="Simulate reaching Checkpoint / Photo Point"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Reached Point X!</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/*  MODAL 1: STEP-BY-STEP DIRECTIONS OVERLAY                    */}
      {/* ============================================================ */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 anim-fade-in">
          <div className="w-full max-w-lg map-hud-glass rounded-2xl border border-white/20 p-5 shadow-2xl relative flex flex-col justify-between anim-slide-down">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#f61d57]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Trail Directions & Compass Bearings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDirectionsModal(false)}
                className="p-1 text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {[
                { step: '1', text: 'Depart Mount Si Trailhead North toward switchbacks.', dist: '0.0 km', bearing: '018° NNE' },
                { step: '2', text: 'Cross wooden bridge over Snoqualmie runoff stream.', dist: '1.2 km', bearing: '045° NE' },
                { step: '3', text: 'Approach Snag Flat Boardwalk Checkpoint. Refill water if needed.', dist: '3.4 km', bearing: '350° N' },
                { step: '4', text: 'USP PHOTO POINT 1: Reach Eagle Crest Overlook. Face 215° SW for verified photo.', dist: '5.1 km', bearing: '215° SW' },
                { step: '5', text: 'Ascend Talus Boulder Field. Follow painted yellow rock markers.', dist: '6.8 km', bearing: '010° N' },
                { step: '6', text: 'Final scramble to Haystack Rock Summit (Elevation 1,270m).', dist: '8.2 km', bearing: '005° N' }
              ].map((s) => (
                <div key={s.step} className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {s.step}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-white/90 leading-snug">{s.text}</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono-data text-white/50 mt-1">
                      <span>{s.dist}</span>
                      <span>Bearing: <strong className="text-[#FFE600]">{s.bearing}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowDirectionsModal(false)}
              className="mt-3 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
            >
              Close Directions
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  MODAL 2: 5-MIN BREAK & PHOTO POINT VERIFICATION SYSTEM      */}
      {/* ============================================================ */}
      {showBreakModal && (
        <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 anim-fade-in">
          <div className="w-full max-w-md rounded-2xl map-hud-glass border border-[#a3e635]/50 p-6 shadow-[0_0_60px_rgba(163,230,53,0.3)] relative anim-slide-down text-center">
            
            <button
              type="button"
              onClick={() => setShowBreakModal(false)}
              className="absolute top-4 right-4 p-1 text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Checkpoint Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#a3e635]/20 border border-[#a3e635] text-[#a3e635] flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Camera className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="text-lg font-extrabold text-white uppercase tracking-wider">
              Eagle Crest Photo Point Reached!
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Mandatory 5-minute break started. Hydrate, recover, and take your scenic vista photo.
            </p>

            {/* 5-Minute Break Countdown Timer */}
            <div className="my-5 p-4 rounded-xl bg-black/50 border border-white/10">
              <span className="text-[10px] font-mono-data text-white/40 uppercase tracking-widest block mb-1">
                REST & RECOVERY TIMER
              </span>
              <div className="text-4xl font-extrabold font-mono-data text-[#FFE600]">
                {formatTime(breakTimerSec)}
              </div>
              <span className="text-[10px] font-mono-data text-emerald-400 mt-1 block">
                Target Heart Rate: Slow down to &lt;120 bpm
              </span>
            </div>

            {/* Photo Upload & Verification Box */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/15 text-left mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
                  Photo Point Challenge
                </span>
                <span className="text-xs font-bold font-mono-data text-[#FFE600]">+500 PTS</span>
              </div>

              {!isPhotoUploaded ? (
                <div>
                  <p className="text-[11px] text-white/70 mb-3">
                    Upload your landscape photo of Mount Rainier from Eagle Crest to verify this waypoint.
                  </p>
                  <button
                    type="button"
                    disabled={isVerifyingPhoto}
                    onClick={handleUploadPhoto}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#a3e635] hover:bg-[#bef264] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isVerifyingPhoto ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>AI Scanning Vista Horizon...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Snap / Upload View Photo</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block">
                      Scenic Alignment: 98% · Vista Verified!
                    </span>
                    <span className="text-[10px] text-white/80 font-mono-data">
                      +500 Points added to your AltiPulse summit score!
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowBreakModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
            >
              Resume Trekking
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
