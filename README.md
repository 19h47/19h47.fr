# 19h47

Personal WordPress theme for [19h47.fr](https://www.19h47.fr/), version **4**.

Built with [Timber](https://timber.github.io/docs/) / Twig, [Vite](https://vitejs.dev/), TypeScript, [Tailwind CSS](https://tailwindcss.com/) v4, [Barba](https://barba.js.org/), [PiecesJS](https://github.com/piecesjs/piecesjs), and GSAP.

## Requirements

- PHP **8.3+**
- Node **20+** / [pnpm](https://pnpm.io/) **11**
- WordPress with [Advanced Custom Fields](https://www.advancedcustomfields.com/) (work fields)
- Composer

## Setup

```bash
composer install
cp .env.sample .env   # set APP_URL to your local site
pnpm install
pnpm dev              # Vite HMR
pnpm build            # production assets → dist/
```

`APP_URL` is used by `laravel-vite-plugin` for the local Vite server.

Optional API overrides (defaults live in the theme; prefer `wp-config.php` in production):

```php
define( 'LASTFM_API_KEY', '…' );
define( 'LASTFM_USER', '…' );
define( 'TUMBLR_API_KEY', '…' );
define( 'TUMBLR_BLOG', '….tumblr.com' );
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Vite dev server + HMR |
| `pnpm build` | Production build (`dist/`, manifest, gzip) |
| `composer lint` | PHPCS (WordPress Coding Standards) |
| `composer lint:fix` | PHPCBF auto-fix |

## Architecture

### PHP

Service registry:

- `functions.php` — Composer autoload → Timber → `DixNeufHeureQuaranteSept\Init::run_services()`
- `includes/` — PSR-4 namespace `DixNeufHeureQuaranteSept\`
- Each feature implements `Service` and registers hooks in `run()`
- `includes/helpers.php` — shared procedural helpers (Composer `files`)

Notable services: `Setup\Enqueue`, `Setup\Context`, `Setup\Twig`, `Vite`, `Barba\NamespaceFilter`, `Post\Work`, `Post\Lastfm`, `Post\Tumblr`, ACF field loaders.

### Twig

- Views under `views/` (`pages/`, `components/`, `sections/`)
- Page templates under `templates/` map to `views/pages/*-page.html.twig` when dedicated
- Shared `components/image.html.twig` — `<picture>`, srcset, WebP via Timber `towebp`

### Front-end

Entry: `src/scripts/main.ts` + `src/stylesheets/styles.css`.

- **Vite** builds JS/CSS into `dist/` with a manifest consumed by PHP
- **Barba** handles page transitions; namespaces come from `Barba\NamespaceFilter` / Timber context
- **PiecesJS** custom elements (`lastfm-feed`, `tumblr-feed`, `black-board`, …) mount on boot and after Barba `afterEnter`
- **GSAP** powers transitions and interactions

```
src/scripts/
  main.ts
  components/     # PiecesJS web components
  modules/        # App, Navigation, Watchers, guid
  transitions/    # Barba transitions
  views/          # Barba views (e.g. Work)
  lib/Piece.ts    # Piece base adapted for Barba
```

## Page templates

| WP template | Twig | Role |
| --- | --- | --- |
| Last.fm | `lastfm-page.html.twig` | Recent tracks (“Currently listening”) |
| Tumblr | `tumblr-page.html.twig` | Inspiration feed (“Currently inspired”) |
| Curriculum Vitae | `curriculum-vitae-page.html.twig` | CV |
| — | `front-page.html.twig` | Home / blackboard |
| `home.php` | `home-page.html.twig` | Blog (posts) |
| `archive-work.php` / `single-work.php` | `archive-work.html.twig` / `single-work.html.twig` | Work CPT |

Last.fm and Tumblr data are proxied through `admin-ajax` and rendered as Timber HTML partials.

## Deploy

1. `composer install --no-dev`
2. `pnpm install && pnpm build`
3. Ship the theme **including** `dist/` (or build on the server)

Do not commit `.env`, `node_modules/`, or `.pnpm-store/`.

## License

GPL-2.0-or-later (same as WordPress). See `style.css`.
