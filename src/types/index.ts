export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface ScoreLog {
  id: string;
  playerId: string;
  playerName: string;
  delta: number;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  scoreUnit: number;
  createdAt: number;
  logs: ScoreLog[];
}
