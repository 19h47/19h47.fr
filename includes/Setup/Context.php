<?php
/**
 * Context
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Setup;

use DateTime;
use DixNeufHeureQuaranteSept\Service;
use Timber\{ Site, Timber };

/**
 * Timber context (Site subclass, Timber 2).
 */
class Context extends Site implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_filter( 'timber/context', array( $this, 'add_to_context' ) );
		add_filter( 'timber/context', array( $this, 'add_menus_to_context' ) );
	}

	/**
	 * Add custom data to the global context.
	 *
	 * @param array $context Timber context.
	 * @return array
	 */
	public function add_to_context( array $context ): array {
		$context['socials'] = $this->get_socials();

		$context['page_permalink'] = array(
			'what_im_currently_listening_to' => get_permalink( get_page_by_path( 'what-im-currently-listening-to' ) ),
			'who_i_am'                       => get_permalink( get_page_by_path( 'who-i-am' ) ),
			'what_inspires_me'               => get_permalink( get_page_by_path( 'what-inspires-me' ) ),
			'work'                           => get_post_type_archive_link( 'work' ),
			'thoughts'                       => get_permalink( get_page_by_path( 'thoughts' ) ),
		);

		$context['barba_namespace'] = get_barba_namespace();

		$o_date_now      = new DateTime( 'now' );
		$o_date_birth    = new DateTime( '1986-07-27' );
		$o_date_interval = $o_date_now->diff( $o_date_birth );

		$context['age'] = $o_date_interval->y;

		return $context;
	}

	/**
	 * Add menus to context.
	 *
	 * @param array $context Timber context.
	 * @return array
	 */
	public function add_menus_to_context( array $context ): array {
		foreach ( get_registered_nav_menus() as $menu => $value ) {
			$context['nav_menus'][ $menu ] = Timber::get_menu( $menu );
		}

		// Back-compat for templates still using main_menu.
		$context['main_menu'] = $context['nav_menus']['main'] ?? null;

		return $context;
	}

	/**
	 * Social links from options.
	 *
	 * @return array
	 */
	private function get_socials(): array {
		$socials = array();
		$keys    = array(
			'facebook'  => 'Facebook',
			'twitter'   => 'Twitter',
			'instagram' => 'Instagram',
			'pinterest' => 'Pinterest',
		);

		foreach ( $keys as $slug => $name ) {
			$url = get_option( $slug );

			if ( ! $url ) {
				continue;
			}

			$socials[ $slug ] = array(
				'slug' => $slug,
				'name' => $name,
				'url'  => $url,
			);
		}

		return $socials;
	}
}
