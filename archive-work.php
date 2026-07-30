<?php
/**
 * Work archive template.
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context = Timber::context();

Timber::render( 'pages/archive-work.html.twig', $context );
