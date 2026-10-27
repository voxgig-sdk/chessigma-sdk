package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/chessigma-sdk/go"
	"github.com/voxgig-sdk/chessigma-sdk/go/core"

	vs "github.com/voxgig-sdk/chessigma-sdk/go/utility/struct"
)

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const gameEntityLiveStrict = true


func TestGameEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Game(nil)
		if ent == nil {
			t.Fatal("expected non-nil GameEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.Game(nil).Load(map[string]any{"id": 1}, nil)
		if sdkerr, ok := err.(*core.ChessigmaError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
		setup := gameBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "load"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "game." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		if setup.live && os.Getenv("VOXGIG_GETONLY_GUARD") == "TRUE" {
			t.Log("LIVE STEP {\"id\":\"game.create.0\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: needs POST /game\"}")
			t.Log("LIVE STEP {\"id\":\"game.load.1\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: reads a record only game.create.0 gives\"}")
			t.Skip("Live coverage incomplete: game.create.0 excluded (GET-only live run: needs POST /game); game.load.1 excluded (GET-only live run: reads a record only game.create.0 gives)")
			return
		}

		client := setup.client
		_ = client

		// CREATE
		gameRef01Ent := client.Game(nil)
		gameRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "game"}), "game_ref01"))

		gameRef01DataResult, err := gameRef01Ent.Create(gameRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		gameRef01Data = core.ToMapAny(entityData(gameRef01DataResult))
		if gameRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if gameRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LOAD
		gameRef01MatchDt0 := map[string]any{
			"id": gameRef01Data["id"],
		}
		gameRef01DataDt0Loaded, err := gameRef01Ent.Load(gameRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		gameRef01DataDt0LoadResult := core.ToMapAny(entityData(gameRef01DataDt0Loaded))
		if gameRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if gameRef01DataDt0LoadResult["id"] != gameRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

	})
}

func gameBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "game", "GameTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read game test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse game test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"game01", "game02", "game03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("CHESSIGMA_TEST_GAME_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"CHESSIGMA_TEST_GAME_ENTID": idmap,
		"CHESSIGMA_TEST_LIVE":      "FALSE",
		"CHESSIGMA_TEST_EXPLAIN":   "FALSE",
	})

	idmapResolved := core.ToMapAny(env["CHESSIGMA_TEST_GAME_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["CHESSIGMA_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
			},
			extraOpts,
		})
		client = sdk.NewChessigmaSDK(core.ToMapAny(mergedOpts))
	}

	live := env["CHESSIGMA_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["CHESSIGMA_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
