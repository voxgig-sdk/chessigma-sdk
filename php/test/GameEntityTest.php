<?php
declare(strict_types=1);

// Game entity test

require_once __DIR__ . '/../chessigma_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class GameEntityTest extends TestCase
{
    // main.kit.test.live.strict is true (the default is true): a live
    // request that fails, or a live test missing an input it needs,
    // fails the test.
    // An account with no record for a test to read skips it either way.
    private const LIVE_STRICT = true;

    public function test_create_instance(): void
    {
        $testsdk = ChessigmaSDK::test(null, null);
        $ent = $testsdk->Game(null);
        $this->assertNotNull($ent);
    }

    public function test_validate(): void
    {
        $cfg = ChessigmaConfig::shared_config();
        if (!isset($cfg["feature"]["validate"])) {
            $this->markTestSkipped('feature not present in this SDK: validate');
        }
        $client = ChessigmaSDK::test(null, ["feature" => ["validate" => ["active" => true]]]);
        $err = null;
        try {
            $client->Game(null)->load(["id" => 1], null);
        } catch (\Throwable $e) {
            $err = $e;
        }
        $this->assertSame('validate_failed', $err->sdk_code ?? null);
    }

    public function test_basic_flow(): void
    {
        $setup = game_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "load"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "game." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        if (!empty($setup["live"]) && getenv('VOXGIG_GETONLY_GUARD') === "TRUE") {
            fwrite(STDOUT, 'LIVE STEP {"id":"game.create.0","state":"excluded","attempted":false,"reason":"GET-only live run: needs POST /game"}' . "\n");
            fwrite(STDOUT, 'LIVE STEP {"id":"game.load.1","state":"excluded","attempted":false,"reason":"GET-only live run: reads a record only game.create.0 gives"}' . "\n");
            $this->markTestSkipped('Live coverage incomplete: game.create.0 excluded (GET-only live run: needs POST /game); game.load.1 excluded (GET-only live run: reads a record only game.create.0 gives)');
        }

        $client = $setup["client"];

        // CREATE
        $game_ref01_ent = $client->Game(null);
        $game_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.game"), "game_ref01"));

        $game_ref01_data_result = $game_ref01_ent->create($game_ref01_data, null);
        $game_ref01_data = Helpers::to_map(is_object($game_ref01_data_result) && method_exists($game_ref01_data_result, 'data_get') ? $game_ref01_data_result->data_get() : $game_ref01_data_result);
        $this->assertNotNull($game_ref01_data);
        $this->assertNotNull($game_ref01_data["id"]);

        // LOAD
        $game_ref01_match_dt0 = [
            "id" => $game_ref01_data["id"],
        ];
        $game_ref01_data_dt0_loaded = $game_ref01_ent->load($game_ref01_match_dt0, null);
        $game_ref01_data_dt0_load_result = Helpers::to_map(is_object($game_ref01_data_dt0_loaded) && method_exists($game_ref01_data_dt0_loaded, 'data_get') ? $game_ref01_data_dt0_loaded->data_get() : $game_ref01_data_dt0_loaded);
        $this->assertNotNull($game_ref01_data_dt0_load_result);
        $this->assertEquals($game_ref01_data_dt0_load_result["id"], $game_ref01_data["id"]);

    }
}

function game_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/game/GameTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = ChessigmaSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["game01", "game02", "game03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Whether *_ENTID supplied the idmap, read before env_override consumes
    // it: without it, the ids a live flow binds are the fixture's synthetic ones.
    $entid_env_raw = getenv("CHESSIGMA_TEST_GAME_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "CHESSIGMA_TEST_GAME_ENTID" => $idmap,
        "CHESSIGMA_TEST_LIVE" => "FALSE",
        "CHESSIGMA_TEST_EXPLAIN" => "FALSE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["CHESSIGMA_TEST_GAME_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["CHESSIGMA_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            Runner::live_client_options(),
            [
            ],
            // ismap, not a plain "?? []" default: an empty PHP array is a
            // LIST, and a non-map later entry REPLACES the accumulated map in
            // merge - so the no-extras call discarded live_client_options()
            // and the apikey/server map above it.
            Vs::ismap($extra) ? $extra : new \stdClass(),
        ]);
        // "?? []" because merge legitimately answers with a stdClass when every
        // contributing entry is an EMPTY map - an SDK with no apikey and no
        // server variables generates an empty middle entry, so that is the
        // common case, not the edge one. to_map returns null for a non-array by
        // design, and the constructor takes a non-nullable array, so without the
        // fallback every such SDK died on "must be of type array, null given"
        // the moment live mode was switched on. Offline mode never reaches this
        // branch, which is why the offline suite stayed green.
        $client = new ChessigmaSDK(Helpers::to_map($merged_opts) ?? []);
    }

    $live = $env["CHESSIGMA_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["CHESSIGMA_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
