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
	}

	/**
	 * Classic Editor (TinyMCE) styles via content_css.
	 *
	 * @return void
	 */
	public function editor_styles(): void {
		$webfonts = $this->webfonts();

		foreach ( $webfonts as $url ) {
			add_editor_style( $url );
		}

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

		$deps     = array();
		$webfonts = $this->webfonts();

		foreach ( $webfonts as $name => $url ) {
			$handle = 'font-' . $name;
			wp_register_style( $handle, $url, array(), null );
			wp_enqueue_style( $handle );
			$deps[] = $handle;
		}

		try {
			wp_enqueue_style(
				get_theme_text_domain() . '-editor',
				Vite::asset( 'src/stylesheets/editor.css' ),
				$deps,
				null
			);
		} catch ( \Exception $e ) {
			// Manifest missing — run `pnpm build` or `pnpm dev`.
		}
	}

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles(): void {
		$deps     = array();
		$webfonts = $this->webfonts();

		foreach ( $webfonts as $name => $url ) {
			$handle = 'font-' . $name;
			wp_register_style( $handle, $url, array(), null );
			$deps[] = $handle;
		}

		wp_enqueue_style(
			get_theme_text_domain() . '-global',
			Vite::asset( 'src/stylesheets/styles.css' ),
			$deps,
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
			'ajax_url'               => admin_url( 'admin-ajax.php' ),
			'nonce'                  => wp_create_nonce( 'security' ),
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

	/**
	 * List webfonts used by the theme.
	 *
	 * @return array
	 */
	private function webfonts(): array {
		return array(
			'work-sans' => 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,200;0,300;0,400;0,700;1,500&display=swap',
		);
	}
}
