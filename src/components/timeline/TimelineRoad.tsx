'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';
import { TimelineEvent, TIMELINE_EVENTS } from '@/data/timelineEvents';
import { retroAudio } from '@/utils/audioEffects';
import {
  Volume2,
  VolumeX
} from 'lucide-react';

const TimelineCanvas3D = dynamic(
  () => import('./TimelineCanvas3D').then(module => module.TimelineCanvas3D),
  { ssr: false }
);

const WindowsXPDialog = dynamic(
  () => import('./WindowsXPDialog').then(module => module.WindowsXPDialog),
  { ssr: false }
);

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 text-[#FF5FCF] opacity-70 clip-path-glitch-1 animate-pulse -translate-x-[1px] translate-y-[1px] pointer-events-none"
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 text-[#00F0FF] opacity-70 clip-path-glitch-2 animate-pulse translate-x-[1px] -translate-y-[1px] pointer-events-none"
      >
        {text}
      </span>
    </span>
  );
};

export const TimelineRoad: React.FC = () => {
  const stickyContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const [selectedModalEvent, setSelectedModalEvent] = useState<TimelineEvent | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(retroAudio.getMuted());
  const [isMobileTimeline, setIsMobileTimeline] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)');
    const updateMode = () => setIsMobileTimeline(media.matches);

    updateMode();
    media.addEventListener('change', updateMode);
    return () => media.removeEventListener('change', updateMode);
  }, []);

  // STICKY SCROLL PROGRESS TRACKING (Optimized with rAF & Threshold Deadband)
  useEffect(() => {
    if (isMobileTimeline !== false) return;

    let ticking = false;
    let lastProgress = -1;

    const updateScroll = () => {
      if (!stickyContainerRef.current) {
        ticking = false;
        return;
      }
      const rect = stickyContainerRef.current.getBoundingClientRect();
      const totalScrollDistance = rect.height - window.innerHeight;
      const currentScrollTop = -rect.top;

      if (totalScrollDistance > 0) {
        const progress = Math.max(0, Math.min(1, currentScrollTop / totalScrollDistance));
        // Only update state if delta exceeds precision threshold to prevent unnecessary React re-renders
        if (Math.abs(progress - lastProgress) > 0.0002 || progress === 0 || progress === 1) {
          lastProgress = progress;
          setScrollProgress(progress);
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileTimeline]);

  const handleSelectEvent = React.useCallback((index: number) => {
    setActiveEventIndex(prev => prev === index ? prev : index);
  }, []);

  const handleOpenDialog = React.useCallback((event: TimelineEvent) => {
    setSelectedModalEvent(event);
    retroAudio.playXPDing();
  }, []);

  const toggleMute = () => {
    const nextMuted = retroAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) retroAudio.playXPDing();
  };

  const timelineContent = isMobileTimeline === null ? (
    <section
      id="timeline"
      aria-busy="true"
      className="grid min-h-[70svh] place-items-center bg-[#020104] px-6 text-center"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FAEB92]/55">
        Loading timeline
      </p>
    </section>
  ) : isMobileTimeline ? (
    <section id="timeline" className="relative bg-[#020104] px-4 py-16 text-white">
      <div className="mx-auto max-w-xl">
        <header className="mb-9">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#FF5FCF]">
            Event sequence // tap for details
          </p>
          <h2
            className="text-[clamp(2.5rem,13vw,4.5rem)] font-black uppercase leading-[0.84] tracking-[-0.055em]"
            style={{ fontFamily: '"Arial Narrow", "Helvetica Neue", Arial, sans-serif' }}
          >
            The <span className="text-[#FAEB92]">timeline</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
            Follow every checkpoint on a fast, touch-friendly timeline built for smaller screens.
          </p>
        </header>

        <ol className="grid gap-4">
          {TIMELINE_EVENTS.map((event, index) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => {
                  handleSelectEvent(index);
                  handleOpenDialog(event);
                }}
                className="relative min-h-36 w-full overflow-hidden rounded-2xl border bg-[#09050d] p-5 text-left transition-colors active:bg-[#100717]"
                style={{ borderColor: `${event.accentColor}66` }}
                aria-label={`Open details for ${event.title}`}
              >
                <span
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ backgroundColor: event.accentColor }}
                  aria-hidden="true"
                />

                <span className="mb-4 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.14em]">
                  <span style={{ color: event.accentColor }}>{event.stageCode}</span>
                  <span className="text-white/50">{event.dateShort} · {event.time}</span>
                </span>

                <strong className="block text-lg font-extrabold leading-tight text-[#FAEB92]">
                  {event.title}
                </strong>
                <span className="mt-2 block text-[13px] leading-5 text-white/60">
                  {event.description}
                </span>

                <span className="mt-4 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.12em]">
                  <span className="text-white/50">{event.category}</span>
                  <span style={{ color: event.accentColor }}>View details →</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  ) : (
    <section
      id="timeline"
      ref={stickyContainerRef}
      className="relative w-full bg-[#020104]"
      style={{ height: `${(TIMELINE_EVENTS.length + 2) * 72}vh` }}
    >
      {/* FULLSCREEN PINNED STICKY VIEWPORT (100vw x 100vh) */}
      <div className="sticky top-0 flex h-[100svh] w-full select-none flex-col justify-between overflow-hidden">

        {/* 1. FULL-BLEED 3D PERSPECTIVE CANVAS */}
        <TimelineCanvas3D
          activeEventIndex={activeEventIndex}
          onSelectEvent={handleSelectEvent}
          onOpenDialog={handleOpenDialog}
          scrollProgress={scrollProgress}
          setScrollProgress={setScrollProgress}
        />

        {/* 2. TOP FLOATING HUD OVERLAY */}
        <div className="relative z-40 w-full pt-6 px-6 sm:px-10 pointer-events-none flex items-start justify-between">

          {/* Left Headline (Styled with Build Beyond The Screen Font & Typography) */}
          <div className="pointer-events-auto max-w-xl">
            <h2
              className="text-2xl sm:text-4xl lg:text-[44px] uppercase select-none leading-[0.92] tracking-[-0.045em] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: '"Arial Narrow", "Helvetica Neue", Arial, sans-serif', fontWeight: 800 }}
            >
              <span className="text-white">THE </span>
              <GlitchText text="TIMELINE" className="text-[#FAEB92]" />
              <span className="text-white"> TO THE</span>
              <br />
              <span
                className="text-[#FF5FCF] inline-block mt-1"
                style={{
                  textShadow: '3px 3px 0 #9929EA, 0 0 20px rgba(255,95,207,0.5)',
                  filter: 'drop-shadow(0 0 15px rgba(255,95,207,0.4))'
                }}
              >
                GLITCHVERSE
              </span>
            </h2>
          </div>

          {/* Right Sleek Purple Volume Toggle Button */}
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={toggleMute}
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer border shadow-lg
                ${!isMuted
                  ? 'bg-[#9929EA]/25 text-[#FF5FCF] border-[#FF5FCF]/50 hover:bg-[#9929EA]/40 hover:scale-105 shadow-[0_0_20px_rgba(153,41,234,0.4)]'
                  : 'bg-black/60 text-gray-500 border-white/10 hover:bg-black/80 hover:text-gray-300'
                }
              `}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {!isMuted ? (
                <Volume2 className="w-5 h-5 text-[#FF5FCF] drop-shadow-[0_0_8px_#FF5FCF]" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Empty bottom spacer for pristine clean view */}
        <div className="relative z-40 w-full pointer-events-none pb-4" />
      </div>
    </section>
  );

  return (
    <>
      {timelineContent}
      {selectedModalEvent && (
          <div
            onClick={() => setSelectedModalEvent(null)}
            role="presentation"
            className={`fixed inset-0 z-[10000] flex cursor-pointer items-center justify-center bg-black/90 ${isMobileTimeline ? 'p-2' : 'p-4 backdrop-blur-md'}`}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              role="presentation"
              className="cursor-default w-full max-w-[600px]"
            >
              <WindowsXPDialog
                event={selectedModalEvent}
                isFloatingModal={true}
                onClose={() => setSelectedModalEvent(null)}
                onSelectNext={
                  activeEventIndex < TIMELINE_EVENTS.length - 1
                    ? () => handleSelectEvent(activeEventIndex + 1)
                    : undefined
                }
                onSelectPrev={
                  activeEventIndex > 0
                    ? () => handleSelectEvent(activeEventIndex - 1)
                    : undefined
                }
              />
            </div>
          </div>
      )}
    </>
  );
};
