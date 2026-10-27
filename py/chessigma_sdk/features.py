# Chessigma SDK feature factory

from chessigma_sdk.feature.base_feature import ChessigmaBaseFeature
from chessigma_sdk.feature.ratelimit_feature import ChessigmaRatelimitFeature
from chessigma_sdk.feature.retry_feature import ChessigmaRetryFeature
from chessigma_sdk.feature.test_feature import ChessigmaTestFeature
from chessigma_sdk.feature.timeout_feature import ChessigmaTimeoutFeature


_FEATURES = {
    "base": lambda: ChessigmaBaseFeature(),
    "ratelimit": lambda: ChessigmaRatelimitFeature(),
    "retry": lambda: ChessigmaRetryFeature(),
    "test": lambda: ChessigmaTestFeature(),
    "timeout": lambda: ChessigmaTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
