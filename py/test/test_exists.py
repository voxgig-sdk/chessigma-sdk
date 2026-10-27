# Chessigma SDK exists test

import pytest
from chessigma_sdk import ChessigmaSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = ChessigmaSDK.test(None, None)
        assert testsdk is not None
