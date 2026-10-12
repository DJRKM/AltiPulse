'use client';

import StartExplorationScreen from './StartExplorationScreen';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Compass,
  Layers,
  MapPin,
  Mountain,
  Zap,
  Navigation,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Heart,
  Flame,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Crosshair,
  Search,
  Filter
} from 'lucide-react';

/* Dynamic import for Leaflet to ensure 100% client-side SSR safety */
const RealLeafletMap = dynamic(() => import('@/components/RealLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#070306] rounded-2xl border border-white/10 text-white/50 font-mono-data text-xs gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#f61d57] border-t-transparent animate-spin" />
      <span className="tracking-widest uppercase text-[#FFE600] text-[11px]">INITIALIZING SATELLITE GPS RADAR...</span>
    </div>
  )
});

/* ============================================================ */
/*  TRAIL DATA MODEL FOR CAROUSEL & ELEVATION HUD               */
/* ============================================================ */
export interface TrailData {
  id: string;
  name: string;
  region: string;
  country: string;
  category: string;
  difficulty: 'Moderate' | 'Hard' | 'Extreme';
  difficultyColor: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  elevationGainM: number;
  peakAltitudeM: number;
  startAltitudeM: number;
  estDuration: string;
  estPaceMinPerKm: string;
  caloricBurn: number;
  avgGrade: string;
  maxGrade: string;
  image: string;
  gpsCoords: string;
  sectorTag: string;
  // Elevation points along distance (dist in km, alt in meters, grade in %, hr in bpm)
  elevationProfile: { dist: number; alt: number; grade: string; hr: number }[];
  waypoints: { name: string; dist: string; alt: string }[];
}

