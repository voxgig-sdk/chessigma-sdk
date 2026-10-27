# Typed models for the Chessigma SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class DailyPuzzle(TypedDict, total=False):
    date: str
    fen: str
    gameUrl: str | None
    puzzleId: str
    rating: int
    sideToMove: str
    solution: list
    themes: list


class DailyPuzzleListMatch(TypedDict, total=False):
    date: str


class Elo(TypedDict, total=False):
    change: int
    expectedScore: float
    kFactor: int
    newRating: int
    opponentRating: int
    result: str
    system: str
    yourRating: int


class EloLoadMatchRequired(TypedDict):
    opponent_rating: int
    result: str
    your_rating: int


class EloLoadMatch(EloLoadMatchRequired, total=False):
    k_factor: int
    system: str


class GameRequired(TypedDict):
    pgn: str


class Game(GameRequired, total=False):
    analysis: dict
    gameId: str
    id: str
    metadata: dict
    status: str


class GameLoadMatch(TypedDict):
    id: str


class GameCreateData(TypedDict):
    pgn: str
