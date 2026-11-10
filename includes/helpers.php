<?php
/**
 * WordPress helpers (Composer "files" autoload).
 *
 * @package DixNeufHeureQuaranteSept
 */

/**
 * Theme text domain from style.css.
 *
 * @return string
 */
function get_theme_text_domain(): string {
	$domain = wp_get_theme()->get( 'TextDomain' );

	return $domain ? (string) $domain : '19h47';
}

/**
 * Retrieve the classes for the html element as an array.
 *
 * @param string|array $c One or more classes to add to the class list.
 * @return array
 */
function get_html_class( $c = '' ): array {
	$classes = array();

	if ( ! empty( $c ) ) {
		if ( ! is_array( $c ) ) {
			$c = preg_split( '#\s+#', $c );
		}
		$classes = array_merge( $classes, $c );
	} else {
		$c = array();
	}

	$classes = array_map( 'esc_attr', $classes );
	$classes = apply_filters( 'html_class', $classes, $c );

	return array_unique( $classes );
}

/**
 * Return the classes attribute for the html element.
 *
 * @param string|array $c One or more classes to add to the class list.
 * @return string
 */
function html_class( $c = '' ): string {
	return 'class="' . join( ' ', get_html_class( $c ) ) . '"';
}

/**
 * Retrieve the current page namespace.
 *
 * @param string $ns Namespace.
 * @return string
 */
function get_namespace( $ns = '' ): string {
	return (string) apply_filters( 'theme_namespace', $ns );
}
