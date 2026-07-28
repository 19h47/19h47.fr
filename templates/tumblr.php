<?php
/**
 * Template Name: Tumblr
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();
$templates       = array( 'pages/tumblr-page.html.twig' );

Timber::render( $templates, $context );
