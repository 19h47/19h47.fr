<?php
/**
 * /index
 *
 * @package  	WordPress
 * @subpackage  19h47
 * @author   	Jérémy Levron jeremy@poigneedemainvirile.com
 */

if ( ! class_exists( 'Timber' ) ) {
	echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
	return;
}

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

// Roles
$roles = get_field( 'role' );

if ( ! empty( $roles ) ) {

	foreach ($roles as $role ) {
		$context['work']['details']['roles'][] = $role->name;
	}
}

// Clients
$clients = get_field( 'client' );

if( ! empty( $clients ) ) {

	foreach ( $clients as $client ) {
		$context['work']['details']['clients'][] = $client->name;
	}
}


// Link
$link = get_field( 'link' );

if( ! empty( $link ) ) {

	$context['work']['details']['link'] = $link;
}


$templates = array( 'index.twig' );

if ( is_404() ) {

	array_unshift( $templates, 'pages/404.twig' );
}

// Single work
if ( is_singular( 'work' ) ) {

	// Previous post
	$previous_object = get_previous_post();

	// If post hasn't previous post
	if( empty( $previous_object ) ) {
		
	  	// Retrieve the first
	  	$previous_object = get_boundary_post_for_type( get_post_type(), false, '', false )[0];	   
	}

    $context['work']['previous']['id'] = $previous_object->ID;
    $context['work']['previous']['title'] = strip_tags( str_replace( '"', '', $previous_object->post_title ) );
    $context['work']['previous']['link'] = get_permalink( $previous_object->ID );
    $context['work']['previous']['color'] = get_field( 'color', $previous_object->ID );
    $context['work']['previous']['slug'] = $previous_object->post_name;


	// Next post
	$next_object = get_next_post();

	// If post hasn't next post
	if( empty( $next_object ) ) {

		// Retrieve the last
		$next_object = get_boundary_post_for_type( get_post_type(), false, '', true )[0];
	}

	$context['work']['next']['id'] = $next_object->ID;
	$context['work']['next']['title'] = strip_tags( str_replace( '"', '', $next_object->post_title ) );
	$context['work']['next']['link'] = get_permalink( $next_object->ID );
	$context['work']['next']['color'] = get_field( 'color', $next_object->ID );
	$context['work']['next']['slug'] = $next_object->post_name;

	array_unshift( $templates, 'pages/work-single.twig' );
}

// Archive work
if ( is_post_type_archive( 'work' ) ) {

	array_unshift( $templates, 'pages/work-archive.twig' );
}

Timber::render( $templates, $context );