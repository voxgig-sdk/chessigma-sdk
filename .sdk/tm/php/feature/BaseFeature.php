<?php
declare(strict_types=1);

// Chessigma SDK base feature

class ChessigmaBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(ChessigmaContext $ctx, array $options): void {}
    public function PostConstruct(ChessigmaContext $ctx): void {}
    public function PostConstructEntity(ChessigmaContext $ctx): void {}
    public function SetData(ChessigmaContext $ctx): void {}
    public function GetData(ChessigmaContext $ctx): void {}
    public function GetMatch(ChessigmaContext $ctx): void {}
    public function SetMatch(ChessigmaContext $ctx): void {}
    public function PrePoint(ChessigmaContext $ctx): void {}
    public function PreSpec(ChessigmaContext $ctx): void {}
    public function PreRequest(ChessigmaContext $ctx): void {}
    public function PreResponse(ChessigmaContext $ctx): void {}
    public function PreResult(ChessigmaContext $ctx): void {}
    public function PreDone(ChessigmaContext $ctx): void {}
    public function PreUnexpected(ChessigmaContext $ctx): void {}
}
