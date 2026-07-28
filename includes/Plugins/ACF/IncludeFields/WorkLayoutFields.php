<?php
/**
 * Work layout ACF fields.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Plugins\ACF\IncludeFields;

use DixNeufHeureQuaranteSept\Plugins\ACF\IncludeFields\Layouts\Full;
use DixNeufHeureQuaranteSept\Plugins\ACF\IncludeFields\Layouts\Text;
use DixNeufHeureQuaranteSept\Service;

/**
 * Flexible content sections for the work post type.
 */
class WorkLayoutFields implements Service {

	/**
	 * Layout classes (order = admin display order).
	 *
	 * @var array<int, class-string>
	 */
	private static array $layouts = array(
		Full::class,
		Text::class,
	);

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
		$key = 'work_layout';

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
				'key'          => 'field_58f39360bf4b0',
				'label'        => __( 'Sections', '19h47' ),
				'name'         => 'sections',
				'aria-label'   => __( 'Sections', '19h47' ),
				'type'         => 'flexible_content',
				'layouts'      => AcfFieldHelpers::get_layouts_from( $key, self::$layouts ),
				'button_label' => __( 'Add Row', '19h47' ),
			),
		);

		if ( ! function_exists( 'acf_add_local_field_group' ) ) {
			return;
		}

		acf_add_local_field_group(
			array(
				'key'                   => 'group_58f3935888c96',
				'title'                 => __( 'Layout', '19h47' ),
				'fields'                => $fields,
				'location'              => $location,
				'menu_order'            => 0,
				'position'              => 'normal',
				'style'                 => 'default',
				'label_placement'       => 'top',
				'instruction_placement' => 'label',
				'active'                => true,
				'description'           => __( 'Work layout', '19h47' ),
			)
		);
	}
}
