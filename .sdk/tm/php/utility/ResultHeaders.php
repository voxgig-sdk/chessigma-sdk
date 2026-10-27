<?php
declare(strict_types=1);

// Chessigma SDK utility: result_headers

class ChessigmaResultHeaders
{
    public static function call(ChessigmaContext $ctx): ?ChessigmaResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
