import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "daily_puzzle",
    "accessor": "DailyPuzzle",
    "op": "list",
    "method": "GET",
    "path": "/daily-puzzle",
    "args": [],
    "select": {
      "date": "v1"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "date"
    ],
    "queryArgs": [
      {
        "name": "date",
        "wire": "date"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": {
      "date": "2026-05-23",
      "puzzleId": "abcde",
      "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
      "sideToMove": "black",
      "rating": 1523,
      "themes": [
        "fork",
        "middlegame"
      ],
      "solution": [
        "d7d5",
        "e4d5"
      ],
      "gameUrl": "https://lichess.org/abc123"
    },
    "idField": "id"
  },
  {
    "entity": "elo",
    "accessor": "Elo",
    "op": "load",
    "method": "GET",
    "path": "/elo-calculator",
    "args": [],
    "select": {
      "opponent_rating": "v1",
      "result": "win",
      "your_rating": "v1",
      "k_factor": "v1",
      "system": "fide"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "yourRating",
      "opponentRating",
      "result",
      "system",
      "kFactor"
    ],
    "queryArgs": [
      {
        "name": "k_factor",
        "wire": "kFactor"
      },
      {
        "name": "opponent_rating",
        "wire": "opponentRating"
      },
      {
        "name": "result",
        "wire": "result"
      },
      {
        "name": "system",
        "wire": "system"
      },
      {
        "name": "your_rating",
        "wire": "yourRating"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": {
      "yourRating": 1500,
      "opponentRating": 1400,
      "result": "win",
      "system": "fide",
      "kFactor": 20,
      "expectedScore": 0.6401,
      "newRating": 1507,
      "change": 7
    },
    "idField": "id"
  },
  {
    "entity": "game",
    "accessor": "Game",
    "op": "create",
    "method": "POST",
    "path": "/game",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 201,
    "sample": {
      "gameId": "f222a278-3ed5-46c5-bd14-d0af7fa92e3d",
      "url": "https://www.chessigma.com/games/f222a278-3ed5-46c5-bd14-d0af7fa92e3d",
      "status": "submitted",
      "message": "Successfully saved 1 game"
    },
    "idField": "id"
  },
  {
    "entity": "game",
    "accessor": "Game",
    "op": "load",
    "method": "GET",
    "path": "/game/{gameId}",
    "args": [
      {
        "name": "id",
        "wire": "gameId",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "gameId": "x",
      "status": "completed",
      "analysis": {
        "game": {
          "id": "x",
          "pgn": "x",
          "white_username": "x",
          "black_username": "x",
          "white_rating": 1,
          "black_rating": 1,
          "white_result": "x",
          "black_result": "x",
          "time_class": "x",
          "time_control": "x",
          "source": "x"
        }
      },
      "metadata": {
        "analysisCompletedAt": "2026-01-01T00:00:00Z",
        "version": "x"
      }
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
