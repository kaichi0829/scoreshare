import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
  padding: '10px 12px', fontSize: '1rem', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.85rem', fontWeight: 600,
  color: '#6b7280', marginBottom: 8,
};
const sectionStyle: React.CSSProperties = { marginBottom: 24 };

export default function NewRoomPage() {
  const navigate = useNavigate();
  const { createRoom } = useApp();
  const [roomName, setRoomName] = useState('');
  const [players, setPlayers] = useState(['', '', '']);
  const [scoreUnit, setScoreUnit] = useState(1);
  const [error, setError] = useState('');

  const updatePlayer = (i: number, v: string) => {
    const next = [...players];
    next[i] = v;
    setPlayers(next);
  };

  const handleSubmit = () => {
    const valid = players.map((p) => p.trim()).filter(Boolean);
    if (!roomName.trim()) { setError('ゲーム名を入力してください'); return; }
    if (valid.length < 2) { setError('プレイヤーを2人以上入力してください'); return; }
    createRoom(roomName.trim(), valid, scoreUnit);
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.95rem' }}>
          ← 戻る
        </button>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>新しいスコア表を作る</h2>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>ゲーム名</label>
        <input style={inputStyle} placeholder="例：麻雀、ボウリング大会" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>プレイヤー / チーム</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
          {players.map((name, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input style={inputStyle} placeholder={`プレイヤー ${i + 1}`} value={name} onChange={(e) => updatePlayer(i, e.target.value)} />
              <button
                onClick={() => players.length > 2 && setPlayers(players.filter((_, j) => j !== i))}
                disabled={players.length <= 2}
                style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem', padding: '4px 8px' }}
              >✕</button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPlayers([...players, ''])}
          style={{ background: '#fff', border: '1px solid #2563eb', borderRadius: 8, color: '#2563eb', padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem' }}
        >＋ プレイヤーを追加</button>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>スコア単位（＋／－ボタン1回分）</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {[1, 10, 100, 1000].map((u) => (
            <button
              key={u}
              onClick={() => setScoreUnit(u)}
              style={{
                border: '1px solid', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: '0.95rem',
                background: scoreUnit === u ? '#2563eb' : '#fff',
                color: scoreUnit === u ? '#fff' : '#111',
                borderColor: scoreUnit === u ? '#2563eb' : '#e5e7eb',
              }}
            >{u}</button>
          ))}
          <input
            type="number" min={1} max={10000} value={scoreUnit}
            onChange={(e) => setScoreUnit(Math.max(1, Math.min(10000, Number(e.target.value))))}
            style={{ ...inputStyle, width: 90 }}
          />
        </div>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: 8 }}>{error}</p>}

      <button
        onClick={handleSubmit}
        style={{
          background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8,
          padding: '14px 0', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', width: '100%',
        }}
      >スコア表を作成する →</button>
    </div>
  );
}
