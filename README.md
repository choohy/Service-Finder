# Service Finder (React + Firebase Auth)

This scaffold provides a minimal React frontend (Vite) with Firebase Authentication supporting OAuth (Google) and passwordless Email Link sign-in.

## What you get

- Vite + React app
- Firebase modular SDK (v9+) initialization
- OAuth (Google) sign-in flow
- Passwordless Email Link sign-in (send & complete)
- Example `.env` values and setup instructions

---

## Prerequisites

- Node.js 18+ (or current LTS)
- A Firebase project with Authentication enabled (Google provider and Email Link)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Firebase project and enable Authentication > Sign-in methods:

- Google
- Email/Passwordless (Email link)

3. Copy `.env.example` to `.env` and fill in your Firebase config values.

4. Run the dev server:

```bash
npm run dev
```

The app will open at `http://localhost:5173` by default.

---

## Files added

- `index.html`, `vite.config.js` — Vite app boot
- `src/firebase.js` — Firebase initialization and helpers
- `src/Auth.jsx` — Simple auth UI (Google + Email link)
- `.env.example` — env template

---

If you want, I can also add Firestore examples, deploy scripts, or CI steps. Which would you like next?
