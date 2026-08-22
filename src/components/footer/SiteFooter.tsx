import Image from 'next/image';
import { SOCIAL_LINKS } from '@/data/socialLinks';
import { AmbientTetris } from './AmbientTetris';
import styles from '../sections/EventSections.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer} id='contact'>
      <AmbientTetris />
      <div className={styles.footerShade} aria-hidden='true' />

      <div className={styles.footerTop}>
        <div className={styles.brandLogos}>
          <a href='#top' aria-label='Codeutsava home'>
            <Image src='/images/codeutsava/codeutsava-logo.png' alt='CodeUtsava Logo' width={1080} height={1080} />
          </a>
          <span aria-hidden='true' />
          <a href='https://codeutsava.nitrr.ac.in/team' aria-label='Turing Club of Programmers'>
            <Image src='/images/codeutsava/tcp-logo.png' alt='TCP Logo' width={1080} height={1080} />
          </a>
        </div>
        <div className={styles.footerTopNote}>
          <span>SIGNAL // CONNECTED</span>
          <p>Follow us on social media for updates</p>
        </div>
      </div>

      <div className={styles.footerGrid}>
        <section className={styles.about} aria-labelledby='about-nitrr'>
          <div className={styles.nitHeading}>
            <Image src='/images/codeutsava/nit-raipur-logo.webp' alt='NIT Raipur Logo' width={500} height={500} />
            <div>
              <p className={styles.eyebrow}>INSTITUTION // NITRR</p>
              <h2 id='about-nitrr'>About NIT Raipur</h2>
            </div>
          </div>
          <p>
            NIT Raipur develops technical education by preparing graduates in advanced fields of engineering and technology. For decades, the institute has pursued this mission with sincerity and commitment.
          </p>
          <a className={styles.mapLink} href='https://www.google.com/maps/place/NIT+Raipur' target='_blank' rel='noreferrer'>
            VIEW MAP LOCATION <span aria-hidden='true'>-&gt;</span>
          </a>
        </section>

        <nav className={styles.footerNav} aria-label='Footer navigation'>
          <p className={styles.eyebrow}>SITE MAP</p>
          <a href='#top'>Home</a>
          <a href='https://codeutsava.nitrr.ac.in/team'>TCP Team</a>
          <a href='https://codeutsava.nitrr.ac.in/speakers'>Speakers</a>
          <a href='#faq'>FAQ</a>
          <a href='https://codeutsava.nitrr.ac.in/contact-us'>Contact Us</a>
        </nav>

        <nav className={styles.socials} aria-label='Social media'>
          <p className={styles.eyebrow}>OPEN CHANNELS</p>
          {SOCIAL_LINKS.map(([label, href]) => (
            <a href={href} key={label} target='_blank' rel='noreferrer'>
              <span>{label}</span>
              <span aria-hidden='true'>-&gt;</span>
            </a>
          ))}
        </nav>
      </div>

      <div className={styles.footerBottom}>
        <span>Architected by <a href='https://codeutsava.nitrr.ac.in/team'>TCP Team</a></span>
        <span>PIXEL_TETRIS // RUNNING</span>
        <a href='#top'>Back to Top</a>
      </div>
    </footer>
  );
}
