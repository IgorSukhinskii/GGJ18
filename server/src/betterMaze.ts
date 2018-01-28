import shuffle from './shuffle';

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
    type: "exit" | "trap",
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

export function placeCollectibles(maze: Maze, numberOfPlayers: number, killer: number, victim: number) {
    // first, place the exits for each savior
    for (let i = 0; i < numberOfPlayers; i++) {
        if (i != killer && i != victim) {
            // generate exit at a random point in a labyrinth
            const x = Math.floor(Math.random() * maze.width);
            const y = Math.floor(Math.random() * maze.height);
            // place the exit with number i
            maze.cells[x][y].collectibles.push({type: "exit", owner: i});
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
