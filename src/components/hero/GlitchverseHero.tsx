"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar/Navbar";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { PearlButton } from "@/components/ui/pearl-button";
import heroWordmark from "../../../public/images/codeutsava/hero-wordmark.png";
import styles from "./GlitchverseHero.module.css";

const registrationUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfHv8OJ7jkp9thPyPx1HrWJNPoGZ2z7FaFtIqpz7lO3dIqqgg/viewform?pli=1";

export function GlitchverseHero() {
  return (
    <main className={styles.hero} id="top">
      <div className={styles.ambientLight} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <Navbar />

      <section className={styles.heroStage} aria-labelledby="hero-title">
        <p className={styles.eyebrow}>WELCOME TO</p>
        <h1 className={styles.identity} id="hero-title" aria-label="CodeUtsava X point zero, tenth edition">
          <span className={styles.logoWrap}>
            <Image src={heroWordmark} alt="CodeUtsava" priority sizes="(max-width: 768px) 72vw, 66vw" />
          </span>
          <span className={styles.editionCycle} aria-hidden="true">
            <span className={styles.editionX}>X.0</span>
            <span className={styles.editionDas} lang="hi">दस</span>
            <span className={styles.editionTen}>10</span>
          </span>
        </h1>

        <p className={styles.tagline}>CODE. INNOVATE. CELEBRATE.</p>
        <p className={styles.eventLine}>NIT RAIPUR&apos;S FLAGSHIP TECH CELEBRATION&nbsp; // &nbsp;10TH EDITION</p>

        <div className={styles.heroActions} id="join">
          <PearlButton
            label="REGISTER NOW"
            onClick={() => window.open(registrationUrl, "_blank", "noopener,noreferrer")}
          />
          <AntiMetalButton
            label="JOIN THE COMMUNITY"
            aria-label="Join the CodeUtsava community on Discord"
            onClick={() => window.open("https://discord.gg/Ek9gr2Xnqb", "_blank", "noopener,noreferrer")}
          />
        </div>
      </section>

      <div className={styles.bottomRail} aria-hidden="true">
        <span>CODEUTSAVA // X</span>
        <span>BUILD / BREAK / PERCEIVE / REIMAGINE</span>
        <span>BY TURING CLUB OF PROGRAMMERS</span>
      </div>
    </main>
  );
}
