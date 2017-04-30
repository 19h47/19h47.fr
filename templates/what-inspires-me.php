<?php

/**
 * Template Name: What inspires me
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$templates = array( 'pages/what-inspires-me.twig' );

Timber::render( $templates, $context );