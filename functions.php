<?php
/**
 * 19h47 functions and definitions
 *
 * @package DixNeufHeureQuaranteSept
 * @author  Jérémy Levron <jeremylevron@19h47.fr> (https://19h47.fr)
 */

require_once get_template_directory() . '/vendor/autoload.php';

use Timber\Timber;

Timber::init();
Timber::$locations = array( 'views', 'dist' );

DixNeufHeureQuaranteSept\Init::run_services();
