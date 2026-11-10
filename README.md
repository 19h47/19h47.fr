# 19h47

Personal WordPress theme for [19h47.fr](https://www.19h47.fr/), version **4**.

Built with [Timber](https://timber.github.io/docs/) / Twig, [Vite](https://vitejs.dev/), TypeScript, [Tailwind CSS](https://tailwindcss.com/) v4 and [PiecesJS](https://github.com/piecesjs/piecesjs).

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

API keys go in `wp-config.php` (required, never in the theme). The Tumblr key is the OAuth consumer key of a [registered app](https://www.tumblr.com/oauth/apps); the Last.fm key comes from an [API account](https://www.last.fm/api/account/create):

```php
define( 'LASTFM_API_KEY', '…' );
define( 'TUMBLR_API_KEY', '…' );
```

Optional overrides (defaults live in the theme):

```php
define( 'LASTFM_USER', '…' );
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

Notable services: `Setup\Enqueue`, `Setup\Context`, `Setup\Twig`, `Vite`, `PostTemplate\NamespaceFilter`, `Post\Work`, `Post\Lastfm`, `Post\Tumblr`, ACF field loaders.

### Twig

- Views under `views/` (`pages/`, `components/`, `sections/`)
- Page templates under `templates/` map to `views/pages/*-page.html.twig` when dedicated
- Shared `components/image.html.twig` — `<picture>`, srcset, WebP via Timber `towebp`

### Front-end

Entry: `src/scripts/main.ts` + `src/stylesheets/styles.css`.

- **Vite** builds JS/CSS into `dist/` with a manifest consumed by PHP
- **Page transitions** are native cross-document view transitions (`components/view-transition.css`): a cross-fade, and a colour wipe into a work page. Linked pages are prefetched on hover with WordPress speculation rules
- **Namespaces** (`body[data-namespace]`, page-type styling) come from `PostTemplate\NamespaceFilter` / Timber context
- **PiecesJS** custom elements (`lastfm-feed`, `tumblr-feed`, `black-board`, …) mount on boot

```
src/scripts/
  main.ts
  components/     # PiecesJS web components
  modules/        # Watchers, guid
  lib/Piece.ts    # Piece base with a typed queryOne
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

Last.fm and Tumblr data are rendered server-side as Timber HTML partials, then refreshed (Last.fm) or paginated (Tumblr) through public REST routes: `GET /wp-json/19h47/v1/lastfm?limit=` and `GET /wp-json/19h47/v1/tumblr?offset=&per_page=`. The last successful feed is kept as a fallback when an API is down.

## Deploy

1. `composer install --no-dev`
2. `pnpm install && pnpm build`
3. Ship the theme **including** `dist/` (or build on the server)

Do not commit `.env`, `node_modules/`, or `.pnpm-store/`.

## License

GPL-2.0-or-later (same as WordPress). See `style.css`.
