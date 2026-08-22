"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import styles from "./ExperienceShell.module.css";

const GLYPHS = [..."CODEUTSAVA", " ", ..."X", ".O"];

export function ExperienceShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState(false);
  const [entered, setEntered] = useState(false);
  const compactModeRef = useRef(false);

  useEffect(() => {
    const compactQuery = window.matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = compactQuery.matches || reducedMotionQuery.matches;

    compactModeRef.current = compact;
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

  const enter = () => {
    if (!ready || entering) return;
    setEntering(true);
    window.setTimeout(() => setEntered(true), compactModeRef.current ? 420 : 1450);
  };

  return (
    <div
      className={`${styles.experience} ${entering ? styles.entering : ""} ${entered ? styles.entered : ""}`}
    >
      <div className={styles.site}>{children}</div>
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
                  <GradientButton
                    className="min-h-[52px] w-full gap-4 px-6 font-mono text-[clamp(.68rem,.92vw,.84rem)] tracking-[.12em]"
                    type="button"
                    onClick={enter}
                  >
                    <span>ENTER THE GLITCHVERSE</span>
                    <span aria-hidden="true">-&gt;</span>
                  </GradientButton>
                )}
              </div>
              <p className={styles.copyright}>
                Copyright (C) Turing Club of Programmers, 2026. All Rights
                Reserved.
              </p>
            </section>
          </div>
          <div className={styles.flash} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
