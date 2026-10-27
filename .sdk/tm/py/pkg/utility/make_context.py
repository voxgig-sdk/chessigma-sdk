# Chessigma SDK utility: make_context

from projectname_sdk.core.context import ChessigmaContext


def make_context_util(ctxmap, basectx):
    return ChessigmaContext(ctxmap, basectx)
