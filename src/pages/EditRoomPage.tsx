import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import Header from '../components/Header';
import styles from './NewRoomPage.module.css';

export default function EditRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { currentRoom, loadRoom, updateRoom } = useApp();
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(['', '']);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      let room = currentRoom;
      if (!room && roomId) {
        const found = await loadRoom(roomId);
        if (!found) { navigate('/'); return; }
        room = currentRoom;
      }
      if (room && !initialized) {
        setGroupName(room.name);
        setMembers(room.players.map((p) => p.name));
        setInitialized(true);
      }
    };
    init();
  }, [currentRoom]);

  const update = (i: number, v: string) => {
    const next = [...members]; next[i] = v; setMembers(next);
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) { setError('グループ名を入力してください'); return; }
    const valid = members.map((m) => m.trim()).filter(Boolean);
    if (valid.length < 2) { setError('メンバーを2人以上入力してください'); return; }
    setSaving(true);
    try {
      await updateRoom(groupName.trim(), valid);
      navigate(`/dashboard/${roomId}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(`/dashboard/${roomId}`)}>← 戻る</button>
          <h2>編集</h2>
        </div>

        <div className={styles.section}>
          <label className={styles.label}>グループ名</label>
          <input
            className={styles.input}
            placeholder="例：麻雀、ボウリング大会"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label}>メンバー</label>
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
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={saving}>
          {saving ? '更新中...' : '更新する'}
        </button>
      </div>
    </>
  );
}
