"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('EloEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when CHESSIGMA_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('CHESSIGMA_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.ChessigmaSDK.test();
        const ent = testsdk.Elo();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.ChessigmaSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Elo().load({ "k_factor": "x", "opponent_rating": 1, "result": "x", "your_rating": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.CHESSIGMA_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'elo.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "change": { "a": true, "h": "Change", "n": "change", "r": false, "t": "`$INTEGER`", "key$": "change", "index$": 0 }, "expectedScore": { "a": true, "h": "Expected Score", "n": "expectedScore", "r": false, "sh": "Probability of scoring (0–1).", "t": "`$NUMBER`", "key$": "expectedScore", "index$": 1 }, "kFactor": { "a": true, "h": "K Factor", "n": "kFactor", "r": false, "t": "`$INTEGER`", "key$": "kFactor", "index$": 2 }, "newRating": { "a": true, "h": "New Rating", "n": "newRating", "r": false, "t": "`$INTEGER`", "key$": "newRating", "index$": 3 }, "opponentRating": { "a": true, "h": "Opponent Rating", "n": "opponentRating", "r": false, "t": "`$INTEGER`", "key$": "opponentRating", "index$": 4 }, "result": { "a": true, "h": "Result", "n": "result", "r": false, "t": "`$STRING`", "key$": "result", "index$": 5 }, "system": { "a": true, "h": "System", "n": "system", "r": false, "t": "`$STRING`", "key$": "system", "index$": 6 }, "yourRating": { "a": true, "h": "Your Rating", "n": "yourRating", "r": false, "t": "`$INTEGER`", "key$": "yourRating", "index$": 7 } }, "name": "elo", "op": { "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /elo-calculator", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "k_factor", "or": "kFactor", "r": false, "t": "`$INTEGER`", "index$": 0 }, { "a": true, "ex": 1400, "k": "query", "n": "opponent_rating", "or": "opponentRating", "r": true, "t": "`$INTEGER`", "index$": 1 }, { "a": true, "ex": "win", "k": "query", "n": "result", "or": "result", "r": true, "t": "`$STRING`", "index$": 2 }, { "a": true, "ex": "fide", "k": "query", "n": "system", "or": "system", "r": false, "t": "`$STRING`", "index$": 3 }, { "a": true, "ex": 1500, "k": "query", "n": "your_rating", "or": "yourRating", "r": true, "t": "`$INTEGER`", "index$": 4 }] }, "k": "http", "m": "GET", "o": "/elo-calculator", "q": { "exist": ["opponent_rating", "result", "your_rating"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "elo-calculator" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "elo", "name__orig": "elo", "Name": "Elo", "name_": "elo", "name-": "elo", "NAME": "ELO", "index$": 1 }, { "active": true, "entity": "elo", "key$": "BasicEloFlow", "kind": "basic", "name": "BasicEloFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "elo_ref01", "srcdatavar": "elo_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-elo_ref01" } }], "index$": 0 }] }, 'Elo', { "GET /elo-calculator": { "protocol": "http", "parameters": [{ "name": "yourRating", "in": "query", "required": true, "schema": { "type": "integer", "minimum": 100, "maximum": 4000 }, "example": 1500, "index$": 0 }, { "name": "opponentRating", "in": "query", "required": true, "schema": { "type": "integer", "minimum": 100, "maximum": 4000 }, "example": 1400, "index$": 1 }, { "name": "result", "in": "query", "required": true, "schema": { "type": "string", "enum": ["win", "draw", "loss"] }, "example": "win", "index$": 2 }, { "name": "system", "in": "query", "required": false, "schema": { "type": "string", "enum": ["fide", "chesscom", "lichess"], "default": "fide" }, "index$": 3 }, { "name": "kFactor", "in": "query", "required": false, "description": "Override the default K-factor for the chosen system.", "schema": { "type": "integer", "minimum": 1, "maximum": 100 }, "index$": 4 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let elo_ref01_data = Object.values(setup.data.existing.elo)[0];
        // LOAD
        const elo_ref01_ent = client.Elo();
        const elo_ref01_match_dt0 = {};
        const elo_ref01_data_dt0 = (await elo_ref01_ent.load(elo_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != elo_ref01_data_dt0);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/elo/EloTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.ChessigmaSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['elo01', 'elo02', 'elo03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'CHESSIGMA_TEST_ELO_ENTID': idmap,
        'CHESSIGMA_TEST_LIVE': 'FALSE',
        'CHESSIGMA_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['CHESSIGMA_TEST_ELO_ENTID'];
    const live = 'TRUE' === env.CHESSIGMA_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['CHESSIGMA_TEST_ELO_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.ChessigmaSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {},
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
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
    };
    return setup;
}
//# sourceMappingURL=EloEntity.test.js.map