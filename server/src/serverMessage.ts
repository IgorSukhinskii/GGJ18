export interface ServerMessage {
    type: "create" | "join" | "start" | "move" | "finishRound" | "endGame",
    payload: object
}

export interface CreatePayload {
    roomCode: string
}

export interface JoinPayload {
    name: string
}

export interface StartPayload {
    playerType: "victim" | "savior" | "killer",
    maze: object,
    startingPosition: {x: number, y: number}
}

export interface MovePayload {
    position: {x: number, y: number}
}

export interface FinishRoundPayload {
    scores: {[name: string]: number}
    result: "escape" | "die",
    exitNumber?: number,
    victim: string,
    killer: string
}

export interface EndGamePayload {
    winner: string
}

export type ServerPayload = CreatePayload | JoinPayload | StartPayload | MovePayload | FinishRoundPayload | EndGamePayload;