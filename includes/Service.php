<?php
/**
 * Service contract for theme bootstrap.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept;

/**
 * Service
 */
interface Service {

	/**
	 * Register hooks and run initialization.
	 *
	 * @return void
	 */
	public function run(): void;
}
