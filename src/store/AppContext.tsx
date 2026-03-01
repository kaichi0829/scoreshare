import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Room, Player } from '../types/index';

interface AppState {
  currentRoom: Room | null;
  loading: boolean;
  createRoom: (name: string, memberNames: string[]) => Promise<Room>;
  loadRoom: (roomId: string) => Promise<boolean>;
  updateRoom: (name: string, memberNames: string[]) => Promise<void>;
  updateScore: (playerId: string, delta: number) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentRoom?.id) return;
    const unsubscribe = onSnapshot(doc(db, 'rooms', currentRoom.id), (snap) => {
      if (snap.exists()) setCurrentRoom({ id: snap.id, ...snap.data() } as Room);
    });
    return () => unsubscribe();
  }, [currentRoom?.id]);

  const createRoom = async (name: string, memberNames: string[]): Promise<Room> => {
    const roomId = generateId();
    const players: Player[] = memberNames.map((n) => ({ id: generateId(), name: n, score: 0 }));
    const room: Room = { id: roomId, name, players, createdAt: Date.now() };
    await setDoc(doc(db, 'rooms', roomId), { name, players, createdAt: room.createdAt });
    setCurrentRoom(room);
    return room;
  };

  const loadRoom = async (roomId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'rooms', roomId));
      if (!snap.exists()) return false;
      setCurrentRoom({ id: snap.id, ...snap.data() } as Room);
      return true;
    } finally {
      setLoading(false);
    }
  };

  // グループ名・メンバーを更新（スコアは維持）
  const updateRoom = async (name: string, memberNames: string[]): Promise<void> => {
    if (!currentRoom) return;
    // 既存メンバーのスコアを引き継ぎ、新メンバーはスコア0
    const existingMap = new Map(currentRoom.players.map((p) => [p.name, p]));
    const players: Player[] = memberNames.map((n) => {
      const existing = existingMap.get(n);
      return existing ?? { id: generateId(), name: n, score: 0 };
    });
    await updateDoc(doc(db, 'rooms', currentRoom.id), { name, players });
  };

  const updateScore = async (playerId: string, delta: number): Promise<void> => {
    if (!currentRoom) return;
    const updatedPlayers = currentRoom.players.map((p) =>
      p.id === playerId ? { ...p, score: p.score + delta } : p
    );
    await updateDoc(doc(db, 'rooms', currentRoom.id), { players: updatedPlayers });
  };

  return (
    <AppContext.Provider value={{ currentRoom, loading, createRoom, loadRoom, updateRoom, updateScore }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
