# SmartBiz

SmartBiz is a web-based inventory and sales management system for small businesses — manage products, track stock levels, handle sales, and generate reports.

## Features
- Inventory management (products, stock levels)
- Sales processing and receipts
- Customer management
- Reporting and export

## Tech stack
- Frontend: React + Vite
- Backend: Node.js (Express)
- Database: configured in `/server/`

## Repository structure
- `client/` — React frontend (Vite)
- `server/` — Node.js backend
- `DB/` — database connection/config
- `docs/` — design and API docs

## Quick start
1. Install dependencies:

```bash
cd client
npm install
cd ../server
npm install
```

2. Set environment variables: copy `.env.example` to `.env` in `/server` and update values.

3. Run locally (in separate terminals):

```bash
# from repo root, in one terminal
cd server && npm run dev
# in another terminal
cd client && npm run dev
```

## Environment
- Keep secrets out of version control: use `.env` files (already ignored).

## Contributing
- Open issues and PRs; follow existing code style.

## License
See `LICENSE` at repository root.