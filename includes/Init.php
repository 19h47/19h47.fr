<?php
/**
 * Theme bootstrap: service registration and initialization.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept;

/**
 * Init
 */
class Init {

	/**
	 * Theme service classes.
	 *
	 * @return array<int, class-string<Service>>
	 */
	public static function get_services(): array {
		return array(
			Admin\Init::class,
			Setup\Enqueue::class,
			Setup\Context::class,
			Setup\Twig::class,
			WPSettings::class,
			Post::class,
			Reset::class,
			PostTemplate\BodyClass::class,
			Barba\NamespaceFilter::class,
			Vite::class,
			Post\Work::class,
			Post\Tumblr::class,
			Post\Lastfm::class,
			Plugins\ACF\IncludeFields\WorkDetailsFields::class,
			Plugins\ACF\IncludeFields\WorkLayoutFields::class,
		);
	}

	/**
	 * Instantiate each service and call run().
	 *
	 * @return void
	 */
	public static function run_services(): void {
		foreach ( self::get_services() as $class ) {
			$service = self::instantiate( $class );
			if ( $service instanceof Service ) {
				$service->run();
			}
		}
	}

	/**
	 * Create an instance of the given class.
	 *
	 * @param class-string $class_name Fully qualified class name.
	 * @return object
	 */
	private static function instantiate( string $class_name ): object {
		return new $class_name();
	}
}
