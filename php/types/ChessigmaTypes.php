<?php
declare(strict_types=1);

// Typed models for the Chessigma SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** DailyPuzzle entity data model. */
class DailyPuzzle
{
    public ?string $date = null;
    public ?string $fen = null;
    public mixed $gameUrl = null;
    public ?string $puzzleId = null;
    public ?int $rating = null;
    public ?string $sideToMove = null;
    public ?array $solution = null;
    public ?array $themes = null;
}

/** Request payload for DailyPuzzle#list. */
class DailyPuzzleListMatch
{
    public ?string $date = null;
}

/** Elo entity data model. */
class Elo
{
    public ?int $change = null;
    public ?float $expectedScore = null;
    public ?int $kFactor = null;
    public ?int $newRating = null;
    public ?int $opponentRating = null;
    public ?string $result = null;
    public ?string $system = null;
    public ?int $yourRating = null;
}

/** Request payload for Elo#load. */
class EloLoadMatch
{
    public ?int $k_factor = null;
    public int $opponent_rating;
    public string $result;
    public ?string $system = null;
    public int $your_rating;
}

/** Game entity data model. */
class Game
{
    public ?array $analysis = null;
    public ?string $gameId = null;
    public ?string $id = null;
    public ?array $metadata = null;
    public string $pgn;
    public ?string $status = null;
}

/** Request payload for Game#load. */
class GameLoadMatch
{
    public string $id;
}

/** Request payload for Game#create. */
class GameCreateData
{
    public string $pgn;
}

