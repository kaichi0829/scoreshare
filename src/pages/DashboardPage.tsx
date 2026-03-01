import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { currentRoom, loading, loadRoom, updateScore } = useApp();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!roomId || currentRoom?.id === roomId) return;
    loadRoom(roomId).then((found) => { if (!found) setNotFound(true); });
  }, [roomId]);

  if (loading) {
    return <div className={styles.notFound}><p>読み込み中...</p></div>;
  }

  if (notFound || !currentRoom) {
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
        <h2>{currentRoom.name}</h2>
        <button className={styles.editBtn} onClick={() => navigate(`/edit/${currentRoom.id}`)}>
          編集
        </button>
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
