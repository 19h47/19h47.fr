<?php 

add_filter( 'body_class', 'add_class_for_work' );

function add_class_for_work( $classes ) {
	// var_dump( $classes );

	if( ! is_singular( 'work' ) ) {
		return $classes;
	}

	global $post;

	$classes[] = 'Page__' . $post->post_name;
	
	return $classes; 
}

add_filter( 'body_class', 'add_class_for_page_who_i_am' );

function add_class_for_page_who_i_am( $classes ) {
	if( ! is_page( 'who-i-am' ) ) {
		return $classes;
	}

	global $post;

	$classes[] = 'Page__' . $post->post_name;
	
	return $classes; 
}