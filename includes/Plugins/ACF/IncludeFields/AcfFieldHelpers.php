<?php
/**
 * ACF field helpers.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Plugins\ACF\IncludeFields;

/**
 * Static helpers for ACF field group definitions.
 */
class AcfFieldHelpers {

	/**
	 * Builds a flexible content layouts map from layout classes.
	 *
	 * Each class must expose `public static function get_layout( string $key ): array`
	 * with at least `key` and `name`.
	 *
	 * @param string               $key             Field key prefix.
	 * @param array<int, class-string> $layout_classes Layout class names.
	 * @return array<string, array<string, mixed>>
	 */
	public static function get_layouts_from( string $key, array $layout_classes ): array {
		$layouts = array();

		foreach ( $layout_classes as $class ) {
			if ( ! is_callable( array( $class, 'get_layout' ) ) ) {
				continue;
			}

			$layout = $class::get_layout( $key );
			$id     = $layout['key'] ?? ( 'layout_' . $key . '_' . ( $layout['name'] ?? '' ) );

			$layouts[ $id ] = $layout;
		}

		return $layouts;
	}
}
