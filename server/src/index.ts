import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as uuid from 'uuid/v4';
import { ClientMessage, isInstanceOfClientMessage, CreatePayload, JoinPayload, StartPayload, MovePayload, FinishRoundPayload } from './clientMessage';
import { Game, Player } from './game';
import { generateMaze, toSvgPath, Position, Direction } from './betterMaze';
import { setTimeout } from 'timers';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const games: {[roomCode: string]: Game} = {};

function generateRoomCode(): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < 4; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function forEachPlayer(roomCode: string, action: (p: Player, i? : number) => void) {
    for (let i = 0; i< games[roomCode].players.length; i++) {
        const player = games[roomCode].players[i];
        action(player, i);
    }
}

function startNewRound(roomCode: string) {
    const victim = games[roomCode].victim;
    let killer = Math.floor(Math.random() * (games[roomCode].players.length - 1));
    if (killer >= victim) {
        killer += 1;
    }
    games[roomCode].killer = killer;
    forEachPlayer(roomCode, (player, i) => {
        if (i == victim) {
            player.type = "victim";
        } else if (i == killer) {
            player.type = "killer";
        } else {
            player.type = "savior";
        }
    });
    // TODO: generate the bloody maze
    games[roomCode].maze = generateMaze(20, 20);
    // TODO: place the victim in the bloody maze
    games[roomCode].victimPosition = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
    };
    // TODO: place exits in the maze
    forEachPlayer(roomCode, player => {
        player.socket.send(JSON.stringify({
            type: "start",
            payload: {
                playerType: player.type,
                maze: games[roomCode].maze,
                victimPosition: games[roomCode].victimPosition,
                collectables: []
            }
        }));
    });
}

wss.on('connection', (ws: WebSocket) => {
    let id = 0;
    let roomCode = "";
    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        console.log('received: %s', message);
        const msg = JSON.parse(message);
        if (isInstanceOfClientMessage(msg)) {
            if (msg.type == "create") {
                do {
                    roomCode = generateRoomCode();
                } while (games[roomCode] != undefined);
                const payload = msg.payload as CreatePayload;
                games[roomCode] = {
                    players: [],
                    walls: [],
                    full: false,
                    victim: 0,
                    killer: 0,
                    maze: {cells: [], width: 0, height: 0},
                    victimPosition: {x: 0, y: 0},
                    collectables: []
                };
                id = games[roomCode].players.length;
                games[roomCode].players.push({id, name: payload.name, score: 0, socket: ws});
                ws.send(JSON.stringify({
                    type: "create",
                    payload: { roomCode }
                }));
            } else if (msg.type == "join") {
                const payload = msg.payload as JoinPayload;
                if (games[payload.roomCode] != undefined && !games[payload.roomCode].full) {
                    roomCode = payload.roomCode;
                    id = games[roomCode].players.length;
                    games[roomCode].players.push({id, name: payload.name, score: 0, socket: ws});
                    forEachPlayer(roomCode, player => {
                        if (player.id != id) {
                            player.socket.send(JSON.stringify({
                                type: "join",
                                payload: { name: payload.name }
                            }))
                        }
                    });
                    ws.send(JSON.stringify({
                        type: "joinResult",
                        payload: { result: "success" }
                    }));
                } else {
                    ws.send(JSON.stringify({
                        type: "joinResult",
                        payload: { result: "fail" }
                    }));
                }
            } else if (msg.type == "start") {
                const payload = msg.payload as StartPayload;
                games[roomCode].full = true;
                startNewRound(roomCode);
            } else if (msg.type == "move") {
                const payload = msg.payload as MovePayload;
                const {x, y} = games[roomCode].victimPosition;
                if (payload.direction == "N" && (games[roomCode].maze.cells[x][y].neighbors & Direction.North)) {
                    games[roomCode].victimPosition.y += 1;
                }
                if (payload.direction == "S" && (games[roomCode].maze.cells[x][y].neighbors & Direction.South)) {
                    games[roomCode].victimPosition.y -= 1;
                }
                if (payload.direction == "E" && (games[roomCode].maze.cells[x][y].neighbors & Direction.East)) {
                    games[roomCode].victimPosition.x += 1;
                }
                if (payload.direction == "W" && (games[roomCode].maze.cells[x][y].neighbors & Direction.West)) {
                    games[roomCode].victimPosition.x -= 1;
                }
                forEachPlayer(roomCode, player => {
                    player.socket.send(JSON.stringify({
                        type: "move",
                        payload: {
                            position: games[roomCode].victimPosition
                        }
                    }));
                })
            } else if (msg.type == "finishRound") {
                const payload = msg.payload as FinishRoundPayload;
                forEachPlayer(roomCode, player => {
                    player.socket.send(JSON.stringify({
                        type: "finishRound",
                        payload: {
                            scores: {},
                            result: payload.exitNumber != undefined ? "escape" : "die",
                            exitNumber: payload.exitNumber,
                            victim: games[roomCode].players[games[roomCode].victim].name,
                            killer: games[roomCode].players[games[roomCode].killer].name
                        }
                    }));
                });
                games[roomCode].victim += 1;
                if (games[roomCode].victim >= games[roomCode].players.length) { // everyone has been a victim once, game over
                    forEachPlayer(roomCode, player => {
                        player.socket.send(JSON.stringify({
                            type: "endGame",
                            payload: { winner: "Igor" }
                        }));
                    });
                } else {
                    // start a new round after 10 seconds (i know, i know)
                    setTimeout(() => {
                        startNewRound(roomCode);
                    }, 10000);
                    
                }
            }
        }
    });
});

//start our server
const PORT = process.env.PORT || 8999;
server.listen(PORT, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
