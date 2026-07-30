<?php
/**
 * ACF Init.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Plugins\ACF;

use DixNeufHeureQuaranteSept\Service;

/**
 * ACF options pages registration.
 */
class Init implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'acf/init', array( $this, 'add_options_pages' ) );
	}

	/**
	 * Adds the theme options page.
	 *
	 * @return void
	 */
	public function add_options_pages(): void {
		if ( ! function_exists( 'acf_add_options_page' ) ) {
			return;
		}

		acf_add_options_page(
			array(
				'page_title'  => __( 'Theme', '19h47' ),
				'menu_title'  => __( 'Theme', '19h47' ),
				'menu_slug'   => 'options-theme',
				'parent_slug' => 'options-general.php',
				'redirect'    => false,
			)
		);
	}
}
