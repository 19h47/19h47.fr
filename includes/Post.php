<?php
/**
 * Post
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept;

/**
 * Core post-type supports and front behavior.
 */
class Post implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'init', array( $this, 'add_post_type_supports' ) );
		add_action( 'template_redirect', array( $this, 'redirect_single_post_to_thoughts' ) );
	}

	/**
	 * Add post type supports.
	 *
	 * @return void
	 */
	public function add_post_type_supports(): void {
		add_post_type_support( 'page', 'excerpt' );
	}

	/**
	 * Singles live in the Thoughts stream: redirect to the posts page + anchor.
	 *
	 * @return void
	 */
	public function redirect_single_post_to_thoughts(): void {
		if ( ! is_singular( 'post' ) ) {
			return;
		}

		$thoughts_url = get_post_type_archive_link( 'post' );

		if ( ! $thoughts_url ) {
			return;
		}

		wp_safe_redirect( $thoughts_url . '#post-' . get_queried_object_id(), 301 );
		exit;
	}
}
