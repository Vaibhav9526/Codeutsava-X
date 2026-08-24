"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import styles from "../hero/GlitchverseHero.module.css";

function smoothScrollTo(targetSelector: string) {
  const header = document.querySelector("header");
  const offset = header ? header.offsetHeight : 0;
  let destinationY = 0;

  if (!targetSelector || targetSelector === "#" || targetSelector === "#top") {
    destinationY = 0;
  } else {
    const element = document.querySelector(targetSelector);

    if (!element) return;

    const rect = element.getBoundingClientRect();
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
  target?: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, children, target }) => {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === "_blank") return;

    if (href.startsWith("/")) {
      event.preventDefault();
      router.push(href);
      return;
    }

    if (!href.startsWith("#")) return;

    event.preventDefault();
    if (window.location.pathname !== "/") {
      router.push(`/${href}`);
      return;
    }

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
}) => {
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(event) => {
        if (href.startsWith("/")) {
          event.preventDefault();
          router.push(href);
          setMobileOpen(false);
          return;
        }

        if (href.startsWith("#")) {
          event.preventDefault();
          if (window.location.pathname !== "/") {
            router.push(`/${href}`);
            setMobileOpen(false);
            return;
          }
          smoothScrollTo(href);
        }

        setMobileOpen(false);
      }}
      className="block w-full px-6 py-4 text-center text-[12px] font-black tracking-[0.15em] text-[#faeb92] decoration-[#ff5fcf] underline-offset-[6px] hover:text-[#ff5fcf] hover:underline focus-visible:text-[#ff5fcf] focus-visible:underline uppercase transition-colors duration-200"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {children}
    </a>
  );
};

export function Navbar({ variant = "default" }: { variant?: "default" | "back-to-home" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const router = useRouter();
  const isBackToHome = variant === "back-to-home";

  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 768);

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isBackToHome) {
      router.push("/");
      setMobileOpen(false);
      return;
    }
    smoothScrollTo("#top");
    setMobileOpen(false);
  };

  const homeHref = isBackToHome ? "/" : "#top";

  return (
    <>
      <header
        className={styles.navbar}
        style={{ zIndex: mobileOpen ? 50 : 20 }}
      >
        <div className="flex items-center gap-4">
          {!isLargeScreen ? (
            <button
              type="button"
              className="text-[#faeb92] p-2 hover:bg-[#faeb9220] rounded-md cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          ) : (
            <>
              <a href={homeHref} aria-label="CodeUtsava home" onClick={handleHomeClick}>
                <Image
                  src="/images/codeutsava/codeutsava-logo.png"
                  alt="CodeUtsava Logo"
                  width={52}
                  height={52}
                  unoptimized
                  className="w-[52px] h-[52px] object-contain drop-shadow-[0_0_8px_rgba(255,95,207,0.5)]"
                />
              </a>
              <div className={`${styles.navLinks} ${styles.navButton}`}>
                <NavItem
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfHv8OJ7jkp9thPyPx1HrWJNPoGZ2z7FaFtIqpz7lO3dIqqgg/viewform?pli=1"
                  target="_blank"
                >
                  FEEDBACK
                </NavItem>
              </div>
            </>
          )}
        </div>

        {isLargeScreen ? (
          <nav className={styles.navLinks} aria-label="Primary navigation">
            {isBackToHome ? (
              <NavItem href="/">BACK TO HOME</NavItem>
            ) : (
              <>
                <NavItem href="#top">HOME</NavItem>
                <NavItem href="#about">ABOUT US</NavItem>
                <NavItem href="#faq">FAQ</NavItem>
                <NavItem href="/contact-us">CONTACT US</NavItem>
                <NavItem href="/team">TEAM</NavItem>
              </>
            )}
          </nav>
        ) : (
          <div className="flex items-center justify-center">
            <a href={homeHref} aria-label="CodeUtsava home" onClick={handleHomeClick}>
              <Image
                src="/images/codeutsava/codeutsava-logo.png"
                alt="CodeUtsava Logo"
                width={44}
                height={44}
                unoptimized
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
            gap: "16px",
          }}
        >
          {isLargeScreen ? (
            <>
              <div className={`${styles.navLinks} ${styles.navButton}`}>
                <NavItem href="/Brochure.pdf" target="_blank">
                  BROCHURE
                </NavItem>
              </div>
              <a href={homeHref} aria-label="CodeUtsava home" onClick={handleHomeClick}>
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
            <a href={homeHref} aria-label="CodeUtsava home" onClick={handleHomeClick}>
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

      {!isLargeScreen && mobileOpen && (
        <div
          className="fixed left-4 right-4 z-[9998] bg-black/95 backdrop-blur-md border border-[#faeb9240] overflow-hidden shadow-[0_10px_40px_rgba(153,41,234,0.3)]"
          style={{ top: "100px", borderRadius: "12px" }}
        >
          <div className="flex flex-col font-sans">
            {isBackToHome ? (
              <MobileNavLink href="/" setMobileOpen={setMobileOpen}>
                BACK TO HOME
              </MobileNavLink>
            ) : (
              <>
                <MobileNavLink href="#top" setMobileOpen={setMobileOpen}>
                  HOME
                </MobileNavLink>
                <MobileNavLink href="#about" setMobileOpen={setMobileOpen}>
                  ABOUT US
                </MobileNavLink>
                <MobileNavLink href="#faq" setMobileOpen={setMobileOpen}>
                  FAQ
                </MobileNavLink>
                <MobileNavLink href="/contact-us" setMobileOpen={setMobileOpen}>
                  CONTACT US
                </MobileNavLink>
                <MobileNavLink href="/team" setMobileOpen={setMobileOpen}>
                  TEAM
                </MobileNavLink>
              </>
            )}

            <a
              href="https://discord.gg/Ek9gr2Xnqb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-6 py-5 text-[12px] font-black tracking-[0.12em] text-[#000] bg-[#faeb92] hover:bg-[#ff5fcf] uppercase text-center"
              style={{ fontFamily: "var(--font-body)" }}
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
