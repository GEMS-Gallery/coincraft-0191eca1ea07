import { backend } from 'declarations/backend';

let balance = 0;
let transactions = [];

async function updateBalance() {
    balance = await backend.getBalance();
    document.getElementById('balance').textContent = `Current Balance: $${balance.toFixed(2)}`;
}

async function updateTransactions() {
    transactions = await backend.getTransactions();
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `${transaction.description}: $${transaction.amount.toFixed(2)}`;
        transactionList.appendChild(li);
    });
}

document.getElementById('transactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    
    await backend.addTransaction(amount, description);
    
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    
    await updateBalance();
    await updateTransactions();
});

// Initial load
updateBalance();
updateTransactions();