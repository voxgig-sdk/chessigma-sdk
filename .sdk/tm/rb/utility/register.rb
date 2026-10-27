# Chessigma SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

ChessigmaUtility.registrar = ->(u) {
  u.clean = ChessigmaUtilities::Clean
  u.clean_add = ChessigmaUtilities::CleanAdd
  u.clean_explain = ChessigmaUtilities::CleanExplain
  u.done = ChessigmaUtilities::Done
  u.make_error = ChessigmaUtilities::MakeError
  u.feature_add = ChessigmaUtilities::FeatureAdd
  u.feature_hook = ChessigmaUtilities::FeatureHook
  u.feature_init = ChessigmaUtilities::FeatureInit
  u.fetcher = ChessigmaUtilities::Fetcher
  u.make_fetch_def = ChessigmaUtilities::MakeFetchDef
  u.make_context = ChessigmaUtilities::MakeContext
  u.make_options = ChessigmaUtilities::MakeOptions
  u.make_request = ChessigmaUtilities::MakeRequest
  u.make_response = ChessigmaUtilities::MakeResponse
  u.make_result = ChessigmaUtilities::MakeResult
  u.make_point = ChessigmaUtilities::MakePoint
  u.make_spec = ChessigmaUtilities::MakeSpec
  u.make_url = ChessigmaUtilities::MakeUrl
  u.param = ChessigmaUtilities::Param
  u.prepare_auth = ChessigmaUtilities::PrepareAuth
  u.prepare_body = ChessigmaUtilities::PrepareBody
  u.prepare_headers = ChessigmaUtilities::PrepareHeaders
  u.prepare_method = ChessigmaUtilities::PrepareMethod
  u.prepare_params = ChessigmaUtilities::PrepareParams
  u.prepare_path = ChessigmaUtilities::PreparePath
  u.prepare_query = ChessigmaUtilities::PrepareQuery
  u.graphql_body = ChessigmaUtilities::GraphqlBody
  u.graphql_errors = ChessigmaUtilities::GraphqlErrors
  u.result_basic = ChessigmaUtilities::ResultBasic
  u.result_body = ChessigmaUtilities::ResultBody
  u.result_headers = ChessigmaUtilities::ResultHeaders
  u.transform_request = ChessigmaUtilities::TransformRequest
  u.transform_response = ChessigmaUtilities::TransformResponse
}
