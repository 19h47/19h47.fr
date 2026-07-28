<?php
/**
 * Vite
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept;

use Exception;

/**
 * Vite
 */
class Vite implements Service {

	/**
	 * Flag to determine whether hot server is active.
	 *
	 * @var bool
	 */
	private static $is_hot = false;

	/**
	 * The URI to the hot server.
	 *
	 * @var string
	 */
	private static $server;

	/**
	 * The path where compiled assets will go.
	 *
	 * @var string
	 */
	private static $build_path = 'dist';

	/**
	 * Manifest file contents.
	 *
	 * @var array
	 */
	private static $manifest = array();

	/**
	 * Whether Vite has been booted.
	 *
	 * @var bool
	 */
	private static $booted = false;

	/**
	 * Bootstrap Vite.
	 *
	 * @return void
	 */
	public function run(): void {
		self::boot( null, true );
	}

	/**
	 * Boot Vite.
	 *
	 * @param string|null $build_path Build path.
	 * @param bool        $output     Whether to output the Vite client.
	 * @return string|null
	 * @throws Exception Exception.
	 */
	public static function boot( $build_path = null, $output = true ) {
		if ( $build_path ) {
			static::$build_path = $build_path;
		}

		if ( ! static::$booted ) {
			static::$is_hot = file_exists( static::hot_file_path() );

			if ( static::$is_hot ) {
				// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				static::$server = trim( file_get_contents( static::hot_file_path() ) );
			} else {
				$manifest_path = static::build_path() . '/.vite/manifest.json';

				if ( ! file_exists( $manifest_path ) ) {
					throw new Exception(
						esc_html__( 'No Vite Manifest exists. Should hot server be running?', '19h47' )
					);
				}

				// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				static::$manifest = json_decode( file_get_contents( $manifest_path ), true );
			}

			static::$booted = true;
		}

		if ( ! static::$is_hot ) {
			return null;
		}

		$client = static::$server . '/@vite/client';

		if ( $output && ! is_admin() && ! wp_doing_ajax() && ! wp_is_json_request() ) {
			printf( '<script type="module" src="%s"></script>', esc_url( $client ) );
		}

		return $client;
	}

	/**
	 * Enqueue the Vite client as a script module (HMR).
	 *
	 * @param string|null $build_path Build path.
	 * @return void
	 */
	public static function enqueue_script_module( $build_path = null ) {
		$client = self::boot( $build_path, false );

		if ( ! $client ) {
			return;
		}

		wp_enqueue_script_module( 'vite-client', $client, array(), null );
	}

	/**
	 * Return URI path to an asset.
	 *
	 * @param string $asset Asset path.
	 * @return string
	 * @throws Exception Exception.
	 */
	public static function asset( $asset ) {
		if ( ! static::$booted ) {
			self::boot( null, false );
		}

		if ( static::$is_hot ) {
			return static::$server . '/' . ltrim( $asset, '/' );
		}

		if ( ! array_key_exists( $asset, static::$manifest ) ) {
			throw new Exception(
				esc_html(
					sprintf(
						/* translators: %s: asset path */
						__( 'Unknown Vite build asset: %s', '19h47' ),
						$asset
					)
				)
			);
		}

		return implode(
			'/',
			array(
				get_stylesheet_directory_uri(),
				static::$build_path,
				static::$manifest[ $asset ]['file'],
			)
		);
	}

	/**
	 * Return theme-relative path to a built asset (for add_editor_style).
	 *
	 * @param string $asset Asset path.
	 * @return string
	 * @throws Exception Exception.
	 */
	public static function asset_path( $asset ) {
		if ( ! static::$booted ) {
			self::boot( null, false );
		}

		if ( static::$is_hot ) {
			return static::$server . '/' . ltrim( $asset, '/' );
		}

		if ( ! array_key_exists( $asset, static::$manifest ) ) {
			throw new Exception(
				esc_html(
					sprintf(
						/* translators: %s: asset path */
						__( 'Unknown Vite build asset: %s', '19h47' ),
						$asset
					)
				)
			);
		}

		return static::$build_path . '/' . static::$manifest[ $asset ]['file'];
	}

	/**
	 * Hot file path.
	 *
	 * @return string
	 */
	private static function hot_file_path() {
		return implode( '/', array( static::build_path(), 'hot' ) );
	}

	/**
	 * Build path.
	 *
	 * @return string
	 */
	private static function build_path() {
		return implode( '/', array( get_stylesheet_directory(), static::$build_path ) );
	}
}
