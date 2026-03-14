import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <button className={styles.logo} onClick={() => navigate('/')}>
        ScoreShare
      </button>
    </header>
  );
}
