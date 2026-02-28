import { createContext, useContext, useState, ReactNode } from 'react';
import type { Room, Player } from '../types/index';

interface AppState {
  currentRoom: Room | null;
  createRoom: (memberNames: string[]) => Room;
  updateScore: (playerId: string, delta: number) => void;
}

const AppContext = createContext<AppState | null>(null);

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  const createRoom = (memberNames: string[]): Room => {
    const players: Player[] = memberNames.map((name) => ({ id: generateId(), name, score: 0 }));
    const room: Room = { id: generateId(), players, createdAt: Date.now() };
    setCurrentRoom(room);
    return room;
  };

  const updateScore = (playerId: string, delta: number): void => {
    if (!currentRoom) return;
    setCurrentRoom({
      ...currentRoom,
      players: currentRoom.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + delta } : p
      ),
    });
  };

  return (
    <AppContext.Provider value={{ currentRoom, createRoom, updateScore }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
