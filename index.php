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

	array_unshift( $templates, 'pages/work-single.twig' );
}

// Archive work
if ( is_post_type_archive( 'work' ) ) {

	array_unshift( $templates, 'pages/work-archive.twig' );
}

Timber::render( $templates, $context );