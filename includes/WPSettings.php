<?php
/**
 * WPSettings
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept;

/**
 * Theme supports, menus, textdomain.
 */
class WPSettings implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'after_setup_theme', array( $this, 'load_textdomain' ), 0 );
		add_action( 'after_setup_theme', array( $this, 'add_theme_supports' ) );
		add_action( 'after_setup_theme', array( $this, 'register_nav_menus' ) );
	}

	/**
	 * Load theme textdomain.
	 *
	 * @return void
	 */
	public function load_textdomain(): void {
		load_theme_textdomain( '19h47', get_template_directory() . '/languages' );
	}

	/**
	 * Register theme supports.
	 *
	 * @return void
	 */
	public function add_theme_supports(): void {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);
	}

	/**
	 * Register nav menus.
	 *
	 * @return void
	 */
	public function register_nav_menus(): void {
		register_nav_menus(
			array(
				'main' => __( 'Menu Principal', '19h47' ),
			)
		);
	}
}
