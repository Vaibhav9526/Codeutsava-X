"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type CSSProperties } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import EncryptButton from "@/components/originkit/ui/encrypt-button";
import { useRichEffects } from "@/hooks/useRichEffects";
import styles from "./GlitchverseHero.module.css";

const PrismGrid = dynamic(() => import("@/components/originkit/ui/prism-grid"), {
  ssr: false,
});

type HeroStyle = CSSProperties & {
  "--pointer-x": string;
  "--pointer-y": string;
  "--tilt-x": string;
  "--tilt-y": string;
  "--screen-x": string;
  "--screen-y": string;
  "--float-x": string;
  "--float-y": string;
  "--reverse-x": string;
  "--reverse-y": string;
};

const initialHeroStyle: HeroStyle = {
  "--pointer-x": "0px",
  "--pointer-y": "0px",
  "--tilt-x": "0deg",
  "--tilt-y": "0deg",
  "--screen-x": "0px",
  "--screen-y": "0px",
  "--float-x": "0px",
  "--float-y": "0px",
  "--reverse-x": "0px",
  "--reverse-y": "0px",
};

export function GlitchverseHero() {
  const heroRef = useRef<HTMLElement>(null);
  const richEffects = useRichEffects();

  useEffect(() => {
    if (!richEffects) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let animationFrame = 0;

    const followCursor = () => {
      const element = heroRef.current;
      if (!element) {
        animationFrame = 0;
        return;
      }

      current.x += (target.x - current.x) * 0.24;
      current.y += (target.y - current.y) * 0.24;

      element.style.setProperty("--pointer-x", `${current.x * 90}px`);
      element.style.setProperty("--pointer-y", `${current.y * 62}px`);
      element.style.setProperty("--tilt-x", `${current.y * -26}deg`);
      element.style.setProperty("--tilt-y", `${current.x * 34}deg`);
      element.style.setProperty("--screen-x", `${current.x * -28}px`);
      element.style.setProperty("--screen-y", `${current.y * -22}px`);
      element.style.setProperty("--float-x", `${current.x * 50}px`);
      element.style.setProperty("--float-y", `${current.y * 36}px`);
      element.style.setProperty("--reverse-x", `${current.x * -56}px`);
      element.style.setProperty("--reverse-y", `${current.y * -42}px`);

      const moving =
        Math.abs(target.x - current.x) > 0.0001 ||
        Math.abs(target.y - current.y) > 0.0001;
      animationFrame = moving ? requestAnimationFrame(followCursor) : 0;
    };

    const moveMonitor = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "touch") return;

      target.x = Math.max(-0.5, Math.min(0.5, event.clientX / window.innerWidth - 0.5));
      target.y = Math.max(-0.5, Math.min(0.5, event.clientY / window.innerHeight - 0.5));
      if (!animationFrame) animationFrame = requestAnimationFrame(followCursor);
    };

    window.addEventListener("pointermove", moveMonitor, { passive: true });
    return () => {
      window.removeEventListener("pointermove", moveMonitor);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [richEffects]);

  return (
    <main
      className={styles.hero}
      id="top"
      ref={heroRef}
      style={initialHeroStyle}
    >
      {richEffects && (
        <div className={styles.prismBackdrop} aria-hidden="true">
          <PrismGrid
            backgroundColor="transparent"
            boxSize={62}
            borderWidth={1}
            borderColor="rgba(153, 41, 234, 0.28)"
            rotate={{ x: -10, y: 7 }}
            colors={{
              paletteCount: 4,
              color1: "#000000",
              color2: "#9929EA",
              color3: "#FF5FCF",
              color4: "#FAEB92",
            }}
          />
        </div>
      )}
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.cursorGlow} aria-hidden="true" />

      <Navbar />

      <section className={styles.heroGrid} aria-labelledby="hero-title">
        <div className={styles.copy} id="brief">
          <div className={styles.kicker}>
            <span>CODEUTSAVA X</span>
            <span className={styles.kickerRule} />
            <span>GLITCH &times; ILLUSION</span>
          </div>

          <h1 className={styles.title} id="hero-title">
            <span>WELCOME TO</span>
            <span>CODEUTSAVA X.0</span>
            <span className={styles.screenWord}>CODE . INNOVATE . CELEBRATE</span>
          </h1>

          <div className={styles.copyFooter} id="join">
            <p>
              CodeUtsava X is the 10th edition of NIT Raipur&apos;s flagship
              technology celebration&mdash;uniting students and developers to build, learn, compete, and reimagine what technology can do.
            </p>
          </div>
        </div>

        <div className={styles.visual} id="signal" aria-label="CodeUtsava identity transmission">
          <div className={`${styles.heroActions} flex flex-wrap items-center justify-center gap-6 mb-10 z-10`}>
            <EncryptButton
              label="REGISTER"
              sweep={false}
              fill="#faeb92"
              textColor="#000000"
              hoverTextColor="#9929ea"
              paddingX={40}
              paddingY={16}
              rounded={4}
              border
              borderOptions={{ color: "#ff5fcf", width: 1 }}
              font={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
              scrambleOptions={{ speed: 95, cycles: 8 }}
            />
            <button className="gradient-button-variant px-10 py-4 rounded font-mono font-bold text-sm tracking-widest text-white transition-transform hover:scale-105 active:scale-95">
              COMING SOON
            </button>
          </div>

          <span className={`${styles.codeFragment} ${styles.fragmentOne}`} aria-hidden="true">
            EDITION//10
          </span>
          <span className={`${styles.codeFragment} ${styles.fragmentTwo}`} aria-hidden="true">
            SIGNAL//LIVE
          </span>
          <span className={`${styles.codeFragment} ${styles.fragmentThree}`} aria-hidden="true">
            &lt;/PERCEPTION&gt;
          </span>

          <div
            className={styles.mobileWordmark}
            role="img"
            aria-label="CodeUtsava X. The edition mark glitches between X, das in Hindi, 10, and X point 0."
          >
            <strong className={styles.mobileBrand} aria-hidden="true">
              <span className={styles.mobileBrandName} data-text="CODEUTSAVA">
                CODEUTSAVA
              </span>
              <span className={styles.mobileEditionCycle}>
                <span className={styles.mobileEditionX}>X</span>
                <span className={styles.mobileEditionDas} lang="hi">दस</span>
                <span className={styles.mobileEditionTen}>10</span>
                <span className={styles.mobileEditionXZero}>X.0</span>
              </span>
            </strong>
          </div>

          <div className={styles.monitorScene}>
            <div className={styles.monitorOrbit} aria-hidden="true" />
            <div className={styles.monitorFloat}>
              <div className={styles.monitorRig}>
                <div className={styles.monitorHandle} aria-hidden="true" />
                <div className={styles.monitor}>
                  <div className={styles.monitorTop} aria-hidden="true" />

                  <div className={styles.bezel}>
                    <div className={styles.screenShell}>
                      <div className={styles.screen}>
                        <div className={styles.screenGrid} aria-hidden="true" />
                        <div className={styles.scanlines} aria-hidden="true" />
                        <div className={styles.screenSweep} aria-hidden="true" />
                        <div className={styles.glitchBands} aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className={styles.glitchNoise} aria-hidden="true" />
                        <div className={styles.signalLoss} aria-hidden="true" />
                        <div className={styles.screenContent}>
                          <span className={styles.screenLabel}>TCP // NIT RAIPUR</span>
                          <strong
                            className={styles.screenHeadline}
                            data-text={"CODEUTSAVA\nX.O"}
                            aria-label="CodeUtsava X.O, edition ten"
                          >
                            <span className={styles.screenBrandLine} aria-hidden="true">
                              CODEUTSAVA
                            </span>
                            <span className={styles.editionCycle} aria-hidden="true">
                              <span className={styles.editionXo}>X.O</span>
                              <span className={styles.editionTen}>10</span>
                              <span className={styles.editionDas}>&#2342;&#2360;</span>
                            </span>
                          </strong>
                          <span className={styles.terminalLine}>&gt; EDITION_ID UNSTABLE_</span>
                        </div>
                        <span className={styles.crosshair} aria-hidden="true">
                          +
                        </span>
                      </div>
                    </div>

                    <div className={styles.controls} aria-hidden="true">
                      <div className={styles.controlBrand}>CU.OS</div>
                      <div className={styles.vents}>
                        {Array.from({ length: 6 }, (_, index) => (
                          <span key={index} />
                        ))}
                      </div>
                      <span className={styles.powerLight} />
                      <span className={styles.dial} />
                      <span className={`${styles.dial} ${styles.dialSmall}`} />
                    </div>
                  </div>

                  <div className={styles.monitorSide} aria-hidden="true" />
                  <div className={styles.monitorBottom} aria-hidden="true" />
                </div>

                <div className={styles.stand} aria-hidden="true">
                  <span />
                </div>
                <div className={styles.monitorShadow} aria-hidden="true" />
              </div>
            </div>
          </div>

          <p className={styles.dragHint} aria-hidden="true">
            <span>MOVE CURSOR</span>
            <span>TO DISTORT PERCEPTION</span>
          </p>
        </div>
      </section>

      <div className={styles.bottomRail}>
        <span>10TH EDITION // NIT RAIPUR</span>
        <span className={styles.ticker}>
          <span>BUILD</span> / <span>BREAK</span> / <span>PERCEIVE</span> / <span>REIMAGINE</span>
        </span>
        <span>BY TURING CLUB OF PROGRAMMERS</span>
      </div>
    </main>
  );
}
