import { ChessigmaEntityBase } from '../ChessigmaEntityBase';
import type { ChessigmaSDK } from '../ChessigmaSDK';
import type { Control } from '../types';
import type { Game, GameLoadMatch, GameCreateData } from '../ChessigmaTypes';
declare class GameEntity extends ChessigmaEntityBase<Game> {
    constructor(client: ChessigmaSDK, entopts: any);
    make(this: GameEntity): GameEntity;
    load(this: any, reqmatch?: GameLoadMatch, ctrl?: Control): Promise<GameEntity>;
    create(this: any, reqdata?: GameCreateData, ctrl?: Control): Promise<GameEntity>;
}
export { GameEntity };
