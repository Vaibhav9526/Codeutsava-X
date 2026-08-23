"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import styles from "../hero/GlitchverseHero.module.css";

function smoothScrollTo(targetSelector: string) {
  const header = document.querySelector("header");
  const offset = header ? header.offsetHeight : 0;
  let destinationY = 0;

  if (!targetSelector || targetSelector === "#" || targetSelector === "#top") {
    destinationY = 0;
  } else {
    const el = document.querySelector(targetSelector);

    if (!el) return;

    const rect = el.getBoundingClientRect();
    destinationY = window.scrollY + rect.top - offset - 8;
  }

  // @ts-expect-error - lenis might be globally present
  if (window.lenis && typeof window.lenis.scrollTo === "function") {
    // @ts-expect-error - lenis might be globally present
    window.lenis.scrollTo(destinationY, {
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
  } else {
    window.scrollTo({
      top: destinationY,
      behavior: "smooth",
    });
  }
}

const NavItem = ({
  children,
  href,
  target,
}: {
  children: React.ReactNode;
  href: string;
  target?: string;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === "_blank") {
      return;
    }
    if (!href.startsWith("#")) {
      return;
    }
    e.preventDefault();
    smoothScrollTo(href);
  };

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

const MobileNavLink = ({
  href,
  children,
  setMobileOpen,
}: {
  href: string;
  children: React.ReactNode;
  setMobileOpen: (open: boolean) => void;
}) => (
  <a
    href={href}
    onClick={(e) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        smoothScrollTo(href);
      }
      setMobileOpen(false);
    }}
    className="block w-full px-6 py-4 text-center text-[12px] font-black tracking-[0.15em] text-[#faeb92] decoration-[#ff5fcf] underline-offset-[6px] hover:text-[#ff5fcf] hover:underline focus-visible:text-[#ff5fcf] focus-visible:underline uppercase transition-colors duration-200"
    style={{
      fontFamily: "var(--font-body)",
    }}
  >
    {children}
  </a>
);

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => {
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <header
        className={styles.navbar}
        style={{
          zIndex: mobileOpen ? 50 : 20,
        }}
      >
        {/* ================= LEFT COLUMN ================= */}
        <div className="flex items-center gap-4">
          {!isLargeScreen ? (
            <button
              className="text-[#faeb92] p-2 hover:bg-[#faeb9220] rounded-md cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          ) : (
            <>
              <a
                href="#top"
                aria-label="CodeUtsava home"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo("#top");
                }}
              >
                <Image
                  src="/images/codeutsava/codeutsava-logo.png"
                  alt="CodeUtsava Logo"
                  width={52}
                  height={52}
                  className="w-[52px] h-[52px] object-contain drop-shadow-[0_0_8px_rgba(255,95,207,0.5)]"
                />
              </a>
              <div className={`${styles.navLinks} ${styles.navButton}`}>
                <NavItem href="https://docs.google.com/forms/d/e/1FAIpQLSfHv8OJ7jkp9thPyPx1HrWJNPoGZ2z7FaFtIqpz7lO3dIqqgg/viewform?pli=1" target="_blank">
                  FEEDBACK
                </NavItem>
              </div>
            </>
          )}
        </div>

        {/* ================= CENTER COLUMN ================= */}
        {isLargeScreen ? (
          <nav
            className={styles.navLinks}
            aria-label="Primary navigation"
          >
            <NavItem href="#top">
              HOME
            </NavItem>
            <NavItem href="#about">
              ABOUT US
            </NavItem>
            <NavItem href="#faq">
              FAQ
            </NavItem>
            <NavItem href="#contact">
              CONTACT US
            </NavItem>
            <NavItem href="/team">
              TEAM
            </NavItem>
          </nav>
        ) : (
          <div className="flex items-center justify-center">
            <a
              href="#top"
              aria-label="CodeUtsava home"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("#top");
                setMobileOpen(false);
              }}
            >
              <Image
                src="/images/codeutsava/codeutsava-logo.png"
                alt="CodeUtsava Logo"
                width={44}
                height={44}
                className="w-[44px] h-[44px] object-contain drop-shadow-[0_0_8px_rgba(255,95,207,0.5)]"
              />
            </a>
          </div>
        )}
        <div
          style={{
            justifySelf: "end",
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          {isLargeScreen ? (
            <>
              <div className={`${styles.navLinks} ${styles.navButton}`}>
                <NavItem href="/Brochure.pdf" target="_blank">
                  BROCHURE
                </NavItem>
              </div>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo("#top");
                }}
              >
                <Image
                  src="/images/codeutsava/tcp-logo.png"
                  alt="TCP Logo"
                  width={52}
                  height={52}
                  className="w-[52px] h-[52px] object-contain drop-shadow-[0_0_8px_rgba(255,95,207,0.5)]"
                />
              </a>
            </>
          ) : (
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo("#top");
              }}
            >
              <Image
                src="/images/codeutsava/tcp-logo.png"
                alt="TCP Logo"
                width={44}
                height={44}
                className="w-[44px] h-[44px] object-contain drop-shadow-[0_0_8px_rgba(255,95,207,0.5)]"
              />
            </a>
          )}
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}

      {!isLargeScreen && mobileOpen && (
        <div
          className="fixed left-4 right-4 z-[9998] bg-black/95 backdrop-blur-md border border-[#faeb9240] overflow-hidden shadow-[0_10px_40px_rgba(153,41,234,0.3)]"
          style={{
            top: "100px",
            borderRadius: "12px",
          }}
        >
          <div className="flex flex-col font-sans">

              {/* HOME */}
              <MobileNavLink href="#top" setMobileOpen={setMobileOpen}>
                HOME
              </MobileNavLink>

              {/* ABOUT US */}
              <MobileNavLink href="#about" setMobileOpen={setMobileOpen}>
                ABOUT US
              </MobileNavLink>

              {/* FAQ */}
              <MobileNavLink href="#faq" setMobileOpen={setMobileOpen}>
                FAQ
              </MobileNavLink>

              {/* CONTACT US */}
              <MobileNavLink href="#contact" setMobileOpen={setMobileOpen}>
                CONTACT US
              </MobileNavLink>

              {/* TEAM */}
              <MobileNavLink href="/team" setMobileOpen={setMobileOpen}>
                TEAM
              </MobileNavLink>

              {/* COMMUNITY CTA */}
              <a
                href="https://discord.gg/Ek9gr2Xnqb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-6 py-5 text-[12px] font-black tracking-[0.12em] text-[#000] bg-[#faeb92] hover:bg-[#ff5fcf] uppercase text-center"
                style={{
                  fontFamily: "var(--font-body)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-black" />

                JOIN THE COMMUNITY
              </a>
          </div>
        </div>
      )}
    </>
  );
}
