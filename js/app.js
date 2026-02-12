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
                    font: { family: 'Inter' }
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

    // Net Worth Chart
    const netWorthCtx = document.getElementById('netWorthChart').getContext('2d');
    new Chart(netWorthCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Net Worth',
                data: [120000, 122500, 121000, 125000, 128000, 131000],
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0f172a',
                pointBorderWidth: 2
            }]
        },
        options: commonOptions
    });

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
