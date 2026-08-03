(() => {
  const API_ORIGIN = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? ''
    : 'https://api.samjakeman.com';
  const loginView = document.querySelector('#loginView');
  const dashboardView = document.querySelector('#dashboardView');
  const loginForm = document.querySelector('#loginForm');
  const loginError = document.querySelector('#loginError');
  const dietLabels = {
    none: 'None', vegetarian: 'Vegetarian', vegan: 'Vegan', pescatarian: 'Pescatarian', 'gluten-free': 'Gluten free'
  };

  function showLogin() {
    dashboardView.hidden = true;
    loginView.hidden = false;
    document.querySelector('#password').focus();
  }

  function showDashboard() {
    loginView.hidden = true;
    dashboardView.hidden = false;
  }

  function guestCount(rsvps) {
    return rsvps.reduce((total, response) => total + response.guests.length, 0);
  }

  function appendCell(row, content, className) {
    const cell = document.createElement('td');
    if (className) cell.className = className;
    if (content instanceof Node) cell.append(content); else cell.textContent = content;
    row.append(cell);
  }

  function dietaryList(guests) {
    const list = document.createElement('ul');
    list.className = 'diet-list';
    guests.forEach((guest) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = `${guest.name}: `;
      item.append(name, (guest.dietary || ['none']).map((diet) => dietLabels[diet] || diet).join(', '));
      list.append(item);
    });
    return list;
  }

  function renderTable(rsvps, targetId, emptyId) {
    const target = document.querySelector(targetId);
    const empty = document.querySelector(emptyId);
    target.replaceChildren();
    empty.hidden = rsvps.length > 0;
    rsvps.forEach((response) => {
      const row = document.createElement('tr');
      appendCell(row, response.guests.map((guest) => guest.name).join(' & '));
      const status = document.createElement('span');
      status.className = `status-pill${response.attending ? '' : ' no'}`;
      status.textContent = response.attending ? 'Yes' : 'No';
      appendCell(row, status);
      appendCell(row, dietaryList(response.guests));
      appendCell(row, `${response.phone.countryCode} ${response.phone.number}`);
      appendCell(row, new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(response.submittedAt)), 'date-cell');
      target.append(row);
    });
  }

  function render(rsvps) {
    const attending = rsvps.filter((response) => response.attending);
    const declined = rsvps.filter((response) => !response.attending);
    const attendingGuests = guestCount(attending);
    const declinedGuests = guestCount(declined);
    document.querySelector('#attendingCount').textContent = attendingGuests;
    document.querySelector('#decliningCount').textContent = declinedGuests;
    document.querySelector('#responseCount').textContent = rsvps.length;
    document.querySelector('#attendingTableCount').textContent = `${attendingGuests} ${attendingGuests === 1 ? 'guest' : 'guests'}`;
    document.querySelector('#declinedTableCount').textContent = `${declinedGuests} ${declinedGuests === 1 ? 'guest' : 'guests'}`;
    document.querySelector('#lastUpdated').textContent = `Last updated ${new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())}`;
    renderTable(attending, '#attendingRows', '#attendingEmpty');
    renderTable(declined, '#declinedRows', '#declinedEmpty');
  }

  async function loadRsvps({ showLoginOnUnauthorised = true } = {}) {
    const response = await fetch(`${API_ORIGIN}/api/admin/rsvps`, { credentials: 'include' });
    if (response.status === 401) {
      if (showLoginOnUnauthorised) showLogin();
      return false;
    }
    if (!response.ok) throw new Error('Could not load responses');
    const data = await response.json();
    render(data.rsvps);
    showDashboard();
    return true;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginError.textContent = '';
    const button = loginForm.querySelector('button');
    button.disabled = true;
    try {
      const response = await fetch(`${API_ORIGIN}/api/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: document.querySelector('#password').value })
      });
      const data = await response.json();
      if (!response.ok) {
        loginError.textContent = data.error || 'Unable to log in.';
        return;
      }
      loginForm.reset();
      await loadRsvps({ showLoginOnUnauthorised: false });
    } catch (error) {
      loginError.textContent = 'The portal could not be reached. Please try again.';
    } finally {
      button.disabled = false;
    }
  });

  document.querySelector('#refreshButton').addEventListener('click', async (event) => {
    event.currentTarget.disabled = true;
    try { await loadRsvps(); } finally { event.currentTarget.disabled = false; }
  });

  document.querySelector('#logoutButton').addEventListener('click', async () => {
    try {
      await fetch(`${API_ORIGIN}/api/admin/logout`, { method: 'POST', credentials: 'include' });
    } finally {
      showLogin();
    }
  });

  loadRsvps().catch(showLogin);
})();
