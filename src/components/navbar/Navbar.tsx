import styles from '../hero/GlitchverseHero.module.css';

export function Navbar() {
  return (
    <header className={styles.navbar}>
      <nav className={styles.navLinks} aria-label='Primary navigation'>
        <a href='#top'>HOME</a>
        <a href='#about'>ABOUT US</a>
        <a href='#timeline'>TIMELINE</a>
        <a href='#prizes'>PRIZES</a>
        <a href='#sponsors'>SPONSORS</a>
        <a href='#faq'>FAQ</a>
        <a href='#contact'>CONTACT US</a>
      </nav>
    </header>
  );
}
