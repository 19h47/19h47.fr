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
 * Retrieve data-barba-namespace for Barba.js.
 *
 * @param string $ns Namespace.
 * @return string
 */
function get_barba_namespace( $ns = '' ): string {
	return (string) apply_filters( 'barba_namespace', $ns );
}

/**
 * Return data-title attribute for Barba.js.
 *
 * @return string
 */
function barba_title(): string {
	return 'data-title="' . esc_attr( wp_title( '&raquo;', false ) ) . '"';
}

/**
 * Whether the request comes from Barba.js.
 *
 * @return bool
 */
function is_from_barba(): bool {
	return (
		isset( $_SERVER['HTTP_X_BARBA'] )
		&& 'yes' === strtolower( sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_BARBA'] ) ) )
	);
}
