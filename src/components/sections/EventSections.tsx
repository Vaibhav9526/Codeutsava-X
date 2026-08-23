import { ShortlistedTeams } from '@/components/shortlisted/ShortlistedTeams';
import { FaqSection } from '@/components/faq/FaqSection';
import { SiteFooter } from '@/components/footer/SiteFooter';
import styles from './EventSections.module.css';

export function EventSections() {
  return (
    <div className={styles.sections}>
      <ShortlistedTeams />
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
