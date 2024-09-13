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

  // Stable variables to persist data across upgrades
  stable var nextId: Nat = 0;
  stable var transactions: [Transaction] = [];
  stable var balance: Float = 0.0;

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

  // Get the current balance
  public query func getBalance() : async Float {
    balance
  };

  // Get all transactions
  public query func getTransactions() : async [Transaction] {
    transactions
  };

  // System functions for upgrades
  system func preupgrade() {
    // Data is already in stable variables, no action needed
  };

  system func postupgrade() {
    // Data is already in stable variables, no action needed
  };
}