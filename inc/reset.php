<?php

// disable loading of stylesheets and scripts from Contact Form 7 plugin
// add_filter( 'wpcf7_load_js', '__return_false' );
add_filter( 'wpcf7_load_css', '__return_false' );
// remove Get Shortlink
add_filter( 'pre_get_shortlink', '__return_empty_string' );
// Disable Canonical meta from Yoast SEO Plugin
add_filter( 'wpseo_canonical', '__return_false' );

// -----------------------------------------------------------------------------

/**
 * Disable emojicons.
 * @see http://wordpress.stackexchange.com/questions/185577/disable-emojicons-introduced-with-wp-4-2
 */
function disable_wp_emojicons() {

  // all actions related to emojis
  remove_action( 'admin_print_styles', 'print_emoji_styles' );
  remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
  remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
  remove_action( 'wp_print_styles', 'print_emoji_styles' );
  remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
  remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
  remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );

  // filter to remove TinyMCE emojis
  add_filter( 'tiny_mce_plugins', 'disable_emojicons_tinymce' );
}
if ( ! is_admin() ) {
  add_action( 'init', 'disable_wp_emojicons' );
}

// -----------------------------------------------------------------------------

/**
 * Remove unnecessary metas from <head>.
 */
function remove_some_metas() {

    remove_action( 'wp_head', 'rsd_link' );
    remove_action( 'wp_head', 'wlwmanifest_link' );
    remove_action( 'wp_head', 'wp_shortlink_wp_head' );
    remove_action( 'wp_head', 'wp_generator' );
    remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
    remove_action( 'wp_head', 'rest_output_link_wp_head' );
    remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
    remove_action( 'wp_head', 'rel_canonical' );
}

add_action( 'after_setup_theme', 'remove_some_metas' );

// -----------------------------------------------------------------------------