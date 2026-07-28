<?php
/**
 * BodyClass
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\PostTemplate;

use DixNeufHeureQuaranteSept\Service;

/**
 * Body class filters.
 */
class BodyClass implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_filter( 'body_class', array( $this, 'add_class_for_work' ) );
		add_filter( 'body_class', array( $this, 'add_class_for_page_who_i_am' ) );
	}

	/**
	 * Add Page__{slug} on singular work.
	 *
	 * @param array $classes Body classes.
	 * @return array
	 */
	public function add_class_for_work( $classes ) {
		if ( ! is_singular( 'work' ) ) {
			return $classes;
		}

		global $post;

		$classes[] = 'Page__' . $post->post_name;

		return $classes;
	}

	/**
	 * Add Page__{slug} on who-i-am page.
	 *
	 * @param array $classes Body classes.
	 * @return array
	 */
	public function add_class_for_page_who_i_am( $classes ) {
		if ( ! is_page( 'who-i-am' ) ) {
			return $classes;
		}

		global $post;

		$classes[] = 'Page__' . $post->post_name;

		return $classes;
	}
}
