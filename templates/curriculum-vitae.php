<?php
/**
 * Template Name: Curriculum Vitae
 *
 * @package DixNeufHeureQuaranteSept
 */

use Timber\Timber;

$context         = Timber::context();
$context['post'] = Timber::get_post();
$templates       = array( 'pages/curriculum-vitae.html.twig' );

Timber::render( $templates, $context );
