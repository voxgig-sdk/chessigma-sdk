package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewDailyPuzzleEntityFunc func(client *ChessigmaSDK, entopts map[string]any) ChessigmaEntity

var NewEloEntityFunc func(client *ChessigmaSDK, entopts map[string]any) ChessigmaEntity

var NewGameEntityFunc func(client *ChessigmaSDK, entopts map[string]any) ChessigmaEntity

