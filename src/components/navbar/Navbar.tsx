"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  delay?: number;
  target?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  children,
  target,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === "_blank") {
      return;
    }
    if (href.startsWith("/")) {
      e.preventDefault();
      if (typeof window !== "undefined") {
        sessionStorage.setItem("glitchverse_entered", "true");
      }
      router.push(href);
      return;
    }
    if (href.startsWith("#")) {
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        e.preventDefault();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("glitchverse_entered", "true");
        }
        router.push(`/${href}`);
        return;
      }
      e.preventDefault();
      smoothScrollTo(href);
    }
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
}) => {
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(e) => {
        if (href.startsWith("/")) {
          e.preventDefault();
          if (typeof window !== "undefined") {
            sessionStorage.setItem("glitchverse_entered", "true");
          }
          router.push(href);
          setMobileOpen(false);
          return;
        }
        if (href.startsWith("#")) {
          if (typeof window !== "undefined" && window.location.pathname !== "/") {
            e.preventDefault();
            if (typeof window !== "undefined") {
              sessionStorage.setItem("glitchverse_entered", "true");
            }
            router.push(`/${href}`);
            setMobileOpen(false);
            return;
          }
          e.preventDefault();
          smoothScrollTo(href);
        }
        setMobileOpen(false);
      }}
      className="block w-full px-6 py-4 text-[12px] font-black tracking-[0.15em] text-[#faeb92] border-b border-[#faeb9220] hover:bg-[#faeb9220] transition-colors uppercase text-center"
      style={{
        fontFamily: "var(--font-body)",
      }}
    >
      {children}
    </a>
  );
};

export function Navbar({ variant = 'default' }: { variant?: 'default' | 'back-to-home' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const router = useRouter();

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

  const isBackToHome = variant === 'back-to-home';

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
                href={isBackToHome ? "/?skipIntro=true" : "#top"}
                aria-label="CodeUtsava home"
                onClick={(e) => {
                  if (isBackToHome) {
                    e.preventDefault();
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("glitchverse_entered", "true");
                    }
                    router.push("/?skipIntro=true");
                  } else {
                    e.preventDefault();
                    smoothScrollTo("#top");
                  }
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
            {isBackToHome ? (
              <NavItem href="/?skipIntro=true" delay={0.2}>
                BACK TO HOME
              </NavItem>
            ) : (
              <>
                <NavItem href="#top" delay={0.2}>
                  HOME
                </NavItem>
                <NavItem href="#about" delay={0.3}>
                  ABOUT US
                </NavItem>
                <NavItem href="#faq" delay={0.4}>
                  FAQ
                </NavItem>
                <NavItem href="/contact-us" delay={0.5}>
                  CONTACT US
                </NavItem>
                <NavItem href="/team" delay={0.6}>
                  TEAM
                </NavItem>
              </>
            )}
          </nav>
        ) : (
          <div className="flex items-center justify-center">
            <a
              href={isBackToHome ? "/?skipIntro=true" : "#top"}
              aria-label="CodeUtsava home"
              onClick={(e) => {
                if (isBackToHome) {
                  e.preventDefault();
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("glitchverse_entered", "true");
                  }
                  router.push("/?skipIntro=true");
                } else {
                  e.preventDefault();
                  smoothScrollTo("#top");
                }
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

      <AnimatePresence>
        {!isLargeScreen && mobileOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.3, 0.35, 0.4],
            }}
            className="fixed left-4 right-4 z-[9998] bg-black/95 backdrop-blur-md border border-[#faeb9240] overflow-hidden shadow-[0_10px_40px_rgba(153,41,234,0.3)]"
            style={{
              top: "100px",
              borderRadius: "12px",
            }}
          >
            <div className="flex flex-col font-sans">
              {isBackToHome ? (
                <MobileNavLink href="/?skipIntro=true" setMobileOpen={setMobileOpen}>
                  BACK TO HOME
                </MobileNavLink>
              ) : (
                <>
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
                  <MobileNavLink href="/contact-us" setMobileOpen={setMobileOpen}>
                    CONTACT US
                  </MobileNavLink>

                  {/* TEAM */}
                  <MobileNavLink href="/team" setMobileOpen={setMobileOpen}>
                    TEAM
                  </MobileNavLink>
                </>
              )}

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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
