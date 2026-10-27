<?php
declare(strict_types=1);

// Chessigma SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class ChessigmaMakeContext
{
    public static function call(array $ctxmap, ?ChessigmaContext $basectx): ChessigmaContext
    {
        return new ChessigmaContext($ctxmap, $basectx);
    }
}
