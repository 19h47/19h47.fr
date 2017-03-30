<?php

/**
 * Template Name: What I currently listening
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$templates = array( 'pages/what-i-currently-listening.twig' );

Timber::render( $templates, $context );