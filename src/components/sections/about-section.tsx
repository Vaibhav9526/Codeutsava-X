import Image from 'next/image';
import styles from './EventSections.module.css';

const eventHighlights = [
  '28-hour hackathon',
  'Workshops, MIC sessions & mentorship',
  'Gaming battles & community showcases',
  'Big prize pool & industry partners',
] as const;

export function AboutSection() {
  return (
    <section
      className={`${styles.sections} ${styles.faq} ${styles.aboutSection}`}
      id='about'
      aria-labelledby='about-title'
    >
      <div className={styles.signalLine} aria-hidden='true'>
        <span>TRANSMISSION // ABOUT US</span>
        <span>EVENT PROFILE // X.0</span>
      </div>

      <div className={`${styles.faqPanel} ${styles.aboutPanel}`}>
        <div className={styles.aboutScrim} aria-hidden='true' />

        <div className={styles.aboutPanelContent}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutLogoStage}>
              <span className={styles.aboutLogoIndex} aria-hidden='true'>
                TCP // 01
              </span>
              <div className={styles.aboutLogoFrame}>
                <Image
                  src='/images/codeutsava/tcp-logo.png'
                  alt='Turing Club of Programmers logo'
                  width={520}
                  height={520}
                  className={styles.aboutLogo}
                />
              </div>
              <p>TURING CLUB OF PROGRAMMERS</p>
            </div>

            <div className={styles.aboutCopy}>
              <p className={styles.eyebrow}>THE PEOPLE BEHIND THE SIGNAL</p>
              <h2 id='about-title'>About Us</h2>

              <div className={styles.aboutBody}>
                <p>
                  Codeutsava is an annual event organized by the Turing Club of Programmers. It brings together
                  like-minded coders from across the nation to foster a thriving coding culture with workshops,
                  hackathons, gaming battles, MIC sessions, and more.
                </p>
                <p>
                  The heart of <strong>CODEUTSAVA</strong> is the <strong>28-hour hackathon</strong>, where participants
                  build ambitious ideas at speed and scale. This year&apos;s edition features a{' '}
                  <span className={styles.prizeHighlight}>33&nbsp;L+</span> prize pool, including{' '}
                  <span className={styles.cashHighlight}>1.5–2&nbsp;L</span> cash prizes.
                </p>
              </div>

              <ul className={styles.aboutHighlights}>
                {eventHighlights.map((highlight, index) => (
                  <li key={highlight}>
                    <span aria-hidden='true'>{String(index + 1).padStart(2, '0')}</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
