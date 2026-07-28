<?php
/**
 * Reset
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept;

/**
 * Cleanup default WordPress / plugin head noise.
 */
class Reset implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_filter( 'wpcf7_load_css', '__return_false' );
		add_filter( 'pre_get_shortlink', '__return_empty_string' );
		add_filter( 'wpseo_canonical', '__return_false' );

		add_action( 'after_setup_theme', array( $this, 'remove_some_metas' ) );

		if ( ! is_admin() ) {
			add_action( 'init', array( $this, 'disable_wp_emojicons' ) );
		}
	}

	/**
	 * Disable emojicons.
	 *
	 * @return void
	 */
	public function disable_wp_emojicons(): void {
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );

		add_filter( 'tiny_mce_plugins', array( $this, 'disable_emojicons_tinymce' ) );
	}

	/**
	 * Disable emojicons in TinyMCE.
	 *
	 * @param array $plugins TinyMCE plugins.
	 * @return array
	 */
	public function disable_emojicons_tinymce( $plugins ) {
		if ( is_array( $plugins ) ) {
			return array_diff( $plugins, array( 'wpemoji' ) );
		}

		return array();
	}

	/**
	 * Remove unnecessary metas from head.
	 *
	 * @return void
	 */
	public function remove_some_metas(): void {
		remove_action( 'wp_head', 'rsd_link' );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'wp_shortlink_wp_head' );
		remove_action( 'wp_head', 'wp_generator' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
		remove_action( 'wp_head', 'rest_output_link_wp_head' );
		remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
		remove_action( 'wp_head', 'rel_canonical' );
	}
}
