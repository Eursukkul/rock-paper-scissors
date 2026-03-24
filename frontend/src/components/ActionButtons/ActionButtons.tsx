import { Action } from '@/types/game';
import { ACTIONS, ACTION_EMOJI } from '@/constants/game';
import styles from './ActionButtons.module.scss';

interface Props {
  disabled: boolean;
  onAction: (action: Action) => void;
}

export function ActionButtons({ disabled, onAction }: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Your action:</span>
      <div className={styles.buttons}>
        {ACTIONS.map(action => (
          <button
            key={action}
            className={styles.actionBtn}
            disabled={disabled}
            onClick={() => onAction(action)}
            aria-label={action}
          >
            <span className={styles.emoji}>{ACTION_EMOJI[action]}</span>
            <span className={styles.name}>{action.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
