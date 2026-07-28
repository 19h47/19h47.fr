<?php
/**
 * Twig
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Setup;

use DixNeufHeureQuaranteSept\{ Service, Vite };
use Twig\Extra\Html\HtmlExtension;
use Twig\Extra\Intl\IntlExtension;
use Twig\TwigFunction;
use function html_class;

/**
 * Twig functions for Timber 2.
 */
class Twig implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_filter( 'timber/twig', array( $this, 'add_functions' ) );
		add_filter( 'timber/twig', array( $this, 'add_extensions' ) );
		add_filter( 'timber/twig/environment/options', array( $this, 'set_environment_options' ) );
	}

	/**
	 * Twig environment options.
	 *
	 * @param array $options Twig options.
	 * @return array
	 */
	public function set_environment_options( array $options ): array {
		$options['cache']       = WP_DEBUG ? false : true;
		$options['auto_reload'] = WP_DEBUG;

		return $options;
	}

	/**
	 * Register Twig extras.
	 *
	 * @param object $twig Twig environment.
	 * @return object
	 */
	public function add_extensions( object $twig ): object {
		$twig->addExtension( new HtmlExtension() );
		$twig->addExtension( new IntlExtension() );

		return $twig;
	}

	/**
	 * Add functions to Twig.
	 *
	 * @param object $twig Twig environment.
	 * @return object
	 */
	public function add_functions( object $twig ): object {
		$twig->addFunction(
			new TwigFunction(
				'html_class',
				function ( string $args = '' ) {
					return html_class( $args );
				}
			)
		);

		$twig->addFunction(
			new TwigFunction(
				'body_class',
				function ( $args = '' ) {
					return 'class="' . esc_attr( implode( ' ', get_body_class( $args ) ) ) . '"';
				}
			)
		);

		$twig->addFunction(
			new TwigFunction(
				'asset',
				function ( $asset ) {
					return Vite::asset( $asset );
				}
			)
		);

		return $twig;
	}
}
