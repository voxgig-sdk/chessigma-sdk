import { ChessigmaEntityBase } from '../ChessigmaEntityBase';
import type { ChessigmaSDK } from '../ChessigmaSDK';
import type { Control } from '../types';
import type { Elo, EloLoadMatch } from '../ChessigmaTypes';
declare class EloEntity extends ChessigmaEntityBase<Elo> {
    constructor(client: ChessigmaSDK, entopts: any);
    make(this: EloEntity): EloEntity;
    load(this: any, reqmatch?: EloLoadMatch, ctrl?: Control): Promise<EloEntity>;
}
export { EloEntity };
