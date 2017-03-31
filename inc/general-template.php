<?php
/**
 * Filters the text of the page title.
 *
 *
 * @param 	string 	$title 			Page title.
 * @param 	string 	$sep 			Title separator.
 * @param 	string 	$seplocation 	Location of the separator (left or right).
 */
add_filter( 'document_title_parts',  'document_title_parts_custom' );

function document_title_parts_custom( $title ) {
	
	$title['title'] = get_the_title(); 
	$title['page'] = '';
	$title['tagline'] = '';
	$title['site'] = '';

	return $title;
}