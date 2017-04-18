<?php

/**
 * Template Name: Works
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$templates = array( 'pages/works.twig' );

Timber::render( $templates, $context );