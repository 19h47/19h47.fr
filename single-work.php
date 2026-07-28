<?php
/**
 * Single work template.
 *
 * @package    WordPress
 * @subpackage 19h47
 * @author     Jérémy Levron <jeremyjeremy@19h47.fr> (http://19h47.fr)
 */

use Timber\Timber;

$template        = 'pages/single-work.html.twig';
$context         = Timber::context();
$post            = Timber::get_post();
$context['post'] = $post;

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

	$context['post']->previous = array(
		'id'    => $previous_object->ID,
		'title' => wp_strip_all_tags( str_replace( '"', '', $previous_object->post_title ) ),
		'link'  => get_permalink( $previous_object->ID ),
		'color' => get_field( 'color', $previous_object->ID ),
		'slug'  => $previous_object->post_name,
	);

	$context['post']->next = array(
		'id'    => $next_object->ID,
		'title' => wp_strip_all_tags( str_replace( '"', '', $next_object->post_title ) ),
		'link'  => get_permalink( $next_object->ID ),
		'color' => get_field( 'color', $next_object->ID ),
		'slug'  => $next_object->post_name,
	);
}

Timber::render( $template, $context );
