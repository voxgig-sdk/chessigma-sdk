# Game direct test

require "minitest/autorun"
require "json"
require_relative "../Chessigma_sdk"
require_relative "runner"

class GameDirectTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def live_ok(result)
    status = Helpers.to_int(result["status"])
    result["err"].nil? && result["ok"] && status >= 200 && status < 300
  end

  def test_direct_load_game
    setup = game_direct_setup({ "id" => "direct01" })
    _should_skip, _reason = Runner.is_control_skipped("direct", "direct-load-game", setup[:live] ? "live" : "unit")
    if _should_skip
      skip(_reason || "skipped via sdk-test-control.json")
      return
    end
    if setup[:live] && ENV["VOXGIG_GETONLY_GUARD"] == "TRUE" && setup[:idmap]["game01"].nil?
      puts "LIVE STEP {\"id\":\"direct-load-game\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: needs game01, which only POST /game gives\"}"
      skip("Live coverage incomplete: direct-load-game excluded (GET-only live run: needs game01, which only POST /game gives)")
    end
    if setup[:live]
      ["game01"].each do |_live_key|
        if setup[:idmap][_live_key].nil?
          Runner.live_miss(LIVE_STRICT, "Live test blocked: needs #{_live_key} via CHESSIGMA_TEST_GAME_ENTID")
        end
      end
    end
    client = setup[:client]

    params = {}
    query = {}
    if setup[:live]
      params["id"] = setup[:idmap]["game01"]
    else
      params["id"] = "direct01"
    end

    result = client.direct({
      "path" => "game/{id}",
      "method" => "GET",
      "params" => params,
      "query" => query,
    })
    if setup[:live]
      unless live_ok(result)
        Runner.live_miss(LIVE_STRICT, "Live load failed: " + Runner.live_describe(result))
      end
      if result["data"].nil?
        Runner.live_miss(LIVE_STRICT, "Live load returned no data: " + Runner.live_describe(result))
      end
      assert !result["data"].nil?
    else
      assert_nil result["err"]
      assert result["ok"]
      assert_equal 200, Helpers.to_int(result["status"])
      assert !result["data"].nil?
      if result["data"].is_a?(Hash)
        assert_equal "direct01", result["data"]["id"]
      end
      assert_equal 1, setup[:calls].length
    end
  end

end


def game_direct_setup(mockres)
  Runner.load_env_local

  calls = []

  env = Runner.env_override({
    "CHESSIGMA_TEST_GAME_ENTID" => {},
    "CHESSIGMA_TEST_LIVE" => "FALSE",
  })

  live = env["CHESSIGMA_TEST_LIVE"] == "TRUE"

  if live
    # Merged so the generated fields win: sdk-test-control.json's
    # test.client.options adds to the live client, it does not redirect it.
    merged_opts = Runner.live_client_options.merge({
    })
    client = ChessigmaSDK.new(merged_opts)
    idmap = env["CHESSIGMA_TEST_GAME_ENTID"]
    return {
      client: client,
      calls: calls,
      live: true,
      idmap: idmap.is_a?(Hash) ? idmap : {},
    }
  end

  mock_fetch = ->(url, init) {
    calls.push({ "url" => url, "init" => init })
    return {
      "status" => 200,
      "statusText" => "OK",
      "headers" => {},
      "json" => ->() {
        if !mockres.nil?
          return mockres
        end
        return { "id" => "direct01" }
      },
      "body" => "mock",
    }, nil
  }

  client = ChessigmaSDK.new({
    "base" => "http://localhost:8080",
    "system" => {
      "fetch" => mock_fetch,
    },
  })

  {
    client: client,
    calls: calls,
    live: false,
    idmap: {},
  }
end
