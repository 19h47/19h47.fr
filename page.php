<?php
/**
 * /index
 *
 * @package  	WordPress
 * @subpackage  lecafedelaquarium
 * @author   	Jérémy Levron jeremy@poigneedemainvirile.com
 */

if ( ! class_exists( 'Timber' ) ) {
	echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
	return;
}

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

$templates = array( 'pages/base.twig' );

Timber::render( $templates, $context );