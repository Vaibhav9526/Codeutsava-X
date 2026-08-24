import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '@/data/timelineEvents';
import { retroAudio } from '@/utils/audioEffects';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Flame,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface WindowsXPDialogProps {
  event: TimelineEvent;
  isExpanded?: boolean;
  onClose?: () => void;
  onSelectNext?: () => void;
  onSelectPrev?: () => void;
  isFloatingModal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const WindowsXPDialog: React.FC<WindowsXPDialogProps> = ({
  event,
  onClose,
  onSelectNext,
  onSelectPrev,
  isFloatingModal = false,
  className = '',
  style
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'raw_log' | 'diagnostics'>('details');
  const [isGlitching, setIsGlitching] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [prevEventId, setPrevEventId] = useState(event.id);
  const [isMaterializing, setIsMaterializing] = useState(true);

  if (prevEventId !== event.id) {
    setPrevEventId(event.id);
    setIsMaterializing(true);
  }

  // Trigger Spider-Verse Glitch Materialize shader when stage changes
  useEffect(() => {
    if (isMaterializing) {
      const timer = setTimeout(() => setIsMaterializing(false), 460);
      return () => clearTimeout(timer);
    }
  }, [isMaterializing]);

  const handleCopy = () => {
    retroAudio.playXPClick();
    const textToCopy = `Codeutsava Event: ${event.title}\nDate: ${event.date}, ${event.time}\nStage: ${event.stageCode}\nLane: ${event.lane.toUpperCase()}\nDetails: ${event.description}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClose = () => {
    retroAudio.playXPClick();
    setIsExiting(true);
    setTimeout(() => {
      if (onClose) onClose();
      setIsExiting(false);
    }, 420);
  };

  const handleActionClick = () => {
    retroAudio.playXPDing();
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 600);

    if (event.category === 'Finale') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5FCF', '#9929EA', '#FFE279', '#00F0FF']
      });
    }
  };

  const laneColor = event.accentColor;
  const laneLabel = event.lane === 'middle' ? 'MIDDLE LANE' : event.lane === 'left' ? 'LEFT LANE' : 'RIGHT LANE';

  return (
    <div
      style={style}
      className={`
        relative rounded-t-lg rounded-b-none overflow-hidden select-none flex flex-col
        border-[3px] border-[#0055EA] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(153,41,234,0.3)]
        bg-[#ECE9D8] text-[#111111] font-sans
        ${isFloatingModal ? 'w-[95vw] sm:w-[92vw] max-w-[580px] max-h-[88vh] z-50 cursor-grab active:cursor-grabbing' : 'w-full'}
        ${isExiting ? 'card-glitch-disintegrate' : isMaterializing ? 'card-glitch-materialize' : ''}
        ${isGlitching ? 'animate-glitch' : ''}
        ${className}
      `}
    >
      {/* WINDOWS XP BLUE HEADER BAR */}
      <div
        className="relative h-8 px-2 flex items-center justify-between overflow-hidden cursor-move border-b border-[#0038A8] shrink-0"
        style={{
          background: 'linear-gradient(180deg, #0058EE 0%, #3593FF 10%, #288EFF 25%, #0055EA 90%, #0046D5 100%)'
        }}
      >
        {/* XP Gloss highlight */}
        <div className="absolute inset-x-0 top-0 h-[45%] bg-white/25 pointer-events-none" />

        {/* Title & Icon */}
        <div className="flex items-center gap-2 z-10 min-w-0 pr-2">
          <div className="w-4 h-4 rounded-sm flex items-center justify-center bg-white/10 shadow-inner flex-shrink-0">
            {event.xpIcon === 'alert' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-300 drop-shadow" />
            ) : event.xpIcon === 'trophy' ? (
              <Flame className="w-3.5 h-3.5 text-amber-300 drop-shadow" />
            ) : event.xpIcon === 'cmd' ? (
              <Terminal className="w-3.5 h-3.5 text-green-300 drop-shadow" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-sky-200 drop-shadow" />
            )}
          </div>
          <span
            className="text-[11px] sm:text-[12px] font-bold text-white tracking-wide truncate drop-shadow-[1px_1px_1px_#09265B]"
            style={{ fontFamily: '"Tahoma", "Segoe UI", sans-serif' }}
          >
            {event.xpFileName} - Codeutsava XP
          </span>
        </div>

        {/* Windows XP Window Buttons (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-1 z-10 flex-shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); retroAudio.playXPClick(); }}
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#3C89FF] to-[#0055EA] border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-center hover:brightness-110 active:brightness-90 transition-all cursor-pointer"
            title="Minimize"
          >
            <span className="w-2.5 h-[2px] bg-white block mb-[-6px]" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); retroAudio.playXPClick(); }}
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#3C89FF] to-[#0055EA] border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-center hover:brightness-110 active:brightness-90 transition-all cursor-pointer"
            title="Maximize"
          >
            <span className="w-2.5 h-2.5 border-[1.5px] border-white block rounded-[1px]" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="w-5 h-5 rounded-[3px] bg-gradient-to-b from-[#E04343] via-[#D32828] to-[#990D0D] border border-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_4px_rgba(255,0,0,0.5)] flex items-center justify-center hover:brightness-125 active:brightness-75 transition-all cursor-pointer"
            title="Close"
          >
            <span className="text-white text-[11px] font-black leading-none select-none">✕</span>
          </button>
        </div>
      </div>

      {/* WINDOWS XP CLASSIC MENU STRIP */}
      <div className="h-6 bg-[#ECE9D8] border-b border-[#D0CCB8] px-2 flex items-center gap-3 text-[11px] text-[#222222] font-sans shrink-0 overflow-x-auto">
        <button
          onClick={() => { retroAudio.playXPClick(); setActiveTab('details'); }}
          className={`px-1.5 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white cursor-pointer transition-colors ${activeTab === 'details' ? 'font-bold' : ''}`}
        >
          <span className="underline">F</span>ile
        </button>
        <button
          onClick={() => { retroAudio.playXPClick(); setActiveTab('raw_log'); }}
          className={`px-1.5 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white cursor-pointer transition-colors ${activeTab === 'raw_log' ? 'font-bold' : ''}`}
        >
          <span className="underline">E</span>dit
        </button>
        <button
          onClick={() => { retroAudio.playXPClick(); setActiveTab('diagnostics'); }}
          className={`px-1.5 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white cursor-pointer transition-colors ${activeTab === 'diagnostics' ? 'font-bold' : ''}`}
        >
          <span className="underline">V</span>iew
        </button>
        <button
          onClick={handleCopy}
          className="px-1.5 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white cursor-pointer transition-colors"
        >
          <span className="underline">C</span>opy
        </button>
        <button
          onClick={() => retroAudio.playXPDing()}
          className="px-1.5 py-0.5 rounded-sm hover:bg-[#316AC5] hover:text-white cursor-pointer transition-colors ml-auto text-[#0055EA] font-semibold"
        >
          <span className="underline">H</span>elp
        </button>
      </div>

      {/* MAIN INNER DIALOG CONTENT (NOTEPAD / CYBER RETRO) */}
      <div className="p-3 sm:p-3.5 bg-[#0D0B18] text-white font-mono min-h-[220px] max-h-[62vh] overflow-y-auto relative border-2 border-inset border-[#808080] flex-1">

        {/* Subtle Cyber Grid Background in Notepad */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${laneColor} 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        {/* Top Diagnostics Header */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-[10px] text-gray-400">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="inline-block w-2 h-2 rounded-full animate-ping shrink-0" style={{ backgroundColor: laneColor }} />
            <span className="font-bold text-white tracking-wider">{event.stageCode}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-300 truncate">{event.memoryAddress}</span>
          </div>

          <div
            className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0"
            style={{
              backgroundColor: `${laneColor}20`,
              color: laneColor,
              border: `1px solid ${laneColor}50`
            }}
          >
            {laneLabel}
          </div>
        </div>

        {activeTab === 'details' && (
          <div className="space-y-3">
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase"
                  style={{ backgroundColor: `${laneColor}30`, color: laneColor }}
                >
                  {event.phase}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">[{event.category}]</span>
              </div>

              <h3
                className="text-base sm:text-xl font-black tracking-tight text-white flex items-center gap-2"
                style={{ textShadow: `0 0 15px ${laneColor}60` }}
              >
                {event.title}
              </h3>
            </div>

            {/* Date & Time Capsule */}
            <div className="flex flex-wrap items-center gap-2 py-1.5 px-2.5 rounded bg-white/5 border border-white/10 text-xs">
              <div className="flex items-center gap-1.5 text-[#FFE279]">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold">{event.date}</span>
              </div>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1.5 text-[#FF5FCF]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="ml-auto">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  event.status === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' :
                  event.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                  'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}>
                  ● {event.status}
                </span>
              </div>
            </div>

            {/* Description Text with Notepad look */}
            <div className="p-2.5 rounded bg-black/40 border border-white/10 text-[12px] leading-relaxed text-gray-200">
              <p className="font-sans text-[12px] sm:text-[13px]">{event.description}</p>
            </div>

            {/* Event Key Protocols */}
            {event.details && event.details.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  &gt; STAGE_DIRECTIVES.LOG:
                </div>
                <ul className="space-y-1 text-[11px] text-gray-300">
                  {event.details.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'raw_log' && (
          <div className="text-[11px] text-green-400 bg-black/70 p-3 rounded border border-green-500/30 space-y-1.5">
            <p className="text-gray-400">{'// CODEUTSAVA KERNEL LOG DUMP'}</p>
            <p>&gt; EXEC: {event.xpFileName}</p>
            <p>&gt; STAMP: {event.date} - {event.time}</p>
            <p>&gt; ADDR: {event.memoryAddress}</p>
            <p>&gt; LANE: {event.lane.toUpperCase()} [INDEX: {event.laneIndex}]</p>
            <p>&gt; STATUS: {event.status}</p>
            <p>&gt; PAYLOAD: {event.title}</p>
            <p className="text-yellow-400">&gt; CRC32: 0x889FA02C [VERIFIED]</p>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="text-[11px] text-purple-300 bg-black/70 p-3 rounded border border-purple-500/30 space-y-2">
            <p className="font-bold text-white">System Diagnostics (Windows XP x Codeutsava)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
              <div className="bg-white/5 p-1.5 rounded">
                <span className="text-gray-400">Total Teams:</span>
                <p className="text-white font-bold">2,500+ Registered</p>
              </div>
              <div className="bg-white/5 p-1.5 rounded">
                <span className="text-gray-400">Prize Pool:</span>
                <p className="text-[#FFE279] font-bold">₹2,50,000 INR</p>
              </div>
              <div className="bg-white/5 p-1.5 rounded">
                <span className="text-gray-400">Hack Duration:</span>
                <p className="text-[#FF5FCF] font-bold">28 Hours Non-Stop</p>
              </div>
              <div className="bg-white/5 p-1.5 rounded">
                <span className="text-gray-400">Venue:</span>
                <p className="text-[#00F0FF] font-bold">CCC, NIT Raipur</p>
              </div>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS (AUTHENTIC XP 3D BEVELED BUTTONS) */}
        <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {onSelectPrev && (
              <button
                type="button"
                onClick={() => { retroAudio.playXPClick(); onSelectPrev(); }}
                className="px-2.5 py-1 text-[11px] font-sans font-bold bg-[#ECE9D8] text-black border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white shadow hover:brightness-105 cursor-pointer rounded-[2px]"
              >
                &lt; Prev
              </button>
            )}
            {onSelectNext && (
              <button
                type="button"
                onClick={() => { retroAudio.playXPClick(); onSelectNext(); }}
                className="px-2.5 py-1 text-[11px] font-sans font-bold bg-[#ECE9D8] text-black border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white shadow hover:brightness-105 cursor-pointer rounded-[2px]"
              >
                Next &gt;
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1 text-[11px] font-sans font-medium bg-[#ECE9D8] text-black border-2 border-t-white border-l-white border-b-[#404040] border-r-[#404040] active:border-t-[#404040] active:border-l-[#404040] active:border-b-white active:border-r-white shadow hover:brightness-105 cursor-pointer rounded-[2px] flex items-center gap-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleActionClick}
              className="px-3.5 py-1 text-[11px] font-sans font-black bg-gradient-to-b from-[#FFF089] to-[#FFCF25] text-[#0A0518] border-2 border-t-white border-l-white border-b-[#6B4B00] border-r-[#6B4B00] active:border-t-[#6B4B00] active:border-l-[#6B4B00] active:border-b-white active:border-r-white shadow-[0_0_10px_rgba(255,226,121,0.5)] hover:brightness-110 cursor-pointer rounded-[2px] flex items-center gap-1.5"
            >
              <span>{event.actionText}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* WINDOWS XP BOTTOM STATUS BAR */}
      <div className="h-5 bg-[#ECE9D8] border-t border-[#D0CCB8] px-2 flex items-center justify-between text-[10px] text-[#444444] font-sans shrink-0">
        <div className="flex items-center gap-3">
          <span className="border-r border-[#D0CCB8] pr-2">Stage {event.stageNumber} of 12</span>
          <span className="border-r border-[#D0CCB8] pr-2 hidden sm:inline">{event.phaseCode}</span>
          <span className="font-semibold text-[#0055EA]">{laneLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="border-l border-[#D0CCB8] pl-2 hidden sm:inline">100% ZOOM</span>
          <span className="border-l border-[#D0CCB8] pl-2 font-mono text-[9px]">UTF-8</span>
        </div>
      </div>
    </div>
  );
};
