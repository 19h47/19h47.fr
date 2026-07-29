<?php
/**
 * Template Name: Tumblr
 *
 * @package DixNeufHeureQuaranteSept
 */

use DixNeufHeureQuaranteSept\Post\Tumblr;
use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();

$per_page = 20;
$feed     = ( new Tumblr() )->get_feed( 0, $per_page );

$context['tumblr_feed'] = is_wp_error( $feed ) ? null : $feed;
$templates              = array( 'pages/tumblr-page.html.twig' );

Timber::render( $templates, $context );
