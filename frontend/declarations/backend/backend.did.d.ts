import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Transaction {
  'id' : bigint,
  'description' : string,
  'timestamp' : bigint,
  'amount' : number,
}
export interface _SERVICE {
  'addTransaction' : ActorMethod<[number, string], bigint>,
  'getBalance' : ActorMethod<[], number>,
  'getTransactions' : ActorMethod<[], Array<Transaction>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