export const TRAILS: TrailData[] = [
  {
    id: 'mount_si',
    name: 'Mount Si Trail',
    region: 'Cascades, Washington',
    country: 'USA',
    category: 'Alpine Ridge',
    difficulty: 'Hard',
    difficultyColor: '#f61d57',
    rating: 5.0,
    reviewsCount: 791,
    distanceKm: 18.0,
    elevationGainM: 1280,
    peakAltitudeM: 1270,
    startAltitudeM: 150,
    estDuration: '4h 15m',
    estPaceMinPerKm: '14:10',
    caloricBurn: 1640,
    avgGrade: '14.2%',
    maxGrade: '28.5%',
    image: '/trails/mount_si.jpg',
    gpsCoords: '47.4880° N, 121.7230° W',
    sectorTag: 'SECTOR PACIFIC-NW / CAS-04',
    elevationProfile: [
      { dist: 0, alt: 150, grade: '4%', hr: 112 },
      { dist: 2.8, alt: 380, grade: '12%', hr: 138 },
      { dist: 6.2, alt: 710, grade: '16%', hr: 154 },
      { dist: 10.4, alt: 960, grade: '19%', hr: 162 },
      { dist: 14.6, alt: 1180, grade: '24%', hr: 168 },
      { dist: 18.0, alt: 1270, grade: '28%', hr: 175 }
    ],
    waypoints: [
      { name: 'Lower Trailhead', dist: '0.0 km', alt: '150 m' },
      { name: 'Snag Flats Boardwalk', dist: '7.2 km', alt: '790 m' },
      { name: 'Boulder Crest', dist: '14.6 km', alt: '1,180 m' },
      { name: 'Haystack Summit', dist: '18.0 km', alt: '1,270 m' }
    ]
  },
  {
    id: 'odenwald',
    name: 'Odenwald High Ridge',
    region: 'Heidelberg & Mannheim',
    country: 'Germany',
    category: 'Local Alpine',
    difficulty: 'Moderate',
    difficultyColor: '#FFE600',
    rating: 4.9,
    reviewsCount: 1240,
    distanceKm: 12.4,
    elevationGainM: 560,
    peakAltitudeM: 568,
    startAltitudeM: 112,
    estDuration: '2h 45m',
    estPaceMinPerKm: '13:20',
    caloricBurn: 920,
    avgGrade: '9.1%',
    maxGrade: '18.2%',
    image: '/trails/odenwald.jpg',
    gpsCoords: '49.4075° N, 8.7180° E',
    sectorTag: 'SECTOR RHINE-NECKAR / GER-01',
    elevationProfile: [
      { dist: 0, alt: 112, grade: '3%', hr: 104 },
      { dist: 2.5, alt: 220, grade: '7%', hr: 124 },
      { dist: 5.8, alt: 390, grade: '11%', hr: 142 },
      { dist: 9.0, alt: 495, grade: '14%', hr: 151 },
      { dist: 12.4, alt: 568, grade: '18%', hr: 158 }
    ],
    waypoints: [
      { name: 'Neckar Valley', dist: '0.0 km', alt: '112 m' },
      { name: 'Dilsberg Castle View', dist: '5.8 km', alt: '390 m' },
      { name: 'Königstuhl Summit', dist: '12.4 km', alt: '568 m' }
    ]
  },
  {
    id: 'rainier',
    name: 'Disappointment Cleaver',
    region: 'Mt. Rainier National Park',
    country: 'USA',
    category: 'Glacial Summit',
    difficulty: 'Extreme',
    difficultyColor: '#ff2a5f',
    rating: 4.9,
    reviewsCount: 482,
    distanceKm: 14.8,
    elevationGainM: 2750,
    peakAltitudeM: 4392,
    startAltitudeM: 1640,
    estDuration: '10h 15m',
    estPaceMinPerKm: '41:30',
    caloricBurn: 3480,
    avgGrade: '22.4%',
    maxGrade: '38.0%',
    image: '/trails/rainier.jpg',
    gpsCoords: '46.8523° N, 121.7603° W',
    sectorTag: 'SECTOR VOLCANO-CREST / RAN-09',
    elevationProfile: [
      { dist: 0, alt: 1640, grade: '8%', hr: 120 },
      { dist: 4.2, alt: 2420, grade: '17%', hr: 152 },
      { dist: 8.0, alt: 3105, grade: '23%', hr: 164 },
      { dist: 11.5, alt: 3780, grade: '31%', hr: 172 },
      { dist: 14.8, alt: 4392, grade: '38%', hr: 178 }
    ],
    waypoints: [
      { name: 'Paradise Lodge', dist: '0.0 km', alt: '1,640 m' },
      { name: 'Pebble Creek', dist: '4.2 km', alt: '2,420 m' },
      { name: 'Camp Muir High Camp', dist: '8.0 km', alt: '3,105 m' },
      { name: 'The Cleaver Rock Spine', dist: '11.5 km', alt: '3,780 m' },
      { name: 'Columbia Crest Crater', dist: '14.8 km', alt: '4,392 m' }
    ]
  },
  {
    id: 'lake_22',
    name: 'Lake 22 Alpine Loop',
    region: 'Snoqualmie Wilderness',
    country: 'USA',
    category: 'Glacial Cirque',
    difficulty: 'Moderate',
    difficultyColor: '#FFE600',
    rating: 4.9,
    reviewsCount: 2150,
    distanceKm: 9.3,
    elevationGainM: 610,
    peakAltitudeM: 730,
    startAltitudeM: 120,
    estDuration: '3h 10m',
    estPaceMinPerKm: '20:25',
    caloricBurn: 1040,
    avgGrade: '11.5%',
    maxGrade: '21.0%',
    image: '/trails/lake_22.jpg',
    gpsCoords: '48.0652° N, 121.7580° W',
    sectorTag: 'SECTOR CASCADE-RIVER / LK-22',
    elevationProfile: [
      { dist: 0, alt: 120, grade: '5%', hr: 108 },
      { dist: 2.2, alt: 270, grade: '10%', hr: 130 },
      { dist: 5.0, alt: 490, grade: '14%', hr: 146 },
      { dist: 7.2, alt: 660, grade: '18%', hr: 156 },
      { dist: 9.3, alt: 730, grade: '21%', hr: 162 }
    ],
    waypoints: [
      { name: 'Rainforest Entry', dist: '0.0 km', alt: '120 m' },
      { name: 'Talus Slope Switchbacks', dist: '5.0 km', alt: '490 m' },
      { name: 'Alpine Cirque Rim', dist: '9.3 km', alt: '730 m' }
    ]
  }
];

interface StartHikeCockpitProps {
  initialTrailId?: string;
  onBackToHome: () => void;
  userScore: number;
}

