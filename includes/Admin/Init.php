<?php
/**
 * Admin Init
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Admin;

use DixNeufHeureQuaranteSept\Service;

/**
 * Admin customizations.
 */
class Init implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_filter( 'admin_footer_text', array( $this, 'set_admin_footer_text' ) );
	}

	/**
	 * Custom admin footer text.
	 *
	 * @return string
	 */
	public function set_admin_footer_text(): string {
		return __( 'Thank you for creating with <a href="http://www.19h47.fr/" target="_blank">19h47</a>. ✌️', '19h47' );
	}
}
