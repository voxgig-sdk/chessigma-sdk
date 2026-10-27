// Typed models for the Chessigma SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/chessigma-sdk/go/core"
)

// DailyPuzzle is the typed data model for the daily_puzzle entity.
type DailyPuzzle struct {
}

// DailyPuzzleListMatch is the typed request payload for DailyPuzzle.ListTyped.
type DailyPuzzleListMatch struct {
	Date *string `json:"date,omitempty"`
}

// Elo is the typed data model for the elo entity.
type Elo struct {
}

// EloLoadMatch is the typed request payload for Elo.LoadTyped.
type EloLoadMatch struct {
	KFactor *int `json:"k_factor,omitempty"`
	OpponentRating int `json:"opponent_rating"`
	Result string `json:"result"`
	System *string `json:"system,omitempty"`
	YourRating int `json:"your_rating"`
}

// Game is the typed data model for the game entity.
type Game struct {
}

// GameLoadMatch is the typed request payload for Game.LoadTyped.
type GameLoadMatch struct {
	Id string `json:"id"`
}

// GameCreateData is the typed request payload for Game.CreateTyped.
type GameCreateData struct {
	Pgn string `json:"pgn"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
