package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "Chessigma",
			"slug": "chessigma",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"now": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://www.chessigma.com/public-api/v1",
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"daily_puzzle": map[string]any{},
				"elo": map[string]any{},
				"game": map[string]any{},
			},
		},
		"entity": map[string]any{
			"daily_puzzle": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "date",
						"title": "Date",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "fen",
						"title": "Fen",
						"type": "`$STRING`",
						"short": "Position in FEN notation.",
					},
					map[string]any{
						"name": "gameUrl",
						"title": "Game Url",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"format": "uri",
					},
					map[string]any{
						"name": "puzzleId",
						"title": "Puzzle Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "rating",
						"title": "Rating",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "sideToMove",
						"title": "Side To Move",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "solution",
						"title": "Solution",
						"type": "`$ARRAY`",
						"short": "Moves in UCI notation; first move sets up the puzzle.",
					},
					map[string]any{
						"name": "themes",
						"title": "Themes",
						"type": "`$ARRAY`",
					},
				},
				"name": "daily_puzzle",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/daily-puzzle",
								"segments": []any{
									map[string]any{
										"lit": "daily-puzzle",
									},
								},
								"parts": []any{
									"daily-puzzle",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "date",
											"orig": "date",
											"type": "`$STRING`",
											"kind": "query",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"elo": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "change",
						"title": "Change",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "expectedScore",
						"title": "Expected Score",
						"type": "`$NUMBER`",
						"short": "Probability of scoring (0–1).",
					},
					map[string]any{
						"name": "kFactor",
						"title": "K Factor",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "newRating",
						"title": "New Rating",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "opponentRating",
						"title": "Opponent Rating",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "result",
						"title": "Result",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "system",
						"title": "System",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "yourRating",
						"title": "Your Rating",
						"type": "`$INTEGER`",
					},
				},
				"name": "elo",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/elo-calculator",
								"segments": []any{
									map[string]any{
										"lit": "elo-calculator",
									},
								},
								"parts": []any{
									"elo-calculator",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "k_factor",
											"orig": "kFactor",
											"type": "`$INTEGER`",
											"kind": "query",
										},
										map[string]any{
											"name": "opponent_rating",
											"orig": "opponentRating",
											"type": "`$INTEGER`",
											"kind": "query",
											"reqd": true,
											"example": 1400,
										},
										map[string]any{
											"name": "result",
											"orig": "result",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "win",
											"field": true,
										},
										map[string]any{
											"name": "system",
											"orig": "system",
											"type": "`$STRING`",
											"kind": "query",
											"example": "fide",
											"field": true,
										},
										map[string]any{
											"name": "your_rating",
											"orig": "yourRating",
											"type": "`$INTEGER`",
											"kind": "query",
											"reqd": true,
											"example": 1500,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"opponent_rating",
										"result",
										"your_rating",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"game": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "analysis",
						"title": "Analysis",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "gameId",
						"title": "Game Id",
						"type": "`$STRING`",
						"format": "uuid",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "metadata",
						"title": "Metadata",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "pgn",
						"title": "Pgn",
						"type": "`$STRING`",
						"req": true,
						"short": "PGN text.",
					},
					map[string]any{
						"name": "status",
						"title": "Status",
						"type": "`$STRING`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "game",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/game",
								"segments": []any{
									map[string]any{
										"lit": "game",
									},
								},
								"parts": []any{
									"game",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": map[string]any{
										"pgn": "`reqdata.pgn`",
									},
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/game/{gameId}",
								"segments": []any{
									map[string]any{
										"lit": "game",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"game",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"gameId": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "gameId",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
