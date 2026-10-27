-- Chessigma SDK exists test

local sdk = require("chessigma_sdk")

describe("ChessigmaSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
