# Chessigma SDK utility: prepare_body
require_relative 'media'
module ChessigmaUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return ChessigmaUtilities.raw_body(ctx.reqdata) if ChessigmaUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
