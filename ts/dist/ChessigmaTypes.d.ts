export interface DailyPuzzle {
    date?: string;
    fen?: string;
    gameUrl?: string | null;
    puzzleId?: string;
    rating?: number;
    sideToMove?: string;
    solution?: any[];
    themes?: any[];
}
export interface DailyPuzzleListMatch {
    date?: string;
}
export interface Elo {
    change?: number;
    expectedScore?: number;
    kFactor?: number;
    newRating?: number;
    opponentRating?: number;
    result?: string;
    system?: string;
    yourRating?: number;
}
export interface EloLoadMatch {
    k_factor?: number;
    opponent_rating: number;
    result: string;
    system?: string;
    your_rating: number;
}
export interface Game {
    analysis?: Record<string, any>;
    gameId?: string;
    id?: string;
    metadata?: Record<string, any>;
    pgn: string;
    status?: string;
}
export interface GameLoadMatch {
    id: string;
}
export interface GameCreateData {
    pgn: string;
}
