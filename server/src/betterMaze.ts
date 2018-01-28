import shuffle from './shuffle';
import { exists } from 'fs';

export enum Direction {
    None = 0,
    North = 1 << 0,
    South = 1 << 1,
    East = 1 << 2,
    West = 1 << 3,
    All = North | South | East | West
}

export namespace Direction {
    export const directions = [Direction.North, Direction.South, Direction.East, Direction.West];
    export const dX = {[Direction.North]: 0, [Direction.South]: 0, [Direction.East]: 1, [Direction.West]: -1};
    export const dY = {[Direction.North]: 1, [Direction.South]: -1, [Direction.East]: 0, [Direction.West]: 0};
    export const opposite = {
        [Direction.North]: Direction.South,
        [Direction.South]: Direction.North,
        [Direction.East]: Direction.West,
        [Direction.West]: Direction.East
    }
}

export interface Position {
    x: number,
    y: number
}

function move(pos: Position, d: Direction): Position {
    const x = pos.x + Direction.dX[d];
    const y = pos.y + Direction.dY[d];
    return {x, y};
}

export interface Collectible {
    type: "exit" | "trap" | "medkit",
    owner: number
}

export interface Cell extends Position {
    neighbors: Direction,
    collectibles: Array<Collectible>,
    touched: number
}

export interface Maze {
    cells: Cells,
    width: number,
    height: number
}

export type Cells = Array<Array<Cell>>;

export function generateMaze(width: number, height: number): Maze {
    const cells = [] as Cells;
    for (let x = 0; x < width; x++) {
        cells.push(new Array(height));
        for (let y = 0; y < height; y++) {
            cells[x][y] = {neighbors: 0, x, y, touched: 0, collectibles: []};
        }
    }

    const maze = {cells, width, height}

    carvePassagesFrom({x: 0, y: 0}, maze);

    return maze;
}

type DistancePairs = Array<Array<Array<Array<number>>>>;

function floydWarshall(maze: Maze): DistancePairs {
    const dist = [] as DistancePairs;
    for (let x1 = 0; x1 < maze.width; x1++) {
        dist.push([]);
        for (let y1 = 0; y1 < maze.height; y1++) {
            dist[x1].push([]);
            for (let x2 = 0; x2 < maze.width; x2++) {
                dist[x1][y1].push([]);
                for (let y2 = 0; y2 < maze.height; y2++) {
                    dist[x1][y1][x2].push(Infinity);
                }
            }
        }
    }

    for (let x = 0; x < maze.width; x++) {
        for (let y = 0; y < maze.height; y++) {
            dist[x][y][x][y] = 0;
        }
    }
    for (let x = 0; x < maze.width; x++) {
        for (let y = 0; y < maze.height; y++) {
            for (let d of Direction.directions) {
                if (maze.cells[x][y].neighbors & d) {
                    dist[x][y][x + Direction.dX[d]][y + Direction.dY[d]] = 1;
                    dist[x + Direction.dX[d]][y + Direction.dY[d]][x][y] = 1;
                }
            }
        }
    }
    // yob tvoyu mat 6 vlozennyh ciclov
    for (let xk = 0; xk < maze.width; xk++) {
        for (let yk = 0; yk < maze.height; yk++) {
            for (let xi = 0; xi < maze.width; xi++) {
                for (let yi = 0; yi < maze.height; yi++) {
                    for (let xj = 0; xj < maze.width; xj++) {
                        for (let yj = 0; yj < maze.height; yj++) {
                            if (dist[xi][yi][xj][yj] > dist[xi][yi][xk][yk] + dist[xk][yk][xj][yj]) {
                                dist[xi][yi][xj][yj] = dist[xi][yi][xk][yk] + dist[xk][yk][xj][yj];
                            }
                        }
                    }
                }
            }
        }
    }
    return dist;
}

