<?php
/**
 * ACF layout: Full
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Plugins\ACF\IncludeFields\Layouts;

/**
 * Full media section layout.
 */
class Full {

	/**
	 * Returns the layout definition.
	 *
	 * @param string $key Field key prefix.
	 * @return array<string, mixed>
	 */
	public static function get_layout( string $key ): array {
		$type_key = 'field_58f4e063f5a7d';

		return array(
			'key'        => '58f393d5b3348',
			'name'       => 'full',
			'label'      => __( 'Full', '19h47' ),
			'display'    => 'row',
			'sub_fields' => array(
				array(
					'key'           => $type_key,
					'label'         => __( 'Type of media', '19h47' ),
					'name'          => 'type',
					'aria-label'    => __( 'Type of media', '19h47' ),
					'type'          => 'radio',
					'choices'       => array(
						'image' => __( 'Image', '19h47' ),
						'video' => __( 'Video', '19h47' ),
					),
					'default_value' => 'image',
					'layout'        => 'horizontal',
					'return_format' => 'value',
				),
				array(
					'key'               => 'field_58f39443bf4b1',
					'label'             => __( 'Image', '19h47' ),
					'name'              => 'image',
					'aria-label'        => __( 'Image', '19h47' ),
					'type'              => 'image',
					'conditional_logic' => array(
						array(
							array(
								'field'    => $type_key,
								'operator' => '==',
								'value'    => 'image',
							),
						),
					),
					'return_format'     => 'array',
					'preview_size'      => 'medium',
					'library'           => 'uploadedTo',
				),
				array(
					'key'               => 'field_58f4e38524f59',
					'label'             => __( 'Video', '19h47' ),
					'name'              => 'video',
					'aria-label'        => __( 'Video', '19h47' ),
					'type'              => 'oembed',
					'conditional_logic' => array(
						array(
							array(
								'field'    => $type_key,
								'operator' => '==',
								'value'    => 'video',
							),
						),
					),
				),
				array(
					'key'           => 'field_58f51443184ea',
					'label'         => __( 'Box shadow', '19h47' ),
					'name'          => 'shadow',
					'aria-label'    => __( 'Box shadow', '19h47' ),
					'type'          => 'radio',
					'choices'       => array(
						'true'  => __( 'True', '19h47' ),
						'false' => __( 'False', '19h47' ),
					),
					'default_value' => 'true',
					'layout'        => 'horizontal',
					'return_format' => 'value',
				),
			),
		);
	}
}
