<?php
/**
 * Theme functions and definitions.
 *
 * @package DixNeufHeureQuaranteSept
 */

require_once get_template_directory() . '/vendor/autoload.php';

use Timber\Timber;

Timber::init();
Timber::$locations = array( 'views', 'dist' );

DixNeufHeureQuaranteSept\Init::run_services();
