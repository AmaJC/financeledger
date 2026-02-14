document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    loadTransactions();
});

function initCharts() {
    // Shared Chart Options for Dark Theme
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Outfit' }
                }
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    // Net Worth Data
    const nwData = {
        monthly: {
            labels: ['Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026'],
            data: [1120000, 1135000, 1138000, 1150000, 1140000, 1162500],
            current: 1162500.32,
            changeVal: 22500.32,
            changePct: 1.97
        },
        annual: {
            labels: ['2021', '2022', '2023', '2024', '2025', '2026 (YTD)'],
            data: [850000, 920000, 980000, 1050000, 1150000, 1162500],
            current: 1162500.32,
            changeVal: 12500.32,
            changePct: 1.09 // YTD change logic simplified
        }
    };

    // Net Worth Chart
    const netWorthCtx = document.getElementById('netWorthChart').getContext('2d');

    // Create gradient
    const gradient = netWorthCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

    const netWorthChart = new Chart(netWorthCtx, {
        type: 'line',
        data: {
            labels: nwData.monthly.labels,
            datasets: [{
                label: 'Net Worth',
                data: nwData.monthly.data,
                borderColor: '#38bdf8',
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0f172a',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    ticks: {
                        color: '#94a3b8',
                        callback: function (value) {
                            if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
                            if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.raw);
                        }
                    }
                }
            }
        }
    });

    // Toggle Logic
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            toggleBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const period = btn.dataset.period;
            const newData = nwData[period];

            // Update Chart
            netWorthChart.data.labels = newData.labels;
            netWorthChart.data.datasets[0].data = newData.data;
            netWorthChart.update();

            // Update Text logic
            // Note: In a real app this would calculate diffs dynamically. 
            // For now we just keep the hardcoded header as requested or could update it.
            // The user request implied the header shows "Current" status, which is usually constant for "Now", 
            // but the "change" part might depend on the period context.
            // Let's update the "time period" label at least.

            // Only update the time label for now to keep it simple, or we could swap the "change" stats too.
            // Let's sway the change stats to match the period for realism.

            document.querySelector('.time-period-label').textContent = period === 'monthly' ? 'this month' : 'this year';

            // Optional: Update the change values if we had different dummy data for annual change
            if (period === 'annual') {
                // Mock annual change
                updateStats(nwData.annual.changeVal, nwData.annual.changePct);
            } else {
                updateStats(nwData.monthly.changeVal, nwData.monthly.changePct);
            }
        });
    });

    function updateStats(val, pct) {
        document.getElementById('nwChangeValue').textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
        document.getElementById('nwChangePercent').textContent = `(${pct}%)`;
    }

    // Spending Chart
    const spendingCtx = document.getElementById('spendingChart').getContext('2d');
    new Chart(spendingCtx, {
        type: 'bar',
        data: {
            labels: ['Groceries', 'Rent', 'Dining', 'Transport', 'Utilities'],
            datasets: [{
                label: 'This Month',
                data: [450, 1800, 320, 150, 200],
                backgroundColor: [
                    '#38bdf8',
                    '#818cf8',
                    '#c084fc',
                    '#f472b6',
                    '#2dd4bf'
                ],
                borderRadius: 4
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function loadTransactions() {
    const categories = [
        'Groceries', 'Transport', 'Entertainment', 'Income',
        'Utilities', 'Dining', 'Housing', 'Savings', 'Health', 'General'
    ];

    const transactions = [
        { id: 1, date: '2023-10-25', desc: 'Whole Foods Market', cat: 'Groceries', amount: -64.20 },
        { id: 2, date: '2023-10-24', desc: 'Uber Ride', cat: 'Transport', amount: -18.50 },
        { id: 3, date: '2023-10-24', desc: 'Tech Consulting Inc', cat: 'Income', amount: 4500.00 },
        { id: 4, date: '2023-10-23', desc: 'Netflix Subscription', cat: 'Entertainment', amount: -15.99 },
        { id: 5, date: '2023-10-22', desc: 'Shell Station', cat: 'Transport', amount: -45.00 },
    ];

    const tbody = document.getElementById('transactionsBody');
    tbody.innerHTML = '';

    transactions.forEach(tx => {
        const tr = document.createElement('tr');
        const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount);
        const amountClass = tx.amount >= 0 ? 'amount-positive' : 'amount-negative';

        tr.innerHTML = `
            <td>${tx.date}</td>
            <td>${tx.desc}</td>
            <td class="category-cell" data-id="${tx.id}">
                <span class="category-badge">${tx.cat}</span>
            </td>
            <td class="${amountClass}">${formattedAmount}</td>
        `;
        tbody.appendChild(tr);
    });

    // Event delegation for category editing
    tbody.addEventListener('click', (e) => {
        const cell = e.target.closest('.category-cell');
        if (!cell || cell.classList.contains('editing')) return;

        const badge = cell.querySelector('.category-badge');
        const currentCat = badge.textContent;

        cell.classList.add('editing');

        // Create select element
        const select = document.createElement('select');
        select.className = 'category-select';

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            if (cat === currentCat) option.selected = true;
            select.appendChild(option);
        });

        // Replace badge with select
        cell.innerHTML = '';
        cell.appendChild(select);
        select.focus();

        // Handle selection change or blur
        const finishEditing = () => {
            const newCat = select.value;
            cell.classList.remove('editing');
            cell.innerHTML = `<span class="category-badge">${newCat}</span>`;
            // In a real app, we would update the transaction object/backend here
        };

        select.addEventListener('blur', finishEditing);
        select.addEventListener('change', finishEditing);
    });
}
