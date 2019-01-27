<?php
/**
 * Work class
 */
class Work {

	/**
     * The unique identifier of this theme.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $plugin_name    The string used to uniquely identify this theme.
     */
    protected $theme_name;


    /**
     * The version of the theme.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this theme.
     */
    private $theme_version;


	/**
	 * Construct function
	 *
	 * @access public
	 */
	public function __construct( $theme_name, $theme_version ) {
		$this->theme_name = $theme_name;
        $this->theme_version = $theme_version;

        $this->register_post_type();

        add_action( 'init', array( $this, 'register_post_type' ) );
        add_action( 'admin_head', array( $this, 'works_css' ) );
        add_filter( 'dashboard_glance_items', array( $this, 'at_a_glance_works' ) );

        add_filter('pre_get_posts', array( $this, 'pre_get_works' ), 10);
	}


	/**
	 * Register Custom Post Type
	 */
	public function register_post_type() {
		$labels = array(
			'name'                  => __( 'Works', $this->theme_name ),
			'singular_name'         => __( 'Work', $this->theme_name ),
			'menu_name'             => __( 'Works', $this->theme_name ),
			'name_admin_bar'        => __( 'Work', $this->theme_name ),
			'archives'              => __( 'Work Archives', $this->theme_name ),
			'attributes'			=> __( 'Item Attributes', $this->theme_name ),
			'parent_item_colon'     => __( 'Parent Work:', $this->theme_name ),
			'all_items'             => __( 'All works', $this->theme_name ),
			'add_new_item'          => __( 'Add New Work', $this->theme_name ),
			'add_new'               => __( 'Add New', $this->theme_name ),
			'new_item'              => __( 'New Work', $this->theme_name ),
			'edit_item'             => __( 'Edit work', $this->theme_name ),
			'update_item'           => __( 'Update work', $this->theme_name ),
	        'view_item'             => __( 'View Work', $this->theme_name ),
			'view_items'            => __( 'View Works', $this->theme_name ),
			'search_items'          => __( 'Search Work', $this->theme_name ),
			'not_found'             => __( 'Not found', $this->theme_name ),
			'not_found_in_trash'    => __( 'Not found in Trash', $this->theme_name ),
			'featured_image'        => __( 'Featured Image', $this->theme_name ),
			'set_featured_image'    => __( 'Set featured image', $this->theme_name ),
			'remove_featured_image' => __( 'Remove featured image', $this->theme_name ),
			'use_featured_image'    => __( 'Use as featured image', $this->theme_name ),
			'insert_into_item'      => __( 'Insert into work', $this->theme_name ),
			'uploaded_to_this_item' => __( 'Updloaded to this work', $this->theme_name ),
			'items_list'            => __( 'Works list', $this->theme_name ),
			'items_list_navigation' => __( 'Works list navigation', $this->theme_name ),
			'filter_items_list'     => __( 'Filtrer works list', $this->theme_name ),
		);
		$rewrite = array(
	        'slug'          => 'works',
	        'with_front'    => false,
	    );
		$args = array(
			'label'                 => __( 'Work', $this->theme_name ),
			'description'           => __( 'Work description', $this->theme_name ),
			'labels'                => $labels,
			'supports'              => array( 'title', 'editor' ),
			'taxonomies'            => array( 'post_tag' ),
			'hierarchical'          => false,
			'public'                => true,
			'show_ui'               => true,
			'show_in_menu'          => true,
			'menu_position'         => 40,
			'menu_icon'             => 'dashicons-portfolio',
			'show_in_admin_bar'     => true,
			'show_in_nav_menus'     => true,
			'can_export'            => true,
			'has_archive'           => true,
			'rewrite'				=> $rewrite,
			'exclude_from_search'   => false,
			'publicly_queryable'    => true,
			'capability_type'       => 'post',
		);
		register_post_type( 'work', $args );
	}


	function works_css() {
	?>
	    <style>
	        #dashboard_right_now .work-count:before { content: "\f322"; }
	        .widefat .column-featured-image { width: 60px; }
	        .fixed .column-year {
	            width: 10%;
	            text-align: left;
	            vertical-align: top;
	        }
	        .fixed .column-color {
	        	width: 10%;
	        	text-align: center;
	        	vertical-align: top;
	        }
	        .column-color .color-indicator {
	            border: none !important;
	            border-radius: 50% !important;
	            height: 26px !important;
	            margin-left: auto;
	            margin-right: auto;
	        }

	    </style>
	<?php
	}


	/**
	 * "At a glance" items (dashboard widget): add the projects.
	 */
	function at_a_glance_works( $items ) {
	    $post_type = 'work';
	    $post_status = 'publish';

	    $object = get_post_type_object( $post_type );

	    $num_posts = wp_count_posts( $post_type );

	    if ( ! $num_posts || ! isset ( $num_posts->{$post_status} ) || 0 === (int) $num_posts->{$post_status} )
	        return $items;

	    $text = sprintf(
	        _n( '%1$s %4$s%2$s', '%1$s %4$s%3$s', $num_posts->{$post_status} ),
	        number_format_i18n( $num_posts->{$post_status} ),
	        strtolower( $object->labels->singular_name ),
	        strtolower( $object->labels->name ),
	        'pending' === $post_status ? 'Pending ' : ''
	    );
	    if ( current_user_can( $object->cap->edit_posts ) )
	        $items[] = sprintf( '<a class="%1$s-count" href="edit.php?post_status=%2$s&post_type=%1$s">%3$s</a>', $post_type, $post_status, $text );
	    else
	        $items[] = sprintf( '<span class="%1$s-count">%s</span>', $text );

	    return $items;
	}


    /**
     * Pre get works
     *
     * @param  {} $query
     * @return
     */
    function pre_get_works( $query ) {
        if ( ! in_array ( $query->get('post_type'), array( 'work' ) ) ) return false;

        $query->set( 'meta_key', 'year' );
        $query->set( 'orderby', 'meta_value_num' );
        $query->set( 'order', 'DESC' );

        return $query;
    }
}
