import styles from '../hero/GlitchverseHero.module.css';

export function Navbar() {
  return (
    <header className={styles.navbar}>
      <nav className={styles.navLinks} aria-label='Primary navigation'>
        <a href='#brief'>THE BRIEF</a>
        <a href='#signal'>THE SIGNAL</a>
        <a href='#faq'>FAQ</a>
        <a href='#contact'>CONTACT</a>
      </nav>

      <a className={styles.navCta} href='https://discord.gg/Ek9gr2Xnqb'>
        <span className={styles.liveDot} aria-hidden='true' />
        JOIN THE COMMUNITY
        <span aria-hidden='true'>-&gt;</span>
      </a>
    </header>
  );
}
