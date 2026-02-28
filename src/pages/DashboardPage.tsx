import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentRoom, updateScore } = useApp();

  if (!currentRoom) {
    return (
      <div className={styles.notFound}>
        <p>ルームが見つかりません</p>
        <button className={styles.backToTopBtn} onClick={() => navigate('/')}>
          トップへ戻る
        </button>
      </div>
    );
  }

  const sorted = [...currentRoom.players].sort((a, b) => b.score - a.score);
  const rankLabel = (i: number) => ['🥇', '🥈', '🥉'][i] ?? `${i + 1}位`;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← トップへ</button>
        <h2>スコアボード</h2>
        <div className={styles.spacer} />
      </div>

      <div className={styles.scoreBoard}>
        {sorted.map((player, index) => (
          <div key={player.id} className={`${styles.scoreCard} ${index === 0 ? styles.top : ''}`}>
            <span className={styles.rank}>{rankLabel(index)}</span>
            <span className={styles.playerName}>{player.name}</span>
            <div className={styles.controls}>
              <button className={styles.btnMinus} onClick={() => updateScore(player.id, -1)}>−</button>
              <span className={styles.scoreValue}>{player.score}</span>
              <button className={styles.btnPlus} onClick={() => updateScore(player.id, 1)}>＋</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
