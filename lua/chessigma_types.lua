-- Typed models for the Chessigma SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
-- params (op.<name>.points[].g.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class DailyPuzzle
---@field date? string
---@field fen? string
---@field gameUrl? string|nil
---@field puzzleId? string
---@field rating? number
---@field sideToMove? string
---@field solution? table
---@field themes? table

---@class DailyPuzzleListMatch
---@field date? string

---@class Elo
---@field change? number
---@field expectedScore? number
---@field kFactor? number
---@field newRating? number
---@field opponentRating? number
---@field result? string
---@field system? string
---@field yourRating? number

---@class EloLoadMatch
---@field k_factor? number
---@field opponent_rating number
---@field result string
---@field system? string
---@field your_rating number

---@class Game
---@field analysis? table
---@field gameId? string
---@field id? string
---@field metadata? table
---@field pgn string
---@field status? string

---@class GameLoadMatch
---@field id string

---@class GameCreateData
---@field pgn string

local M = {}

return M
