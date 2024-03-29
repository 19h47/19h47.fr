<?php
/**
 * /index
 *
 * @package     WordPress
 * @subpackage  19h47
 * @author      Jérémy Levron <jeremyjeremy@19h47.fr> (http://19h47.fr)
 */

if ( ! class_exists( 'Timber' ) ) {
	echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
	return;
}

$context         = Timber::get_context();
$post            = new TimberPost();
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


$templates = array( 'index.twig' );

if ( is_404() ) {
	array_unshift( $templates, 'pages/404.twig' );
}

// Single work
if ( is_singular( 'work' ) ) {

	$work = new WP_Query(
		array(
			'post_type'      => 'work',
			'posts_per_page' => -1,
		)
	);

	foreach ( $work->posts as $key => $value ) {
		if ( $value->ID === $post->ID ) {
			$next_object     = $work->posts[ $key - 1 ];
			$previous_object = $work->posts[ $key + 1 ];
		}
	}

	if ( $next_object === null ) {
		$next_object = $work->posts[ count( $work->posts ) - 1 ];
	}

	if ( $previous_object === null ) {
		$previous_object = $work->posts[0];
	}

	$context['work']['previous'] = array(
		'id'    => $previous_object->ID,
		'title' => strip_tags( str_replace( '"', '', $previous_object->post_title ) ),
		'link'  => get_permalink( $previous_object->ID ),
		'color' => get_field( 'color', $previous_object->ID ),
		'slug'  => $previous_object->post_name,
	);

	$context['work']['next'] = array(
		'id'    => $next_object->ID,
		'title' => strip_tags( str_replace( '"', '', $next_object->post_title ) ),
		'link'  => get_permalink( $next_object->ID ),
		'color' => get_field( 'color', $next_object->ID ),
		'slug'  => $next_object->post_name,
	);

	array_unshift( $templates, 'pages/work-single.twig' );
}

// Archive work
if ( is_post_type_archive( 'work' ) ) {
	array_unshift( $templates, 'pages/work-archive.twig' );
}

// Home
if ( is_home() ) {
	array_unshift( $templates, 'pages/thoughts.twig' );
}

Timber::render( $templates, $context );
