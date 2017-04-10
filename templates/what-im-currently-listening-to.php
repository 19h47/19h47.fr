<?php

/**
 * Template Name: What I'm currently listening to
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$templates = array( 'pages/what-im-currently-listening-to.twig' );

Timber::render( $templates, $context );