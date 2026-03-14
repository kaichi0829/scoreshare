import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import styles from './TopPage.module.css';

export default function TopPage() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.title}>みんなのスコアを<br />リアルタイムで共有</h1>
          <p className={styles.tagline}>アプリ不要。URLを共有するだけ。</p>
          <button className={styles.startBtn} onClick={() => navigate('/new')}>
            ＋ 新しいスコア表を作る
          </button>
        </div>

        <div className={styles.howTo}>
          <h2 className={styles.howToTitle}>使い方</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <div>
                <p className={styles.stepLabel}>グループを作成</p>
                <p className={styles.stepDesc}>グループ名とメンバーを入力してスタート</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <div>
                <p className={styles.stepLabel}>URLを共有</p>
                <p className={styles.stepDesc}>表示されたURLをメンバーに送るだけ</p>
              </div>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <div>
                <p className={styles.stepLabel}>スコアを入力</p>
                <p className={styles.stepDesc}>＋／－ボタンで全員のスコアがリアルタイム更新</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
