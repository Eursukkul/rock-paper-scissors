import { api } from '@/services/api';
import { GameClient } from '@/components/GameClient/GameClient';

export default async function Home() {
  let initialHighScore = 0;
  try {
    const data = await api.getHighScore() as any;
    initialHighScore = data.highScore ?? 0;
  } catch {}
  return <GameClient initialHighScore={initialHighScore} />;
}
