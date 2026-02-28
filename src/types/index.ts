export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Room {
  id: string;
  players: Player[];
  createdAt: number;
}
