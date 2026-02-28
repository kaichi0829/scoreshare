import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';

type Tab = 'score' | 'log';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentRoom, updateScore, addPlayer, removePlayer, updateScoreUnit, resetScores, setCurrentRoom } = useApp();
  const [tab, setTab] = useState<Tab>('score');
  const [showSettings, setShowSettings] = useState(false);
  const [newName, setNewName] = useState('');
  const [unitVal, setUnitVal] = useState(currentRoom?.scoreUnit ?? 1);

  if (!currentRoom) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ marginBottom: 16 }}>ルームが見つかりません</p>
        <button onClick={() => navigate('/')} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', cursor: 'pointer' }}>
          トップへ戻る
        </button>
      </div>
    );
  }

  const sorted = [...currentRoom.players].sort((a, b) => b.score - a.score);
  const rankLabel = (i: number) => ['🥇', '🥈', '🥉'][i] ?? `${i + 1}位`;

  const handleExport = () => {
    const lines = [
      `【${currentRoom.name}】結果`, '',
      ...sorted.map((p, i) => `${i + 1}位 ${p.name}：${p.score}点`),
      '', '--- 履歴 ---',
      ...currentRoom.logs.map((l) => {
        const sign = l.delta >= 0 ? `+${l.delta}` : `${l.delta}`;
        return `[${new Date(l.timestamp).toLocaleTimeString()}] ${l.playerName} ${sign}`;
      }),
    ];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    a.download = `${currentRoom.name}_result.txt`;
    a.click();
  };

  const btnBase: React.CSSProperties = { border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem' };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{currentRoom.name}</h2>
          <span style={{ fontSize: '0.8rem', background: '#e5e7eb', borderRadius: 4, padding: '2px 6px' }}>
            単位: {currentRoom.scoreUnit}点
          </span>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} style={{ ...btnBase, background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
          ⚙️ 設定
        </button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>設定・共有</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>プレイヤーを追加</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={newName} onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && newName.trim()) { addPlayer(newName.trim()); setNewName(''); } }}
                placeholder="名前を入力" style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: '0.95rem' }} />
              <button onClick={() => { if (newName.trim()) { addPlayer(newName.trim()); setNewName(''); } }}
                style={{ ...btnBase, background: '#fff', border: '1px solid #2563eb', color: '#2563eb' }}>追加</button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>プレイヤーを削除</label>
            {currentRoom.players.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: 6, padding: '6px 12px', marginBottom: 4, fontSize: '0.9rem' }}>
                <span>{p.name}</span>
                <button onClick={() => removePlayer(p.id)} disabled={currentRoom.players.length <= 2}
                  style={{ ...btnBase, color: '#dc2626', background: 'none', padding: '2px 8px' }}>削除</button>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>スコア単位変更</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="number" min={1} max={10000} value={unitVal} onChange={(e) => setUnitVal(Number(e.target.value))}
                style={{ width: 100, border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: '0.95rem' }} />
              <button onClick={() => updateScoreUnit(Math.max(1, Math.min(10000, unitVal)))}
                style={{ ...btnBase, background: '#fff', border: '1px solid #2563eb', color: '#2563eb' }}>変更</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 12, borderTop: '1px solid #e5e7eb' }}>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('リンクをコピーしました'); }}
              style={{ ...btnBase, background: '#fff', border: '1px solid #e5e7eb' }}>🔗 リンクをコピー</button>
            <button onClick={handleExport} style={{ ...btnBase, background: '#fff', border: '1px solid #e5e7eb' }}>📥 エクスポート</button>
            <button onClick={() => { if (confirm('スコアをリセットしますか？')) resetScores(); }}
              style={{ ...btnBase, background: '#fff', border: '1px solid #e5e7eb' }}>🔄 リセット</button>
            <button onClick={() => { if (confirm('ゲームを終了しますか？')) { setCurrentRoom(null); navigate('/'); } }}
              style={{ ...btnBase, background: '#fff', border: '1px solid #dc2626', color: '#dc2626' }}>🏁 終了</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: 16 }}>
        {(['score', 'log'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer', fontSize: '0.95rem',
            borderBottom: tab === t ? '2px solid #2563eb' : '2px solid transparent',
            color: tab === t ? '#2563eb' : '#6b7280', fontWeight: tab === t ? 600 : 400, marginBottom: -2,
          }}>
            {t === 'score' ? 'スコアボード' : `履歴 (${currentRoom.logs.length})`}
          </button>
        ))}
      </div>

      {/* Score Board */}
      {tab === 'score' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((player, index) => (
            <div key={player.id} style={{
              background: index === 0 ? '#fffbeb' : '#fff',
              border: `1px solid ${index === 0 ? '#fbbf24' : '#e5e7eb'}`,
              borderRadius: 8, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: '1.2rem', minWidth: 36, textAlign: 'center' }}>{rankLabel(index)}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: '1rem' }}>{player.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => updateScore(player.id, -currentRoom.scoreUnit)} style={{
                  width: 40, height: 40, borderRadius: '50%', border: 'none',
                  background: '#fee2e2', color: '#dc2626', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer',
                }}>−</button>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, minWidth: 60, textAlign: 'center' }}>{player.score}</span>
                <button onClick={() => updateScore(player.id, currentRoom.scoreUnit)} style={{
                  width: 40, height: 40, borderRadius: '50%', border: 'none',
                  background: '#dcfce7', color: '#16a34a', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer',
                }}>＋</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log */}
      {tab === 'log' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {currentRoom.logs.length === 0
            ? <p style={{ textAlign: 'center', color: '#6b7280', padding: 32 }}>まだ記録がありません</p>
            : currentRoom.logs.map((log) => (
              <div key={log.id} style={{
                background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem',
              }}>
                <span style={{ flex: 1, fontWeight: 600 }}>{log.playerName}</span>
                <span style={{ fontWeight: 700, color: log.delta >= 0 ? '#16a34a' : '#dc2626', minWidth: 50, textAlign: 'right' }}>
                  {log.delta >= 0 ? `+${log.delta}` : log.delta}
                </span>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
