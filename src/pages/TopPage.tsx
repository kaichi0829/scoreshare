import { useNavigate } from 'react-router-dom';
import styles from './TopPage.module.css';

export default function TopPage() {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <h1 className={styles.logo}>ScoreShare</h1>
      <p className={styles.tagline}>みんなのスコアをリアルタイムで共有</p>
      <button className={styles.startBtn} onClick={() => navigate('/new')}>
        ＋ 新しいスコア表を作る
      </button>
    </div>
  );
}
