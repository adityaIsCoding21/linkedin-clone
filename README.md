# LinkedIn Clone

A small LinkedIn-like clone (frontend + backend) built with React (Vite) for the frontend and Node/Express + MongoDB for the backend.

## What this repo contains

- `backend/` - Express server, routes, models.
- `frontend/` - React (Vite) app.

## Quick start (local)

1. Clone repository (if not already on your machine):

	git clone https://github.com/<your-username>/linkedin-clone.git
	cd linkedin-clone

2. Backend

	cd backend
	npm install

	Create a `.env` file (do NOT commit it) based on `.env.example`.

	Example `.env` variables:

	- `MONGO_URI` - your MongoDB connection string
	- `JWT_SECRET` - secret for authentication tokens
	- `PORT` - backend port (default: 5000)

	Start backend:

	npm run start
	# or in development
	npm run dev

3. Frontend

	cd frontend
	npm install
	npm run dev

	By default Vite serves on `http://localhost:5173` (or 3000 depending on config).

## Environment variables

This repo ignores real `.env` files. Use `.env.example` as a template and create a local `.env` file.

## Creating the GitHub repo and pushing

Option A — Using the GitHub website

1. Create a new repository on GitHub named `linkedin-clone` (your repo URL will be `https://github.com/<your-username>/linkedin-clone.git`).
2. In your local project root run:

	git init
	git add .
	git commit -m "Initial commit"
	git branch -M main
	git remote add origin https://github.com/<your-username>/linkedin-clone.git
	git push -u origin main

Option B — Using GitHub CLI (if installed)

	gh repo create <your-username>/linkedin-clone --public --source=. --remote=origin --push

(If you prefer a private repo, add `--private`.)

## Notes

- Make sure you DO NOT commit any real secrets. The `.gitignore` file here ignores `.env` and `node_modules`.
- If you want, I can run the `git init` + initial commit for you and set the remote — tell me the remote URL or confirm you have `gh` configured and want the CLI route.

## License

MIT