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

$templates = array( 'pages/404.twig' );

Timber::render( $templates, $context );