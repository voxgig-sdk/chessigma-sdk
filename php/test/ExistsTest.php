<?php
declare(strict_types=1);

// Chessigma SDK exists test

require_once __DIR__ . '/../chessigma_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = ChessigmaSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
