# Chessigma SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module ChessigmaFeatures
  def self.make_feature(name)
    case name
    when "base"
      ChessigmaBaseFeature.new
    when "ratelimit"
      ChessigmaRatelimitFeature.new
    when "retry"
      ChessigmaRetryFeature.new
    when "test"
      ChessigmaTestFeature.new
    when "timeout"
      ChessigmaTimeoutFeature.new
    else
      ChessigmaBaseFeature.new
    end
  end
end
