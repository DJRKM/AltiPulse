'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Camera,
  Flag,
  Tent,
  Radio,
  Compass,
  Maximize2,
  Clock,
  Award,
  RotateCcw,
  Play,
  Pause,
  X,
  Plus,
  Minus,
  Navigation
} from 'lucide-react';

export type DifficultyLevel = 'casual' | 'alpine' | 'speed' | 'technical';

export interface MilestonePin {
  id: string;
  type: 'start' | 'checkpoint' | 'photopoint' | 'camp' | 'summit';
  title: string;
  subtitle: string;
  baseMinutes: number;
  elevationM: number;
  pointsBounty: number;
  pos3D: [number, number, number]; // 3D coordinates on the mountain
  poleHeight: number;
  badgeColor: string;
  iconType: 'start' | 'camera' | 'tent' | 'radio' | 'flag';
}

interface TopographicCompassMapProps {
  difficulty: DifficultyLevel;
  onSelectMilestone?: (milestone: MilestonePin) => void;
  onToggleViewMode?: () => void;
}

export default function TopographicCompassMap({
  difficulty,
  onSelectMilestone
}: TopographicCompassMapProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [screenCoords, setScreenCoords] = useState<Record<string, { x: number; y: number; visible: boolean; depth: number }>>({});

  // Rotation state refs for smooth 360 drag interaction
  const rotationRef = useRef<{ theta: number; phi: number; radius: number; isDragging: boolean; lastX: number; lastY: number }>({
    theta: 0.85, // Azimuthal angle
    phi: 0.72,   // Polar elevation angle (~41 degrees)
    radius: 34,
    isDragging: false,
    lastX: 0,
    lastY: 0
  });

  // Difficulty time multipliers
  const timeMultiplier = {
    casual: 1.3,
    alpine: 1.0,
    speed: 0.75,
    technical: 1.15
  }[difficulty];

  const formatSplitTime = (baseMin: number) => {
    const totalMin = Math.round(baseMin * timeMultiplier);
    if (totalMin < 60) return `${totalMin} MIN`;
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return mins > 0 ? `${hrs}HR ${mins}MIN` : `${hrs}HR`;
  };

  // Milestones anchored in true 3D coordinates
  const milestones: MilestonePin[] = [
    {
      id: 'start',
      type: 'start',
      title: 'Trailhead Base',
      subtitle: 'Snoqualmie Valley North',
      baseMinutes: 0,
      elevationM: 150,
      pointsBounty: 0,
      pos3D: [9.5, 0.4, 6.5],
      poleHeight: 2.4,
      badgeColor: '#ffffff',
      iconType: 'start'
    },
    {
      id: 'camp_1',
      type: 'camp',
      title: 'Pine Glade Camp',
      subtitle: 'Old Growth Shelter',
      baseMinutes: 32,
      elevationM: 480,
      pointsBounty: 150,
      pos3D: [-6.8, 2.4, 5.8],
      poleHeight: 2.8,
      badgeColor: '#60a5fa',
      iconType: 'tent'
    },
    {
      id: 'radio_1',
      type: 'checkpoint',
      title: 'Snag Flat Relay',
      subtitle: 'Telemetry Repeater CAS-04',
      baseMinutes: 52,
      elevationM: 790,
      pointsBounty: 200,
      pos3D: [-5.2, 4.3, -2.4],
      poleHeight: 2.8,
      badgeColor: '#fb923c',
      iconType: 'radio'
    },
    {
      id: 'photo_1',
      type: 'photopoint',
      title: 'Eagle Crest Vista',
      subtitle: 'USP Photo Point · Rainier Horizon',
      baseMinutes: 72,
      elevationM: 980,
      pointsBounty: 350,
      pos3D: [3.4, 5.8, 3.2],
      poleHeight: 3.2,
      badgeColor: '#a3e635',
      iconType: 'camera'
    },
    {
      id: 'radio_2',
      type: 'checkpoint',
      title: 'Talus Field Crest',
      subtitle: 'Radio Checkpoint 2',
      baseMinutes: 88,
      elevationM: 1120,
      pointsBounty: 250,
      pos3D: [3.8, 7.2, -2.6],
      poleHeight: 2.8,
      badgeColor: '#fb923c',
      iconType: 'radio'
    },
    {
      id: 'summit',
      type: 'summit',
      title: 'Haystack Rock Summit',
      subtitle: 'Cascades Peak Crest',
      baseMinutes: 115,
      elevationM: 1270,
      pointsBounty: 500,
      pos3D: [-0.4, 9.4, 0.4],
      poleHeight: 3.4,
      badgeColor: '#ffffff',
      iconType: 'flag'
    }
  ];

  /* ============================================================ */
  /*  THREE.JS INTERACTIVE 3D TOPOGRAPHIC SCENE SETUP             */
  /* ============================================================ */
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group that contains everything that rotates
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ============================================================
    // A. CIRCULAR COMPASS BASE WITH 3D DEGREE TICKS
    // ============================================================
    const compassRadius = 14.5;

    // Outer Glow Ring
    const outerRingGeo = new THREE.RingGeometry(compassRadius - 0.1, compassRadius + 0.15, 128);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = -Math.PI / 2;
    outerRingMesh.position.y = 0.05;
    worldGroup.add(outerRingMesh);

    // Secondary Dark Base Disc
    const baseDiscGeo = new THREE.CircleGeometry(compassRadius, 64);
    const baseDiscMat = new THREE.MeshBasicMaterial({ color: 0x070509, transparent: true, opacity: 0.85 });
    const baseDiscMesh = new THREE.Mesh(baseDiscGeo, baseDiscMat);
    baseDiscMesh.rotation.x = -Math.PI / 2;
    worldGroup.add(baseDiscMesh);

    // Degree Ticks (72 ticks around base perimeter)
    const tickPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 72; i++) {
      const angle = (i * 5 * Math.PI) / 180;
      const isMajor = i % 9 === 0;
      const rInner = isMajor ? compassRadius - 1.2 : compassRadius - 0.6;
      const rOuter = compassRadius - 0.1;
      
      const x1 = Math.cos(angle) * rInner;
      const z1 = Math.sin(angle) * rInner;
      const x2 = Math.cos(angle) * rOuter;
      const z2 = Math.sin(angle) * rOuter;

      tickPoints.push(new THREE.Vector3(x1, 0.08, z1));
      tickPoints.push(new THREE.Vector3(x2, 0.08, z2));
    }

    const tickGeo = new THREE.BufferGeometry().setFromPoints(tickPoints);
    const tickMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const tickLines = new THREE.LineSegments(tickGeo, tickMat);
    worldGroup.add(tickLines);

    // ============================================================
    // B. 3D TOPOGRAPHIC CONTOUR MOUNTAIN CONCENTRIC RINGS
    // ============================================================
    const mountainGroup = new THREE.Group();
    worldGroup.add(mountainGroup);

    // Mountain Contour Slices generator (18 layered concentric slices)
    const numSlices = 18;
    const maxHeight = 9.8;

    for (let i = 0; i < numSlices; i++) {
      const t = i / (numSlices - 1);
      const y = t * maxHeight;
      const baseRadius = 12.5 * Math.sqrt(Math.max(0.001, 1 - Math.pow(t, 1.2)));

      const curvePoints: THREE.Vector3[] = [];
      const numPts = 72;

      for (let j = 0; j <= numPts; j++) {
        const angle = (j / numPts) * Math.PI * 2;
        
        // Procedural mountain ridge deformers matching dual-peak reference
        const ridge1 = Math.sin(angle * 3 + 0.4) * (1.2 * (1 - t));
        const ridge2 = Math.cos(angle * 2 - 0.8) * (0.8 * (1 - t));
        const crag = Math.sin(angle * 5) * (0.35 * t);

        // Peak offset shifting towards summit
        const peakShiftX = -0.4 * t;
        const peakShiftZ = 0.4 * t;

        const r = Math.max(0.3, baseRadius + ridge1 + ridge2 + crag);
        const x = Math.cos(angle) * r + peakShiftX;
        const z = Math.sin(angle) * r + peakShiftZ;

        curvePoints.push(new THREE.Vector3(x, y + 0.1, z));
      }

      const ringGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      
      // Color transition from base cyan/slate to summit magma/amber
      let ringColor = 0x38bdf8;
      let ringOpacity = 0.35 + t * 0.45;
      if (t > 0.7) {
        ringColor = t > 0.9 ? 0xffe600 : 0xf61d57;
      }

      const ringMat = new THREE.LineBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: ringOpacity,
        linewidth: t > 0.85 ? 2 : 1
      });

      const contourLine = new THREE.LineLoop(ringGeo, ringMat);
      mountainGroup.add(contourLine);
    }

    // Mountain Shaded Translucent Body (Occludes back lines for 3D realism)
    const coneGeo = new THREE.ConeGeometry(12, maxHeight, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x050811,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      depthWrite: true
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.y = maxHeight / 2;
    mountainGroup.add(coneMesh);

    // ============================================================
    // C. 3D ASCENT TRAIL SPLINE
    // ============================================================
    const trailCurvePoints = milestones.map((m) => new THREE.Vector3(m.pos3D[0], m.pos3D[1], m.pos3D[2]));
    const trailSpline = new THREE.CatmullRomCurve3(trailCurvePoints, false, 'catmullrom', 0.2);
    const trailSamplePoints = trailSpline.getPoints(120);

    // Outer dark contrast backing line
    const trailBackGeo = new THREE.BufferGeometry().setFromPoints(trailSamplePoints);
    const trailBackMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4, transparent: true, opacity: 0.8 });
    const trailBackLine = new THREE.Line(trailBackGeo, trailBackMat);
    trailBackLine.position.y += 0.05;
    mountainGroup.add(trailBackLine);

    // Core Glowing Neon Ascent Line
    const trailCoreGeo = new THREE.BufferGeometry().setFromPoints(trailSamplePoints);
    const trailCoreMat = new THREE.LineDashedMaterial({
      color: 0xa3e635,
      dashSize: 0.6,
      gapSize: 0.35,
      linewidth: 2.5
    });
    const trailCoreLine = new THREE.Line(trailCoreGeo, trailCoreMat);
    trailCoreLine.computeLineDistances();
    trailCoreLine.position.y += 0.08;
    mountainGroup.add(trailCoreLine);

    // ============================================================
    // D. 3D MILESTONE VERTICAL POLES & BASE ANCHORS
    // ============================================================
    milestones.forEach((m) => {
      const basePos = new THREE.Vector3(m.pos3D[0], m.pos3D[1], m.pos3D[2]);
      const topPos = new THREE.Vector3(m.pos3D[0], m.pos3D[1] + m.poleHeight, m.pos3D[2]);

      // Vertical pole line
      const poleGeo = new THREE.BufferGeometry().setFromPoints([basePos, topPos]);
      const poleMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(m.badgeColor),
        transparent: true,
        opacity: 0.8
      });
      const poleLine = new THREE.Line(poleGeo, poleMat);
      mountainGroup.add(poleLine);

      // Glowing anchor disc on the terrain
      const anchorGeo = new THREE.RingGeometry(0.15, 0.45, 16);
      const anchorMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(m.badgeColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const anchorMesh = new THREE.Mesh(anchorGeo, anchorMat);
      anchorMesh.position.copy(basePos);
      anchorMesh.rotation.x = -Math.PI / 2;
      mountainGroup.add(anchorMesh);
    });

    // ============================================================
    // E. ANIMATION & 2D PROJECTION LOOP
    // ============================================================
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotation when active and not dragging
      if (isAutoRotate && !rotationRef.current.isDragging) {
        rotationRef.current.theta += 0.0025;
      }

      const { theta, phi, radius } = rotationRef.current;

      // Spherical camera positioning
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi) + 2.5;
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 4.0, 0);

      renderer.render(scene, camera);

      // Project 3D pole tops into 2D screen coordinates for crisp HTML badges
      const newCoords: Record<string, { x: number; y: number; visible: boolean; depth: number }> = {};
      const tempVec = new THREE.Vector3();

      milestones.forEach((m) => {
        // Point at the top of the pole in world space
        tempVec.set(m.pos3D[0], m.pos3D[1] + m.poleHeight, m.pos3D[2]);
        tempVec.applyMatrix4(mountainGroup.matrixWorld);
        
        // Calculate camera distance for depth sorting
        const depth = tempVec.distanceTo(camera.position);

        // Project to normalized device coordinates (-1 to +1)
        tempVec.project(camera);

        const x = ((tempVec.x + 1) * width) / 2;
        const y = ((-tempVec.y + 1) * height) / 2;
        const visible = tempVec.z < 1.0;

        newCoords[m.id] = { x, y, visible, depth };
      });

      setScreenCoords(newCoords);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAutoRotate]);

  /* ============================================================ */
  /*  POINTER / DRAG CONTROLS FOR 360 ROTATION                     */
  /* ============================================================ */
  const handlePointerDown = (e: React.PointerEvent) => {
    rotationRef.current.isDragging = true;
    rotationRef.current.lastX = e.clientX;
    rotationRef.current.lastY = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!rotationRef.current.isDragging) return;
    const deltaX = e.clientX - rotationRef.current.lastX;
    const deltaY = e.clientY - rotationRef.current.lastY;

    rotationRef.current.lastX = e.clientX;
    rotationRef.current.lastY = e.clientY;

    // Azimuthal rotation (horizontal drag)
    rotationRef.current.theta += deltaX * 0.008;

    // Polar elevation (vertical drag clamped between 18° and 75°)
    rotationRef.current.phi = Math.max(0.35, Math.min(1.35, rotationRef.current.phi - deltaY * 0.006));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    rotationRef.current.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch (err) {
      // Ignored
    }
  };

  // Zoom in / out controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      rotationRef.current.radius = Math.max(22, rotationRef.current.radius - 3);
    } else {
      rotationRef.current.radius = Math.min(48, rotationRef.current.radius + 3);
    }
  };

  // Reset 3D View to default reference angle
  const handleResetView = () => {
    rotationRef.current.theta = 0.85;
    rotationRef.current.phi = 0.72;
    rotationRef.current.radius = 34;
  };

  const activeMilestone =
    milestones.find((m) => m.id === activePinId) || null;

  return (
    <div
      onClick={() => setActivePinId(null)}
      className="relative w-full h-full bg-[#070408] rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between select-none shadow-2xl"
    >
      
      {/* Top Header Bar: Status & Interactive 3D Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-30 flex items-center justify-between px-4 py-2 bg-[#09060b]/85 backdrop-blur-md border-b border-white/10"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#f61d57] to-[#FFE600] p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(246,29,87,0.4)]">
            <Compass className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white tracking-wide uppercase font-brand">
              3D Topo Mountain
            </span>
            <span className="text-[10px] text-white/50 font-mono-data ml-2">
              Drag to Rotate 360°
            </span>
          </div>
        </div>

        {/* Rotation & View Controls */}
        <div className="flex items-center gap-1.5">
          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-data font-bold flex items-center gap-1 border transition-all cursor-pointer ${
              isAutoRotate
                ? 'bg-[#FFE600]/20 border-[#FFE600]/50 text-[#FFE600]'
                : 'bg-white/10 border-white/10 text-white/60 hover:text-white'
            }`}
            title="Toggle Auto-Rotation"
          >
            {isAutoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{isAutoRotate ? 'Auto' : 'Paused'}</span>
          </button>

          {/* Reset Camera View */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors border border-white/10 cursor-pointer"
            title="Reset to Default Angle"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Zoom In/Out */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => handleZoom('in')}
              className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom('out')}
              className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Container with Interactive Pointer Drag */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Background Ambient Radial Gradient */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,rgba(246,29,87,0.03)_50%,transparent_70%)]" />

        {/* ============================================================ */}
        {/*  BILLBOARD BADGES PROJECTED OVER 3D PIN TOPS                */}
        {/* ============================================================ */}
        {milestones.map((m) => {
          const coords = screenCoords[m.id];
          if (!coords || !coords.visible) return null;

          const isSelected = activePinId === m.id;
          const splitTime = formatSplitTime(m.baseMinutes);

          return (
            <div
              key={m.id}
              onClick={(e) => {
                e.stopPropagation();
                // Toggle active state (dismiss if already active)
                const nextId = activePinId === m.id ? null : m.id;
                setActivePinId(nextId);
                if (nextId && onSelectMilestone) onSelectMilestone(m);
              }}
              className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform duration-150 group z-20 ${
                isSelected ? 'scale-110 z-40' : 'hover:scale-105'
              }`}
              style={{
                left: `${coords.x}px`,
                top: `${coords.y}px`
              }}
            >
              {/* Badge Icon & Target Split Time Pill */}
              <div className="flex items-center gap-1.5 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                
                {/* Circular Icon Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    m.type === 'photopoint'
                      ? 'bg-[#a3e635] text-black ring-2 ring-[#a3e635]/70 shadow-[0_0_16px_rgba(163,230,53,0.9)] animate-pulse'
                      : m.type === 'summit'
                      ? 'bg-white text-black ring-2 ring-white/80 shadow-[0_0_16px_rgba(255,255,255,0.9)]'
                      : m.type === 'camp'
                      ? 'bg-[#60a5fa] text-black ring-1 ring-white/40 shadow-[0_0_10px_rgba(96,165,250,0.6)]'
                      : m.type === 'checkpoint'
                      ? 'bg-[#fb923c] text-black ring-1 ring-white/40 shadow-[0_0_10px_rgba(251,146,60,0.6)]'
                      : 'bg-white text-black font-extrabold ring-1 ring-white/50'
                  }`}
                >
                  {m.iconType === 'camera' && <Camera className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {m.iconType === 'flag' && <Flag className="w-3.5 h-3.5 fill-black" />}
                  {m.iconType === 'tent' && <Tent className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {m.iconType === 'radio' && <Radio className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {m.iconType === 'start' && (
                    <span className="text-[11px] font-mono font-black">S</span>
                  )}
                </div>

                {/* Split Time Pill */}
                {m.baseMinutes > 0 && (
                  <div
                    className={`px-2 py-0.5 rounded-md backdrop-blur-md text-[10px] font-mono-data font-bold tracking-wider flex items-center gap-1 border whitespace-nowrap shadow-xl transition-colors ${
                      isSelected
                        ? 'bg-[#080407]/95 border-[#FFE600] text-[#FFE600] shadow-[0_0_14px_rgba(255,230,0,0.4)]'
                        : m.type === 'photopoint'
                        ? 'bg-[#080407]/92 border-[#a3e635]/60 text-[#a3e635]'
                        : 'bg-[#080407]/92 border-white/25 text-white/90'
                    }`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    <span>{splitTime}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Dismissible Floating Card for Selected Active Pin */}
        {activeMilestone && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 left-4 right-4 sm:right-auto sm:max-w-xs z-40 p-3 rounded-xl bg-[#080407]/95 backdrop-blur-md border border-white/20 text-white shadow-2xl flex items-center justify-between gap-3 anim-slide-down"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  {activeMilestone.title}
                </span>
                <span className="text-[9px] font-mono-data text-white/50">
                  {activeMilestone.elevationM}m Vert
                </span>
              </div>
              <p className="text-[10px] text-white/60 mt-0.5">{activeMilestone.subtitle}</p>
              <div className="flex items-center gap-2.5 mt-1 text-[10px] font-mono-data font-bold">
                <span className="text-[#FFE600]">
                  Target Split: {formatSplitTime(activeMilestone.baseMinutes)}
                </span>
                {activeMilestone.pointsBounty > 0 && (
                  <span className="text-[#a3e635] flex items-center gap-0.5">
                    <Award className="w-3 h-3" />
                    +{activeMilestone.pointsBounty} PTS
                  </span>
                )}
              </div>
            </div>

            {/* Close Button to dismiss card */}
            <button
              type="button"
              onClick={() => setActivePinId(null)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
              title="Close Card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Bottom Map Legend Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-30 px-4 py-2 bg-[#09060b]/85 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[10px] font-mono-data text-white/70"
      >
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635]" />
            <span className="font-bold text-[#a3e635]">USP PHOTO POINT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>SUMMIT PIN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c]" />
            <span>CHECKPOINT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
            <span>CAMPSITE</span>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-white/40">INTERACTION:</span>{' '}
          <span className="text-white font-bold">CLICK PIN TO VIEW · CLICK OUTSIDE TO CLOSE</span>
        </div>
      </div>

    </div>
  );
}
