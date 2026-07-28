<?php
/**
 * ACF layout: Text
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Plugins\ACF\IncludeFields\Layouts;

/**
 * Text section layout.
 */
class Text {

	/**
	 * Returns the layout definition.
	 *
	 * @param string $key Field key prefix.
	 * @return array<string, mixed>
	 */
	public static function get_layout( string $key ): array {
		return array(
			'key'        => '58f3bc71fc4f7',
			'name'       => 'text',
			'label'      => __( 'Text', '19h47' ),
			'display'    => 'row',
			'sub_fields' => array(
				array(
					'key'          => 'field_58f3bc7afc4f8',
					'label'        => __( 'WYSIWYG', '19h47' ),
					'name'         => 'wysiwyg',
					'aria-label'   => __( 'WYSIWYG', '19h47' ),
					'type'         => 'wysiwyg',
					'tabs'         => 'all',
					'toolbar'      => 'basic',
					'media_upload' => 0,
					'delay'        => 1,
				),
			),
		);
	}
}
