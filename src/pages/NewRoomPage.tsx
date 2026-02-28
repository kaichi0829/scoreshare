import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import styles from './NewRoomPage.module.css';

export default function NewRoomPage() {
  const navigate = useNavigate();
  const { createRoom } = useApp();
  const [members, setMembers] = useState(['', '']);
  const [error, setError] = useState('');

  const update = (i: number, v: string) => {
    const next = [...members]; next[i] = v; setMembers(next);
  };

  const handleSubmit = () => {
    const valid = members.map((m) => m.trim()).filter(Boolean);
    if (valid.length < 2) { setError('メンバーを2人以上入力してください'); return; }
    const room = createRoom(valid);
    navigate(`/dashboard/${room.id}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← 戻る</button>
        <h2>メンバーを追加</h2>
      </div>

      <div className={styles.memberList}>
        {members.map((name, i) => (
          <div key={i} className={styles.memberRow}>
            <input
              className={styles.input}
              placeholder={i === 0 ? '自分' : 'Aさん、Bさん...'}
              value={name}
              onChange={(e) => update(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && i === members.length - 1) setMembers([...members, '']); }}
            />
            <button
              className={styles.removeBtn}
              onClick={() => members.length > 2 && setMembers(members.filter((_, j) => j !== i))}
              disabled={members.length <= 2}
            >✕</button>
          </div>
        ))}
      </div>

      <button className={styles.addBtn} onClick={() => setMembers([...members, ''])}>
        ＋ メンバーを追加
      </button>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.submitBtn} onClick={handleSubmit}>
        スタート →
      </button>
    </div>
  );
}
