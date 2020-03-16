<?php
/**
 * /front-page
 * 
 * @package  	WordPress
 * @subpackage  19h47
 * @author  	Jérémy Levron <jeremyjeremy@19h47.fr> (http://19h47.fr)
 */
if ( ! class_exists( 'Timber' ) ) {
	echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
	return;
}
$context['is_front_page'] = true;
$context = Timber::get_context();
$context['posts'] = Timber::get_posts();
$templates = array( 'pages/front-page.twig' );

Timber::render( $templates, $context );