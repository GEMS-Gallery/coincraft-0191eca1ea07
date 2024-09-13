export const idlFactory = ({ IDL }) => {
  const Holding = IDL.Record({
    'id' : IDL.Nat,
    'performanceType' : IDL.Text,
    'ticker' : IDL.Text,
    'marketValue' : IDL.Float64,
    'companyName' : IDL.Text,
    'quantity' : IDL.Float64,
    'marketPrice' : IDL.Float64,
  });
  const Transaction = IDL.Record({
    'id' : IDL.Nat,
    'description' : IDL.Text,
    'timestamp' : IDL.Int,
    'amount' : IDL.Float64,
  });
  return IDL.Service({
    'addHolding' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text],
        [IDL.Nat],
        [],
      ),
    'addTransaction' : IDL.Func([IDL.Float64, IDL.Text], [IDL.Nat], []),
    'getBalance' : IDL.Func([], [IDL.Float64], ['query']),
    'getHoldings' : IDL.Func([], [IDL.Vec(Holding)], ['query']),
    'getTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
