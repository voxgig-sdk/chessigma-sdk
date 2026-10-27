// Typed models for the Chessigma SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface DailyPuzzle {
  date?: string
  fen?: string
  gameUrl?: string | null
  puzzleId?: string
  rating?: number
  sideToMove?: string
  solution?: any[]
  themes?: any[]
}

export interface DailyPuzzleListMatch {
  date?: string
}

export interface Elo {
  change?: number
  expectedScore?: number
  kFactor?: number
  newRating?: number
  opponentRating?: number
  result?: string
  system?: string
  yourRating?: number
}

export interface EloLoadMatch {
  k_factor?: number
  opponent_rating: number
  result: string
  system?: string
  your_rating: number
}

export interface Game {
  analysis?: Record<string, any>
  gameId?: string
  id?: string
  metadata?: Record<string, any>
  pgn: string
  status?: string
}

export interface GameLoadMatch {
  id: string
}

export interface GameCreateData {
  pgn: string
}

