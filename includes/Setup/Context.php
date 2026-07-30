<?php
/**
 * Context
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Setup;

use DateTime;
use DixNeufHeureQuaranteSept\Models\Work;
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
		add_filter( 'timber/post/classmap', array( $this, 'add_post_classmap' ) );
	}

	/**
	 * Map CPT slugs to Timber Post models.
	 *
	 * @param array $classmap Classmap.
	 * @return array
	 *
	 * @see https://timber.github.io/docs/v2/guides/class-maps/#the-post-class-map
	 */
	public function add_post_classmap( array $classmap ): array {
		$classmap['work'] = Work::class;

		return $classmap;
	}

	/**
	 * Add custom data to the global context.
	 *
	 * @param array $context Timber context.
	 * @return array
	 */
	public function add_to_context( array $context ): array {
		$context['socials'] = $this->get_socials();

		$context['page_permalink'] = $this->get_page_permalinks();

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

		return $context;
	}

	/**
	 * Page permalinks from ACF theme options + CPT archives.
	 *
	 * @return array{about: string|false, lastfm: string|false, tumblr: string|false, work: string|false, posts: string|false}
	 */
	private function get_page_permalinks(): array {
		$pages = function_exists( 'get_field' ) ? get_field( 'pages', 'option' ) : null;
		$pages = is_array( $pages ) ? $pages : array();

		$permalink = static function ( $page_id ) {
			return $page_id ? get_permalink( (int) $page_id ) : false;
		};

		return array(
			'about'  => $permalink( $pages['about'] ?? null ),
			'lastfm' => $permalink( $pages['lastfm'] ?? null ),
			'tumblr' => $permalink( $pages['tumblr'] ?? null ),
			'work'   => get_post_type_archive_link( 'work' ),
			'posts'  => get_post_type_archive_link( 'post' ),
		);
	}

	/**
	 * Social links from options.
	 *
	 * @return array
	 */
	private function get_socials(): array {
		$socials = array();
		$keys    = array(
			'facebook'  => __( 'Facebook', '19h47' ),
			'twitter'   => __( 'Twitter', '19h47' ),
			'instagram' => __( 'Instagram', '19h47' ),
			'pinterest' => __( 'Pinterest', '19h47' ),
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
