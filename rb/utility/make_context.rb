# Chessigma SDK utility: make_context
require_relative '../core/context'
module ChessigmaUtilities
  MakeContext = ->(ctxmap, basectx) {
    ChessigmaContext.new(ctxmap, basectx)
  }
end
