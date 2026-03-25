import GameBoard from '@/components/GameBoard/GameBoard';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Rock Paper Scissors</h1>
      <GameBoard />
    </main>
  );
}
