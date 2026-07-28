<?php
/**
 * Template Name: Last.fm
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();
$templates       = array( 'pages/lastfm-page.html.twig' );

Timber::render( $templates, $context );
