<?php
/**
 * Page namespace filter.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\PostTemplate;

use DixNeufHeureQuaranteSept\Service;

/**
 * Sets the current page namespace.
 */
class NamespaceFilter implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_filter( 'theme_namespace', array( $this, 'resolve' ) );
	}

	/**
	 * Resolve namespace for the current view.
	 *
	 * @param string $ns Default namespace.
	 * @return string
	 */
	public function resolve( $ns ) {
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
