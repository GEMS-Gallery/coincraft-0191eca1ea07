import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

actor {
  type Transaction = {
    id: Nat;
    amount: Float;
    description: Text;
    timestamp: Int;
  };

  type Holding = {
    id: Nat;
    ticker: Text;
    companyName: Text;
    quantity: Float;
    marketValue: Float;
    marketPrice: Float;
    performanceType: Text;
  };

  stable var nextId: Nat = 0;
  stable var transactions: [Transaction] = [];
  stable var balance: Float = 0.0;
  stable var holdings: [Holding] = [];

  public func addTransaction(amount: Float, description: Text) : async Nat {
    let id = nextId;
    nextId += 1;

    let transaction: Transaction = {
      id;
      amount;
      description;
      timestamp = Time.now();
    };

    transactions := Array.append(transactions, [transaction]);
    balance += amount;

    id
  };

  public func addHolding(ticker: Text, companyName: Text, quantity: Float, marketValue: Float, marketPrice: Float, performanceType: Text) : async Nat {
    let id = nextId;
    nextId += 1;

    let holding: Holding = {
      id;
      ticker;
      companyName;
      quantity;
      marketValue;
      marketPrice;
      performanceType;
    };

    holdings := Array.append(holdings, [holding]);
    balance += marketValue;

    id
  };

  public query func getBalance() : async Float {
    balance
  };

  public query func getTransactions() : async [Transaction] {
    transactions
  };

  public query func getHoldings() : async [Holding] {
    holdings
  };

  system func preupgrade() {
  };

  system func postupgrade() {
  };
}