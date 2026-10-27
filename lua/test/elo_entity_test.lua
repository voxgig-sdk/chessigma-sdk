-- Elo entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("chessigma_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

-- main.kit.test.live.strict is true (the default is true): a live
-- request that fails, or a live test missing an input it needs,
-- fails the test.
-- An account with no record for a test to read skips it either way.
local LIVE_STRICT = true


describe("EloEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Elo(nil)
    assert.is_not_nil(ent)
  end)

  it("should refuse an invalid request", function()
    local config = require("config_shared")()
    if type(config.feature) ~= "table" or config.feature.validate == nil then
      pending("feature not present in this SDK: validate")
      return
    end
    local client = sdk.test(nil, { feature = { validate = { active = true } } })
    local _, err = client:Elo(nil):load({ ["k_factor"] = "x", ["opponent_rating"] = 1, ["result"] = "x", ["your_rating"] = 1 }, nil)
    assert.are.equal("validate_failed", type(err) == "table" and err.code or nil)
  end)

  it("should run basic flow", function()
    local setup = elo_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"load"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "elo." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    local client = setup.client

    -- Bootstrap entity data from existing test data.
    local elo_ref01_data_raw = vs.items(helpers.to_map(
      vs.getpath(setup.data, "existing.elo")))
    local elo_ref01_data = nil
    if #elo_ref01_data_raw > 0 then
      elo_ref01_data = helpers.to_map(elo_ref01_data_raw[1][2])
    end

    -- LOAD
    local elo_ref01_ent = client:Elo(nil)
    local elo_ref01_match_dt0 = {}
    if setup.live then
      elo_ref01_match_dt0["opponent_rating"] = 1400
      elo_ref01_match_dt0["result"] = "win"
      elo_ref01_match_dt0["your_rating"] = 1500
    end
    local elo_ref01_data_dt0_loaded, err = elo_ref01_ent:load(elo_ref01_match_dt0, nil)
    assert.is_nil(err)
    assert.is_not_nil(elo_ref01_data_dt0_loaded)

  end)
end)

function elo_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/elo/EloTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read elo test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "elo01", "elo02", "elo03" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Whether *_ENTID supplied the idmap, read before env_override consumes
  -- it: without it, the ids a live flow binds are the fixture's synthetic ones.
  local entid_env_raw = os.getenv("CHESSIGMA_TEST_ELO_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["CHESSIGMA_TEST_ELO_ENTID"] = idmap,
    ["CHESSIGMA_TEST_LIVE"] = "FALSE",
    ["CHESSIGMA_TEST_EXPLAIN"] = "FALSE",
  })

  local idmap_resolved = helpers.to_map(
    env["CHESSIGMA_TEST_ELO_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["CHESSIGMA_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      -- FIRST, so the generated fields below win: sdk-test-control.json's
      -- test.client.options adds to the live client, it does not redirect it.
      runner.live_client_options(),
      {
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["CHESSIGMA_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["CHESSIGMA_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
