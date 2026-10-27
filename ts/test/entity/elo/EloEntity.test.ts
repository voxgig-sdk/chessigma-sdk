

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


describe('EloEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when CHESSIGMA_TEST_LIVE=TRUE.
  afterEach(liveDelay('CHESSIGMA_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ChessigmaSDK.test()
    const ent = testsdk.Elo()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = ChessigmaSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Elo().load({"k_factor":"x","opponent_rating":1,"result":"x","your_rating":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.CHESSIGMA_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'elo.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"change":{"a":true,"h":"Change","n":"change","r":false,"t":"`$INTEGER`","key$":"change","index$":0},"expectedScore":{"a":true,"h":"Expected Score","n":"expectedScore","r":false,"sh":"Probability of scoring (0–1).","t":"`$NUMBER`","key$":"expectedScore","index$":1},"kFactor":{"a":true,"h":"K Factor","n":"kFactor","r":false,"t":"`$INTEGER`","key$":"kFactor","index$":2},"newRating":{"a":true,"h":"New Rating","n":"newRating","r":false,"t":"`$INTEGER`","key$":"newRating","index$":3},"opponentRating":{"a":true,"h":"Opponent Rating","n":"opponentRating","r":false,"t":"`$INTEGER`","key$":"opponentRating","index$":4},"result":{"a":true,"h":"Result","n":"result","r":false,"t":"`$STRING`","key$":"result","index$":5},"system":{"a":true,"h":"System","n":"system","r":false,"t":"`$STRING`","key$":"system","index$":6},"yourRating":{"a":true,"h":"Your Rating","n":"yourRating","r":false,"t":"`$INTEGER`","key$":"yourRating","index$":7}},"name":"elo","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /elo-calculator","source":"openapi3","version":2},"g":{"query":[{"a":true,"k":"query","n":"k_factor","or":"kFactor","r":false,"t":"`$INTEGER`","index$":0},{"a":true,"ex":1400,"k":"query","n":"opponent_rating","or":"opponentRating","r":true,"t":"`$INTEGER`","index$":1},{"a":true,"ex":"win","k":"query","n":"result","or":"result","r":true,"t":"`$STRING`","index$":2},{"a":true,"ex":"fide","k":"query","n":"system","or":"system","r":false,"t":"`$STRING`","index$":3},{"a":true,"ex":1500,"k":"query","n":"your_rating","or":"yourRating","r":true,"t":"`$INTEGER`","index$":4}]},"k":"http","m":"GET","o":"/elo-calculator","q":{"exist":["opponent_rating","result","your_rating"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"elo-calculator"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"elo","name__orig":"elo","Name":"Elo","name_":"elo","name-":"elo","NAME":"ELO","index$":1}, {"active":true,"entity":"elo","key$":"BasicEloFlow","kind":"basic","name":"BasicEloFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"elo_ref01","srcdatavar":"elo_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-elo_ref01"}}],"index$":0}]}, 'Elo', {"GET /elo-calculator":{"protocol":"http","parameters":[{"name":"yourRating","in":"query","required":true,"schema":{"type":"integer","minimum":100,"maximum":4000},"example":1500,"index$":0},{"name":"opponentRating","in":"query","required":true,"schema":{"type":"integer","minimum":100,"maximum":4000},"example":1400,"index$":1},{"name":"result","in":"query","required":true,"schema":{"type":"string","enum":["win","draw","loss"]},"example":"win","index$":2},{"name":"system","in":"query","required":false,"schema":{"type":"string","enum":["fide","chesscom","lichess"],"default":"fide"},"index$":3},{"name":"kFactor","in":"query","required":false,"description":"Override the default K-factor for the chosen system.","schema":{"type":"integer","minimum":1,"maximum":100},"index$":4}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let elo_ref01_data = Object.values(setup.data.existing.elo)[0] as any

    // LOAD
    const elo_ref01_ent = client.Elo()
    const elo_ref01_match_dt0: any = {}
    const elo_ref01_data_dt0 = (await elo_ref01_ent.load(elo_ref01_match_dt0)).data()
    assert(null != elo_ref01_data_dt0)


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
      '../../../../.sdk/test/entity/elo/EloTestData.json')

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
    ['elo01','elo02','elo03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'CHESSIGMA_TEST_ELO_ENTID': idmap,
    'CHESSIGMA_TEST_LIVE': 'FALSE',
    'CHESSIGMA_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['CHESSIGMA_TEST_ELO_ENTID']

  const live = 'TRUE' === env.CHESSIGMA_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['CHESSIGMA_TEST_ELO_ENTID']
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
  
