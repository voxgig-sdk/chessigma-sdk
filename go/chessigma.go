package voxgigchessigmasdk

import (
	"github.com/voxgig-sdk/chessigma-sdk/go/core"
	"github.com/voxgig-sdk/chessigma-sdk/go/entity"
	"github.com/voxgig-sdk/chessigma-sdk/go/feature"
	_ "github.com/voxgig-sdk/chessigma-sdk/go/utility"
)

// Type aliases preserve external API.
type ChessigmaSDK = core.ChessigmaSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type ChessigmaEntity = core.ChessigmaEntity
type StreamItem = core.StreamItem
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type ChessigmaError = core.ChessigmaError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewRatelimitFeatureFunc = func() core.Feature {
		return feature.NewRatelimitFeature()
	}
	core.NewRetryFeatureFunc = func() core.Feature {
		return feature.NewRetryFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewTimeoutFeatureFunc = func() core.Feature {
		return feature.NewTimeoutFeature()
	}
	core.NewDailyPuzzleEntityFunc = func(client *core.ChessigmaSDK, entopts map[string]any) core.ChessigmaEntity {
		return entity.NewDailyPuzzleEntity(client, entopts)
	}
	core.NewEloEntityFunc = func(client *core.ChessigmaSDK, entopts map[string]any) core.ChessigmaEntity {
		return entity.NewEloEntity(client, entopts)
	}
	core.NewGameEntityFunc = func(client *core.ChessigmaSDK, entopts map[string]any) core.ChessigmaEntity {
		return entity.NewGameEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewChessigmaSDK = core.NewChessigmaSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var SharedConfig = core.SharedConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewChessigmaSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *ChessigmaSDK  { return NewChessigmaSDK(nil) }
func Test() *ChessigmaSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewRatelimitFeature = feature.NewRatelimitFeature
var NewRetryFeature = feature.NewRetryFeature
var NewTestFeature = feature.NewTestFeature
var NewTimeoutFeature = feature.NewTimeoutFeature
