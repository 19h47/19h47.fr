<?php

/**
 * Template Name: What I do
 */

 $context = Timber::get_context();
 $post = new TimberPost();
 $context['post'] = $post;

 $templates = array( 'pages/what-i-do.twig' );

 Timber::render( $templates, $context );