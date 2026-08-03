const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIRECTORY = process.env.RSVP_DATA_DIR
  ? path.resolve(process.env.RSVP_DATA_DIR)
  : path.join(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIRECTORY, 'rsvps.json');
const ADMIN_PASSWORD_HASH = process.env.RSVP_ADMIN_PASSWORD_HASH
  || 'scrypt$cb2b4079002bcf7c17f1bcb5dd736812$e3a5b69bd8c8175bc2d0a7b7ddc252c7e9e23d266f7737d48e78087d51075e49523eb7d98b2d2b1344208874ac203c1ffc87ff6472c02d5865140c5a122de431';
const SESSION_LIFETIME_MS = 12 * 60 * 60 * 1000;
const sessions = new Map();
const loginAttempts = new Map();
let writeQueue = Promise.resolve();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '32kb' }));
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    const productionOrigins = new Set(['https://samjakeman.com', 'https://www.samjakeman.com']);
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');
    if (!origin || productionOrigins.has(origin) || isLocal) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS.'));
  }
}));
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });
  next();
});

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : '';
}

function validateRsvp(body) {
  const allowedDiets = new Set(['none', 'vegetarian', 'vegan', 'pescatarian', 'gluten-free']);
  const attending = body.attending;
  const locale = body.locale === 'fi' ? 'fi' : 'en';
  const submittedGuests = Array.isArray(body.guests) ? body.guests : [];
  const guests = submittedGuests.slice(0, 10).map((guest) => {
    const dietary = Array.isArray(guest.dietary)
      ? [...new Set(guest.dietary.filter((item) => allowedDiets.has(item)))].slice(0, 5)
      : [];
    return {
      name: cleanText(guest.name, 100),
      dietary: dietary.length ? dietary : ['none']
    };
  });
  const countryCode = cleanText(body.phone?.countryCode, 8).replace(/[^+\d]/g, '');
  const number = cleanText(body.phone?.number, 24).replace(/[^\d\s()-]/g, '');

  if (attending !== true && attending !== false) return { error: 'Please select whether you are attending.' };
  if (!guests.length || guests.some((guest) => guest.name.length < 2)) return { error: 'Please enter a name for every guest.' };
  if (!/^\+\d{1,4}$/.test(countryCode)) return { error: 'Please enter a valid country code, for example +44.' };
  if (number.replace(/\D/g, '').length < 6) return { error: 'Please enter a valid phone number.' };

  return { value: { attending, locale, guests, phone: { countryCode, number } } };
}

async function readRsvps() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function saveRsvp(rsvp) {
  const operation = writeQueue.then(async () => {
    await fs.mkdir(DATA_DIRECTORY, { recursive: true });
    const rsvps = await readRsvps();
    rsvps.push(rsvp);
    await fs.writeFile(DATA_FILE, `${JSON.stringify(rsvps, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

function deleteRsvp(id) {
  const operation = writeQueue.then(async () => {
    const rsvps = await readRsvps();
    const index = rsvps.findIndex((rsvp) => rsvp.id === id);
    if (index === -1) return false;
    rsvps.splice(index, 1);
    await fs.writeFile(DATA_FILE, `${JSON.stringify(rsvps, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
    return true;
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map((cookie) => {
    const separator = cookie.indexOf('=');
    return [cookie.slice(0, separator).trim(), decodeURIComponent(cookie.slice(separator + 1))];
  }));
}

function requireAdmin(req, res, next) {
  const token = parseCookies(req).rsvp_session;
  const session = token && sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    return res.status(401).json({ error: 'Authentication required.' });
  }
  session.expiresAt = Date.now() + SESSION_LIFETIME_MS;
  next();
}

function passwordMatches(password) {
  const [algorithm, saltHex, expectedHex] = ADMIN_PASSWORD_HASH.split('$');
  if (algorithm !== 'scrypt' || !saltHex || !expectedHex) return Promise.resolve(false);
  return new Promise((resolve) => {
    crypto.scrypt(password, Buffer.from(saltHex, 'hex'), expectedHex.length / 2, (error, derivedKey) => {
      if (error) return resolve(false);
      const expected = Buffer.from(expectedHex, 'hex');
      resolve(derivedKey.length === expected.length && crypto.timingSafeEqual(derivedKey, expected));
    });
  });
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/rsvps', async (req, res, next) => {
  try {
    const result = validateRsvp(req.body || {});
    if (result.error) return res.status(400).json({ error: result.error });
    const rsvp = {
      id: crypto.randomUUID(),
      ...result.value,
      submittedAt: new Date().toISOString()
    };
    await saveRsvp(rsvp);
    res.status(201).json({ id: rsvp.id });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/login', async (req, res) => {
  const key = req.ip;
  const now = Date.now();
  const recentAttempts = (loginAttempts.get(key) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (recentAttempts.length >= 10) return res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes.' });

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!(await passwordMatches(password))) {
    recentAttempts.push(now);
    loginAttempts.set(key, recentAttempts);
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  loginAttempts.delete(key);
  const token = crypto.randomBytes(32).toString('base64url');
  sessions.set(token, { expiresAt: now + SESSION_LIFETIME_MS });
  res.cookie('rsvp_session', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_LIFETIME_MS,
    path: '/'
  });
  res.json({ ok: true });
});

app.get('/api/admin/rsvps', requireAdmin, async (req, res, next) => {
  try {
    const rsvps = await readRsvps();
    res.json({ rsvps: rsvps.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)) });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/rsvps/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid RSVP identifier.' });
    }
    const deleted = await deleteRsvp(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'RSVP not found.' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = parseCookies(req).rsvp_session;
  sessions.delete(token);
  res.clearCookie('rsvp_session', { path: '/' });
  res.json({ ok: true });
});

app.use(express.static(__dirname, { dotfiles: 'deny', index: false }));
app.get('/index.html', (req, res) => res.redirect(301, '/'));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expiresAt <= now) sessions.delete(token);
  }
}, 30 * 60 * 1000).unref();

if (require.main === module) {
  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;
