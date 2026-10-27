# Game direct test

import json
import os
import pytest

from chessigma_sdk.utility.voxgig_struct import voxgig_struct as vs
from chessigma_sdk import ChessigmaSDK
from chessigma_sdk.core import helpers
from test import runner


# main.kit.test.live.strict is true (the default is true): a live
# request that fails, or a live test missing an input it needs,
# fails the test.
# An account with no record for a test to read skips it either way.
LIVE_STRICT = True


def _live_ok(result):
    status = helpers.to_int(result.get("status"))
    return result.get("err") is None and bool(result.get("ok")) and 200 <= status < 300


class TestGameDirect:

    def test_should_direct_load_game(self):
        setup = _game_direct_setup({"id": "direct01"})
        _skip, _reason = runner.is_control_skipped("direct", "direct-load-game", "live" if setup["live"] else "unit")
        if _skip:
            pytest.skip(_reason or "skipped via sdk-test-control.json")
            return
        if setup["live"] and os.environ.get("VOXGIG_GETONLY_GUARD") == "TRUE" and setup["idmap"].get("game01") is None:
            print("LIVE STEP {\"id\":\"direct-load-game\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: needs game01, which only POST /game gives\"}")
            pytest.skip("Live coverage incomplete: direct-load-game excluded (GET-only live run: needs game01, which only POST /game gives)")

        if setup["live"]:
            for _live_key in ["game01"]:
                if setup["idmap"].get(_live_key) is None:
                    runner.live_miss(LIVE_STRICT, f"Live test blocked: needs {_live_key} via CHESSIGMA_TEST_GAME_ENTID")

        client = setup["client"]

        params = {}
        query = {}
        if setup["live"]:
            params["id"] = setup["idmap"].get("game01")
            pass
        else:
            params["id"] = "direct01"
            pass

        result = client.direct({
            "path": "game/{id}",
            "method": "GET",
            "params": params,
            "query": query,
        })
        if setup["live"]:
            if not _live_ok(result):
                runner.live_miss(LIVE_STRICT, "Live load failed: " + runner.live_describe(result))
            if result.get("data") is None:
                runner.live_miss(LIVE_STRICT, "Live load returned no data: " + runner.live_describe(result))
        else:
            assert result["ok"] is True
            assert helpers.to_int(result["status"]) == 200
            assert result["data"] is not None
            if isinstance(result["data"], dict):
                assert result["data"]["id"] == "direct01"
            assert len(setup["calls"]) == 1



def _game_direct_setup(mockres):
    runner.load_env_local()

    calls = []

    env = runner.env_override({
        "CHESSIGMA_TEST_GAME_ENTID": {},
        "CHESSIGMA_TEST_LIVE": "FALSE",
    })

    live = env.get("CHESSIGMA_TEST_LIVE") == "TRUE"

    if live:
        # sdk-test-control.json's test.client.options seeds the live
        # client; the generated fields below overwrite anything they name.
        merged_opts = dict(runner.live_client_options())
        merged_opts.update({
        })
        client = ChessigmaSDK(merged_opts)
        idmap = env.get("CHESSIGMA_TEST_GAME_ENTID")
        return {
            "client": client,
            "calls": calls,
            "live": True,
            "idmap": idmap if isinstance(idmap, dict) else {},
        }

    def mock_fetch(url, init):
        calls.append({"url": url, "init": init})
        return {
            "status": 200,
            "statusText": "OK",
            "headers": {},
            "json": lambda: mockres if mockres is not None else {"id": "direct01"},
            "body": "mock",
        }, None

    client = ChessigmaSDK({
        "base": "http://localhost:8080",
        "system": {
            "fetch": mock_fetch,
        },
    })

    return {
        "client": client,
        "calls": calls,
        "live": False,
        "idmap": {},
    }
