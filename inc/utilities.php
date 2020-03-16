<?php

if ( ! function_exists( 'get_html_class' ) ) :

/**
 * Retrieve the classes for the html element as an array.
 *
 * @param string|array $class One or more classes to add to the class list.
 * @return array Array of classes.
 */
function get_html_class( $class = '' ) {

    $classes = array();

    if ( ! empty( $class ) ) {
        if ( !is_array( $class ) ) {
            $class = preg_split( '#\s+#', $class );
        }
        $classes = array_merge( $classes, $class );
    } else {
        // Ensure that we always coerce class to being an array.
        $class = array();
    }

    $classes = array_map( 'esc_attr', $classes );

    /**
     * Filter the list of CSS html classes for the current post or page.
     *
     * @param array  $classes An array of html classes.
     * @param string $class   A comma-separated list of additional classes added to the html.
     */
    $classes = apply_filters( 'html_class', $classes, $class );

    return array_unique( $classes );
}

endif;

// -----------------------------------------------------------------------------

if ( ! function_exists( 'html_class' ) ) :

    /**
     * Display the classes for the html element.
     *
     * @param string|array $class One or more classes to add to the class list.
     */
    function html_class( $class = '' ) {
        // Separates classes with a single space, collates classes for html element
        echo 'class="' . join( ' ', get_html_class( $class ) ) . '"';
    }

endif;
