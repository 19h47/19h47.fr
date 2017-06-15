<?php

/**
 * Template Name: Curriculum Vitae
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$templates = array( 'pages/curriculum-viate.twig' );

Timber::render( $templates, $context );