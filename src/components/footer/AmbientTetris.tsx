'use client';

import dynamic from 'next/dynamic';
import { useRichEffects } from '@/hooks/useRichEffects';
import styles from '../sections/EventSections.module.css';

const Tetris = dynamic(() => import('@/components/originkit/ui/pixel-tetris'), {
  ssr: false,
});

export function AmbientTetris() {
  const richEffects = useRichEffects();

  if (!richEffects) return null;

  return (
    <div className={styles.tetrisField} aria-hidden='true'>
      <Tetris
        boardColor='rgba(250, 235, 146, 0.045)'
        colors={['#9929ea', '#ff5fcf', '#faeb92']}
        movement={4}
        cellSize={30}
        gap={2}
        rounded={2}
        dropSpeed={2}
      />
    </div>
  );
}
