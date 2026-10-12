'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  Layers,
  Crosshair,
  ChevronLeft,
  Mountain,
  Plus,
  Minus,
  Info,
  MapPin,
  Navigation
} from 'lucide-react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';

export interface RealMapTrail {
  id: string;
  name: string;
  region: string;
  sectorTag: string;
  startAltitudeM: number;
  peakAltitudeM: number;
  elevationGainM: number;
  maxGrade: string;
  category: string;
  bounds: [[number, number], [number, number]];
  center: [number, number];
  zoom: number;
  routeCoordinates: [number, number][];
  waypoints: { name: string; coord: [number, number]; alt: string; type: 'start' | 'mid' | 'summit' }[];
}

export const REAL_MAP_TRAILS: RealMapTrail[] = [
  {
    id: 'mount_si',
    name: 'Mount Si Trail',
    region: 'Cascades, Washington',
    sectorTag: 'SECTOR PACIFIC-NW / CAS-04',
    startAltitudeM: 150,
    peakAltitudeM: 1270,
    elevationGainM: 1280,
    maxGrade: '28.5%',
    category: 'Alpine Ridge',
    bounds: [[47.485, -121.745], [47.512, -121.718]],
    center: [47.498, -121.731],
    zoom: 14,
    routeCoordinates: [
      [47.4881, -121.7231], // Mt Si Trailhead (150m)
      [47.4892, -121.7242],
      [47.4905, -121.7258],
      [47.4916, -121.7245],
      [47.4928, -121.7262],
      [47.4939, -121.7248],
      [47.4950, -121.7271],
      [47.4965, -121.7289],
      [47.4978, -121.7275],
      [47.4990, -121.7310],
      [47.5002, -121.7335], // Snag Flat Boardwalk (790m)
      [47.5015, -121.7350],
      [47.5028, -121.7338],
      [47.5042, -121.7365],
      [47.5055, -121.7375],
      [47.5065, -121.7385], // Talus Field
      [47.5074, -121.7392],
      [47.5078, -121.7397]  // Haystack Rock Summit (1,270m)
    ],
    waypoints: [
      { name: 'Mt Si Trailhead', coord: [47.4881, -121.7231], alt: '150m', type: 'start' },
      { name: 'Snag Flat Boardwalk', coord: [47.5002, -121.7335], alt: '790m', type: 'mid' },
      { name: 'Haystack Rock Summit', coord: [47.5078, -121.7397], alt: '1,270m', type: 'summit' }
    ]
  },
  {
    id: 'odenwald',
    name: 'Odenwald High Ridge',
    region: 'Heidelberg & Mannheim',
    sectorTag: 'SECTOR RHINE-NECKAR / GER-01',
    startAltitudeM: 112,
    peakAltitudeM: 568,
    elevationGainM: 560,
    maxGrade: '18.2%',
    category: 'Local Alpine',
    bounds: [[49.398, 8.705], [49.416, 8.736]],
    center: [49.406, 8.721],
    zoom: 14,
    routeCoordinates: [
      [49.4125, 8.7090], // Neckar Valley Old Town (112m)
      [49.4118, 8.7115],
      [49.4108, 8.7142],
      [49.4105, 8.7153], // Heidelberg Castle View (390m)
      [49.4095, 8.7165],
      [49.4082, 8.7178],
      [49.4072, 8.7188], // Molkenkur Station
      [49.4062, 8.7200],
      [49.4052, 8.7218],
      [49.4045, 8.7230], // Felsenmeer Boulder Path
      [49.4035, 8.7245],
      [49.4025, 8.7262],
      [49.4018, 8.7278],
      [49.4014, 8.7291], // Königstuhl Summit (568m)
      [49.4005, 8.7312],
      [49.3985, 8.7340]  // Posseltslust Tower Crest
    ],
    waypoints: [
      { name: 'Neckar Valley', coord: [49.4125, 8.7090], alt: '112m', type: 'start' },
      { name: 'Heidelberg Castle View', coord: [49.4105, 8.7153], alt: '390m', type: 'mid' },
      { name: 'Königstuhl Summit', coord: [49.4014, 8.7291], alt: '568m', type: 'summit' }
    ]
  },
  {
    id: 'rainier',
    name: 'Disappointment Cleaver',
    region: 'Mt. Rainier National Park',
    sectorTag: 'SECTOR VOLCANO-CREST / RAN-09',
    startAltitudeM: 1640,
    peakAltitudeM: 4392,
    elevationGainM: 2750,
    maxGrade: '38.0%',
    category: 'Glacial Summit',
    bounds: [[46.780, -121.770], [46.860, -121.720]],
    center: [46.820, -121.745],
    zoom: 13,
    routeCoordinates: [
      [46.7860, -121.7350], // Paradise Base (1,640m)
      [46.7915, -121.7340],
      [46.7975, -121.7320], // Alta Vista
      [46.8040, -121.7305],
      [46.8120, -121.7280], // Pebble Creek (2,420m)
      [46.8190, -121.7295],
      [46.8265, -121.7310], // Muir Snowfield
      [46.8320, -121.7318],
      [46.8355, -121.7320], // Camp Muir High Camp (3,105m)
      [46.8385, -121.7370], // Cathedral Gap
      [46.8415, -121.7420], // Ingraham Glacier
      [46.8450, -121.7470], // Disappointment Cleaver Rock Spine (3,780m)
      [46.8485, -121.7520],
      [46.8510, -121.7565], // Upper Bergschrund
      [46.8529, -121.7604]  // Columbia Crest Crater Summit (4,392m)
    ],
    waypoints: [
      { name: 'Paradise Base', coord: [46.7860, -121.7350], alt: '1,640m', type: 'start' },
      { name: 'Camp Muir High Camp', coord: [46.8355, -121.7320], alt: '3,105m', type: 'mid' },
      { name: 'Columbia Crest Summit', coord: [46.8529, -121.7604], alt: '4,392m', type: 'summit' }
    ]
  },
  {
    id: 'lake_22',
    name: 'Lake 22 Alpine Loop',
    region: 'Snoqualmie Wilderness',
    sectorTag: 'SECTOR CASCADE-RIVER / LK-22',
    startAltitudeM: 120,
    peakAltitudeM: 730,
    elevationGainM: 610,
    maxGrade: '21.0%',
    category: 'Glacial Cirque',
    bounds: [[48.055, -121.765], [48.080, -121.740]],
    center: [48.067, -121.752],
    zoom: 14,
    routeCoordinates: [
      [48.0770, -121.7455], // Mountain Loop Trailhead (120m)
      [48.0750, -121.7468],
      [48.0725, -121.7485], // River Bridge
      [48.0705, -121.7495],
      [48.0680, -121.7510], // Talus Slope Switchbacks (490m)
      [48.0660, -121.7525],
      [48.0645, -121.7538], // Old Growth Forest
      [48.0630, -121.7552],
      [48.0620, -121.7565], // Cirque Lake Outlet
      [48.0605, -121.7595], // Lake 22 West Shore
      [48.0585, -121.7580], // Cirque Headwall Base (730m)
      [48.0595, -121.7550], // East Shore Boardwalk
      [48.0620, -121.7565]  // Loop Closure
    ],
    waypoints: [
      { name: 'Mountain Loop Trailhead', coord: [48.0770, -121.7455], alt: '120m', type: 'start' },
      { name: 'Talus Slope Switchbacks', coord: [48.0680, -121.7510], alt: '490m', type: 'mid' },
      { name: 'Lake 22 Cirque Basin', coord: [48.0585, -121.7580], alt: '730m', type: 'summit' }
    ]
  }
];

