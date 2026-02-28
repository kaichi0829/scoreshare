import { useNavigate } from 'react-router-dom';

export default function TopPage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb', marginBottom: 8 }}>
        ScoreShare
      </h1>
      <p style={{ color: '#6b7280', marginBottom: 40 }}>
        みんなのスコアをリアルタイムで共有
      </p>
      <button
        onClick={() => navigate('/new')}
        style={{
          background: '#2563eb', color: '#fff', border: 'none',
          borderRadius: 8, padding: '14px 32px', fontSize: '1rem',
          fontWeight: 600, cursor: 'pointer', display: 'block', width: '100%',
        }}
      >
        ＋ 新しいスコア表を作る
      </button>
      <div style={{ display: 'flex', gap: 12, marginTop: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { icon: '📱', text: 'アプリ不要・URLで共有' },
          { icon: '🎮', text: '麻雀・ボードゲームに' },
          { icon: '⚡', text: 'かんたん操作' },
        ].map((f) => (
          <div key={f.text} style={{
            border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 16px',
            fontSize: '0.85rem', color: '#6b7280', minWidth: 120,
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{f.icon}</div>
            {f.text}
          </div>
        ))}
      </div>
    </div>
  );
}
