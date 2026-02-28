import { createContext, useContext, useState, ReactNode } from 'react';
import type { Room, Player, ScoreLog } from '../types/index';

interface AppState {
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  createRoom: (name: string, playerNames: string[], scoreUnit: number) => Room;
  updateScore: (playerId: string, delta: number) => void;
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  updateScoreUnit: (unit: number) => void;
  resetScores: () => void;
}

const AppContext = createContext<AppState | null>(null);

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  const createRoom = (name: string, playerNames: string[], scoreUnit: number): Room => {
    const players: Player[] = playerNames.map((n) => ({
      id: generateId(),
      name: n,
      score: 0,
    }));
    const room: Room = {
      id: generateId(),
      name,
      players,
      scoreUnit,
      createdAt: Date.now(),
      logs: [],
    };
    setCurrentRoom(room);
    return room;
  };

  const updateScore = (playerId: string, delta: number) => {
    if (!currentRoom) return;
    const player = currentRoom.players.find((p) => p.id === playerId);
    if (!player) return;
    const log: ScoreLog = {
      id: generateId(),
      playerId,
      playerName: player.name,
      delta,
      timestamp: Date.now(),
    };
    setCurrentRoom({
      ...currentRoom,
      players: currentRoom.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + delta } : p
      ),
      logs: [log, ...currentRoom.logs],
    });
  };

  const addPlayer = (name: string) => {
    if (!currentRoom) return;
    const newPlayer: Player = { id: generateId(), name, score: 0 };
    setCurrentRoom({ ...currentRoom, players: [...currentRoom.players, newPlayer] });
  };

  const removePlayer = (playerId: string) => {
    if (!currentRoom) return;
    setCurrentRoom({
      ...currentRoom,
      players: currentRoom.players.filter((p) => p.id !== playerId),
    });
  };

  const updateScoreUnit = (unit: number) => {
    if (!currentRoom) return;
    setCurrentRoom({ ...currentRoom, scoreUnit: unit });
  };

  const resetScores = () => {
    if (!currentRoom) return;
    setCurrentRoom({
      ...currentRoom,
      players: currentRoom.players.map((p) => ({ ...p, score: 0 })),
      logs: [],
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        createRoom,
        updateScore,
        addPlayer,
        removePlayer,
        updateScoreUnit,
        resetScores,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
