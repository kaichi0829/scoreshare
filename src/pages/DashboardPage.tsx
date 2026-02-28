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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← トップへ</button>
        <h2>スコアボード</h2>
        <div className={styles.spacer} />
      </div>

      <div className={styles.scoreBoard}>
        {currentRoom.players.map((player) => (
          <div key={player.id} className={styles.scoreCard}>
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
