# Game entity test

require "minitest/autorun"
require "json"
require_relative "../Chessigma_sdk"
require_relative "runner"

class GameEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = ChessigmaSDK.test(nil, nil)
    ent = testsdk.Game(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = ChessigmaConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = ChessigmaSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Game(nil).load({ "id" => 1 }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = game_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "game." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    if setup[:live] && ENV["VOXGIG_GETONLY_GUARD"] == "TRUE"
      puts "LIVE STEP {\"id\":\"game.create.0\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: needs POST /game\"}"
      puts "LIVE STEP {\"id\":\"game.load.1\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: reads a record only game.create.0 gives\"}"
      skip("Live coverage incomplete: game.create.0 excluded (GET-only live run: needs POST /game); game.load.1 excluded (GET-only live run: reads a record only game.create.0 gives)")
    end

    client = setup[:client]

    # CREATE
    game_ref01_ent = client.Game(nil)
    game_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.game"), "game_ref01"))

    game_ref01_data_result = game_ref01_ent.create(game_ref01_data, nil)
    game_ref01_data = Helpers.to_map(game_ref01_data_result.respond_to?(:data_get) ? game_ref01_data_result.data_get : game_ref01_data_result)
    assert !game_ref01_data.nil?
    assert !game_ref01_data["id"].nil?

    # LOAD
    game_ref01_match_dt0 = {
      "id" => game_ref01_data["id"],
    }
    game_ref01_data_dt0_loaded = game_ref01_ent.load(game_ref01_match_dt0, nil)
    game_ref01_data_dt0_load_result = Helpers.to_map(game_ref01_data_dt0_loaded.respond_to?(:data_get) ? game_ref01_data_dt0_loaded.data_get : game_ref01_data_dt0_loaded)
    assert !game_ref01_data_dt0_load_result.nil?
    assert_equal game_ref01_data_dt0_load_result["id"], game_ref01_data["id"]

  end
end

def game_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "game", "GameTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = ChessigmaSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["game01", "game02", "game03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["CHESSIGMA_TEST_GAME_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "CHESSIGMA_TEST_GAME_ENTID" => idmap,
    "CHESSIGMA_TEST_LIVE" => "FALSE",
    "CHESSIGMA_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["CHESSIGMA_TEST_GAME_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["CHESSIGMA_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
      },
      extra || {},
    ])
    client = ChessigmaSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["CHESSIGMA_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["CHESSIGMA_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
