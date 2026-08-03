# samjakeman.com

## Wedding RSVP

- Public form: `/rsvp.html`
- Private dashboard: `/rsvp-admin.html`
- Local server: `npm run start:local` (serves `http://127.0.0.1:3001`)

RSVP responses are stored in `.data/rsvps.json`. This directory is ignored by Git and denied by the static file server. On Linux, the response file is created with owner-only permissions.

The dashboard password is never sent to the browser or saved in plaintext. The server compares it with a one-way scrypt hash. For VPS deployment, set `RSVP_ADMIN_PASSWORD_HASH` in the service environment to override the built-in initial hash. The value has this format:

```text
scrypt$<hex salt>$<hex derived key>
```

Run the service with `NODE_ENV=production` behind HTTPS so the admin session cookie is marked secure. Set `RSVP_DATA_DIR` if responses should live outside the application directory.
