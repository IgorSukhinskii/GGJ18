export interface ClientMessage {
    type: "create" | "join" | "start" | "move" | "finishRound",
    payload: ClientPayload;
}

export interface CreatePayload {
    name: string
}

export interface JoinPayload {
    name: string,
    roomCode: string
}

export interface StartPayload {
}

export interface MovePayload {
    direction: "N" | "S" | "E" | "W"
}

export interface FinishRoundPayload {
    exitNumber?: number
}

export type ClientPayload = CreatePayload | JoinPayload | StartPayload | MovePayload | FinishRoundPayload;

export function isInstanceOfClientMessage(object: any): object is ClientMessage {
    return 'type' in object && 'payload' in object;
}