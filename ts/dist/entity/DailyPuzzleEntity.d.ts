import { ChessigmaEntityBase } from '../ChessigmaEntityBase';
import type { ChessigmaSDK } from '../ChessigmaSDK';
import type { Control } from '../types';
import type { DailyPuzzle, DailyPuzzleListMatch } from '../ChessigmaTypes';
declare class DailyPuzzleEntity extends ChessigmaEntityBase<DailyPuzzle> {
    constructor(client: ChessigmaSDK, entopts: any);
    make(this: DailyPuzzleEntity): DailyPuzzleEntity;
    list(this: any, reqmatch?: DailyPuzzleListMatch, ctrl?: Control): Promise<DailyPuzzleEntity[]>;
}
export { DailyPuzzleEntity };
