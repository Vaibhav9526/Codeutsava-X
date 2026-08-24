'use client';

import { motion, type Transition } from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
} from 'react';

type ScrambleOptions = {
  speed?: number;
  cycles?: number;
  chars?: string;
};

type SweepOptions = {
  color?: string;
  speed?: number;
  count?: number;
  width?: number;
};

type BorderOptions = {
  color?: string;
  width?: number;
};

type EncryptButtonProps = {
  label?: string;
  font?: CSSProperties;
  fill?: string;
  textColor?: string;
  hoverTextColor?: string;
  paddingX?: number;
  paddingY?: number;
  rounded?: number;
  scrambleOptions?: ScrambleOptions;
  sweep?: boolean;
  sweepOptions?: SweepOptions;
  border?: boolean;
  borderOptions?: BorderOptions;
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const DEFAULTS = {
  label: 'Hover Me',
  fill: '#ffffff',
  textColor: '#000000',
  hoverTextColor: '#000000',
  paddingX: 48,
  paddingY: 24,
  rounded: 16,
  scrambleOptions: {
    speed: 60,
    cycles: 4,
    chars: '!@#$%^&*():{};|,.<>/?',
  },
  sweepOptions: {
    color: '#818cf8',
    speed: 7,
    count: 2,
    width: 8,
  },
  borderOptions: {
    color: '#737373',
    width: 1,
  },
  transition: {
    type: 'tween',
    duration: 0.3,
    ease: 'easeInOut',
  } satisfies Transition,
} as const;

const MIN_STEP_MS = 16;
const SWEEP_SECONDS_SLOW = 2;
const SWEEP_SECONDS_FAST = 0.15;
const TRAIL_SHORT = 6;
const TRAIL_LONG = 0.001;
const FACE_AT = 50;
const FACE_EDGE = 1.5;
const BAND_SCALE = 1.25;
const FLIP_SHARE = 0.001;

function mapSlider(value: number, outputStart: number, outputEnd: number) {
  const normalized = (Math.min(10, Math.max(1, value)) - 1) / 9;
  return outputStart + (outputEnd - outputStart) * normalized;
}

export default function EncryptButton({
  label = DEFAULTS.label,
  font,
  fill = DEFAULTS.fill,
  textColor = DEFAULTS.textColor,
  hoverTextColor = DEFAULTS.hoverTextColor,
  paddingX = DEFAULTS.paddingX,
  paddingY = DEFAULTS.paddingY,
  rounded = DEFAULTS.rounded,
  scrambleOptions = DEFAULTS.scrambleOptions,
  sweep = true,
  sweepOptions = DEFAULTS.sweepOptions,
  border = false,
  borderOptions = DEFAULTS.borderOptions,
  transition = DEFAULTS.transition,
  className,
  style,
  disabled = false,
  onClick,
}: EncryptButtonProps) {
  const [text, setText] = useState(label);
  const [hovered, setHovered] = useState(false);
  const animationFrame = useRef<number | null>(null);
  const config = useRef({ label, scrambleOptions });

  useEffect(() => {
    config.current = { label, scrambleOptions };
  }, [label, scrambleOptions]);

  const borderWidth = border ? (borderOptions.width ?? DEFAULTS.borderOptions.width) : 0;
  const sweepSeconds = mapSlider(
    sweepOptions.speed ?? DEFAULTS.sweepOptions.speed,
    SWEEP_SECONDS_SLOW,
    SWEEP_SECONDS_FAST,
  );
  const sweepCount = Math.max(1, Math.round(sweepOptions.count ?? DEFAULTS.sweepOptions.count));
  const trail = mapSlider(
    sweepOptions.width ?? DEFAULTS.sweepOptions.width,
    TRAIL_SHORT,
    TRAIL_LONG,
  );

  const yKeyframes: string[] = ['-100%'];
  const yTimes: number[] = [0];
  const flipKeyframes: number[] = [];
  const flipTimes: number[] = [];

  for (let index = 0; index < sweepCount; index += 1) {
    const downward = index % 2 === 0;
    const start = index / sweepCount;
    const end = (index + 1) / sweepCount;

    yKeyframes.push(downward ? '100%' : '-100%');
    yTimes.push(end);

    const facing = downward ? BAND_SCALE : -BAND_SCALE;
    flipKeyframes.push(facing, facing);
    flipTimes.push(start, index === sweepCount - 1 ? end : end - FLIP_SHARE / sweepCount);
  }

  const stopScramble = () => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = null;
    setText(config.current.label);
  };

  const startScramble = () => {
    if (disabled) return;

    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
    }

    const { label: target, scrambleOptions: options } = config.current;
    const chars = options.chars?.length ? options.chars : DEFAULTS.scrambleOptions.chars;
    const cycles = Math.max(1, options.cycles ?? DEFAULTS.scrambleOptions.cycles);
    const speed = Math.max(1, options.speed ?? DEFAULTS.scrambleOptions.speed);
    const stepMs = Math.max(MIN_STEP_MS, 1000 / speed);
    const letters = [...target];
    const totalSteps = letters.length * cycles;
    let step = 0;
    let lastFrame = 0;

    const tick = (now: number) => {
      if (!lastFrame) lastFrame = now;

      if (now - lastFrame >= stepMs) {
        lastFrame = now;
        setText(
          letters
            .map((character, index) => {
              if (step / cycles > index || !character.trim()) return character;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(''),
        );
        step += 1;

        if (step >= totalSteps) {
          animationFrame.current = null;
          setText(target);
          return;
        }
      }

      animationFrame.current = requestAnimationFrame(tick);
    };

    animationFrame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (animationFrame.current === null) setText(label);
  }, [label]);

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <motion.button
      type='button'
      aria-label={label}
      className={className}
      disabled={disabled}
      initial={false}
      onClick={onClick}
      onHoverStart={() => {
        setHovered(true);
        startScramble();
      }}
      onHoverEnd={() => {
        setHovered(false);
        stopScramble();
      }}
      onFocus={() => {
        setHovered(true);
        startScramble();
      }}
      onBlur={() => {
        setHovered(false);
        stopScramble();
      }}
      style={{
        ...style,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: 'fit-content',
        padding: `${paddingY}px ${paddingX}px`,
        borderRadius: rounded,
        background: fill,
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderOptions.color}` : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {sweep && hovered ? (
        <motion.span
          aria-hidden='true'
          initial={{ y: '-100%', scaleY: BAND_SCALE }}
          animate={{ y: yKeyframes, scaleY: flipKeyframes }}
          transition={{
            y: { duration: sweepSeconds * sweepCount, ease: 'linear', times: yTimes },
            scaleY: { duration: sweepSeconds * sweepCount, ease: 'linear', times: flipTimes },
          }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            scale: `${BAND_SCALE} 1`,
            background: `linear-gradient(to bottom, transparent ${FACE_AT - trail}%, ${sweepOptions.color} ${FACE_AT}%, transparent ${FACE_AT + FACE_EDGE}%)`,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      <motion.span
        initial={false}
        animate={{ color: hovered ? hoverTextColor : textColor }}
        transition={transition}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          ...font,
        }}
      >
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span aria-hidden='true' style={{ visibility: 'hidden' }}>
            {label}
          </span>
          <span
            aria-hidden='true'
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {text}
          </span>
        </span>
      </motion.span>
    </motion.button>
  );
}
