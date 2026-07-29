<?php
/**
 * Template Name: Last.fm
 *
 * @package DixNeufHeureQuaranteSept
 */

use DixNeufHeureQuaranteSept\Post\Lastfm;
use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();

$limit = 50;
$feed  = ( new Lastfm() )->get_feed( $limit );

$context['lastfm_feed'] = is_wp_error( $feed ) ? null : $feed;
$templates              = array( 'pages/lastfm-page.html.twig' );

Timber::render( $templates, $context );
