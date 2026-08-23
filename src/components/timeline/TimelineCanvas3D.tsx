'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TimelineEvent, TIMELINE_EVENTS } from '@/data/timelineEvents';
import { retroAudio } from '@/utils/audioEffects';

interface TimelineCanvas3DProps {
  activeEventIndex: number;
  onSelectEvent: (index: number) => void;
  onOpenDialog: (event: TimelineEvent) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  speed: number;
  alpha: number;
}

export const TimelineCanvas3D: React.FC<TimelineCanvas3DProps> = ({
  activeEventIndex,
  onSelectEvent,
  onOpenDialog,
  scrollProgress
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Exact Physical Highway Constants (Expansive Spacing & Balanced Perspective)
  const STAGE_SPACING = 460;
  const CAMERA_VIEW_DISTANCE = 460;
  const FOCAL_LENGTH = 450;
  const EXTRA_RUNWAY = 520; // Natural extra distance so scroll continues smoothly past the final card
  const TOTAL_DEPTH = (TIMELINE_EVENTS.length - 1) * STAGE_SPACING + EXTRA_RUNWAY;
  const HORIZON_Y = 0.40;
  const ROAD_HEIGHT = 160;

  // Camera & Mouse tracking
  const cameraZRef = useRef(-CAMERA_VIEW_DISTANCE);
  const targetZRef = useRef(-CAMERA_VIEW_DISTANCE);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const mousePixelRef = useRef({ x: -1000, y: -1000 });
  const hoveredNodeIndexRef = useRef<number | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);

  // Smooth Scroll-Activated Expansion Progress
  const expansionProgressRef = useRef<number[]>(new Array(TIMELINE_EVENTS.length).fill(0));
  const prevReportedStageRef = useRef<number>(activeEventIndex);

  const onSelectEventRef = useRef(onSelectEvent);
  useEffect(() => {
    onSelectEventRef.current = onSelectEvent;
  }, [onSelectEvent]);

  const onOpenDialogRef = useRef(onOpenDialog);
  useEffect(() => {
    onOpenDialogRef.current = onOpenDialog;
  }, [onOpenDialog]);

  // Generate ambient particle cloud (Optimized particle count with frustum culling)
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const pts: Particle[] = [];
    const colors = ['#FF5FCF', '#9929EA', '#C084FC', '#E879F9', '#FFE279', '#00F0FF', '#FFFFFF'];
    const totalDepth = TIMELINE_EVENTS.length * STAGE_SPACING + 1000;
    for (let i = 0; i < 260; i++) {
      pts.push({
        x: (Math.random() - 0.5) * 1400,
        y: ROAD_HEIGHT + (Math.random() - 0.5) * 220,
        z: -300 + Math.random() * totalDepth,
        size: Math.random() * 2.0 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: (Math.random() * 0.2 + 0.05),
        alpha: Math.random() * 0.70 + 0.2
      });
    }
    particlesRef.current = pts;
  }, [STAGE_SPACING]);

  // Pure 1-to-1 Continuous Linear Camera Glide (No freezing, no frame locking)
  useEffect(() => {
    targetZRef.current = scrollProgress * TOTAL_DEPTH - CAMERA_VIEW_DISTANCE;
  }, [scrollProgress, TOTAL_DEPTH, CAMERA_VIEW_DISTANCE]);

  // Spider-Verse Multiverse Glitch Glyphs
  const ITSV_GLYPHS = ['0', '1', 'X', 'Ø', '§', '¶', '▓', '▒', '░', '<', '>', '#', '%', '$', '!', '&', '?', '¥', '∆', '⚡', '★', '⌘', '¿', '¡'];
  const scrambleDuringExpansion = (text: string, progress: number, tick: number): string => {
    if (progress <= 0.04 || progress >= 0.94) return text;
    const chars = text.split('');
    const decodedCount = Math.floor(chars.length * Math.pow(progress, 1.4));
    const seed = Math.floor(tick / 2);
    return chars
      .map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (i < decodedCount) return ch;
        const glyphIdx = (i * 7 + seed) % ITSV_GLYPHS.length;
        return ITSV_GLYPHS[glyphIdx];
      })
      .join('');
  };

  // Precomputed Wrapped Text Lines Cache (Zero MeasureText on 60fps Animation Loop)
  const precomputedDescRef = useRef<string[][]>([]);

  // Render & Animation Loop (with IntersectionObserver lifecycle pause)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;

    const computeWrappedDescriptions = (context: CanvasRenderingContext2D, maxWidth: number) => {
      context.font = '500 10px "Geist Mono", "Silkscreen", monospace';
      precomputedDescRef.current = TIMELINE_EVENTS.map(evt => {
        const words = evt.description.split(' ');
        const lines: string[] = [];
        let currentLine = words[0] || '';
        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine + ' ' + word;
          const metrics = context.measureText(testLine);
          if (metrics.width < maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
      });
    };

    // Pixel-Perfect HiDPI Resize Handler (Eliminates all blurriness on laptops/monitors)
    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Precalculate text wrapping for canonical width (canonicalW = 270 - 28 = 242)
      computeWrappedDescriptions(ctx, 242);
    };

    resize();
    window.addEventListener('resize', resize);

    // IntersectionObserver: Completely pauses rAF loop when off-screen to save 100% GPU/CPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          animationFrameId = requestAnimationFrame(render);
        } else if (!isVisible && wasVisible) {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 3D Projection Helper (Optimized inline bounds)
    const project3D = (
      x: number,
      y: number,
      z: number,
      width: number,
      height: number
    ) => {
      const relZ = z - cameraZRef.current;
      if (relZ <= 10 || relZ > 2300) return null;

      const scale = FOCAL_LENGTH / relZ;
      const cx = width / 2 + mousePosRef.current.x * 20 * (1 - relZ / 2500);
      const cy = height * HORIZON_Y + mousePosRef.current.y * 12 * (1 - relZ / 2500);

      const px = cx + x * scale;
      const py = cy + y * scale;

      return { x: px, y: py, scale, relZ };
    };

    let tick = 0;

    const render = () => {
      tick++;
      if (!canvas || !containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Balanced Widescreen Road Dimensions
      const roadWidth = Math.max(520, Math.min(760, width * 0.48));
      const laneOffset = roadWidth / 3;

      // Smooth camera interpolation for cinematic feel
      cameraZRef.current += (targetZRef.current - cameraZRef.current) * 0.085;

      // =========================================================================
      // REAL-TIME PHYSICAL LINE-CROSSING STAGE DETECTION
      // =========================================================================
      const physicalStageIdx = Math.max(0, Math.min(
        TIMELINE_EVENTS.length - 1,
        Math.floor((cameraZRef.current + CAMERA_VIEW_DISTANCE + STAGE_SPACING * 0.08) / STAGE_SPACING)
      ));

      if (physicalStageIdx !== prevReportedStageRef.current) {
        prevReportedStageRef.current = physicalStageIdx;
        retroAudio.playStageChime(physicalStageIdx);
        if (onSelectEventRef.current) {
          onSelectEventRef.current(physicalStageIdx);
        }
      }

      // 1. Dark Retro Void Background with Ultra-Subtle Deep Purple Whisper
      const bgGrad = ctx.createRadialGradient(
        width / 2, height * HORIZON_Y, 20,
        width / 2, height * HORIZON_Y, Math.max(width, height) * 0.80
      );
      bgGrad.addColorStop(0, 'rgba(7, 2, 12, 0.4)');     // Barely-there subtle deep purple center
      bgGrad.addColorStop(0.40, 'rgba(4, 1, 7, 0.5)');  // Deep retro void
      bgGrad.addColorStop(1, 'rgba(2, 1, 4, 0.6)');     // Obsidian black
      ctx.fillStyle = bgGrad;
      ctx.clearRect(0, 0, width, height);
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Ambient 3D Particle Cloud
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const wobbleY = p.y + Math.sin(tick * 0.02 + i) * 6;
        const wobbleX = p.x + Math.cos(tick * 0.015 + i) * 4;
        const proj = project3D(wobbleX, wobbleY, p.z, width, height);

        if (proj && proj.relZ > 20 && proj.relZ < 2400) {
          const r = Math.max(0.5, p.size * proj.scale);
          const alpha = p.alpha * Math.min(1, (2400 - proj.relZ) / 800) * Math.min(1, (proj.relZ - 20) / 100);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      // 3. DRAW 3D PERSPECTIVE DUOCHROME PURPLE PIXEL GRID HIGHWAY (INCLINED ROAD MESH)
      const numCols = 16;
      const colWidth = roadWidth / numCols;
      const rowSpacingZ = 55;
      const zStart = cameraZRef.current - 120;
      const zEnd = cameraZRef.current + 2500;

      // STEP A: Road Base Trapezoid Surface
      const p1 = project3D(-roadWidth / 2, ROAD_HEIGHT, zStart, width, height);
      const p2 = project3D(roadWidth / 2, ROAD_HEIGHT, zStart, width, height);
      const p3 = project3D(roadWidth / 2, ROAD_HEIGHT, zEnd, width, height);
      const p4 = project3D(-roadWidth / 2, ROAD_HEIGHT, zEnd, width, height);

      if (p1 && p2 && p3 && p4) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();

        // Dark Purple Void Road Gradient
        const roadGrad = ctx.createLinearGradient(0, p1.y, 0, p3.y);
        roadGrad.addColorStop(0, 'rgba(30, 4, 56, 0.55)');
        roadGrad.addColorStop(0.35, 'rgba(18, 2, 34, 0.35)');
        roadGrad.addColorStop(0.75, 'rgba(8, 1, 16, 0.18)');
        roadGrad.addColorStop(1, 'rgba(2, 1, 4, 0.02)');
        ctx.fillStyle = roadGrad;
        ctx.fill();
      }

      // STEP B: Interactive Duochrome Purple Pixel Grid Cells (Hover Reactivity & Cyber Waves)
      const startZSnap = Math.floor(zStart / rowSpacingZ) * rowSpacingZ;
      const maxGridRows = 32;

      for (let r = 0; r < maxGridRows; r++) {
        const rz = startZSnap + r * rowSpacingZ;
        if (rz < zStart || rz >= zEnd - rowSpacingZ) continue;

        const depthAlpha = Math.max(0, Math.min(1, (zEnd - rz) / (zEnd - zStart)));
        if (depthAlpha <= 0.02) continue;

        for (let c = 0; c < numCols; c++) {
          const xLeft = -roadWidth / 2 + c * colWidth;
          const xRight = xLeft + colWidth;
          const cellCenterProj = project3D((xLeft + xRight) / 2, ROAD_HEIGHT, rz + rowSpacingZ / 2, width, height);

          if (!cellCenterProj) continue;

          // Mouse Proximity Glow on 3D Road Plane
          const dx = mousePixelRef.current.x - cellCenterProj.x;
          const dy = mousePixelRef.current.y - cellCenterProj.y;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);
          const mouseGlow = Math.max(0, 1 - mouseDist / 95);

          // Flowing Cyber Wave Shading
          const wave = Math.sin((rz * 0.02 - tick * 0.04) + c * 0.5);
          const isPulseCell = (c + Math.floor(rz / rowSpacingZ)) % 5 === 0 && wave > 0.65;

          if (mouseGlow > 0.05 || isPulseCell) {
            const cP1 = project3D(xLeft, ROAD_HEIGHT, rz, width, height);
            const cP2 = project3D(xRight, ROAD_HEIGHT, rz, width, height);
            const cP3 = project3D(xRight, ROAD_HEIGHT, rz + rowSpacingZ, width, height);
            const cP4 = project3D(xLeft, ROAD_HEIGHT, rz + rowSpacingZ, width, height);

            if (cP1 && cP2 && cP3 && cP4) {
              ctx.beginPath();
              ctx.moveTo(cP1.x, cP1.y);
              ctx.lineTo(cP2.x, cP2.y);
              ctx.lineTo(cP3.x, cP3.y);
              ctx.lineTo(cP4.x, cP4.y);
              ctx.closePath();

              if (mouseGlow > 0.05) {
                // Interactive Reactive Duochrome Glow (Pink & Electric Purple)
                const glowAlpha = (0.08 + mouseGlow * 0.35) * depthAlpha;
                ctx.fillStyle = mouseGlow > 0.5
                  ? `rgba(255, 95, 207, ${glowAlpha})`
                  : `rgba(153, 41, 234, ${glowAlpha})`;
              } else {
                // Subtle Ambient Wave Cell
                ctx.fillStyle = `rgba(121, 27, 196, ${0.09 * depthAlpha})`;
              }
              ctx.fill();
            }
          }
        }
      }

      // STEP C: 3D Transversal Grid Rows (Removed as requested)

      // STEP D: 3D Longitudinal Grid Columns (Removed as requested)

      // 4. Draw Transverse Horizontal Time Rung Bars (Stage Milestones with Dates)
      TIMELINE_EVENTS.forEach((evt, idx) => {
        const stageZ = idx * STAGE_SPACING;
        const pLeft = project3D(-roadWidth / 2 - 35, ROAD_HEIGHT, stageZ, width, height);
        const pRight = project3D(roadWidth / 2 + 35, ROAD_HEIGHT, stageZ, width, height);

        if (pLeft && pRight && pLeft.relZ > 20 && pLeft.relZ < 2400) {
          const isActive = idx === physicalStageIdx;
          const isHovered = idx === hoveredNodeIndexRef.current;
          const depthAlpha = Math.max(0.15, Math.min(1, (2400 - pLeft.relZ) / 1000));

          ctx.strokeStyle = isActive
            ? '#FFE279'
            : isHovered
            ? '#00F0FF'
            : `rgba(255, 95, 207, ${0.45 * depthAlpha})`;

          ctx.lineWidth = isActive ? 2.6 : isHovered ? 1.6 : Math.max(1.0, 1.3 * pLeft.scale);
          if (isActive) {
            ctx.shadowColor = '#FFE279';
            ctx.shadowBlur = 12;
          } else if (isHovered) {
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 8;
          }

          ctx.beginPath();
          ctx.moveTo(pLeft.x, pLeft.y);
          ctx.lineTo(pRight.x, pRight.y);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Date Ticker on the left side of every milestone rung
          if (pLeft.scale > 0.25) {
            ctx.font = `${isActive ? 'bold ' : '500 '}${Math.max(9, Math.round((isActive ? 12 : 10.5) * pLeft.scale))}px "Geist Mono", monospace`;
            ctx.fillStyle = isActive
              ? '#FFE279'
              : isHovered
              ? '#00F0FF'
              : `rgba(250, 235, 146, ${0.75 * depthAlpha})`;
            ctx.textAlign = 'right';
            ctx.fillText(`${evt.dateShort}`, pLeft.x - 10 * pLeft.scale, pLeft.y + 4 * pLeft.scale);
          }
        }
      });


      // 5. PAINTER'S ALGORITHM: SORT STAGES FROM FURTHEST TO CLOSEST
      const sortedStageIndices = TIMELINE_EVENTS.map((_, i) => i).sort((a, b) => {
        const zDistA = a * STAGE_SPACING - cameraZRef.current;
        const zDistB = b * STAGE_SPACING - cameraZRef.current;
        return zDistB - zDistA;
      });

      let closestNodeIdx: number | null = null;
      const minDistanceToMouse = 55;

      sortedStageIndices.forEach((idx) => {
        const evt = TIMELINE_EVENTS[idx];
        const stageZ = idx * STAGE_SPACING;

        let laneX = 0;
        if (evt.lane === 'left') laneX = -laneOffset;
        else if (evt.lane === 'right') laneX = laneOffset;
        else laneX = 0;

        const floatY = ROAD_HEIGHT - 34 + Math.sin(tick * 0.04 + idx * 1.5) * 7;
        const proj = project3D(laneX, floatY, stageZ, width, height);

        if (!proj || proj.relZ <= 15 || proj.relZ > 2400) return;

        // Smooth depth visibility & distance fade
        const depthAlpha = Math.max(0, Math.min(1, (2400 - proj.relZ) / 600));
        if (depthAlpha <= 0.01) return;

        const isActive = idx === physicalStageIdx;
        const isHovered = idx === hoveredNodeIndexRef.current;
        const isTargetActive = isActive || isHovered;

        // Smooth scroll-activated expansion progress (faster, snappier transition)
        const currentProg = expansionProgressRef.current[idx];
        const targetProg = isTargetActive ? 1.0 : 0.0;
        expansionProgressRef.current[idx] += (targetProg - currentProg) * 0.28;
        const expProgress = expansionProgressRef.current[idx];

        // ITSV Glitch Intensity:
        // 1. Snappy glitch during expansion on arrival
        const isExpanding = isTargetActive && expProgress > 0.05 && expProgress < 0.92;
        const expansionGlitch = isExpanding ? Math.sin(expProgress * Math.PI) : 0;

        // 2. Near-camera exit glitch: triggers only when almost about to scroll out of the card (relZ < 85)
        const nearExitGlitch = proj.relZ < 85 ? Math.pow((85 - proj.relZ) / 70, 1.6) : 0;

        // 3. Far-away horizon disappearance glitch (when points/cards are far away: relZ > 1600)
        const farDistanceGlitch = proj.relZ > 1600 ? Math.pow((proj.relZ - 1600) / 750, 1.3) : 0;

        const totalGlitch = Math.min(1.0, expansionGlitch + nearExitGlitch + farDistanceGlitch);
        const isOrbGlitching = isExpanding || nearExitGlitch > 0.04 || farDistanceGlitch > 0.04;
        const isCardGlitching = isOrbGlitching;

        // Jitter displacements
        const glitchShiftX = isCardGlitching ? (Math.sin(tick * 1.8 + idx * 4) * 4.5 * totalGlitch) : 0;
        const glitchShiftY = isCardGlitching && (tick + idx) % 2 === 0 ? (Math.cos(tick * 1.4 + idx) * 3.0 * totalGlitch) : 0;

        const baseRadius = (9 + 4 * expProgress) * proj.scale;

        // Pixel-accurate mouse hover detection
        const dx = mousePixelRef.current.x - proj.x;
        const dy = mousePixelRef.current.y - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < baseRadius + 30 && (!closestNodeIdx || dist < minDistanceToMouse)) {
          closestNodeIdx = idx;
        }

        // Drop stalk beam (with glitchy jitter on disappearance)
        const roadProj = project3D(laneX, ROAD_HEIGHT, stageZ, width, height);
        if (roadProj) {
          const beamJitterX = isOrbGlitching ? (Math.sin(tick * 2.8 + idx * 3.5) * 6.0) * totalGlitch : 0;
          ctx.strokeStyle = isOrbGlitching && totalGlitch > 0.25 && tick % 2 === 0 ? '#00F0FF' : evt.accentColor;
          ctx.lineWidth = Math.max(1, (1.2 + (totalGlitch > 0.2 ? 0.8 : 0)) * proj.scale);
          ctx.globalAlpha = 0.35 * Math.min(1, proj.scale * 1.5) * depthAlpha;
          ctx.beginPath();
          ctx.moveTo(proj.x + beamJitterX, proj.y);
          ctx.lineTo(roadProj.x - beamJitterX, roadProj.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(roadProj.x, roadProj.y, 18 * proj.scale, 6 * proj.scale, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }

        // Orb energy ring (with chromatic ghost ring split on disappearance)
        const pulse = (Math.sin(tick * 0.08 + idx) + 1) * 0.5;
        const ringRadius = baseRadius * (1.3 + pulse * 0.4);

        ctx.globalAlpha = depthAlpha;
        ctx.strokeStyle = isOrbGlitching ? (Math.random() > 0.5 ? '#00F0FF' : '#FF0055') : evt.accentColor;
        ctx.lineWidth = Math.max(1, (isOrbGlitching ? 2.4 : 1.8) * proj.scale);
        ctx.shadowColor = isOrbGlitching ? '#00F0FF' : evt.accentColor;
        ctx.shadowBlur = (10 + 10 * expProgress) * proj.scale;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Chromatic split ring when glitching / disappearing far away
        if (isOrbGlitching && totalGlitch > 0.12) {
          const ringGhostX = (Math.sin(tick * 3.2 + idx * 2) * 5) * totalGlitch;
          ctx.strokeStyle = '#00F0FF';
          ctx.beginPath();
          ctx.arc(proj.x - ringGhostX, proj.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = '#FF0055';
          ctx.beginPath();
          ctx.arc(proj.x + ringGhostX, proj.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // Core Sphere
        const orbGrad = ctx.createRadialGradient(
          proj.x - baseRadius * 0.3, proj.y - baseRadius * 0.3, baseRadius * 0.1,
          proj.x, proj.y, baseRadius
        );
        orbGrad.addColorStop(0, '#FFFFFF');
        orbGrad.addColorStop(0.3, isOrbGlitching ? (tick % 2 === 0 ? '#00F0FF' : '#FF5FCF') : evt.accentColor);
        orbGrad.addColorStop(1, '#020105');

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Digital pixel static bursts around orb when disappearing far away
        if (isOrbGlitching && totalGlitch > 0.2) {
          ctx.fillStyle = tick % 2 === 0 ? '#00F0FF' : '#FF5FCF';
          for (let k = 0; k < 3; k++) {
            const px = proj.x + (Math.sin(tick * 4 + k * 1.7 + idx) * 14) * totalGlitch;
            const py = proj.y + (Math.cos(tick * 3.5 + k * 2.1 + idx) * 12) * totalGlitch;
            ctx.fillRect(px, py, Math.max(1.5, 2.0 * proj.scale), Math.max(1.5, 2.0 * proj.scale));
          }
        }

        // =========================================================================
        // PROMINENT SPIDER-MAN ITSV GLITCH CARD (SHARP, SPACIOUS & LAPTOP-OPTIMIZED)
        // =========================================================================
        if (proj.scale > 0.18) {
          const isExpanded = expProgress > 0.40;
          const canonicalW = 165 + 105 * expProgress;
          const canonicalH = 55 + 145 * expProgress;
          const canonicalHeaderH = 15 + 13 * expProgress; // Slim, proportional 28px header
          const canonicalBodyH = canonicalH - canonicalHeaderH;

          // Scale cutoff glitch factor (ramps up when card is shrinking towards disappearance threshold 0.18)
          const scaleGlitch = proj.scale < 0.32 ? (0.32 - proj.scale) / 0.14 : 0;
          const effectiveCardGlitch = Math.min(1.0, totalGlitch + scaleGlitch * 0.7);
          const effectiveIsCardGlitching = isCardGlitching || scaleGlitch > 0.05;

          const cardFadeAlpha = depthAlpha * Math.min(1, (proj.scale - 0.18) / 0.08);
          ctx.globalAlpha = cardFadeAlpha;

          // STEP A: ITSV TRI-COLOR CHROMATIC GHOST SILHOUETTES
          if (effectiveIsCardGlitching) {
            const cmykColors = [
              { col: 'rgba(0, 240, 255, 0.75)', ox: -5.0 * effectiveCardGlitch, oy: -2.0 * effectiveCardGlitch }, // Cyan
              { col: 'rgba(255, 0, 85, 0.75)', ox: 5.0 * effectiveCardGlitch, oy: 2.0 * effectiveCardGlitch },   // Miles Magenta
              { col: 'rgba(255, 226, 121, 0.65)', ox: 0, oy: -4.0 * effectiveCardGlitch }                     // Acid Yellow
            ];

            cmykColors.forEach(ghost => {
              ctx.save();
              ctx.translate(proj.x + ghost.ox, proj.y - baseRadius - 8 * proj.scale + ghost.oy);
              ctx.scale(proj.scale, proj.scale);

              const gx = -canonicalW / 2;
              const gy = -canonicalH;

              ctx.strokeStyle = ghost.col;
              ctx.lineWidth = 2.0;
              ctx.shadowColor = ghost.col;
              ctx.shadowBlur = 10;
              ctx.strokeRect(gx, gy, canonicalW, canonicalH);

              ctx.fillStyle = ghost.col.replace('0.75', '0.12').replace('0.65', '0.10');
              ctx.fillRect(gx, gy, canonicalW, canonicalH);

              ctx.restore();
            });
          }

          // STEP B: MAIN CARD CONTAINER (GPU Hardware Scaled)
          ctx.save();
          ctx.translate(proj.x + glitchShiftX, proj.y - baseRadius - 8 * proj.scale + glitchShiftY);
          ctx.scale(proj.scale, proj.scale);

          const cardX = -canonicalW / 2;
          const cardY = -canonicalH;
          const bodyY = cardY + canonicalHeaderH;

          // 1. Solid Opaque Foundation
          ctx.fillStyle = '#020104';
          ctx.fillRect(cardX - 1, cardY - 1, canonicalW + 2, canonicalH + 2);

          // 2. Strict Rectangular Mask
          ctx.beginPath();
          ctx.rect(cardX, cardY, canonicalW, canonicalH);
          ctx.clip();

          // 3. CRT Monitor Gradient Header Bar (Yellow -> Pink -> Purple)
          if (effectiveIsCardGlitching) {
            const glitchHeaders = ['#FAEB92', '#FF5FCF', '#9929EA', '#00F0FF'];
            ctx.fillStyle = glitchHeaders[Math.floor(Math.random() * glitchHeaders.length)];
          } else {
            const headerGrad = ctx.createLinearGradient(cardX, cardY, cardX + canonicalW, cardY);
            headerGrad.addColorStop(0, '#FAEB92');    // Lemon / Yellow (top of CRT)
            headerGrad.addColorStop(0.48, '#FF5FCF'); // Neon Pink (mid of CRT)
            headerGrad.addColorStop(1, '#9929EA');    // Purple / Violet (bottom of CRT)
            ctx.fillStyle = headerGrad;
          }
          ctx.fillRect(cardX, cardY, canonicalW, canonicalHeaderH);

          // Header Gloss Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(cardX, cardY, canonicalW, canonicalHeaderH * 0.38);

          // Sleek Dark Red Rectangle Block (Shifted left from right border)
          const redW = isExpanded ? 18 : 11;
          const redH = isExpanded ? 13 : 8;
          const redX = cardX + canonicalW - redW - (isExpanded ? 8 : 5);
          const redY = cardY + Math.round((canonicalHeaderH - redH) / 2);

          ctx.fillStyle = '#9E1B1B';
          ctx.fillRect(redX, redY, redW, redH);

          // Glitch Header Text (Original Silkscreen / Press Start 2P)
          if (isExpanded) {
            ctx.font = 'bold 11px "Silkscreen", "Press Start 2P", monospace';
            const headerStr = scrambleDuringExpansion(`STAGE ${evt.stageNumber}`, effectiveIsCardGlitching ? effectiveCardGlitch : expProgress, tick);
            const headerTextY = cardY + canonicalHeaderH / 2 + 4.0;

            if (effectiveIsCardGlitching) {
              ctx.fillStyle = '#00F0FF';
              ctx.fillText(headerStr, -1.5, headerTextY);
              ctx.fillStyle = '#FF0055';
              ctx.fillText(headerStr, 1.5, headerTextY);
            }
            ctx.fillStyle = '#0A0314';
            ctx.textAlign = 'center';
            ctx.fillText(headerStr, 0, headerTextY);
          } else {
            ctx.font = 'bold 9.5px "Tahoma", sans-serif';
            ctx.fillStyle = '#0A0314';
            ctx.textAlign = 'left';
            const codeStr = scrambleDuringExpansion(`CU_${evt.stageCode}`, effectiveIsCardGlitching ? effectiveCardGlitch : expProgress, tick);
            ctx.fillText(codeStr, cardX + 6, cardY + 11);
          }

          // 4. Solid Black Body
          ctx.fillStyle = '#0A0514';
          ctx.fillRect(cardX, bodyY, canonicalW, canonicalBodyH);

          // STEP C: ITSV COMIC HALFTONE & HORIZONTAL BLOCK DISPLACEMENT SLICES
          if (effectiveIsCardGlitching) {
            const numSlices = 4;
            const sliceH = canonicalBodyH / numSlices;
            for (let s = 0; s < numSlices; s++) {
              if ((s + tick) % 2 === 0) {
                const sY = bodyY + s * sliceH;
                const sliceOffsetX = (Math.sin(tick * 3 + s * 5) * 7.5) * effectiveCardGlitch;
                const sliceColor = s % 3 === 0 ? 'rgba(0, 240, 255, 0.35)' : s % 3 === 1 ? 'rgba(255, 0, 85, 0.35)' : 'rgba(255, 226, 121, 0.35)';

                ctx.fillStyle = sliceColor;
                ctx.fillRect(cardX + sliceOffsetX, sY, canonicalW, sliceH - 1);
              }
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            for (let hx = cardX + 4; hx < cardX + canonicalW - 4; hx += 8) {
              for (let hy = bodyY + 4; hy < bodyY + canonicalBodyH - 4; hy += 8) {
                if ((hx + hy + tick * 4) % 16 === 0) {
                  ctx.fillRect(hx, hy, 2.5, 2.5);
                }
              }
            }
          }

          // STEP D: BODY CONTENT WITH GENEROUS LINE SPACING & CENTERED ALIGNMENT
          if (isExpanded) {
            // Line 1: Uppercase Title in Silkscreen / Press Start 2P
            ctx.font = 'bold 11px "Silkscreen", "Geist Mono", monospace';
            const titleStr = scrambleDuringExpansion(evt.title.toUpperCase(), effectiveIsCardGlitching ? effectiveCardGlitch : expProgress, tick);

            if (effectiveIsCardGlitching) {
              ctx.fillStyle = '#00F0FF';
              ctx.fillText(titleStr, -2, bodyY + 24);
              ctx.fillStyle = '#FF0055';
              ctx.fillText(titleStr, 2, bodyY + 24);
            }
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText(titleStr, 0, bodyY + 24);

            // Line 2: Full Description with Precomputed Zero-Reflow Lines Cache
            ctx.font = '500 10px "Geist Mono", "Silkscreen", monospace';
            const baseLines = precomputedDescRef.current[idx] || [evt.description];
            const descLines = effectiveIsCardGlitching
              ? baseLines.map(line => scrambleDuringExpansion(line, effectiveCardGlitch, tick))
              : baseLines;

            // Generous Vertical Centering between Title & Date
            const availableTop = bodyY + 42;
            const availableBottom = bodyY + canonicalBodyH - 26;
            const availableCenter = (availableTop + availableBottom) / 2;
            const lineSpacing = 17.5;
            const startY = availableCenter - ((descLines.length - 1) * lineSpacing) / 2;

            if (effectiveIsCardGlitching) {
              ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
              descLines.forEach((line, lIdx) => {
                ctx.fillText(line, -1.5, startY + lIdx * lineSpacing);
              });
            }

            ctx.fillStyle = '#FFE279';
            descLines.forEach((line, lIdx) => {
              ctx.fillText(line, 0, startY + lIdx * lineSpacing);
            });

            // Line 3: Big Bold Golden Timestamp in Silkscreen
            ctx.font = 'bold 11px "Silkscreen", "Geist Mono", monospace';
            const dateStr = scrambleDuringExpansion(`${evt.date.toUpperCase()}, ${evt.time.split(' ')[0]} ${evt.time.split(' ')[1] || ''}`, effectiveIsCardGlitching ? effectiveCardGlitch : expProgress, tick);

            if (effectiveIsCardGlitching) {
              ctx.fillStyle = '#FF0055';
              ctx.fillText(dateStr, 1.5, bodyY + canonicalBodyH - 14);
            }
            ctx.fillStyle = '#FFE279';
            ctx.fillText(dateStr, 0, bodyY + canonicalBodyH - 14);
          } else {
            // Compact Body
            ctx.font = 'bold 10px "Geist Mono", monospace';
            const shortTitle = evt.title.length > 18 ? evt.title.substring(0, 16) + '..' : evt.title;
            const scrambledShort = scrambleDuringExpansion(shortTitle, effectiveIsCardGlitching ? effectiveCardGlitch : expProgress, tick);

            if (effectiveIsCardGlitching) {
              ctx.fillStyle = '#00F0FF';
              ctx.fillText(scrambledShort, cardX + 5.5, bodyY + 15);
            }
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText(scrambledShort, cardX + 7, bodyY + 15);

            // Replaced lane label with Date & Time
            ctx.font = '8.5px "Geist Mono", monospace';
            const timeTag = evt.time.split(' ')[0] + ' ' + (evt.time.split(' ')[1] || '');
            const compactDateTime = `${evt.dateShort} • ${timeTag}`;
            const scrambledDate = scrambleDuringExpansion(compactDateTime, effectiveIsCardGlitching ? effectiveCardGlitch : expProgress, tick);

            if (effectiveIsCardGlitching) {
              ctx.fillStyle = '#FF0055';
              ctx.fillText(scrambledDate, cardX + 5.5, bodyY + 26);
            }
            ctx.fillStyle = effectiveIsCardGlitching ? '#FFE279' : evt.accentColor;
            ctx.fillText(scrambledDate, cardX + 7, bodyY + 26);
          }

          // STEP E: ELECTRIC MULTI-COLOR JAGGED ITSV BORDER
          if (effectiveIsCardGlitching) {
            const borderPalette = ['#00F0FF', '#FF0055', '#FFE279'];
            ctx.strokeStyle = borderPalette[tick % borderPalette.length];
            ctx.lineWidth = 2.4;
            ctx.shadowColor = borderPalette[(tick + 1) % borderPalette.length];
            ctx.shadowBlur = 12;
          } else {
            ctx.strokeStyle = isTargetActive ? '#FFE279' : evt.accentColor;
            ctx.lineWidth = isTargetActive ? 2.0 : 1.2;
            if (isTargetActive) {
              ctx.shadowColor = '#FFE279';
              ctx.shadowBlur = 8;
            }
          }
          ctx.strokeRect(cardX, cardY, canonicalW, canonicalH);
          ctx.shadowBlur = 0;

          ctx.restore();
          ctx.globalAlpha = 1.0;
        }
      });

      // Update hover state
      if (closestNodeIdx !== hoveredNodeIndexRef.current) {
        hoveredNodeIndexRef.current = closestNodeIdx;
        if (closestNodeIdx !== null) {
          setHoveredEvent(TIMELINE_EVENTS[closestNodeIdx]);
        } else {
          setHoveredEvent(null);
        }
      }

      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
    // The canvas renderer intentionally captures the pure scramble helper once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mouse move parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mousePosRef.current = { x, y };
    mousePixelRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseLeave = () => {
    mousePixelRef.current = { x: -1000, y: -1000 };
    setHoveredEvent(null);
    hoveredNodeIndexRef.current = null;
  };

  // Canvas Click: Open XP Dialog
  const handleClick = () => {
    if (hoveredNodeIndexRef.current !== null) {
      const selected = TIMELINE_EVENTS[hoveredNodeIndexRef.current];
      onSelectEvent(hoveredNodeIndexRef.current);
      onOpenDialog(selected);
      retroAudio.playXPDing();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="3D Timeline Road Interactive Canvas"
      className="w-full h-full absolute inset-0 cursor-crosshair select-none bg-[#020104]"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Hover Tooltip */}
      {hoveredEvent && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/95 backdrop-blur-xl border-2 px-5 py-2.5 rounded-xl shadow-[0_0_30px_rgba(255,95,207,0.4)] flex items-center gap-3 text-xs font-mono pointer-events-none transition-all z-30"
          style={{ borderColor: hoveredEvent.accentColor }}
        >
          <span className="text-white font-bold">{hoveredEvent.stageCode}:</span>
          <span className="text-gray-200 font-sans font-medium">{hoveredEvent.title}</span>
          <span className="text-gray-400">({hoveredEvent.date})</span>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-black uppercase"
            style={{ backgroundColor: `${hoveredEvent.accentColor}30`, color: hoveredEvent.accentColor }}
          >
            {hoveredEvent.lane.toUpperCase()} LANE
          </span>
          <span className="text-yellow-300 font-bold ml-1 animate-pulse">[ Click to open XP Dialog ]</span>
        </div>
      )}
    </div>
  );
};
