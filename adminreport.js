

const REPORT_DATA = {

  projects: [
    {
      name: 'Orphan Sponsorship',
      amount: 22500
    },

    {
      name: 'Mosque Construction',
      amount: 50000
    },

    {
      name: 'Medical Aid',
      amount: 18900
    },

    {
      name: 'Education Support',
      amount: 13100
    },

    {
      name: 'Ramadan Feeding',
      amount: 14200
    }
  ],

  transactions: [

    {
      id: 'TX-9201',
      donor: 'Donor #001',
      project: 'Orphan Sponsorship',
      type: 'Donation',
      amount: 5000,
      status: 'Completed'
    },

    {
      id: 'TX-9202',
      donor: 'Donor #002',
      project: 'Medical Aid',
      type: 'Donation',
      amount: 3200,
      status: 'Completed'
    },

    {
      id: 'TX-9203',
      donor: 'System',
      project: 'Education Support',
      type: 'Disbursement',
      amount: 1800,
      status: 'Pending'
    },

    {
      id: 'TX-9204',
      donor: 'Donor #004',
      project: 'Mosque Construction',
      type: 'Donation',
      amount: 8000,
      status: 'Completed'
    }
  ]
};


// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════

function formatMoney(number) {
  return 'EGP ' + number.toLocaleString('en');
}


// ═══════════════════════════════════════
// STATS
// ═══════════════════════════════════════

function loadStats() {

  const totalDonations = REPORT_DATA.projects.reduce((sum, project) => {
    return sum + project.amount;
  }, 0);

  document.getElementById('totalDonations').textContent =
    formatMoney(totalDonations);

  document.getElementById('fundsDisbursed').textContent =
    formatMoney(25800);

  document.getElementById('activeProjects').textContent =
    REPORT_DATA.projects.length;

  document.getElementById('pendingCases').textContent =
    7;
}


// ═══════════════════════════════════════
// CHART
// ═══════════════════════════════════════

function renderChart() {

  const chart = document.getElementById('chartBars');

  const maxAmount = Math.max(...REPORT_DATA.projects.map(project => {
    return project.amount;
  }));

  chart.innerHTML = REPORT_DATA.projects.map(project => {

    const percentage = (project.amount / maxAmount) * 100;

    return `

      <div class="chart-item">

        <div
          class="bar"
          style="height:${percentage}%">
        </div>

        <div class="bar-label">
          ${project.name}
        </div>

        <div class="bar-value">
          ${formatMoney(project.amount)}
        </div>

      </div>

    `;

  }).join('');
}


// ═══════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════

function renderSummary() {

  const summaryList = document.getElementById('summaryList');

  const summaryData = [

    {
      label: 'Registered Donors',
      value: '312'
    },

    {
      label: 'Approved Cases',
      value: '21'
    },

    {
      label: 'Pending Reviews',
      value: '7'
    },

    {
      label: 'Closed Projects',
      value: '2'
    },

    {
      label: 'Average Donation',
      value: 'EGP 1,850'
    }
  ];

  summaryList.innerHTML = summaryData.map(item => {

    return `

      <div class="summary-row">

        <span class="summary-label">
          ${item.label}
        </span>

        <span class="summary-value">
          ${item.value}
        </span>

      </div>

    `;

  }).join('');
}


// ═══════════════════════════════════════
// TRANSACTIONS TABLE
// ═══════════════════════════════════════

function renderTransactions() {

  const body = document.getElementById('transactionTableBody');

  body.innerHTML = REPORT_DATA.transactions.map(transaction => {

    return `

      <tr>

        <td>${transaction.id}</td>

        <td>${transaction.donor}</td>

        <td>${transaction.project}</td>

        <td>${transaction.type}</td>

        <td>${formatMoney(transaction.amount)}</td>

        <td>

          <span class="status ${transaction.status.toLowerCase()}">
            ${transaction.status}
          </span>

        </td>

      </tr>

    `;

  }).join('');
}


// ═══════════════════════════════════════
// DOWNLOAD BUTTON
// ═══════════════════════════════════════

document.getElementById('downloadBtn').addEventListener('click', () => {

  const button = document.getElementById('downloadBtn');

  button.textContent = 'Generating...';

  setTimeout(() => {

    button.textContent = 'Download Report';

    alert('Financial report generated successfully!');

  }, 1500);
});


// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════

function init() {

  loadStats();

  renderChart();

  renderSummary();

  renderTransactions();
}

init();


// ═══════════════════════════════════════
// PERIOD FILTER
// ═══════════════════════════════════════

const periodSelect = document.getElementById('periodSelect');