function findCellsAtDistance(maze: Maze,
    dist: DistancePairs,
    start: Position,
    distanceMin: number,
    distanceMax: number,
    count: number
): Array<Position> {
    const result = [] as Array<Position>;
    for (let i = 0; i < count; i++) {
        const candidates = [] as Array<Position>;
        while (candidates.length == 0) {
            const distance = Math.floor(Math.random() * (distanceMax - distanceMin + 1)) + distanceMin;
            for (let x = 0; x < maze.width; x++) {
                for (let y = 0; y < maze.height; y++) {
                    // see if this point has alredy been selected before
                    let alreadySeen = false;
                    for (let p of result) {
                        if (p.x == x && p.y == y) {
                            alreadySeen = true;
                        }
                    }
                    if (dist[start.x][start.y][x][y] == distance && !alreadySeen) {
                        candidates.push({x, y});
                    }
                }
            }
        }
        result.push(candidates[Math.floor(Math.random() * candidates.length)]);
    }
    return result;
}

export function placeCollectibles(maze: Maze, numberOfPlayers: number, killer: number, victim: number, victimPosition: Position) {
    // first, place the exits for each savior
    const dist = floydWarshall(maze);
    const exits = findCellsAtDistance(
        maze,
        dist,
        victimPosition,
        Math.floor((maze.height + maze.width) / 1.8),
        Math.floor((maze.height + maze.width) / 1.5),
        numberOfPlayers
    );
    for (let i = 0; i < numberOfPlayers; i++) {
        if (i != killer && i != victim) {
            const {x, y} = exits[i];
            // place the exit with number i
            maze.cells[x][y].collectibles.push({type: "exit", owner: i});
        }
    }
    // place a bit of medkits
    const numberOfMedkits = Math.floor(maze.width * maze.height / 100 * 4);
    const medkits = findCellsAtDistance(
        maze,
        dist,
        victimPosition,
        5,
        Math.floor(maze.height + maze.width),
        numberOfMedkits
    );
    for (let {x, y} of medkits) {
        if (maze.cells[x][y].collectibles.length == 0) {
            maze.cells[x][y].collectibles.push({type: "medkit", owner: -1});
        }
    }
    // now place some traps >:D
    const numberOfTraps = Math.floor(maze.width * maze.height / 100 * 10);
    const traps = findCellsAtDistance(
        maze,
        dist,
        victimPosition,
        5,
        Math.floor(maze.height + maze.width),
        numberOfTraps
    );
    for (let {x, y} of traps) {
        if (maze.cells[x][y].collectibles.length == 0) {
            maze.cells[x][y].collectibles.push({type: "trap", owner: killer});
        }
    }
}

export function toSvgPath(maze: Maze): string {
    const sizePerCell = 10;
    const offset = 10;
    let result = "";
    for (let x = 0; x < maze.width; x++) {
        for (let y = 0; y < maze.height; y++) {
            const cell = maze.cells[x][y];
            for (let d of Direction.directions) {
                if (!(cell.neighbors & d)) {
                    const cx = (cell.x + 0.5) * sizePerCell + offset;
                    const cy = (cell.y + 0.5) * sizePerCell + offset;
                    let line = "";
                    const delta = sizePerCell * 0.5;
                    switch(d) {
                        case Direction.North:
                            line = `m ${-delta},${delta} l ${2*delta},0 `;
                            break;
                        case Direction.South:
                            line = `m ${-delta},${-delta} l ${2*delta},0 `;
                            break;
                        case Direction.East:
                            line = `m ${delta},${-delta} l 0,${2*delta} `;
                            break;
                        case Direction.West:
                            line = `m ${-delta},${-delta} l 0,${2*delta} `;
                            break;
                    }
                    result += `M ${cx},${cy} ${line}`;
                }
            }
        }
    }
    return result;
}

function isValid(maze: Maze, position: Position): boolean {
    return position.x >= 0 && position.x < maze.width && position.y >= 0 && position.y < maze.height;
}

function carvePassagesFrom(pos: Position, maze: Maze) {
    const currCell = maze.cells[pos.x][pos.y];
    currCell.touched += 1;
    const directions = Direction.directions.slice();
    shuffle(directions);
    directions.forEach(d => {
        const next = move(pos, d);
        if (isValid(maze, next)) {
            const nextCell = maze.cells[next.x][next.y];
            const touchLimit = Math.random() * 100 > 85 ? 2 : 1;
            if (nextCell.touched < touchLimit) {
                currCell.neighbors |= d;
                nextCell.neighbors |= Direction.opposite[d];
                carvePassagesFrom(next, maze);
            }
        }
    });
}
