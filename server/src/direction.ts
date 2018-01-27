export enum Direction {
    North = "N",
    South = "S",
    East = "E",
    West = "W"
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
