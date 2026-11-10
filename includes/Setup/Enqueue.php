<?php
/**
 * Enqueue
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Setup;

use DixNeufHeureQuaranteSept\{ Service, Vite };
use function get_theme_text_domain;

/**
 * Theme asset enqueue.
 */
class Enqueue implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'after_setup_theme', array( $this, 'editor_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ) );
		add_action( 'wp_head', array( $this, 'resource_hints' ), 1 );
		add_filter( 'wp_preload_resources', array( $this, 'preload_resources' ) );
		add_filter( 'wp_speculation_rules_configuration', array( $this, 'speculation_rules_configuration' ) );
	}

	/**
	 * Prefetch a linked page after a short hover (`moderate`) rather than on
	 * click. Prefetch only: prerendering would run the page's scripts before
	 * it is shown. `null` (logged-in visitors, plain permalinks) keeps
	 * speculative loading off.
	 *
	 * @param array|null $config Speculation rules configuration.
	 * @return array|null
	 */
	public function speculation_rules_configuration( ?array $config ): ?array {
		if ( null === $config ) {
			return null;
		}

		return array(
			'mode'      => 'prefetch',
			'eagerness' => 'moderate',
		);
	}

	/**
	 * Preload Work Sans (latin, upright) painted above the fold so it is not
	 * discovered only once the CSS is parsed. The italic and the other subsets
	 * stay on demand.
	 *
	 * @param array $resources Resources to preload.
	 * @return array
	 */
	public function preload_resources( array $resources ): array {
		$fonts = array_filter(
			Vite::entry_assets( 'src/stylesheets/styles.css' ),
			fn( $asset ) => str_contains( $asset, '/work-sans-latin-wght-normal-' )
		);

		foreach ( $fonts as $font ) {
			$resources[] = array(
				'href'        => $font,
				'as'          => 'font',
				'type'        => 'font/woff2',
				'crossorigin' => 'anonymous',
			);
		}

		return $resources;
	}

	/**
	 * Classic Editor (TinyMCE) styles via content_css.
	 *
	 * @return void
	 */
	public function editor_styles(): void {
		try {
			// Theme-relative path so TinyMCE/WP resolve the file without a loopback HTTP fetch.
			add_editor_style( Vite::asset_path( 'src/stylesheets/editor.css' ) );
		} catch ( \Exception $e ) {
			// Manifest missing — run `pnpm build` or `pnpm dev`.
		}
	}

	/**
	 * Block editor canvas styles (iframed Gutenberg).
	 *
	 * @return void
	 */
	public function enqueue_block_assets(): void {
		if ( ! is_admin() ) {
			return;
		}

		try {
			wp_enqueue_style(
				get_theme_text_domain() . '-editor',
				Vite::asset( 'src/stylesheets/editor.css' ),
				array(),
				null
			);
		} catch ( \Exception $e ) {
			// Manifest missing — run `pnpm build` or `pnpm dev`.
		}
	}

	/**
	 * Early dns-prefetch for analytics injected by plugins.
	 *
	 * @return void
	 */
	public function resource_hints(): void {
		if ( is_admin() ) {
			return;
		}

		echo '<link rel="dns-prefetch" href="//www.googletagmanager.com">' . "\n";
		echo '<link rel="dns-prefetch" href="//www.google-analytics.com">' . "\n";
	}

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles(): void {
		wp_enqueue_style(
			get_theme_text_domain() . '-global',
			Vite::asset( 'src/stylesheets/styles.css' ),
			array(),
			null
		);
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts(): void {
		$theme = get_theme_text_domain();

		wp_deregister_script( 'jquery' );
		wp_deregister_script( 'wp-embed' );

		Vite::enqueue_script_module();

		wp_register_script_module(
			$theme . '-main',
			Vite::asset( 'src/scripts/main.ts' ),
			array(),
			null
		);

		// Head boot script: html class detection + theme config (before ES modules).
		$boot = $theme . '-boot';
		wp_register_script( $boot, false, array(), null, false );

		wp_add_inline_script(
			$boot,
			"document.documentElement.classList.replace('no-js','js');"
			. "if(window.matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0){"
			. "document.documentElement.classList.replace('no-touch','touch');"
			. '}',
			'before'
		);

		$data = array(
			'template_directory_uri' => get_template_directory_uri(),
			'base_url'               => site_url(),
			'home_url'               => home_url( '/' ),
			'api_url'                => esc_url_raw( rest_url( 'wp/v2/' ) ),
			'text_domain'            => $theme,
		);

		wp_add_inline_script(
			$boot,
			'window.theme = ' . wp_json_encode( $data ) . ';',
			'after'
		);

		wp_enqueue_script( $boot );
		wp_enqueue_script_module( $theme . '-main' );
	}
}
