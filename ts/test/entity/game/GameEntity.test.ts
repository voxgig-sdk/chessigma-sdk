

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { ChessigmaSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('GameEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when CHESSIGMA_TEST_LIVE=TRUE.
  afterEach(liveDelay('CHESSIGMA_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ChessigmaSDK.test()
    const ent = testsdk.Game()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = ChessigmaSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Game().load({"id":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.CHESSIGMA_TEST_LIVE
    for (const op of ['create', 'load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'game.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"analysis":{"a":true,"h":"Analysis","n":"analysis","r":false,"t":"`$OBJECT`","key$":"analysis","index$":0},"gameId":{"a":true,"fo":"uuid","h":"Game Id","n":"gameId","r":false,"t":"`$STRING`","key$":"gameId","index$":1},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":2},"metadata":{"a":true,"h":"Metadata","n":"metadata","r":false,"t":"`$OBJECT`","key$":"metadata","index$":3},"pgn":{"a":true,"h":"Pgn","n":"pgn","r":true,"sh":"PGN text.","t":"`$STRING`","key$":"pgn","index$":4},"status":{"a":true,"h":"Status","n":"status","r":false,"t":"`$STRING`","key$":"status","index$":5}},"id":{"field":"id","name":"id"},"name":"game","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["pgn"],"co":{"id":"POST /game","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/game","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"game"}],"t":{"req":{"pgn":"`reqdata.pgn`"},"res":"`body`"},"index$":0}],"key$":"create"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /game/{gameId}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"gameId","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/game/{gameId}","q":{"exist":["id"]},"r":{"param":{"gameId":"id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"game"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"game","name__orig":"game","Name":"Game","name_":"game","name-":"game","NAME":"GAME","index$":2}, {"active":true,"entity":"game","key$":"BasicGameFlow","kind":"basic","name":"BasicGameFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"game_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{"ref":"game_ref01","srcdatavar":"game_ref01_data","suffix":"_dt0"},"m":{"id":"game01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-game_ref01"}}],"index$":1,"route":"GET /game/{gameId}","record":{}}]}, 'Game', {"POST /game":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["pgn"],"additionalProperties":false,"properties":{"pgn":{"type":"string","minLength":1,"maxLength":10000,"description":"PGN text. Must include [White], [Black], [Result] tags and a valid moves section.","key$":"pgn"}},"x-ref":"#/components/schemas/GameSubmission","index$":1},"example":{"pgn":"[White \"Alice\"]\n[Black \"Bob\"]\n[Result \"1-0\"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 1-0"}}}},"parameters":[]},"GET /game/{gameId}":{"protocol":"http","parameters":[{"name":"gameId","in":"path","required":true,"description":"UUID returned by POST /game.","schema":{"type":"string","format":"uuid"},"index$":0}]}}, { strict: LIVE_STRICT, t }, 'TRUE' === process.env.VOXGIG_GETONLY_GUARD ? {"game.create.0":"GET-only live run: needs POST /game","game.load.1":"GET-only live run: reads a record only game.create.0 gives"} : {})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const game_ref01_ent = client.Game()
    let game_ref01_data = setup.data.new.game['game_ref01']

    game_ref01_data = (await game_ref01_ent.create(game_ref01_data)).data()
    assert(null != game_ref01_data.id)


    // LOAD
    const game_ref01_match_dt0: any = {}
    game_ref01_match_dt0.id = game_ref01_data.id
    const game_ref01_data_dt0 = (await game_ref01_ent.load(game_ref01_match_dt0)).data()
    assert(game_ref01_data_dt0.id === game_ref01_data.id)


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/game/GameTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = ChessigmaSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['game01','game02','game03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'CHESSIGMA_TEST_GAME_ENTID': idmap,
    'CHESSIGMA_TEST_LIVE': 'FALSE',
    'CHESSIGMA_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['CHESSIGMA_TEST_GAME_ENTID']

  const live = 'TRUE' === env.CHESSIGMA_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['CHESSIGMA_TEST_GAME_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new ChessigmaSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.CHESSIGMA_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
