<?php
/**
 * 404 template.
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context = Timber::context();

Timber::render( 'pages/404.html.twig', $context );
