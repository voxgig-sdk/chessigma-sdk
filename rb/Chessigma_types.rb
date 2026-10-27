# frozen_string_literal: true

# Typed models for the Chessigma SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# DailyPuzzle entity data model.
#
# @!attribute [rw] date
#   @return [String, nil]
#
# @!attribute [rw] fen
#   @return [String, nil]
#
# @!attribute [rw] gameUrl
#   @return [Object, nil]
#
# @!attribute [rw] puzzleId
#   @return [String, nil]
#
# @!attribute [rw] rating
#   @return [Integer, nil]
#
# @!attribute [rw] sideToMove
#   @return [String, nil]
#
# @!attribute [rw] solution
#   @return [Array, nil]
#
# @!attribute [rw] themes
#   @return [Array, nil]
DailyPuzzle = Struct.new(
  :date,
  :fen,
  :gameUrl,
  :puzzleId,
  :rating,
  :sideToMove,
  :solution,
  :themes,
  keyword_init: true
)

# Request payload for DailyPuzzle#list.
#
# @!attribute [rw] date
#   @return [String, nil]
DailyPuzzleListMatch = Struct.new(
  :date,
  keyword_init: true
)

# Elo entity data model.
#
# @!attribute [rw] change
#   @return [Integer, nil]
#
# @!attribute [rw] expectedScore
#   @return [Float, nil]
#
# @!attribute [rw] kFactor
#   @return [Integer, nil]
#
# @!attribute [rw] newRating
#   @return [Integer, nil]
#
# @!attribute [rw] opponentRating
#   @return [Integer, nil]
#
# @!attribute [rw] result
#   @return [String, nil]
#
# @!attribute [rw] system
#   @return [String, nil]
#
# @!attribute [rw] yourRating
#   @return [Integer, nil]
Elo = Struct.new(
  :change,
  :expectedScore,
  :kFactor,
  :newRating,
  :opponentRating,
  :result,
  :system,
  :yourRating,
  keyword_init: true
)

# Request payload for Elo#load.
#
# @!attribute [rw] k_factor
#   @return [Integer, nil]
#
# @!attribute [rw] opponent_rating
#   @return [Integer]
#
# @!attribute [rw] result
#   @return [String]
#
# @!attribute [rw] system
#   @return [String, nil]
#
# @!attribute [rw] your_rating
#   @return [Integer]
EloLoadMatch = Struct.new(
  :k_factor,
  :opponent_rating,
  :result,
  :system,
  :your_rating,
  keyword_init: true
)

# Game entity data model.
#
# @!attribute [rw] analysis
#   @return [Hash, nil]
#
# @!attribute [rw] gameId
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] metadata
#   @return [Hash, nil]
#
# @!attribute [rw] pgn
#   @return [String]
#
# @!attribute [rw] status
#   @return [String, nil]
Game = Struct.new(
  :analysis,
  :gameId,
  :id,
  :metadata,
  :pgn,
  :status,
  keyword_init: true
)

# Request payload for Game#load.
#
# @!attribute [rw] id
#   @return [String]
GameLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Game#create.
#
# @!attribute [rw] pgn
#   @return [String]
GameCreateData = Struct.new(
  :pgn,
  keyword_init: true
)

