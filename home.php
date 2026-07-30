<?php
/**
 * Blog posts index (home).
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context = Timber::context();

Timber::render( 'pages/home-page.html.twig', $context );
