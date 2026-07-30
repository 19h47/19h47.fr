<?php
/**
 * Theme options ACF fields.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Plugins\ACF\IncludeFields;

use DixNeufHeureQuaranteSept\Service;

/**
 * Fields for the theme options page (Settings > Theme).
 */
class ThemeFields implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'acf/include_fields', array( $this, 'fields' ) );
	}

	/**
	 * Registers the field group.
	 *
	 * @return void
	 */
	public function fields(): void {
		$key = 'theme';

		$location = array(
			array(
				array(
					'param'    => 'options_page',
					'operator' => '==',
					'value'    => 'options-theme',
				),
			),
		);

		$fields = array(
			array(
				'key'        => 'field_' . $key . '_pages',
				'label'      => __( 'Pages', '19h47' ),
				'name'       => 'pages',
				'aria-label' => __( 'Pages', '19h47' ),
				'type'       => 'group',
				'layout'     => 'block',
				'sub_fields' => array(
					array(
						'key'           => 'field_' . $key . '_pages_about',
						'label'         => __( 'About', '19h47' ),
						'name'          => 'about',
						'aria-label'    => __( 'About', '19h47' ),
						'type'          => 'post_object',
						'post_type'     => array( 'page' ),
						'return_format' => 'id',
						'allow_null'    => 1,
						'ui'            => 1,
					),
					array(
						'key'           => 'field_' . $key . '_pages_lastfm',
						'label'         => __( 'Last.fm', '19h47' ),
						'name'          => 'lastfm',
						'aria-label'    => __( 'Last.fm', '19h47' ),
						'type'          => 'post_object',
						'post_type'     => array( 'page' ),
						'return_format' => 'id',
						'allow_null'    => 1,
						'ui'            => 1,
					),
					array(
						'key'           => 'field_' . $key . '_pages_tumblr',
						'label'         => __( 'Tumblr', '19h47' ),
						'name'          => 'tumblr',
						'aria-label'    => __( 'Tumblr', '19h47' ),
						'type'          => 'post_object',
						'post_type'     => array( 'page' ),
						'return_format' => 'id',
						'allow_null'    => 1,
						'ui'            => 1,
					),
				),
			),
		);

		if ( ! function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		acf_add_local_field_group(
			array(
				'key'                   => 'group_' . $key,
				'title'                 => __( 'Theme', '19h47' ),
				'fields'                => $fields,
				'location'              => $location,
				'menu_order'            => 0,
				'position'              => 'normal',
				'style'                 => 'default',
				'label_placement'       => 'top',
				'instruction_placement' => 'label',
				'active'                => true,
			)
		);
	}
}
