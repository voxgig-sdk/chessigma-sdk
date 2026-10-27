import { DailyPuzzleEntity } from './entity/DailyPuzzleEntity';
import { EloEntity } from './entity/EloEntity';
import { GameEntity } from './entity/GameEntity';
export type * from './ChessigmaTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { ChessigmaEntityBase } from './ChessigmaEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class ChessigmaSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    DailyPuzzle(entopts?: Record<string, any>): DailyPuzzleEntity;
    Elo(entopts?: Record<string, any>): EloEntity;
    Game(entopts?: Record<string, any>): GameEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): ChessigmaSDK;
    tester(testopts?: any, sdkopts?: any): ChessigmaSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof ChessigmaSDK;
export { stdutil, config, BaseFeature, ChessigmaEntityBase, ChessigmaSDK, SDK, };
export type { DirectResult };
