<?php
/**
 * Work CPT
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Post;

use DixNeufHeureQuaranteSept\Service;
use function get_theme_text_domain;

/**
 * Work
 */
class Work implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'init', array( $this, 'register_post_type' ) );
		add_action( 'init', array( $this, 'register_taxonomy' ) );
		add_action( 'admin_head', array( $this, 'work_css' ) );
		add_action( 'manage_work_posts_custom_column', array( $this, 'render_custom_columns' ), 10, 2 );
		add_filter( 'dashboard_glance_items', array( $this, 'at_a_glance_work' ) );
		add_filter( 'manage_work_posts_columns', array( $this, 'add_custom_columns' ) );
		add_filter( 'pre_get_posts', array( $this, 'pre_get_work' ), 10 );
		add_action( 'wp_head', array( $this, 'work_styles' ), 99 );
		add_action( 'save_post_work', array( $this, 'clear_transient_for_work_styles' ), 10, 3 );
	}

	/**
	 * Register Custom Post Type.
	 *
	 * @return void
	 */
	public function register_post_type(): void {
		$theme = get_theme_text_domain();

		$labels = array(
			'name'                  => __( 'Work', $theme ),
			'singular_name'         => __( 'Work', $theme ),
			'menu_name'             => __( 'Work', $theme ),
			'name_admin_bar'        => __( 'Work', $theme ),
			'archives'              => __( 'Work Archives', $theme ),
			'attributes'            => __( 'Item Attributes', $theme ),
			'parent_item_colon'     => __( 'Parent Work:', $theme ),
			'all_items'             => __( 'All work', $theme ),
			'add_new_item'          => __( 'Add New Work', $theme ),
			'add_new'               => __( 'Add New', $theme ),
			'new_item'              => __( 'New Work', $theme ),
			'edit_item'             => __( 'Edit work', $theme ),
			'update_item'           => __( 'Update work', $theme ),
			'view_item'             => __( 'View Work', $theme ),
			'view_items'            => __( 'View Work', $theme ),
			'search_items'          => __( 'Search Work', $theme ),
			'not_found'             => __( 'Not found', $theme ),
			'not_found_in_trash'    => __( 'Not found in Trash', $theme ),
			'featured_image'        => __( 'Featured Image', $theme ),
			'set_featured_image'    => __( 'Set featured image', $theme ),
			'remove_featured_image' => __( 'Remove featured image', $theme ),
			'use_featured_image'    => __( 'Use as featured image', $theme ),
			'insert_into_item'      => __( 'Insert into work', $theme ),
			'uploaded_to_this_item' => __( 'Updloaded to this work', $theme ),
			'items_list'            => __( 'Work list', $theme ),
			'items_list_navigation' => __( 'Work list navigation', $theme ),
			'filter_items_list'     => __( 'Filtrer work list', $theme ),
		);

		$args = array(
			'label'               => __( 'Work', $theme ),
			'description'         => __( 'Work description', $theme ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor' ),
			'taxonomies'          => array( 'post_tag', 'stack' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 40,
			'menu_icon'           => 'dashicons-portfolio',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'can_export'          => true,
			'has_archive'         => true,
			'rewrite'             => array(
				'slug'       => 'work',
				'with_front' => false,
			),
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
		);

		register_post_type( 'work', $args );
	}

	/**
	 * Register stack taxonomy.
	 *
	 * @return void
	 */
	public function register_taxonomy(): void {
		$theme = get_theme_text_domain();

		$labels = array(
			'name'                       => __( 'Stack', $theme ),
			'singular_name'              => __( 'Stack', $theme ),
			'search_items'               => __( 'Search Stack', $theme ),
			'popular_items'              => __( 'Popular Stack', $theme ),
			'all_items'                  => __( 'All Stack', $theme ),
			'edit_item'                  => __( 'Edit Stack', $theme ),
			'update_item'                => __( 'Update Stack', $theme ),
			'add_new_item'               => __( 'Add New Stack', $theme ),
			'new_item_name'              => __( 'New Stack Name', $theme ),
			'separate_items_with_commas' => __( 'Separate stack items with commas', $theme ),
			'add_or_remove_items'        => __( 'Add or remove stack', $theme ),
			'choose_from_most_used'      => __( 'Choose from the most used stack', $theme ),
			'not_found'                  => __( 'No stack found', $theme ),
			'menu_name'                  => __( 'Stack', $theme ),
		);

		register_taxonomy(
			'stack',
			array( 'work' ),
			array(
				'labels'             => $labels,
				'hierarchical'       => false,
				'public'             => false,
				'show_ui'            => true,
				'show_admin_column'  => true,
				'show_in_nav_menus'  => false,
				'show_tagcloud'      => false,
				'show_in_rest'       => true,
				'meta_box_cb'        => false,
				'rewrite'            => false,
				'publicly_queryable' => false,
			)
		);
	}

	/**
	 * Admin CSS for work CPT.
	 *
	 * @return void
	 */
	public function work_css(): void {
		?>
		<style>
			#dashboard_right_now .work-count:before { content: "\f322"; }
			.fixed .column-color {
				width: 60px;
				text-align: center;
				vertical-align: middle;
			}
			.column-color .color-indicator {
				border: none !important;
				border-radius: 50% !important;
				display: block;
				height: 26px !important;
				margin-left: auto;
				margin-right: auto;
				width: 26px;
			}
		</style>
		<?php
	}

	/**
	 * Add custom columns.
	 *
	 * @param array $columns Columns.
	 * @return array
	 *
	 * @link https://developer.wordpress.org/reference/hooks/manage_post_type_posts_columns/
	 */
	public function add_custom_columns( array $columns ): array {
		$new_columns = array();

		foreach ( $columns as $key => $value ) {
			if ( 'title' === $key ) {
				$new_columns['color'] = __( 'Color', get_theme_text_domain() );
			}

			$new_columns[ $key ] = $value;
		}

		return $new_columns;
	}

	/**
	 * Render custom columns.
	 *
	 * @param string $column_name Column name.
	 * @param int    $post_id     Post ID.
	 * @return void
	 *
	 * @link https://developer.wordpress.org/reference/hooks/manage_post-post_type_posts_custom_column/
	 */
	public function render_custom_columns( string $column_name, int $post_id ): void {
		if ( 'color' !== $column_name ) {
			return;
		}

		$color = get_field( 'color', $post_id );

		if ( ! $color ) {
			echo '—';
			return;
		}

		printf(
			'<span class="color-indicator" style="background-color: %s;" title="%s"></span>',
			esc_attr( $color ),
			esc_attr( $color )
		);
	}

	/**
	 * At a glance widget: work count.
	 *
	 * @param array $items Glance items.
	 * @return array
	 */
	public function at_a_glance_work( $items ) {
		$post_type   = 'work';
		$post_status = 'publish';
		$object      = get_post_type_object( $post_type );
		$num_posts   = wp_count_posts( $post_type );

		if ( ! $num_posts || ! isset( $num_posts->{$post_status} ) || 0 === (int) $num_posts->{$post_status} ) {
			return $items;
		}

		$text = sprintf(
			_n( '%1$s %4$s%2$s', '%1$s %4$s%3$s', $num_posts->{$post_status} ),
			number_format_i18n( $num_posts->{$post_status} ),
			strtolower( $object->labels->singular_name ),
			strtolower( $object->labels->name ),
			'pending' === $post_status ? 'Pending ' : ''
		);

		if ( current_user_can( $object->cap->edit_posts ) ) {
			$items[] = sprintf( '<a class="%1$s-count" href="edit.php?post_status=%2$s&post_type=%1$s">%3$s</a>', $post_type, $post_status, $text );
		} else {
			$items[] = sprintf( '<span class="%1$s-count">%s</span>', $text );
		}

		return $items;
	}

	/**
	 * Order work by date meta (Ymd in DB; front returns year only).
	 *
	 * @param \WP_Query $query Query.
	 * @return \WP_Query|false
	 */
	public function pre_get_work( $query ) {
		if ( ! in_array( $query->get( 'post_type' ), array( 'work' ), true ) ) {
			return false;
		}

		$query->set( 'meta_key', 'year' );
		$query->set(
			'orderby',
			array(
				'meta_value_num' => 'DESC',
				'ID'             => 'DESC',
			)
		);

		return $query;
	}

	/**
	 * Inline CSS for work colors (transient-cached).
	 *
	 * @return void
	 */
	public function work_styles(): void {
		$transient_id = get_theme_text_domain() . '_work_styles';
		$html         = get_transient( $transient_id );

		if ( false === $html ) {
			$work = get_posts(
				array(
					'post_type'   => 'work',
					'numberposts' => -1,
				)
			);

			if ( $work ) {
				ob_start();
				?>
				<style>
					<?php
					foreach ( $work as $project ) :
						$color = get_field( 'color', $project );
						if ( $color ) :
							?>
							.Page__<?php echo esc_attr( $project->post_name ); ?>,
							.Transition .js-to-<?php echo esc_attr( $project->post_name ); ?> { background-color: <?php echo esc_attr( $color ); ?> }
							<?php
						endif;
					endforeach;
					?>
				</style>
				<?php
				$html = ob_get_clean();
				$html = str_replace( array( "\r\n", "\r", "\n", "\t", ' ' ), '', $html );
				set_transient( $transient_id, $html, 30 * DAY_IN_SECONDS );
			}
		}

		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Clear work styles transient on save.
	 *
	 * @return void
	 */
	public function clear_transient_for_work_styles(): void {
		delete_transient( get_theme_text_domain() . '_work_styles' );
	}
}
