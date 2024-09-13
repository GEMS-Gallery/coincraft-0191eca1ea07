import { backend } from 'declarations/backend';

Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
Chart.defaults.font.size = 12;

async function updateBalance() {
    try {
        const balance = await backend.getBalance();
        document.querySelector('.total-value').textContent = balance.toFixed(3);
    } catch (error) {
        console.error("Error updating balance:", error);
    }
}

async function updateTransactions() {
    try {
        const transactions = await backend.getTransactions();
        const holdingsList = document.querySelector('.holdings-list');
        holdingsList.innerHTML = transactions.map(t => `
            <li><span>${t.description}</span> <span class="value">$${t.amount.toFixed(2)}</span></li>
        `).join('');
    } catch (error) {
        console.error("Error updating transactions:", error);
    }
}

async function updateHoldings() {
    try {
        const holdings = await backend.getHoldings();
        const holdingsGrid = document.getElementById('holdingsGrid');
        holdingsGrid.innerHTML = '';
        holdings.forEach(holding => {
            const tile = document.createElement('div');
            tile.className = 'holding-tile';
            tile.innerHTML = `
                <strong>${holding.ticker} - ${holding.companyName}</strong>
                <p>Quantity: ${holding.quantity}</p>
                <p>Market Value: $${holding.marketValue.toLocaleString()}</p>
                <p>Market Price: $${holding.marketPrice.toLocaleString()}</p>
                <p>Performance: ${holding.performanceType}</p>
            `;
            holdingsGrid.appendChild(tile);
        });
    } catch (error) {
        console.error("Error updating holdings:", error);
    }
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

function initializeModal() {
    const modal = document.getElementById("addAssetModal");
    const btn = document.getElementById("addAssetBtn");
    const span = document.getElementsByClassName("close")[0];

    if (btn) {
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Add Asset button clicked");
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
            const ticker = document.getElementById('assetTicker').value;
            const companyName = document.getElementById('assetCompanyName').value;
            const quantity = parseFloat(document.getElementById('assetQuantity').value);
            const marketValue = parseFloat(document.getElementById('assetMarketValue').value);
            const marketPrice = parseFloat(document.getElementById('assetMarketPrice').value);
            const performanceType = document.getElementById('assetPerformanceType').value;

            if (ticker && companyName && quantity && marketValue && marketPrice && performanceType) {
                try {
                    await backend.addHolding(ticker, companyName, quantity, marketValue, marketPrice, performanceType);
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

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    initializeCharts();
    initializeModal();
    updateBalance();
    updateTransactions();
    updateHoldings();
});

// Prevent any click events from bubbling up from the modal
document.querySelector('.modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});