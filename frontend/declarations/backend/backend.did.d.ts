import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Holding {
  'id' : bigint,
  'performanceType' : string,
  'ticker' : string,
  'marketValue' : number,
  'companyName' : string,
  'quantity' : number,
  'marketPrice' : number,
}
export interface Transaction {
  'id' : bigint,
  'description' : string,
  'timestamp' : bigint,
  'amount' : number,
}
export interface _SERVICE {
  'addHolding' : ActorMethod<
    [string, string, number, number, number, string],
    bigint
  >,
  'addTransaction' : ActorMethod<[number, string], bigint>,
  'getBalance' : ActorMethod<[], number>,
  'getHoldings' : ActorMethod<[], Array<Holding>>,
  'getTransactions' : ActorMethod<[], Array<Transaction>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
