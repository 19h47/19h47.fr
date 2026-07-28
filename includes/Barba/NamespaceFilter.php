<?php
/**
 * Barba namespace filter.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Barba;

use DixNeufHeureQuaranteSept\Service;

/**
 * Sets Barba.js data-barba-namespace.
 */
class NamespaceFilter implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_filter( 'barba_namespace', array( $this, 'barba_namespace' ) );
	}

	/**
	 * Resolve Barba namespace for the current view.
	 *
	 * @param string $ns Default namespace.
	 * @return string
	 */
	public function barba_namespace( $ns ) {
		if ( is_page() ) {
			$ns = 'page';
		}

		if ( is_post_type_archive( 'work' ) ) {
			$ns = 'archive-work';
		}

		if ( is_singular( 'work' ) ) {
			$ns = 'work';
		}

		if ( is_page( 'tumblr' ) ) {
			$ns = 'tumblr';
		}

		if ( is_page( 'lastfm' ) ) {
			$ns = 'lastfm';
		}

		if ( is_page( 'curriculum-vitae' ) ) {
			$ns = 'curriculum-vitae';
		}

		if ( is_404() ) {
			$ns = '404';
		}

		if ( is_front_page() ) {
			$ns = 'front-page';
		}

		if ( is_home() ) {
			$ns = 'thoughts';
		}

		return $ns;
	}
}
