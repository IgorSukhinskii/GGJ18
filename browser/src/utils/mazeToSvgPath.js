const sizePerCell = 10;
const offset = 10;
export function gridToScreenCoordinates(value, max = 0) {
  if (max === 0) {
    return (value + 0.5) * sizePerCell + offset;
  } else {
    return (max - value + 0.5) * sizePerCell + offset;
  }
}
export function mazeToSvgPath(maze) {
    let result = "";
    for (let x = 0; x < maze.width; x++) {
        for (let y = 0; y < maze.height; y++) {
            const cell = maze.cells[x][y];
            const cx = gridToScreenCoordinates(cell.x);
            const cy = gridToScreenCoordinates(cell.y, maze.height);
            for (let d of [1, 2, 4, 8]) {
                if (!(cell.neighbors & d)) {
                    let line = "";
                    const delta = sizePerCell * 0.5;
                    switch(d) {
                        case 1:
                            line = `m ${-delta},${-delta} l ${2*delta},0 `;
                            break;
                        case 2:
                            line = `m ${-delta},${delta} l ${2*delta},0 `;
                            break;
                        case 4:
                            line = `m ${delta},${-delta} l 0,${2*delta} `;
                            break;
                        case 8:
                            line = `m ${-delta},${-delta} l 0,${2*delta} `;
                            break;
                        default:
                    }
                    result += `M ${cx},${cy} ${line}`;
                }
            }
            for (let c of cell.collectibles) {
                if (c.type === "exit") {
                    result += `M ${cx},${cy} m -2,2 v -4 h 4 v 4 h -4 `;
                } else if (c.type === "trap") {
                    result += `M ${cx},${cy} m -2,-2 l 4,4 M ${cx},${cy} m 2,-2 l -4,4 `
                } else if (c.type === "medkit") {
                    result += `M ${cx},${cy} m -2,2 h -2 v -2 h 2 v -2 h 2 v 2 h 2 v 2 h -2 v 2 h -2 v -2 `
                }
            }
        }
    }
    return result;
}