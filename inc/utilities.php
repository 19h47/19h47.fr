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

// -----------------------------------------------------------------------------

if ( ! function_exists( 'get_boundary_post_for_type' ) ) :

/**
 * Retrieve boundary post for custom post types.
 *
 * Boundary being either the first or last post by publish date within the constraints specified
 * by $in_same_term or $excluded_terms.
 *
 * Should be added soon in WP Core. https://core.trac.wordpress.org/ticket/27094
 *
 * @param string       $type           Optional. Post type.
 * @param bool         $in_same_term   Optional. Whether returned post should be in a same taxonomy term.
 * @param array|string $excluded_terms Optional. Array or comma-separated list of excluded term IDs.
 * @param bool         $start          Optional. Whether to retrieve first or last post.
 * @param string       $taxonomy       Optional. Taxonomy, if $in_same_term is true. Default 'category'.
 * @return null|array Array containing the boundary post object if successful, null otherwise.
 */
function get_boundary_post_for_type( $type = null, $in_same_term = false, $excluded_terms = '', $start = true, $taxonomy = 'category' ) {
    $post = get_post();
    if ( ! $post || ! is_single() || is_attachment() || ! taxonomy_exists( $taxonomy ) ) {
        return null;
    }

    $query_args = array(
        'numberposts'            => 1,
        'order'                  => $start ? 'ASC' : 'DESC',
        'update_post_term_cache' => false,
        'update_post_meta_cache' => false,
        'suppress_filters'       => false,
    );

    if ( ! $type ) {
        $type = get_post_type( $post );
    }

    if ( $type ) {
        $query_args['post_type'] = $type;
    }

    $term_array = array();

    if ( ! is_array( $excluded_terms ) ) {
        if ( ! empty( $excluded_terms ) ) {
            $excluded_terms = explode( ',', $excluded_terms );
        } else {
            $excluded_terms = array();
        }
    }

    if ( $in_same_term || ! empty( $excluded_terms ) ) {
        if ( $in_same_term ) {
            $term_array = wp_get_object_terms( $post->ID, $taxonomy, array( 'fields' => 'ids' ) );
        }

        if ( ! empty( $excluded_terms ) ) {
            $excluded_terms = array_map( 'intval', $excluded_terms );
            $excluded_terms = array_diff( $excluded_terms, $term_array );

            $inverse_terms = array();
            foreach ( $excluded_terms as $excluded_term ) {
                $inverse_terms[] = $excluded_term * -1;
            }
            $excluded_terms = $inverse_terms;
        }

        $query_args[ 'tax_query' ] = array( array(
            'taxonomy' => $taxonomy,
            'terms' => array_merge( $term_array, $excluded_terms )
        ) );
    }

    return get_posts( $query_args );
}

endif;