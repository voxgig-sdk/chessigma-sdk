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
(0, node_test_1.describe)('DailyPuzzleEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when CHESSIGMA_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('CHESSIGMA_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.ChessigmaSDK.test();
        const ent = testsdk.DailyPuzzle();
        (0, node_assert_1.default)(null != ent);
    });
    class FailHook extends __1.BaseFeature {
        name = 'failhook';
        version = '0.0.1';
        active = true;
        unexpected = 0;
        init() { }
        PreSpec() { throw new Error('daily_puzzle hook failed'); }
        PreUnexpected() { this.unexpected++; }
    }
    (0, node_test_1.test)('stream-error', async () => {
        const offline = { net: { offline: true } };
        await node_assert_1.default.rejects(async () => {
            for await (const _item of __1.ChessigmaSDK.test(offline).DailyPuzzle().stream('list')) { }
        }, /offline/);
        for await (const _item of __1.ChessigmaSDK.test(offline).DailyPuzzle()
            .stream('list', undefined, { ctrl: { throw: false } })) { }
        if (null != __1.config.feature?.rbac) {
            const denied = __1.ChessigmaSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } });
            await node_assert_1.default.rejects(async () => {
                for await (const _item of denied.DailyPuzzle().stream('list')) { }
            }, (err) => 'rbac_denied' === err.code);
        }
    });
    (0, node_test_1.test)('stream-ctrl', async () => {
        const explain = {};
        const ctrl = { explain };
        for await (const _item of __1.ChessigmaSDK.test().DailyPuzzle().stream('list', undefined, { ctrl })) { }
        node_assert_1.default.deepStrictEqual(Object.keys(ctrl), ['explain']);
        (0, node_assert_1.default)(explain === ctrl.explain && 0 < Object.keys(explain).length);
    });
    (0, node_test_1.test)('unexpected', async () => {
        const hook = new FailHook();
        const client = new __1.ChessigmaSDK({ feature: { test: { active: true } }, extend: [hook] });
        await node_assert_1.default.rejects(client.DailyPuzzle().list(), /hook failed/);
        (0, node_assert_1.default)(0 < hook.unexpected);
        const fired = hook.unexpected;
        node_assert_1.default.strictEqual(await client.DailyPuzzle().list(undefined, { throw: false }), undefined);
        (0, node_assert_1.default)(fired < hook.unexpected);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.ChessigmaSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.DailyPuzzle().list({ "date": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.CHESSIGMA_TEST_LIVE;
        for (const op of ['list']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'daily_puzzle.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "date": { "a": true, "h": "Date", "n": "date", "r": false, "t": "`$STRING`", "key$": "date", "index$": 0 }, "fen": { "a": true, "h": "Fen", "n": "fen", "r": false, "sh": "Position in FEN notation.", "t": "`$STRING`", "key$": "fen", "index$": 1 }, "gameUrl": { "a": true, "fo": "uri", "h": "Game Url", "n": "gameUrl", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "gameUrl", "index$": 2 }, "puzzleId": { "a": true, "h": "Puzzle Id", "n": "puzzleId", "r": false, "t": "`$STRING`", "key$": "puzzleId", "index$": 3 }, "rating": { "a": true, "h": "Rating", "n": "rating", "r": false, "t": "`$INTEGER`", "key$": "rating", "index$": 4 }, "sideToMove": { "a": true, "h": "Side To Move", "n": "sideToMove", "r": false, "t": "`$STRING`", "key$": "sideToMove", "index$": 5 }, "solution": { "a": true, "h": "Solution", "n": "solution", "r": false, "sh": "Moves in UCI notation; first move sets up the puzzle.", "t": "`$ARRAY`", "key$": "solution", "index$": 6 }, "themes": { "a": true, "h": "Themes", "n": "themes", "r": false, "t": "`$ARRAY`", "key$": "themes", "index$": 7 } }, "name": "daily_puzzle", "op": { "list": { "input": "data", "name": "list", "points": [{ "a": true, "co": { "id": "GET /daily-puzzle", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "date", "or": "date", "r": false, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/daily-puzzle", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "daily-puzzle" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "list" } }, "relations": { "ancestors": [] }, "key$": "daily_puzzle", "name__orig": "daily_puzzle", "Name": "DailyPuzzle", "name_": "daily_puzzle", "name-": "daily-puzzle", "NAME": "DAILY_PUZZLE", "index$": 0 }, { "active": true, "entity": "daily_puzzle", "key$": "BasicDailyPuzzleFlow", "kind": "basic", "name": "BasicDailyPuzzleFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": {}, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemExists", "def": { "ref": "daily_puzzle_ref01" } }], "index$": 0 }] }, 'DailyPuzzle', { "GET /daily-puzzle": { "protocol": "http", "parameters": [{ "name": "date", "in": "query", "required": false, "description": "Past date in YYYY-MM-DD format. Defaults to today. Future dates are rejected.", "schema": { "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$" }, "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let daily_puzzle_ref01_data = Object.values(setup.data.existing.daily_puzzle)[0];
        // LIST
        const daily_puzzle_ref01_ent = client.DailyPuzzle();
        const daily_puzzle_ref01_match = {};
        const daily_puzzle_ref01_list = (await daily_puzzle_ref01_ent.list(daily_puzzle_ref01_match)).map((e) => e.data());
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
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/daily_puzzle/DailyPuzzleTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.ChessigmaSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['daily_puzzle01', 'daily_puzzle02', 'daily_puzzle03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'CHESSIGMA_TEST_DAILY_PUZZLE_ENTID': idmap,
        'CHESSIGMA_TEST_LIVE': 'FALSE',
        'CHESSIGMA_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['CHESSIGMA_TEST_DAILY_PUZZLE_ENTID'];
    const live = 'TRUE' === env.CHESSIGMA_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['CHESSIGMA_TEST_DAILY_PUZZLE_ENTID'];
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
//# sourceMappingURL=DailyPuzzleEntity.test.js.map