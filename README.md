# 19h47

WordPress theme built with [Timber](https://www.upstatement.com/timber/), [Barba](https://barba.js.org/) (`@barba/core`) and [Vite](https://vitejs.dev/).

## Setup

```bash
composer install
cp .env.sample .env
pnpm install
pnpm dev    # HMR
pnpm build  # production → dist/
```

`.env` needs `APP_URL` pointing at your local site (used by laravel-vite-plugin).

## Lint

```bash
composer lint       # phpcs (WordPress Coding Standards)
composer lint:fix  # phpcbf (auto-fix)
```

## Architecture

PHP follows a Nexiode-style Service registry:

- `functions.php` — Composer autoload → Timber → `DixNeufHeureQuaranteSept\Init::run_services()`
- `includes/` — PSR-4 (`DixNeufHeureQuaranteSept\`), each feature is a `Service` with `run()`
- `includes/helpers.php` — procedural helpers (Composer `files`)
