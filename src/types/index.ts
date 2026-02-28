export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  createdAt: number;
}
