<?php
/**
 * Post
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept;

/**
 * Core post-type supports.
 */
class Post implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'init', array( $this, 'add_post_type_supports' ) );
	}

	/**
	 * Add post type supports.
	 *
	 * @return void
	 */
	public function add_post_type_supports(): void {
		add_post_type_support( 'page', 'excerpt' );
	}
}