export default function StartHikeCockpit({
  initialTrailId = 'mount_si',
  onBackToHome,
  userScore
}: StartHikeCockpitProps) {
  /* ---- Selected Trail State ---- */
  const [selectedTrailId, setSelectedTrailId] = useState<string>(initialTrailId);
  const activeTrail = TRAILS.find((t) => t.id === selectedTrailId) || TRAILS[0];

  /* ---- Map Controls State ---- */
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [mapLayer, setMapLayer] = useState<'voyager' | 'satellite' | 'topo' | 'tactical'>('voyager');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  /* ---- Chart Hover State ---- */
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  /* ---- Active Expedition Simulation Modal State ---- */
  const [isExplorationOpen, setIsExplorationOpen] = useState<boolean>(false);
  const [isExpeditionActive, setIsExpeditionActive] = useState<boolean>(false);
  const [expeditionTimer, setExpeditionTimer] = useState<number>(0);
  const [isExpeditionPaused, setIsExpeditionPaused] = useState<boolean>(false);
  const [currentHeartRate, setCurrentHeartRate] = useState<number>(142);
  const [distanceClimbed, setDistanceClimbed] = useState<number>(0.4);
  const [vertGained, setVertGained] = useState<number>(45);

  const carouselRef = useRef<HTMLDivElement | null>(null);

  /* Filter trails based on category & search */
  const filteredTrails = TRAILS.filter((t) => {
    const matchesFilter = activeFilter === 'All' || t.category === activeFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  /* Timer for active expedition */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isExpeditionActive && !isExpeditionPaused) {
      interval = setInterval(() => {
        setExpeditionTimer((prev) => prev + 1);
        setDistanceClimbed((prev) => +(prev + 0.005).toFixed(3));
        setVertGained((prev) => Math.round(prev + (Math.random() > 0.4 ? 1 : 0)));
        setCurrentHeartRate((prev) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          return Math.min(178, Math.max(130, prev + delta));
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExpeditionActive, isExpeditionPaused]);

  /* Format seconds to HH:MM:SS */
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  /* Carousel scroll helpers */
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  /* SVG Elevation Path Generator */
  const width = 520;
  const height = 110;
  const paddingX = 35;
  const paddingY = 18;

  const minAlt = Math.min(...activeTrail.elevationProfile.map((p) => p.alt));
  const maxAlt = Math.max(...activeTrail.elevationProfile.map((p) => p.alt));
  const maxDist = activeTrail.distanceKm;

  const points = activeTrail.elevationProfile.map((pt) => {
    const x = paddingX + (pt.dist / maxDist) * (width - paddingX * 2);
    const y =
      height -
      paddingY -
      ((pt.alt - minAlt) / (maxAlt - minAlt || 1)) * (height - paddingY * 2);
    return { x, y, pt };
  });

  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - 4} L ${points[0].x},${height - 4} Z`;

  if (isExplorationOpen) {
    return (
      <StartExplorationScreen
        onBack={() => setIsExplorationOpen(false)}
        userScore={userScore}
      />
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden text-white font-brand">
      
      {/* ============================================================ */}
      {/*  PANE 1: REAL OPEN-SOURCE LEAFLET MAP WITH GPS TRACKS (~54%) */}
      {/* ============================================================ */}
      <section className="relative w-full h-[54vh] min-h-[340px] max-h-[460px] rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
        <RealLeafletMap
          selectedTrailId={selectedTrailId}
          is3DMode={is3DMode}
          mapLayer={mapLayer}
          onSelectTrail={(id) => setSelectedTrailId(id)}
          onBackToHome={onBackToHome}
          onToggle3D={() => setIs3DMode(!is3DMode)}
          onToggleLayer={() => {
            if (mapLayer === 'voyager') setMapLayer('satellite');
            else if (mapLayer === 'satellite') setMapLayer('topo');
            else if (mapLayer === 'topo') setMapLayer('tactical');
            else setMapLayer('voyager');
          }}
          activeFilter={activeFilter}
          onSelectFilter={(cat) => setActiveFilter(cat)}
        />
      </section>

      {/* ============================================================ */}
      {/*  PANE 2: CURATED TRAIL DOCK & ELEVATION HUD (LOWER ~44%)      */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mt-3 flex-1 min-h-[260px] max-h-[340px] items-stretch">
        
        {/* ------------------------------------------------------------ */}
        {/* LEFT SUB-PANE: HORIZONTAL TRAIL CAROUSEL (6 Cols)            */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-6 flex flex-col justify-between laptop-card-glass p-3 sm:p-4 rounded-2xl border border-white/10 relative overflow-hidden">
          
          {/* Header Row: Title & Arrow Nav */}
          <div className="flex items-center justify-between mb-2 px-1 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-data text-white/50 uppercase tracking-wider">Curated Trails</span>
              <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-[#f61d57]/20 text-[#f61d57] border border-[#f61d57]/30">
                {filteredTrails.length} ROUTES
              </span>
            </div>
            
            {/* Scroll Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="p-1.5 rounded-full liquid-glass-button text-white/70 hover:text-white cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="p-1.5 rounded-full liquid-glass-button text-white/70 hover:text-white cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Trail Cards Container */}
          <div
            ref={carouselRef}
            className="flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory flex-1"
          >
            {filteredTrails.map((trail) => {
              const isSelected = trail.id === selectedTrailId;
              return (
                <div
                  key={trail.id}
                  onClick={() => setSelectedTrailId(trail.id)}
                  className={`min-w-[240px] sm:min-w-[270px] max-w-[290px] rounded-xl overflow-hidden cursor-pointer snap-start flex flex-col justify-between p-3 relative group transition-all duration-300 ${
                    isSelected
                      ? 'trail-card-selected'
                      : 'trail-card-interactive'
                  }`}
                >
                  {/* Card Thumbnail Image with Neon GPS Route Line */}
                  <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                    <img
                      src={trail.image}
                      alt={trail.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                    
                    {/* Difficulty Pill */}
                    <div className="absolute top-2 left-2">
                      <span
                        className="px-2 py-0.5 rounded-md text-[9px] font-mono-data font-bold uppercase tracking-wider shadow-md"
                        style={{
                          backgroundColor: `${trail.difficultyColor}28`,
                          color: trail.difficultyColor,
                          border: `1px solid ${trail.difficultyColor}60`
                        }}
                      >
                        {trail.difficulty}
                      </span>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono-data text-white flex items-center gap-1 border border-white/10">
                      <span className="text-[#FFE600]">★</span>
                      <span>{trail.rating.toFixed(1)}</span>
                    </div>

                    {/* Bottom Title inside Image */}
                    <div className="absolute bottom-1.5 left-2 right-2">
                      <h4 className="text-xs font-bold text-white truncate leading-snug drop-shadow-md">
                        {trail.name}
                      </h4>
                      <p className="text-[10px] text-white/70 truncate">{trail.region}</p>
                    </div>
                  </div>

                  {/* Card Stats Row */}
                  <div className="mt-2.5 pt-2 border-t border-white/8 flex items-center justify-between text-[11px] font-mono-data">
                    <div>
                      <span className="text-white/40 block text-[9px]">DIST</span>
                      <span className="text-white font-semibold">{trail.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px]">VERT</span>
                      <span className="text-[#FFE600] font-semibold">+{trail.elevationGainM}m</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[9px]">EST TIME</span>
                      <span className="text-white font-semibold">{trail.estDuration}</span>
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#f61d57] flex items-center justify-center shadow-[0_0_10px_rgba(246,29,87,0.8)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT SUB-PANE: DYNAMIC ELEVATION PROFILE HUD & CTA (6 Cols) */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-6 elevation-hud-panel p-3.5 sm:p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          
          {/* Elevation HUD Header: Selected Trail Telemetry */}
          <div className="flex items-center justify-between flex-shrink-0 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">{activeTrail.name}</span>
                <span className="text-[11px] font-mono-data font-semibold px-2 py-0.5 rounded bg-white/10 text-[#FFE600]">
                  Elev Profile
                </span>
              </div>
              <p className="text-[11px] text-white/60 font-mono-data mt-0.5">
                Base {activeTrail.startAltitudeM}m → Summit {activeTrail.peakAltitudeM}m (Ascent +{activeTrail.elevationGainM}m)
              </p>
            </div>

            <div className="flex items-center gap-3.5 text-right">
              <div>
                <span className="text-[10px] font-mono-data font-semibold text-white/50 block tracking-wider">PACE / KM</span>
                <span className="text-sm font-mono-data font-bold text-white">{activeTrail.estPaceMinPerKm}</span>
              </div>
              <div className="border-l border-white/10 pl-3.5">
                <span className="text-[10px] font-mono-data font-semibold text-white/50 block tracking-wider">AVG USER HR</span>
                <span className="text-sm font-mono-data font-bold text-[#f61d57] flex items-center gap-1.5 justify-end">
                  <Heart className="w-3.5 h-3.5 fill-[#f61d57]" />
                  {Math.round(activeTrail.elevationProfile.reduce((acc, p) => acc + p.hr, 0) / activeTrail.elevationProfile.length)} bpm
                </span>
              </div>
              <div className="border-l border-white/10 pl-3.5">
                <span className="text-[10px] font-mono-data font-semibold text-white/50 block tracking-wider">CALORIC BURN</span>
                <span className="text-sm font-mono-data font-bold text-[#FFE600]">{activeTrail.caloricBurn} kcal</span>
              </div>
            </div>
          </div>

          {/* Dynamic SVG Elevation Profile Chart */}
          <div className="relative w-full h-[95px] my-1 flex items-center justify-center group">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
            >
              <defs>
                {/* Area Gradient */}
                <linearGradient id="elevationAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f61d57" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#ff6b00" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                </linearGradient>

                {/* Line Gradient */}
                <linearGradient id="elevationLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff456e" />
                  <stop offset="60%" stopColor="#f61d57" />
                  <stop offset="100%" stopColor="#FFE600" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={height - 25} x2={width - paddingX} y2={height - 25} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={paddingX} y1={height - 60} x2={width - paddingX} y2={height - 60} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={paddingX} y1={height - 95} x2={width - paddingX} y2={height - 95} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />

              {/* Shaded Area Fill under Profile Curve */}
              <path d={areaD} fill="url(#elevationAreaGrad)" />

              {/* Glowing Elevation Curve Line */}
              <path
                d={pathD}
                fill="none"
                stroke="url(#elevationLineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px rgba(246, 29, 87, 0.7))' }}
              />

              {/* Key Elevation Waypoint Dots */}
              {points.map((p, idx) => {
                const activeIdx = hoveredPointIndex !== null ? hoveredPointIndex : 2;
                const isHovered = activeIdx === idx;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  >
                    {isHovered && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={9}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeOpacity="0.45"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6 : 4}
                      fill={idx === points.length - 1 ? '#FFE600' : '#f61d57'}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2 : 1.5}
                      className="transition-all duration-200"
                    />
                    {/* Distance Marker Label at bottom */}
                    <text
                      x={p.x}
                      y={height + 5}
                      textAnchor="middle"
                      fill={isHovered ? '#ffffff' : 'rgba(255,255,255,0.7)'}
                      fontSize="11"
                      fontWeight={isHovered ? '700' : '600'}
                      fontFamily="monospace"
                    >
                      {p.pt.dist}k
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Fixed Telemetry Text Box (Positioned at Top-Left like Image 3, Always Visible & Legible) */}
            {(() => {
              const activeIdx = hoveredPointIndex !== null ? hoveredPointIndex : 2;
              const pointData = activeTrail.elevationProfile[activeIdx] || activeTrail.elevationProfile[0];
              return (
                <div
                  className="absolute -top-7 left-1.5 map-hud-glass px-3 py-1.5 rounded-lg text-xs font-mono-data text-white pointer-events-none shadow-xl border border-[#f61d57]/50 flex items-center gap-2.5 z-20 transition-all duration-150"
                >
                  <span className="text-[#FFE600] font-bold text-xs">
                    {pointData.alt}m
                  </span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/90 text-xs font-semibold">
                    Grade {pointData.grade}
                  </span>
                  <span className="text-white/40">·</span>
                  <span className="text-[#f61d57] flex items-center gap-1.5 font-mono-data text-xs">
                    <Heart className="w-3 h-3 fill-current animate-pulse text-[#f61d57]" />
                    <span>Avg HR: <strong className="text-white font-bold">{pointData.hr} bpm</strong> <span className="text-white/50 text-[10px] font-normal">(from previous users)</span></span>
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Action Row: Biometric Readiness + START EXPEDITION Liquid Crimson Button */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 flex-shrink-0">
            
            {/* Biometrics Pacing Forecast Pill */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f61d57]/30 to-[#FFE600]/20 flex items-center justify-center border border-[#FFE600]/30 flex-shrink-0">
                <Zap className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white leading-tight">
                  Biometric Score {userScore} Sync
                </p>
                <p className="text-[10px] text-white/50 font-mono-data">
                  Avg User HR: {Math.round(activeTrail.elevationProfile.reduce((acc, p) => acc + p.hr, 0) / activeTrail.elevationProfile.length)} bpm (calculated from {activeTrail.reviewsCount.toLocaleString()} previous users)
                </p>
              </div>
            </div>

            {/* START EXPEDITION Primary Action Button (Liquid Glass Crimson) */}
            <button
              type="button"
              onClick={() => setIsExplorationOpen(true)}
              className="py-2.5 px-5 sm:px-6 rounded-xl liquid-glass-crimson text-white font-extrabold text-xs tracking-wider uppercase flex items-center gap-2.5 cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0 group"
            >
              <Navigation className="w-4 h-4 fill-white group-hover:rotate-12 transition-transform" />
              <span className="font-brand tracking-widest">Start Expedition</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/*  EXPEDITION ACTIVE LIVE TRACKING MODAL HUD                   */}
      {/* ============================================================ */}
      {isExpeditionActive && (
        <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 anim-fade-in">
          <div className="w-full max-w-2xl laptop-card-glass rounded-3xl border border-[#f61d57]/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(246,29,87,0.35)] relative flex flex-col justify-between anim-slide-down">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#f61d57] animate-ping" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wider">
                      EXPEDITION ACTIVE
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-[#f61d57]/20 text-[#f61d57] text-[10px] font-mono-data font-bold border border-[#f61d57]/40">
                      LIVE GPS
                    </span>
                  </div>
                  <p className="text-xs text-white/50 font-mono-data mt-0.5">
                    {activeTrail.name} · {activeTrail.gpsCoords}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExpeditionActive(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                title="Close Live Tracking"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Central Giant Timer & Live Telemetry Grid */}
            <div className="py-6 text-center">
              <span className="text-[11px] font-mono-data text-white/40 uppercase tracking-widest block mb-1">
                ELAPSED EXPEDITION TIME
              </span>
              <div className="text-5xl sm:text-6xl font-extrabold font-mono-data text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 tracking-tight">
                {formatTime(expeditionTimer)}
              </div>

              {/* 4 Telemetry Dials */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="widget-box p-3 text-center">
                  <span className="text-[10px] font-mono-data text-white/40 block">DISTANCE</span>
                  <span className="text-xl font-bold font-mono-data text-white mt-1 block">
                    {distanceClimbed.toFixed(2)} km
                  </span>
                  <span className="text-[9px] text-white/40 font-mono-data">of {activeTrail.distanceKm} km</span>
                </div>

                <div className="widget-box p-3 text-center">
                  <span className="text-[10px] font-mono-data text-white/40 block">VERT CLIMB</span>
                  <span className="text-xl font-bold font-mono-data text-[#FFE600] mt-1 block">
                    +{vertGained} m
                  </span>
                  <span className="text-[9px] text-white/40 font-mono-data">of {activeTrail.elevationGainM} m</span>
                </div>

                <div className="widget-box p-3 text-center">
                  <span className="text-[10px] font-mono-data text-white/40 block">HEART RATE</span>
                  <span className="text-xl font-bold font-mono-data text-[#f61d57] mt-1 flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 fill-[#f61d57] animate-pulse" />
                    {currentHeartRate}
                  </span>
                  <span className="text-[9px] text-white/40 font-mono-data">Zone 3 Aerobic</span>
                </div>

                <div className="widget-box p-3 text-center">
                  <span className="text-[10px] font-mono-data text-white/40 block">PACE</span>
                  <span className="text-xl font-bold font-mono-data text-white mt-1 block">
                    {activeTrail.estPaceMinPerKm}
                  </span>
                  <span className="text-[9px] text-white/40 font-mono-data">Target On-Track</span>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setIsExpeditionPaused(!isExpeditionPaused)}
                className="py-2.5 px-5 rounded-xl liquid-glass-button text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
              >
                {isExpeditionPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{isExpeditionPaused ? 'Resume Hike' : 'Pause Hike'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsExpeditionActive(false);
                  setExpeditionTimer(0);
                }}
                className="py-2.5 px-6 rounded-xl liquid-glass-crimson text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish & Sync Summit</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
