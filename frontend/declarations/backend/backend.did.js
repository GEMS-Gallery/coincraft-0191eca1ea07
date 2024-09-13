export const idlFactory = ({ IDL }) => {
  const Transaction = IDL.Record({
    'id' : IDL.Nat,
    'description' : IDL.Text,
    'timestamp' : IDL.Int,
    'amount' : IDL.Float64,
  });
  return IDL.Service({
    'addTransaction' : IDL.Func([IDL.Float64, IDL.Text], [IDL.Nat], []),
    'getBalance' : IDL.Func([], [IDL.Float64], ['query']),
    'getTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
