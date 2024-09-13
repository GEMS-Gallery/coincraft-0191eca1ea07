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

function initializeCharts() {
    const valueChartElement = document.getElementById('valueChart');
    if (valueChartElement && valueChartElement.getContext) {
        new Chart(valueChartElement.getContext('2d'), {
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
    }

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

    const chartIds = ['allocationChart', 'classesChart', 'sectorsChart'];
    const chartData = [
        [68, 17, 15],
        [47, 21, 15, 17],
        [40, 25, 15, 12, 8]
    ];

    chartIds.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element && element.getContext) {
            new Chart(element.getContext('2d'), {
                type: 'doughnut',
                data: {
                    datasets: [{ data: chartData[index], backgroundColor: pieChartColors }]
                },
                options: pieChartOptions
            });
        }
    });
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById("addAssetModal");
    const btn = document.querySelector(".add-asset-btn");
    const span = document.getElementsByClassName("close")[0];

    if (btn) {
        btn.onclick = function() {
            modal.style.display = "block";
        }
    }

    if (span) {
        span.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const form = document.getElementById('addAssetForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('assetName').value;
            const value = parseFloat(document.getElementById('assetValue').value);
            if (name && value) {
                try {
                    await backend.addHolding(name, value);
                    await updateBalance();
                    await updateHoldings();
                    modal.style.display = "none";
                    form.reset();
                } catch (error) {
                    console.error("Error adding asset:", error);
                    alert("Failed to add asset. Please try again.");
                }
            }
        });
    }
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    initializeModal();
    updateBalance();
    updateTransactions();
    updateHoldings();
});