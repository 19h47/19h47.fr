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

$template = 'pages/single-work.html.twig';

$context         = Timber::get_context();
$context['post'] = new TimberPost();

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
			$next_object     = isset( $work->posts[ $key - 1 ] ) ? $work->posts[ $key - 1 ] : null;
			$previous_object = isset( $work->posts[ $key + 1 ] ) ? $work->posts[ $key + 1 ] : null;
		}
	}

	if ( null === $next_object ) {
		$next_object = $work->posts[ count( $work->posts ) - 1 ];
	}

	if ( null === $previous_object ) {
		$previous_object = $work->posts[0];
	}

	$context['post']->previous = array(
		'id'    => $previous_object->ID,
		'title' => strip_tags( str_replace( '"', '', $previous_object->post_title ) ),
		'link'  => get_permalink( $previous_object->ID ),
		'color' => get_field( 'color', $previous_object->ID ),
		'slug'  => $previous_object->post_name,
	);

	$context['post']->next = array(
		'id'    => $next_object->ID,
		'title' => strip_tags( str_replace( '"', '', $next_object->post_title ) ),
		'link'  => get_permalink( $next_object->ID ),
		'color' => get_field( 'color', $next_object->ID ),
		'slug'  => $next_object->post_name,
	);
}


Timber::render( $template, $context );
