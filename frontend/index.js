import { backend } from 'declarations/backend';

Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
Chart.defaults.font.size = 12;

async function updateBalance() {
    const balance = await backend.getBalance();
    document.querySelector('.total-value').textContent = balance.toFixed(3);
}

async function updateTransactions() {
    const transactions = await backend.getTransactions();
    // Update the holdings list with the latest transactions
    // This is a simplified version and should be expanded based on actual data structure
    const holdingsList = document.querySelector('.holdings-list');
    holdingsList.innerHTML = transactions.map(t => `
        <li><span>${t.description}</span> <span class="value">$${t.amount.toFixed(2)}</span></li>
    `).join('');
}

async function updateHoldings() {
    const holdings = await backend.getHoldings();
    const holdingsGrid = document.getElementById('holdingsGrid');
    holdingsGrid.innerHTML = '';
    holdings.forEach(holding => {
        const tile = document.createElement('div');
        tile.className = 'holding-tile';
        tile.innerHTML = `<strong>${holding.name}</strong>$${holding.value.toLocaleString()}`;
        holdingsGrid.appendChild(tile);
    });
}

// Value chart
new Chart(document.getElementById('valueChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: ['1M', '3M', '6M', '1Y', 'ALL'],
        datasets: [{
            data: [450000, 455000, 458000, 460000, 462487.74],
            borderColor: '#34c759',
            backgroundColor: 'rgba(52, 199, 89, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { display: true, grid: { display: false } },
            y: { display: false }
        },
        elements: {
            line: { tension: 0.4 }
        }
    }
});

// Pie charts
const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
    },
    cutout: '70%'
};

const pieChartColors = ['#34c759', '#5856d6', '#ff9500', '#ff2d55', '#5ac8fa', '#007aff', '#af52de'];

new Chart(document.getElementById('allocationChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        datasets: [{ data: [68, 17, 15], backgroundColor: pieChartColors }]
    },
    options: pieChartOptions
});

new Chart(document.getElementById('classesChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        datasets: [{ data: [47, 21, 15, 17], backgroundColor: pieChartColors }]
    },
    options: pieChartOptions
});

new Chart(document.getElementById('sectorsChart').getContext('2d'), {
    type: 'doughnut',
    data: {
        datasets: [{ data: [40, 25, 15, 12, 8], backgroundColor: pieChartColors }]
    },
    options: pieChartOptions
});

document.querySelector('.add-asset-btn').addEventListener('click', async () => {
    const name = prompt("Enter asset name:");
    const value = parseFloat(prompt("Enter asset value:"));
    if (name && value) {
        await backend.addHolding(name, value);
        await updateBalance();
        await updateHoldings();
    }
});

// Initial load
updateBalance();
updateTransactions();
updateHoldings();