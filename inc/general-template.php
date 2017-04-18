<?php
/**
 * Filters the text of the page title.
 *
 *
 * @param 	string 	$title 			Page title.
 * @param 	string 	$sep 			Title separator.
 * @param 	string 	$seplocation 	Location of the separator (left or right).
 */
// add_filter( 'document_title_parts',  'document_title_parts_custom' );

function document_title_parts_custom( $title ) {

	$output = get_the_title();

	// If it's a 404 page
	if ( is_404() ) {
		$output = __( 'Page not found' );
	}
	
	$title['title'] = $output; 
	$title['page'] = '';
	$title['tagline'] = '';
	$title['site'] = '';

	return $title;
}