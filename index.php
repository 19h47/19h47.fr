<?php
/**
 * Main template.
 *
 * @package WordPress
 * @subpackage 19h47
 * @author     Jérémy Levron <jeremyjeremy@19h47.fr> (http://19h47.fr)
 */

use Timber\Timber;

$context         = Timber::context();
$post            = Timber::get_post();
$context['post'] = $post;

// Roles
$roles = get_field( 'role' );

if ( ! empty( $roles ) ) {

	foreach ( $roles as $role ) {
		$context['work']['details']['roles'][] = $role->name;
	}
}

// Clients
$clients = get_field( 'client' );

if ( ! empty( $clients ) ) {

	foreach ( $clients as $client ) {
		$context['work']['details']['clients'][] = $client->name;
	}
}


// Link
$link = get_field( 'link' );

if ( ! empty( $link ) ) {
	$context['work']['details']['link'] = $link;
}


// Repository
$repository = get_field( 'repository' );

if ( ! empty( $repository ) ) {
	$context['work']['details']['repository'] = $repository;
}


$templates = array( 'index.html.twig' );

if ( is_404() ) {
	array_unshift( $templates, 'pages/404.html.twig' );
}

// Single work
if ( is_singular( 'work' ) && $post ) {

	$work = new WP_Query(
		array(
			'post_type'      => 'work',
			'posts_per_page' => -1,
		)
	);

	$next_object     = null;
	$previous_object = null;

	foreach ( $work->posts as $key => $value ) {
		if ( (int) $value->ID === (int) $post->ID ) {
			$next_object     = $work->posts[ $key - 1 ] ?? null;
			$previous_object = $work->posts[ $key + 1 ] ?? null;
		}
	}

	if ( null === $next_object ) {
		$next_object = $work->posts[ count( $work->posts ) - 1 ];
	}

	if ( null === $previous_object ) {
		$previous_object = $work->posts[0];
	}

	$context['work']['previous'] = array(
		'id'    => $previous_object->ID,
		'title' => wp_strip_all_tags( str_replace( '"', '', $previous_object->post_title ) ),
		'link'  => get_permalink( $previous_object->ID ),
		'color' => get_field( 'color', $previous_object->ID ),
		'slug'  => $previous_object->post_name,
	);

	$context['work']['next'] = array(
		'id'    => $next_object->ID,
		'title' => wp_strip_all_tags( str_replace( '"', '', $next_object->post_title ) ),
		'link'  => get_permalink( $next_object->ID ),
		'color' => get_field( 'color', $next_object->ID ),
		'slug'  => $next_object->post_name,
	);

	array_unshift( $templates, 'pages/single-work.html.twig' );
}

// Archive work
if ( is_post_type_archive( 'work' ) ) {
	array_unshift( $templates, 'pages/work-archive.html.twig' );
}

// Home
if ( is_home() ) {
	array_unshift( $templates, 'pages/thoughts.html.twig' );
}

Timber::render( $templates, $context );
