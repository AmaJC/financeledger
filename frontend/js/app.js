document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    initCashFlowSankey();
    loadTransactions();
});

function initCashFlowSankey() {
    const chartDom = document.getElementById('sankeyChart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom, 'dark', {
        renderer: 'canvas',
        useDirtyRect: false
    });

    const sankeyData = {
        monthly: {
            links: [
                { source: 'Salary', target: 'Total Income', value: 8500 },
                { source: 'Freelance', target: 'Total Income', value: 3200 },
                { source: 'Dividends', target: 'Total Income', value: 800 },
                { source: 'Total Income', target: 'Rent', value: 2500 },
                { source: 'Total Income', target: 'Groceries', value: 600 },
                { source: 'Total Income', target: 'Dining', value: 400 },
                { source: 'Total Income', target: 'Transport', value: 300 },
                { source: 'Total Income', target: 'Utilities', value: 200 },
                { source: 'Total Income', target: 'Savings', value: 4500 },
                { source: 'Total Income', target: 'Investments', value: 4000 }
            ],
            total: 12500
        },
        annual: {
            links: [
                { source: 'Salary', target: 'Total Income', value: 102000 },
                { source: 'Freelance', target: 'Total Income', value: 38400 },
                { source: 'Dividends', target: 'Total Income', value: 9600 },
                { source: 'Total Income', target: 'Rent', value: 30000 },
                { source: 'Total Income', target: 'Groceries', value: 7200 },
                { source: 'Total Income', target: 'Dining', value: 4800 },
                { source: 'Total Income', target: 'Transport', value: 3600 },
                { source: 'Total Income', target: 'Utilities', value: 2400 },
                { source: 'Total Income', target: 'Savings', value: 54000 },
                { source: 'Total Income', target: 'Investments', value: 48000 }
            ],
            total: 150000
        }
    };

    const commonNodes = [
        { name: 'Salary' },
        { name: 'Freelance' },
        { name: 'Dividends' },
        { name: 'Total Income' },
        { name: 'Rent' },
        { name: 'Groceries' },
        { name: 'Dining' },
        { name: 'Transport' },
        { name: 'Utilities' },
        { name: 'Savings' },
        { name: 'Investments' }
    ];

    function getOption(period) {
        const data = sankeyData[period];
        return {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [{
                type: 'sankey',
                layout: 'none',
                emphasis: { focus: 'adjacency' },
                data: commonNodes,
                links: data.links,
                lineStyle: { color: 'gradient', curveness: 0.5 },
                label: {
                    color: '#e2e8f0',
                    fontFamily: 'Outfit',
                    fontSize: 14,
                    formatter: function (params) {
                        const value = params.value;
                        const name = params.name;
                        const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

                        if (name === 'Total Income') {
                            return `${name}\n${formattedValue}`;
                        }

                        const percent = ((value / data.total) * 100).toFixed(1);
                        return `${name}\n${formattedValue} (${percent}%)`;
                    }
                }
            }]
        };
    }

    myChart.setOption(getOption('monthly'));

    window.addEventListener('resize', myChart.resize);

    // Toggle Logic inside the same container scope if buttons exist
    const container = document.querySelector('.card-header');
    if (container) {
        const toggles = container.querySelectorAll('.toggle-btn');
        toggles.forEach(btn => {
            btn.addEventListener('click', () => {
                toggles.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const period = btn.dataset.period;
                myChart.setOption(getOption(period));
            });
        });
    }
}

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
            data: [952123.45, 948567.89, 1012345.12, 1085432.76, 1065234.56, 1198432.42],
            current: 1198432.42,
            changeVal: 133197.86, // Feb - Jan change
            changePct: 12.50
        },
        annual: {
            labels: ['2021', '2022', '2023', '2024', '2025', '2026 (YTD)'],
            data: [854200.12, 921500.45, 982100.32, 1054300.78, 1152100.90, 1198432.42],
            current: 1198432.42,
            changeVal: 46331.52,
            changePct: 4.02
        }
    };

    // Net Worth Chart
    const netWorthCanvas = document.getElementById('netWorthChart');
    if (netWorthCanvas) {
        const netWorthCtx = netWorthCanvas.getContext('2d');
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
                            stepSize: 50000,
                            callback: function (value) {
                                if (value >= 1000000) return '$' + (value / 1000000).toFixed(2) + 'M';
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

                document.querySelector('.time-period-label').textContent = period === 'monthly' ? 'this month' : 'this year';

                if (period === 'annual') {
                    updateStats(nwData.annual.changeVal, nwData.annual.changePct);
                } else {
                    updateStats(nwData.monthly.changeVal, nwData.monthly.changePct);
                }
            });
        });
    }

    function updateStats(val, pct) {
        const changeVal = document.getElementById('nwChangeValue');
        const changePct = document.getElementById('nwChangePercent');
        if (changeVal) changeVal.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
        if (changePct) changePct.textContent = `(${pct}%)`;
    }

    // Spending Chart
    const spendingCanvas = document.getElementById('spendingChart');
    if (spendingCanvas) {
        const spendingCtx = spendingCanvas.getContext('2d');
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
