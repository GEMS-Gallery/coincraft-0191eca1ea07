import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

actor {
  // Define the Transaction type
  type Transaction = {
    id: Nat;
    amount: Float;
    description: Text;
    timestamp: Int;
  };

  // Define the Holding type
  type Holding = {
    id: Nat;
    name: Text;
    value: Float;
  };

  // Stable variables to persist data across upgrades
  stable var nextId: Nat = 0;
  stable var transactions: [Transaction] = [];
  stable var balance: Float = 0.0;
  stable var holdings: [Holding] = [];

  // Add a new transaction
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

  // Add a new holding
  public func addHolding(name: Text, value: Float) : async Nat {
    let id = nextId;
    nextId += 1;

    let holding: Holding = {
      id;
      name;
      value;
    };

    holdings := Array.append(holdings, [holding]);
    balance += value;

    id
  };

  // Get the current balance
  public query func getBalance() : async Float {
    balance
  };

  // Get all transactions
  public query func getTransactions() : async [Transaction] {
    transactions
  };

  // Get all holdings
  public query func getHoldings() : async [Holding] {
    holdings
  };

  // System functions for upgrades
  system func preupgrade() {
    // Data is already in stable variables, no action needed
  };

  system func postupgrade() {
    // Data is already in stable variables, no action needed
  };
}