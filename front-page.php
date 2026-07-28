<?php
/**
 * Front page template.
 *
 * @package    WordPress
 * @subpackage 19h47
 * @author     Jérémy Levron <jeremyjeremy@19h47.fr> (http://19h47.fr)
 */

use Timber\Timber;

$context                  = Timber::context();
$context['is_front_page'] = true;
$context['posts']         = Timber::get_posts();
$templates                = array( 'pages/front-page.html.twig' );

Timber::render( $templates, $context );
