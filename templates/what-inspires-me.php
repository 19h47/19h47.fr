<?php
/**
 * Template Name: What inspires me
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();
$templates       = array( 'pages/what-inspires-me.html.twig' );

Timber::render( $templates, $context );