export type MapLayerType = 'voyager' | 'satellite' | 'topo' | 'tactical';

interface RealLeafletMapProps {
  selectedTrailId: string;
  is3DMode: boolean;
  mapLayer: MapLayerType;
  onSelectTrail: (id: string) => void;
  onBackToHome: () => void;
  onToggle3D: () => void;
  onToggleLayer: () => void;
  activeFilter?: string;
  onSelectFilter?: (cat: string) => void;
}

// User-provided CARTO Basemaps API key to remove watermark
const CARTO_API_KEY = 'cb1_3qqp_1_42dae1ac9956c45393734c2b';

export default function RealLeafletMap({
  selectedTrailId,
  is3DMode,
  mapLayer,
  onSelectTrail,
  onBackToHome,
  onToggle3D,
  onToggleLayer,
  activeFilter,
  onSelectFilter
}: RealLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<any>(null);
  const routesLayerGroupRef = useRef<LayerGroup | null>(null);

  const activeTrail =
    REAL_MAP_TRAILS.find((t) => t.id === selectedTrailId) || REAL_MAP_TRAILS[0];

  /* Tile URL Resolver with CARTO API Key */
  const getTileUrl = (type: MapLayerType) => {
    if (type === 'voyager') {
      // CARTO Voyager Basemap (Watermark-free with user API key)
      return `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`;
    }
    if (type === 'tactical') {
      // CARTO Dark Matter Basemap (Watermark-free with user API key)
      return `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`;
    }
    if (type === 'topo') {
      // Real Topographic Contours, Shaded Relief & Mountain Names
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    }
    // Real High-Resolution Alpine Satellite Imagery
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  };

  /* Initialize Map on Client */
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      });

      // Create map instance
      const map = L.map(mapContainerRef.current, {
        center: activeTrail.center,
        zoom: activeTrail.zoom,
        zoomControl: false,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // Add Tile Layer
      const tileLayer = L.tileLayer(getTileUrl(mapLayer), {
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Create Layer Group for GPS trail paths & waypoint pins
      const routesGroup = L.layerGroup().addTo(map);
      routesLayerGroupRef.current = routesGroup;

      renderTrailOverlay(L, map, routesGroup, activeTrail);

      // Fit bounds to display entire trail track comfortably
      setTimeout(() => {
        map.invalidateSize();
        map.fitBounds(activeTrail.bounds, { padding: [50, 50], maxZoom: 14 });
      }, 150);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  /* Update Tile Layer when mapLayer changes */
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    import('leaflet').then((L) => {
      if (!mapInstanceRef.current) return;

      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newLayer = L.tileLayer(getTileUrl(mapLayer), {
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    });
  }, [mapLayer]);

  /* Smooth FlyTo & Update GPS Polyline when selectedTrailId changes */
  useEffect(() => {
    if (!mapInstanceRef.current || !routesLayerGroupRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      const group = routesLayerGroupRef.current;
      if (!map || !group) return;

      // Cinematic fly to mountain bounds
      map.fitBounds(activeTrail.bounds, {
        padding: [60, 60],
        maxZoom: 14,
        animate: true,
        duration: 1.5
      });

      renderTrailOverlay(L, map, group, activeTrail);
    });
  }, [selectedTrailId]);

  /* Render GPS Trail Path, Start & Summit Waypoints with Low-Transparency Boxes */
  const renderTrailOverlay = (
    L: any,
    map: LeafletMap,
    group: LayerGroup,
    trail: RealMapTrail
  ) => {
    group.clearLayers();

    // 1. Render Outer Glowing Neon Crimson Trail Line
    L.polyline(trail.routeCoordinates, {
      color: '#f61d57',
      weight: 7,
      opacity: 0.88,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(group);

    // 2. Render Inner Core Animated Dashed Solar Yellow Trail Line
    L.polyline(trail.routeCoordinates, {
      color: '#FFE600',
      weight: 3,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(group);

    // 3. Render Waypoint Markers with Low-Transparency Contrast Boxes
    trail.waypoints.forEach((wp) => {
      let categoryTitle = 'CHECKPOINT';
      let borderColor = 'rgba(246, 29, 87, 0.85)';
      let accentColor = '#f61d57';
      let innerGlow = 'rgba(246, 29, 87, 0.2)';
      let dotColor = '#f61d57';
      let dotGlow = '#f61d57';
      let iconBadge = `
        <div style="width: 22px; height: 22px; border-radius: 6px; background: rgba(246, 29, 87, 0.22); border: 1px solid rgba(246, 29, 87, 0.7); display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0;">
          📍
        </div>
      `;

      let anchorPercent = 50;

      if (wp.type === 'start') {
        categoryTitle = 'TRAILHEAD START';
        borderColor = '#10b981';
        accentColor = '#34d399';
        innerGlow = 'rgba(16, 185, 129, 0.25)';
        dotColor = '#10b981';
        dotGlow = '#10b981';
        anchorPercent = 82; // Shift box to top-left so it never overlaps adjacent waypoints
        iconBadge = `
          <div style="width: 22px; height: 22px; border-radius: 6px; background: rgba(16, 185, 129, 0.22); border: 1px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #34d399; font-weight: 800; flex-shrink: 0;">
            ▶
          </div>
        `;
      } else if (wp.type === 'summit') {
        categoryTitle = 'PEAK SUMMIT';
        borderColor = '#FFE600';
        accentColor = '#FFE600';
        innerGlow = 'rgba(255, 230, 0, 0.3)';
        dotColor = '#FFE600';
        dotGlow = '#FFE600';
        anchorPercent = 50;
        iconBadge = `
          <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, rgba(246, 29, 87, 0.45), rgba(255, 230, 0, 0.35)); border: 1px solid #FFE600; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; box-shadow: 0 0 10px rgba(255, 230, 0, 0.5);">
            ⛰️
          </div>
        `;
      } else {
        anchorPercent = 18; // Shift checkpoint box to top-right
      }

      const markerHtml = `
        <div class="waypoint-map-badge" style="position: relative; display: inline-flex; flex-direction: column; align-items: flex-start; transform: translate(-${anchorPercent}%, calc(-100% + 5px)); pointer-events: auto; cursor: default; filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.85));">
          
          <!-- Low-Transparency Box Around Text for Maximum Legibility -->
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: rgba(8, 4, 7, 0.94);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1.5px solid ${borderColor};
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.9), inset 0 0 12px ${innerGlow};
            white-space: nowrap;
          ">
            ${iconBadge}
            <div style="display: flex; flex-direction: column; gap: 1px; text-align: left;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; font-weight: 800; letter-spacing: 0.08em; color: ${accentColor}; text-transform: uppercase;">
                  ${categoryTitle}
                </span>
                <span style="display: inline-block; width: 4px; height: 4px; border-radius: 50%; background: ${accentColor}; opacity: 0.8;"></span>
                <span style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; font-weight: 700; color: #ffffff;">
                  ${wp.alt}
                </span>
              </div>
              <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11.5px; font-weight: 700; color: #ffffff; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95); letter-spacing: 0.01em;">
                ${wp.name}
              </span>
            </div>
          </div>

          <!-- Downward Pointer Arrow Connecting Box to Coordinate -->
          <div style="
            position: relative;
            left: calc(${anchorPercent}% - 5px);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid ${borderColor};
            margin-top: -1px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
          "></div>

          <!-- Coordinate Pin Dot Sitting Exactly on Route -->
          <div style="
            position: relative;
            left: calc(${anchorPercent}% - 4.5px);
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: ${dotColor};
            border: 1.5px solid #ffffff;
            box-shadow: 0 0 10px ${dotGlow};
            margin-top: 1px;
          "></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: markerHtml,
        iconSize: [0, 0]
      });

      L.marker(wp.coord, { icon }).addTo(group);
    });
  };

  /* Zoom controls */
  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapInstanceRef.current) return;
    if (direction === 'in') mapInstanceRef.current.zoomIn();
    else mapInstanceRef.current.zoomOut();
  };

  /* Recenter on active trail bounds */
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.fitBounds(activeTrail.bounds, {
      padding: [60, 60],
      maxZoom: 14,
      animate: true,
      duration: 1.2
    });
  };

  return (
    <div className="relative w-full h-full bg-[#050204] overflow-hidden select-none">
      
      {/* 3D Perspective Tilt Wrapper */}
      <div
        className={`w-full h-full transition-transform duration-700 ease-out ${
          is3DMode ? 'map-3d-tilt' : 'map-2d-flat'
        }`}
      >
        {/* Leaflet DOM Node with Crisp Satellite / Topo / Voyager Visibility */}
        <div
          ref={mapContainerRef}
          className="w-full h-full z-10 filter brightness-[0.92] contrast-[1.12] saturate-[1.05]"
        />
      </div>

      {/* AltiPulse Signature Ambient Crimson Tint Overlay (Non-obstructive) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#f61d57]/10 via-transparent to-[#f61d57]/10 mix-blend-color-dodge z-20" />
      
      {/* Dark Border Vignette (Seamlessly blends real satellite into dark canvas) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_90px_rgba(5,2,4,0.85)] z-20" />
      
      {/* Tactical Grid Scanline (Subtle 15% opacity) */}
      <div className="absolute inset-0 pointer-events-none map-grid-overlay opacity-15 z-20" />

      {/* ============================================================ */}
      {/*  TACTICAL MAP HUD OVERLAYS WITH LOW-TRANSPARENCY BOXES       */}
      {/* ============================================================ */}
      
      {/* Top-Left: Return to Hub + Active Sector GPS Telemetry */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBackToHome}
          className="px-3.5 py-1.5 rounded-xl bg-[#080407]/94 backdrop-blur-md border border-white/20 text-xs text-white/90 hover:text-white flex items-center gap-1.5 cursor-pointer hover:border-[#f61d57]/70 transition-colors shadow-2xl"
          title="Return to Home Dashboard"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-[#f61d57]" />
          <span className="font-semibold">Hub</span>
        </button>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#080407]/94 backdrop-blur-md border border-white/20 text-xs flex items-center gap-2 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#f61d57] animate-ping" />
          <span className="font-mono-data text-[11px] text-[#f61d57] font-bold tracking-wider">
            {activeTrail.sectorTag}
          </span>
        </div>
      </div>



      {/* Top-Right: Map HUD Controls (3D, Layers, Zoom, Recenter) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        {/* 3D Perspective Toggle Button */}
        <button
          type="button"
          onClick={onToggle3D}
          className={`px-3 py-1.5 rounded-xl bg-[#080407]/94 backdrop-blur-md border text-xs font-mono-data font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xl ${
            is3DMode
              ? 'border-[#FFE600]/80 text-[#FFE600] shadow-[0_0_14px_rgba(255,230,0,0.4)]'
              : 'border-white/20 text-white/70 hover:text-white'
          }`}
          title="Toggle 3D Perspective Tilt"
        >
          <Compass className={`w-3.5 h-3.5 ${is3DMode ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          <span>{is3DMode ? '3D VIEW' : '2D FLAT'}</span>
        </button>

        {/* Real Tile Layer Switcher */}
        <button
          type="button"
          onClick={onToggleLayer}
          className="px-3 py-1.5 rounded-xl bg-[#080407]/94 backdrop-blur-md border border-white/20 text-xs font-mono-data text-white/90 hover:text-white flex items-center gap-1.5 cursor-pointer hover:border-[#f61d57]/70 transition-all shadow-2xl"
          title="Switch Map Tiles (Voyager / Satellite / Topo / Tactical)"
        >
          <Layers className="w-3.5 h-3.5 text-[#f61d57]" />
          <span className="capitalize font-semibold">{mapLayer}</span>
        </button>

        {/* Zoom In / Out Controls */}
        <div className="flex items-center rounded-xl bg-[#080407]/94 backdrop-blur-md border border-white/20 shadow-2xl p-0.5">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/90 hover:text-white cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/90 hover:text-white cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recenter GPS Crosshair */}
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2 rounded-xl bg-[#080407]/94 backdrop-blur-md border border-white/20 text-white/80 hover:text-white cursor-pointer hover:border-[#f61d57]/70 transition-all shadow-2xl"
          title="Recenter On Trail GPS"
        >
          <Crosshair className="w-3.5 h-3.5 text-[#f61d57]" />
        </button>
      </div>

      {/* Floating Center Route Tag: Low-transparency box for maximum legibility */}
      <div className="absolute top-14 left-4 z-30 pointer-events-none anim-slide-down">
        <div className="py-2 px-4 rounded-xl bg-[#080407]/94 backdrop-blur-md border border-[#f61d57]/70 text-xs font-mono-data text-white flex items-center gap-2.5 shadow-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] animate-pulse shadow-[0_0_10px_#FFE600]" />
          <span className="font-bold text-white tracking-wide uppercase">{activeTrail.name}</span>
          <span className="text-white/40">·</span>
          <span className="text-[#FFE600] font-bold">GPS Ascent Track</span>
          <span className="text-white/40">·</span>
          <span className="text-white font-bold">+{activeTrail.elevationGainM}m Vert</span>
        </div>
      </div>

      {/* Bottom-Left: Map Legend in Low-Transparency Box */}
      <div className="absolute bottom-3 left-3 z-30 hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#080407]/94 backdrop-blur-md border border-white/20 text-[11px] font-mono-data text-white/80 shadow-2xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]" />
          <span className="font-semibold text-white">TRAILHEAD</span>
        </div>
        <span className="text-white/30">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f61d57] shadow-[0_0_6px_#f61d57]" />
          <span className="font-semibold text-white">GPS TRACK</span>
        </div>
        <span className="text-white/30">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] shadow-[0_0_6px_#FFE600]" />
          <span className="font-semibold text-white">SUMMIT</span>
        </div>
      </div>

      {/* Bottom-Right: Active Incline & Vertical Gain in Low-Transparency Box */}
      <div className="absolute bottom-3 right-3 z-30 px-4 py-2 rounded-xl bg-[#080407]/94 backdrop-blur-md border border-white/20 flex items-center gap-4 text-right shadow-2xl">
        <div>
          <span className="text-[10px] font-mono-data text-white/60 font-semibold block">MAX GRADE</span>
          <span className="text-sm font-bold font-mono-data text-[#f61d57]">{activeTrail.maxGrade}</span>
        </div>
        <div className="border-l border-white/20 pl-4">
          <span className="text-[10px] font-mono-data text-white/60 font-semibold block">VERTICAL GAIN</span>
          <span className="text-sm font-bold font-mono-data text-[#FFE600]">+{activeTrail.elevationGainM}m</span>
        </div>
      </div>

    </div>
  );
}
