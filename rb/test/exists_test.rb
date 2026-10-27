# Chessigma SDK exists test

require "minitest/autorun"
require_relative "../Chessigma_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = ChessigmaSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
