<?php
/**
 * Template Name: What I'm currently listening to
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();
$templates       = array( 'pages/what-im-currently-listening-to.html.twig' );

Timber::render( $templates, $context );
