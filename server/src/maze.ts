import {Direction} from './direction';
import shuffle from './shuffle';
export const enum PickupType {
    Trap = "trap",
    Medkit = "medkit",
    Clock = "clock",
    Exit = "exit"
}

export interface Pickup {
    type: PickupType;
    owner?: number;
}

export class Position {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toString(): string {
        return JSON.stringify({x: this.x, y: this.y});
    }
    goTo(direction: Direction) {
        return new Position(this.x + Direction.dX[direction], this.y + Direction.dY[direction]);
    }
    private static isPosition(obj: any): obj is {x: number, y: number} {
        return typeof obj.x == "number" && typeof obj.y == "number";
    }
    static fromString(s: string): Position | null {
        const obj = JSON.parse(s);
        if (Position.isPosition(obj)) {
            return new Position(obj.x, obj.y);
        } else {
            return null;
        }
    }
}

export const enum Connection {
    Open = 0,
    Closed = 1
}

export class Cell {
    constructor(x: number, y: number) {
        this.position = new Position(x, y);
        this.neighbors = {};
        Direction.directions.forEach(d => {
            this.neighbors[d] = Connection.Closed;
        });
        this.pickups = [];
        this.touched = 0;
    }
    position: Position;
    pickups: Array<Pickup>;
    neighbors: {[key: string]: Connection};
    touched: number;
    getNeighborPosition(d: Direction): Position {
        return this.position.goTo(d);
    }
}

export class Maze extends Map<string, Cell> {
    constructor(w: number, h: number) {
        super();
        this.width = w;
        this.height = h;
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const cell = new Cell(x, y);
                this.set(cell.position.toString(), cell);
            }
        }
        this.carvePassagesFrom(new Position(0, 0));
    }
    width: number;
    height: number;
    getNeighbors(position: Position): Array<Cell> {
        const cell = this.get(position.toString());
        if (cell == undefined) {
            return [];
        } else {
            return Direction
                .directions
                .map(d => this.get(cell.getNeighborPosition(d).toString()))
                .filter(maybeCell => maybeCell != undefined) as Array<Cell>;
        }
    }
    isValid(pos: Position): boolean {
        return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
    }
    toSvgPath(): string {
        const sizePerCell = 10;
        const offset = 10;
        let result = "";
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const cell = this.get(new Position(x, y).toString()) as Cell;
                for (let d of Direction.directions) {
                    if (cell.neighbors[d] == Connection.Closed) {
                        const cx = (cell.position.x + 0.5) * sizePerCell + offset;
                        const cy = (cell.position.y + 0.5) * sizePerCell + offset;
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
    private carvePassagesFrom(pos: Position) {
        const currCell = this.get(pos.toString()) as Cell;
        currCell.touched += 1;
        const directions = Direction.directions.slice();
        shuffle(directions);
        directions.forEach(d => {
            const next = pos.goTo(d);
            if (this.isValid(next)) {
                const nextCell = this.get(next.toString()) as Cell;
                const touchLimit = Math.random() * 100 > 85 ? 2 : 1;
                if (nextCell.touched < touchLimit) {
                    currCell.neighbors[d] = Connection.Open;
                    nextCell.neighbors[Direction.opposite[d]] = Connection.Open;
                    this.carvePassagesFrom(next);
                }
            }
        })
    }
}
