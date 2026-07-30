<?php
/**
 * Main template.
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$data = Timber::context();

Timber::render( array( 'index.html.twig' ), $data );
