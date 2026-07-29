<?php
/**
 * Work details ACF fields.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Plugins\ACF\IncludeFields;

use DixNeufHeureQuaranteSept\Service;

/**
 * Side meta for the work post type.
 */
class WorkDetailsFields implements Service {

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
		$key = 'work_details';

		$location = array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'work',
				),
			),
		);

		$fields = array(
			array(
				'key'            => 'field_58f396e002937',
				'label'          => __( 'Year', '19h47' ),
				'name'           => 'year',
				'aria-label'     => __( 'Year', '19h47' ),
				'type'           => 'date_picker',
				'display_format' => 'Y',
				'return_format'  => 'Y',
				'first_day'      => 1,
			),
			array(
				'key'        => 'field_58f3970702938',
				'label'      => __( 'Color', '19h47' ),
				'name'       => 'color',
				'aria-label' => __( 'Color', '19h47' ),
				'type'       => 'color_picker',
			),
			array(
				'key'           => 'field_58f3b4fa5b54f',
				'label'         => __( 'Client', '19h47' ),
				'name'          => 'client',
				'aria-label'    => __( 'Client', '19h47' ),
				'type'          => 'taxonomy',
				'taxonomy'      => 'post_tag',
				'field_type'    => 'multi_select',
				'allow_null'    => 0,
				'add_term'      => 1,
				'save_terms'    => 1,
				'load_terms'    => 0,
				'return_format' => 'object',
				'multiple'      => 0,
			),
			array(
				'key'           => 'field_58f3b55b5cbc8',
				'label'         => __( 'Role', '19h47' ),
				'name'          => 'role',
				'aria-label'    => __( 'Role', '19h47' ),
				'type'          => 'taxonomy',
				'taxonomy'      => 'post_tag',
				'field_type'    => 'multi_select',
				'allow_null'    => 0,
				'add_term'      => 1,
				'save_terms'    => 1,
				'load_terms'    => 0,
				'return_format' => 'object',
				'multiple'      => 0,
			),
			array(
				'key'           => 'field_68b0c1a2d4e01',
				'label'         => __( 'Stack', '19h47' ),
				'name'          => 'stack',
				'aria-label'    => __( 'Stack', '19h47' ),
				'type'          => 'taxonomy',
				'taxonomy'      => 'stack',
				'field_type'    => 'multi_select',
				'allow_null'    => 0,
				'add_term'      => 1,
				'save_terms'    => 1,
				'load_terms'    => 1,
				'return_format' => 'object',
				'multiple'      => 0,
			),
			array(
				'key'        => 'field_58f3d180e0361',
				'label'      => __( 'Link', '19h47' ),
				'name'       => 'link',
				'aria-label' => __( 'Link', '19h47' ),
				'type'       => 'url',
			),
			array(
				'key'        => 'field_590457da2e2d7',
				'label'      => __( 'Repository', '19h47' ),
				'name'       => 'repository',
				'aria-label' => __( 'Repository', '19h47' ),
				'type'       => 'url',
			),
		);

		if ( ! function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		acf_add_local_field_group(
			array(
				'key'                   => 'group_58f396dca8c71',
				'title'                 => __( 'Details', '19h47' ),
				'fields'                => $fields,
				'location'              => $location,
				'menu_order'            => 0,
				'position'              => 'side',
				'style'                 => 'default',
				'label_placement'       => 'top',
				'instruction_placement' => 'label',
				'hide_on_screen'        => array( 'tags' ),
				'active'                => true,
				'description'           => __( 'Work details', '19h47' ),
			)
		);
	}
}
