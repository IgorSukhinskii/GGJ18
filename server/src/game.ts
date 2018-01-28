import { Position, Maze } from './betterMaze';

export interface Game {
    players: Array<Player>,
    maze: Maze,
    walls: any,
    full: boolean,
    victim: number,
    killer: number,
    victimPosition: Position,
    victimHealth: number,
    collectables: Array<Position>
}

export interface Player {
    id: number,
    name: string,
    score: number
    type?: "victim" | "savior" | "killer",
    socket: any
}
