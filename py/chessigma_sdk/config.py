# Chessigma SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "Chessigma",
            "slug": "chessigma",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
          "factor": 2,
          "maxDelay": 2000,
          "minDelay": 50,
          "retries": 2,
          "statuses": [
            408,
            425,
            429,
            500,
            502,
            503,
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "now": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://www.chessigma.com/public-api/v1",
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "daily_puzzle": {},
                "elo": {},
                "game": {},
            },
        },
        "entity": {
      "daily_puzzle": {
        "fields": [
          {
            "name": "date",
            "title": "Date",
            "type": "`$STRING`",
          },
          {
            "name": "fen",
            "title": "Fen",
            "type": "`$STRING`",
            "short": "Position in FEN notation.",
          },
          {
            "name": "gameUrl",
            "title": "Game Url",
            "type": [
              "`$ONE`",
              [
                "`$STRING`",
                "`$NULL`",
              ],
            ],
            "format": "uri",
          },
          {
            "name": "puzzleId",
            "title": "Puzzle Id",
            "type": "`$STRING`",
          },
          {
            "name": "rating",
            "title": "Rating",
            "type": "`$INTEGER`",
          },
          {
            "name": "sideToMove",
            "title": "Side To Move",
            "type": "`$STRING`",
          },
          {
            "name": "solution",
            "title": "Solution",
            "type": "`$ARRAY`",
            "short": "Moves in UCI notation; first move sets up the puzzle.",
          },
          {
            "name": "themes",
            "title": "Themes",
            "type": "`$ARRAY`",
          },
        ],
        "name": "daily_puzzle",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/daily-puzzle",
                "segments": [
                  {
                    "lit": "daily-puzzle",
                  },
                ],
                "parts": [
                  "daily-puzzle",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "query": [
                    {
                      "name": "date",
                      "orig": "date",
                      "type": "`$STRING`",
                      "kind": "query",
                      "field": True,
                    },
                  ],
                },
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "elo": {
        "fields": [
          {
            "name": "change",
            "title": "Change",
            "type": "`$INTEGER`",
          },
          {
            "name": "expectedScore",
            "title": "Expected Score",
            "type": "`$NUMBER`",
            "short": "Probability of scoring (0–1).",
          },
          {
            "name": "kFactor",
            "title": "K Factor",
            "type": "`$INTEGER`",
          },
          {
            "name": "newRating",
            "title": "New Rating",
            "type": "`$INTEGER`",
          },
          {
            "name": "opponentRating",
            "title": "Opponent Rating",
            "type": "`$INTEGER`",
          },
          {
            "name": "result",
            "title": "Result",
            "type": "`$STRING`",
          },
          {
            "name": "system",
            "title": "System",
            "type": "`$STRING`",
          },
          {
            "name": "yourRating",
            "title": "Your Rating",
            "type": "`$INTEGER`",
          },
        ],
        "name": "elo",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/elo-calculator",
                "segments": [
                  {
                    "lit": "elo-calculator",
                  },
                ],
                "parts": [
                  "elo-calculator",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "query": [
                    {
                      "name": "k_factor",
                      "orig": "kFactor",
                      "type": "`$INTEGER`",
                      "kind": "query",
                    },
                    {
                      "name": "opponent_rating",
                      "orig": "opponentRating",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "reqd": True,
                      "example": 1400,
                    },
                    {
                      "name": "result",
                      "orig": "result",
                      "type": "`$STRING`",
                      "kind": "query",
                      "reqd": True,
                      "example": "win",
                      "field": True,
                    },
                    {
                      "name": "system",
                      "orig": "system",
                      "type": "`$STRING`",
                      "kind": "query",
                      "example": "fide",
                      "field": True,
                    },
                    {
                      "name": "your_rating",
                      "orig": "yourRating",
                      "type": "`$INTEGER`",
                      "kind": "query",
                      "reqd": True,
                      "example": 1500,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "opponent_rating",
                    "result",
                    "your_rating",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "game": {
        "fields": [
          {
            "name": "analysis",
            "title": "Analysis",
            "type": "`$OBJECT`",
          },
          {
            "name": "gameId",
            "title": "Game Id",
            "type": "`$STRING`",
            "format": "uuid",
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
          },
          {
            "name": "metadata",
            "title": "Metadata",
            "type": "`$OBJECT`",
          },
          {
            "name": "pgn",
            "title": "Pgn",
            "type": "`$STRING`",
            "req": True,
            "short": "PGN text.",
          },
          {
            "name": "status",
            "title": "Status",
            "type": "`$STRING`",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "game",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/game",
                "segments": [
                  {
                    "lit": "game",
                  },
                ],
                "parts": [
                  "game",
                ],
                "rename": {},
                "transform": {
                  "req": {
                    "pgn": "`reqdata.pgn`",
                  },
                  "res": "`body`",
                },
                "args": {},
                "select": {},
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/game/{gameId}",
                "segments": [
                  {
                    "lit": "game",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "game",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "gameId": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "gameId",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "response": {
                  "kind": "json",
                  "media": "application/json",
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