periodSelect.addEventListener('change', event => {

  const selectedPeriod = event.target.value;

  if (selectedPeriod === 'month') {

    REPORT_DATA.projects[0].amount = 22500;
    REPORT_DATA.projects[1].amount = 50000;
    REPORT_DATA.projects[2].amount = 18900;
    REPORT_DATA.projects[3].amount = 13100;
    REPORT_DATA.projects[4].amount = 14200;

  }

  else if (selectedPeriod === 'quarter') {

    REPORT_DATA.projects[0].amount = 64000;
    REPORT_DATA.projects[1].amount = 92000;
    REPORT_DATA.projects[2].amount = 51000;
    REPORT_DATA.projects[3].amount = 33000;
    REPORT_DATA.projects[4].amount = 42000;

  }

  else {

    REPORT_DATA.projects[0].amount = 120000;
    REPORT_DATA.projects[1].amount = 210000;
    REPORT_DATA.projects[2].amount = 99000;
    REPORT_DATA.projects[3].amount = 74000;
    REPORT_DATA.projects[4].amount = 88000;

  }

  loadStats();

  renderChart();

  renderSummary();
});


// ═══════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════

function animateValue(element, start, end, duration) {

  let startTimestamp = null;

  const step = timestamp => {

    if (!startTimestamp) {
      startTimestamp = timestamp;
    }

    const progress = Math.min(
      (timestamp - startTimestamp) / duration,
      1
    );

    const current = Math.floor(
      progress * (end - start) + start
    );

    element.textContent = formatMoney(current);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}


// ═══════════════════════════════════════
// UPDATE STATS WITH ANIMATION
// ═══════════════════════════════════════

function loadStats() {

  const totalDonations = REPORT_DATA.projects.reduce((sum, project) => {
    return sum + project.amount;
  }, 0);

  animateValue(
    document.getElementById('totalDonations'),
    0,
    totalDonations,
    1000
  );

  animateValue(
    document.getElementById('fundsDisbursed'),
    0,
    25800,
    1000
  );

  document.getElementById('activeProjects').textContent =
    REPORT_DATA.projects.length;

  document.getElementById('pendingCases').textContent =
    7;
}


// ═══════════════════════════════════════
// AUTO REFRESH TRANSACTIONS
// ═══════════════════════════════════════

function addRandomTransaction() {

  const randomAmount = Math.floor(
    Math.random() * 9000 + 1000
  );

  const randomId = 'TX-' + Math.floor(Math.random() * 9999);

  REPORT_DATA.transactions.unshift({

    id: randomId,

    donor: 'Live Donor',

    project: 'Medical Aid',

    type: 'Donation',

    amount: randomAmount,

    status: 'Completed'
  });

  if (REPORT_DATA.transactions.length > 6) {
    REPORT_DATA.transactions.pop();
  }

  renderTransactions();
}

setInterval(() => {

  addRandomTransaction();

}, 8000);


// ═══════════════════════════════════════
// HOVER EFFECT FOR CHART
// ═══════════════════════════════════════

document.addEventListener('mouseover', event => {

  if (event.target.classList.contains('bar')) {

    event.target.style.opacity = '0.8';

    event.target.style.transform = 'scaleY(1.03)';
  }
});


document.addEventListener('mouseout', event => {

  if (event.target.classList.contains('bar')) {

    event.target.style.opacity = '1';

    event.target.style.transform = 'scaleY(1)';
  }
});


// ═══════════════════════════════════════
// SEARCH TRANSACTIONS
// ═══════════════════════════════════════

function searchTransactions(keyword) {

  const filtered = REPORT_DATA.transactions.filter(transaction => {

    return (
      transaction.id.toLowerCase().includes(keyword.toLowerCase()) ||
      transaction.project.toLowerCase().includes(keyword.toLowerCase()) ||
      transaction.donor.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  const body = document.getElementById('transactionTableBody');

  body.innerHTML = filtered.map(transaction => {

    return `

      <tr>

        <td>${transaction.id}</td>

        <td>${transaction.donor}</td>

        <td>${transaction.project}</td>

        <td>${transaction.type}</td>

        <td>${formatMoney(transaction.amount)}</td>

        <td>
          <span class="status ${transaction.status.toLowerCase()}">
            ${transaction.status}
          </span>
        </td>

      </tr>

    `;

  }).join('');
}


// ═══════════════════════════════════════
// PAGE LOAD ANIMATION
// ═══════════════════════════════════════

window.addEventListener('load', () => {

  document.querySelectorAll('.card').forEach((card, index) => {

    card.style.opacity = '0';

    card.style.transform = 'translateY(20px)';

    setTimeout(() => {

      card.style.transition = '0.5s ease';

      card.style.opacity = '1';

      card.style.transform = 'translateY(0)';

    }, index * 120);
  });
});