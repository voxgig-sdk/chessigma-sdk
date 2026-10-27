# Elo entity test

require "minitest/autorun"
require "json"
require_relative "../Chessigma_sdk"
require_relative "runner"

class EloEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = ChessigmaSDK.test(nil, nil)
    ent = testsdk.Elo(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = ChessigmaConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = ChessigmaSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Elo(nil).load({ "k_factor" => "x", "opponent_rating" => 1, "result" => "x", "your_rating" => 1 }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = elo_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "elo." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    elo_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.elo")))
    elo_ref01_data = nil
    if elo_ref01_data_raw.length > 0
      elo_ref01_data = Helpers.to_map(elo_ref01_data_raw[0][1])
    end

    # LOAD
    elo_ref01_ent = client.Elo(nil)
    elo_ref01_match_dt0 = {}
    if setup[:live]
      elo_ref01_match_dt0["opponent_rating"] = 1400
      elo_ref01_match_dt0["result"] = "win"
      elo_ref01_match_dt0["your_rating"] = 1500
    end
    elo_ref01_data_dt0_loaded = elo_ref01_ent.load(elo_ref01_match_dt0, nil)
    assert !elo_ref01_data_dt0_loaded.nil?

  end
end

def elo_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "elo", "EloTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = ChessigmaSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["elo01", "elo02", "elo03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["CHESSIGMA_TEST_ELO_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "CHESSIGMA_TEST_ELO_ENTID" => idmap,
    "CHESSIGMA_TEST_LIVE" => "FALSE",
    "CHESSIGMA_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["CHESSIGMA_TEST_ELO_ENTID"])
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
