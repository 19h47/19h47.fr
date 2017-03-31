<?php

// -----------------------------------------------------------------------------

if ( ! function_exists( 'get_barba_namespace' ) ) :

/**
 * Retrieve data-namespace for Barba.js.
 * 
 * @return  string
 * @author  Julien Vasseur julien@poigneedemainvirile.com
 */
function get_barba_namespace( $ns = '' ) {
    /**
     * Filter the namespace for the current post or page.
     *
     * @param string $ns Given namespace as parameter.
     */
    $ns = apply_filters( 'barba_namespace', $ns );

    return $ns;
}

endif;

// -----------------------------------------------------------------------------

if ( ! function_exists( 'barba_namespace' ) ) :

/**
 * Display data-namespace for Barba.js.
 * 
 * @return  string
 * @author  Julien Vasseur julien@poigneedemainvirile.com
 */
function barba_namespace( $ns = '' ) {
    $ns = get_barba_namespace( $ns );

    if ( empty( $ns ) ) {
        return;
    }

    echo 'data-namespace="' . $ns . '"';
}

endif;

// -----------------------------------------------------------------------------

if ( ! function_exists( 'barba_title' ) ) :

/**
 * Display data-title for Barba.js.
 * Usefull when using custom HTTP header to return only container.
 * 
 * @return  string
 * @author  Julien Vasseur julien@poigneedemainvirile.com
 */
function barba_title() {
    echo 'data-title="' . wp_title( '&raquo;', false ) . '"';
}

endif;

// -----------------------------------------------------------------------------

if ( ! function_exists( 'is_from_barba' ) ) :

/**
 * Check if a meta variable from Barba.js exists in current HTTP headers.
 * 
 * @return  boolean
 * @author  Julien Vasseur julien@poigneedemainvirile.com
 */
function is_from_barba() {
    return (
        isset( $_SERVER ) && 
        isset( $_SERVER['HTTP_X_BARBA'] ) && 
        'yes' === strtolower( $_SERVER['HTTP_X_BARBA'] )
    );
}

endif; 