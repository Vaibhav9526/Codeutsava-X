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
    </header>
  );
}
