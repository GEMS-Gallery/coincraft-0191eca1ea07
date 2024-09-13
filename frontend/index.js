import { backend } from 'declarations/backend';

async function updateBalance() {
    try {
        const balance = await backend.getBalance();
        document.querySelector('.total-value').textContent = `$${balance.toFixed(2)}`;
        document.querySelector('.change').textContent = 'Updated';
    } catch (error) {
        console.error("Error updating balance:", error);
        document.querySelector('.total-value').textContent = 'Error loading balance';
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
        document.getElementById('holdingsGrid').innerHTML = '<p>Error loading holdings</p>';
    }
}

function initializeModal() {
    const modal = document.getElementById("addAssetModal");
    const btn = document.getElementById("addAssetBtn");
    const span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const form = document.getElementById('addAssetForm');
    form.onsubmit = async function(e) {
        e.preventDefault();
        const ticker = document.getElementById('assetTicker').value;
        const companyName = document.getElementById('assetCompanyName').value;
        const quantity = parseFloat(document.getElementById('assetQuantity').value);
        const marketValue = parseFloat(document.getElementById('assetMarketValue').value);
        const marketPrice = parseFloat(document.getElementById('assetMarketPrice').value);
        const performanceType = document.getElementById('assetPerformanceType').value;

        try {
            await backend.addHolding(ticker, companyName, quantity, marketValue, marketPrice, performanceType);
            modal.style.display = "none";
            form.reset();
            await updateBalance();
            await updateHoldings();
        } catch (error) {
            console.error("Error adding asset:", error);
            alert("Failed to add asset. Please try again.");
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    initializeModal();
    updateBalance();
    updateHoldings();
});