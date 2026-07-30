<?php
/**
 * Front page template.
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context = Timber::context();

Timber::render( 'pages/front-page.html.twig', $context );
