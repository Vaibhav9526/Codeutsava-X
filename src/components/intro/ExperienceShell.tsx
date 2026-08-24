"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import styles from "./ExperienceShell.module.css";

const GLYPHS = [..."CODEUTSAVA", " ", ..."X", ".O"];

export function ExperienceShell({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState(false);
  const reducedMotionRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let fallbackTimer: number | null = null;
    const idleHandle = idleWindow.requestIdleCallback?.(
      () => setHeroMounted(true),
      { timeout: 1200 },
    );

    if (idleHandle === undefined) {
      fallbackTimer = window.setTimeout(() => setHeroMounted(true), 350);
    }

    return () => {
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    const compactQuery = window.matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = compactQuery.matches || reducedMotionQuery.matches;

    reducedMotionRef.current = reducedMotionQuery.matches;
    const timer = window.setTimeout(() => setReady(true), compact ? 700 : 2350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (entered) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [entered]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const enter = () => {
    if (!ready || entering) return;
    setHeroMounted(true);
    setEntering(true);
    transitionTimerRef.current = window.setTimeout(() => {
      setEntered(true);
      transitionTimerRef.current = null;
    }, reducedMotionRef.current ? 180 : 640);
  };

  return (
    <div
      className={`${styles.experience} ${entering ? styles.entering : ""} ${entered ? styles.entered : ""}`}
    >
      <div className={styles.site}>{heroMounted ? children : null}</div>
      {!entered && (
        <div className={styles.transitionStage} aria-live="polite">
          <div className={styles.bootViewport}>
            <div className={styles.bloom} aria-hidden="true" />
            <div className={styles.scanlines} aria-hidden="true" />
            <div className={styles.noise} aria-hidden="true" />
            <section
              className={styles.bios}
              aria-label="Codeutsava X.0 startup screen"
            >
              <div className={styles.brand}>
                <Image
                  className={styles.mark}
                  src="/images/codeutsava/codeutsava-glitch-logo.png"
                  alt=""
                  width={180}
                  height={180}
                  priority
                />
                <h1 aria-label="Codeutsava X.0">
                  {GLYPHS.map((glyph, index) => (
                    <span
                      className={glyph === " " ? styles.wordSpace : undefined}
                      style={{ "--glyph-index": index } as CSSProperties}
                      key={`${glyph}-${index}`}
                    >
                      {glyph}
                    </span>
                  ))}
                </h1>
              </div>
              <div className={styles.systemCopy}>
                <p>Turing Club of Programmers, Website</p>
                <p>Version X.0</p>
              </div>
              <div className={styles.actionSlot}>
                {!ready ? (
                  <div
                    className={styles.loader}
                    aria-label="Initializing creative systems"
                  >
                    {Array.from({ length: 18 }, (_, index) => (
                      <span
                        key={index}
                        style={{ "--segment-index": index } as CSSProperties}
                      />
                    ))}
                  </div>
                ) : (
                  <button
                    className={styles.enterButton}
                    type="button"
                    onClick={enter}
                  >
                    <span>ENTER THE GLITCHVERSE</span>
                  </button>
                )}
              </div>
              <p className={styles.copyright}>
                Copyright (C) Turing Club of Programmers, 2026. All Rights
                Reserved.
              </p>
            </section>
            <div className={styles.glitchBars} aria-hidden="true">
              {Array.from({ length: 9 }, (_, index) => (
                <span
                  key={index}
                  style={{
                    "--bar-index": index,
                    "--tear-a": `${(index - 4) * 7}px`,
                    "--tear-b": `${(4 - index) * 11}px`,
                    "--tear-c": `${(index - 5) * 15}px`,
                    "--tear-d": `${(5 - index) * 13}px`,
                  } as CSSProperties}
                />
              ))}
            </div>
          </div>
          <div className={styles.flash} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
