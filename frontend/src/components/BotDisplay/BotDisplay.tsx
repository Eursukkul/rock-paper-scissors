import { Action } from '@/types/game';
import { ACTION_EMOJI } from '@/constants/game';
import styles from './BotDisplay.module.scss';

interface Props {
  botAction: Action | null;
}

export function BotDisplay({ botAction }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Bot action:</span>
      <div className={styles.display}>
        {botAction ? (
          <span className={styles.action}>
            {ACTION_EMOJI[botAction]} {botAction.toUpperCase()}
          </span>
        ) : (
          <span className={styles.unknown}>???</span>
        )}
      </div>
    </div>
  );
}
