<?php
/**
 * Tumblr photo posts, rendered server-side and paginated over the REST API.
 *
 * Uses the Tumblr API v2 in Neue Post Format (npf=true), which needs an API
 * key (the OAuth consumer key) but no user auth. Define TUMBLR_API_KEY in
 * wp-config.php.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Post;

use DixNeufHeureQuaranteSept\Service;
use Timber\Timber;
use function get_theme_text_domain;

if ( ! defined( 'TUMBLR_BLOG' ) ) {
	define( 'TUMBLR_BLOG', '19h47.tumblr.com' );
}

/**
 * Tumblr
 */
class Tumblr implements Service {

	/**
	 * REST route, under the theme namespace.
	 *
	 * @var string
	 */
	private const ROUTE = '/tumblr';

	/**
	 * Transient TTL (seconds).
	 *
	 * @var int
	 */
	private const CACHE_TTL = 900;

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'rest_api_init', array( $this, 'register_route' ) );
	}

	/**
	 * REST endpoint URL, for the tumblr-feed element.
	 *
	 * @return string
	 */
	public static function endpoint(): string {
		return rest_url( get_theme_text_domain() . '/v1' . self::ROUTE );
	}

	/**
	 * Register the public, read-only posts route.
	 *
	 * @return void
	 */
	public function register_route(): void {
		register_rest_route(
			get_theme_text_domain() . '/v1',
			self::ROUTE,
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'posts' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'offset'   => array(
						'type'    => 'integer',
						'default' => 0,
						'minimum' => 0,
					),
					'per_page' => array(
						'type'    => 'integer',
						'default' => 20,
						'minimum' => 1,
						'maximum' => 20,
					),
				),
			)
		);
	}

	/**
	 * Tumblr blog posts page (REST).
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function posts( \WP_REST_Request $request ) {
		$feed = $this->get_feed( $request['offset'], $request['per_page'] );

		if ( is_wp_error( $feed ) ) {
			return $feed;
		}

		$response = rest_ensure_response( $feed );

		$response->header( 'Cache-Control', 'public, max-age=' . self::CACHE_TTL );

		return $response;
	}

	/**
	 * Fetch (and cache) a Tumblr posts page for SSR or REST.
	 *
	 * The first page falls back to the last successful one when Tumblr is
	 * unreachable.
	 *
	 * @param int $offset   Pagination offset.
	 * @param int $per_page Items per page (1–20).
	 * @return array|\WP_Error {
	 *     @type string $html
	 *     @type int    $total_posts
	 *     @type int    $offset
	 *     @type int    $next_offset
	 *     @type int    $per_page
	 *     @type bool   $has_more
	 * }
	 */
	public function get_feed( int $offset = 0, int $per_page = 20 ) {
		$cache_key = sprintf(
			'19h47_tumblr_%s_%d_%d',
			sanitize_key( TUMBLR_BLOG ),
			$offset,
			$per_page
		);
		$stale_key = '19h47_tumblr_stale';
		$cached    = get_transient( $cache_key );

		if ( is_array( $cached ) ) {
			return $cached;
		}

		$payload = $this->fetch( $offset, $per_page );

		if ( is_wp_error( $payload ) ) {
			$stale = 0 === $offset ? get_option( $stale_key ) : null;

			return is_array( $stale ) ? $stale : $payload;
		}

		set_transient( $cache_key, $payload, self::CACHE_TTL );

		if ( 0 === $offset ) {
			update_option( $stale_key, $payload, false );
		}

		return $payload;
	}

	/**
	 * Request a posts page and render it.
	 *
	 * @param int $offset   Pagination offset.
	 * @param int $per_page Items per page.
	 * @return array|\WP_Error
	 */
	private function fetch( int $offset, int $per_page ) {
		if ( ! defined( 'TUMBLR_API_KEY' ) || empty( TUMBLR_API_KEY ) ) {
			return new \WP_Error(
				'tumblr_api_key',
				__( 'Tumblr API key is missing.', '19h47' ),
				array( 'status' => 500 )
			);
		}

		$url = add_query_arg(
			array(
				'api_key' => TUMBLR_API_KEY,
				'offset'  => $offset,
				'limit'   => $per_page,
				'npf'     => 'true',
			),
			sprintf(
				'https://api.tumblr.com/v2/blog/%s/posts',
				rawurlencode( TUMBLR_BLOG )
			)
		);

		$version  = wp_get_theme()->get( 'Version' );
		$response = wp_remote_get(
			$url,
			array(
				'timeout'    => 10,
				'user-agent' => '19h47-Theme/' . $version . ' (WordPress; ' . get_bloginfo( 'url' ) . ')',
				'headers'    => array(
					'Accept' => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return new \WP_Error( 'tumblr_http', $response->get_error_message(), array( 'status' => 502 ) );
		}

		$code = wp_remote_retrieve_response_code( $response );
		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( 200 !== $code || ! is_array( $body ) || empty( $body['response'] ) ) {
			return new \WP_Error(
				'tumblr_response',
				__( 'Unable to load Tumblr posts.', '19h47' ),
				array( 'status' => 502 )
			);
		}

		$raw_posts = isset( $body['response']['posts'] ) && is_array( $body['response']['posts'] )
			? $body['response']['posts']
			: array();
		$total     = isset( $body['response']['total_posts'] ) ? (int) $body['response']['total_posts'] : 0;
		$posts     = array();

		foreach ( $raw_posts as $post ) {
			$image = $this->extract_image( $post );

			if ( ! $image ) {
				continue;
			}

			$posts[] = array(
				'image' => $image,
				'label' => $this->label( $post, $image['alt'] ),
				'src'   => ! empty( $post['post_url'] ) ? $post['post_url'] : '',
			);
		}

		$next_offset = $offset + count( $raw_posts );

		return array(
			'html'        => Timber::compile( 'components/posts.html.twig', array( 'posts' => $posts ) ),
			'total_posts' => $total,
			'offset'      => $offset,
			'next_offset' => $next_offset,
			'per_page'    => $per_page,
			'has_more'    => $next_offset < $total && count( $raw_posts ) > 0,
		);
	}

	/**
	 * First image of a post, or of the post it reblogs.
	 *
	 * @param array $post Tumblr post payload (NPF).
	 * @return array{src: string, srcset: string, alt: string}|null
	 */
	private function extract_image( array $post ): ?array {
		$image = $this->first_image_from_blocks( $post['content'] ?? array() );

		if ( $image ) {
			return $image;
		}

		foreach ( $post['trail'] ?? array() as $item ) {
			$image = $this->first_image_from_blocks( $item['content'] ?? array() );

			if ( $image ) {
				return $image;
			}
		}

		return null;
	}

	/**
	 * First NPF image block as src (largest) + srcset (every width).
	 *
	 * @param array $blocks NPF content blocks.
	 * @return array{src: string, srcset: string, alt: string}|null
	 */
	private function first_image_from_blocks( array $blocks ): ?array {
		foreach ( $blocks as $block ) {
			if ( empty( $block['type'] ) || 'image' !== $block['type'] || empty( $block['media'] ) || ! is_array( $block['media'] ) ) {
				continue;
			}

			$src    = '';
			$max_w  = -1;
			$srcset = array();

			foreach ( $block['media'] as $media ) {
				if ( empty( $media['url'] ) || empty( $media['width'] ) ) {
					continue;
				}

				$width = (int) $media['width'];

				$srcset[ $width ] = $media['url'] . ' ' . $width . 'w';

				if ( $width > $max_w ) {
					$max_w = $width;
					$src   = $media['url'];
				}
			}

			if ( $src ) {
				return array(
					'src'    => $src,
					'srcset' => implode( ', ', $srcset ),
					'alt'    => isset( $block['alt_text'] ) ? (string) $block['alt_text'] : '',
				);
			}
		}

		return null;
	}

	/**
	 * Accessible name of the link to a post: the image alt text, else the
	 * post summary, else its date.
	 *
	 * @param array  $post Tumblr post payload.
	 * @param string $alt  Image alt text.
	 * @return string
	 */
	private function label( array $post, string $alt ): string {
		if ( '' !== trim( $alt ) ) {
			return $alt;
		}

		$summary = trim( (string) ( $post['summary'] ?? '' ) );

		if ( '' !== $summary ) {
			return wp_trim_words( $summary, 20 );
		}

		$timestamp = (int) ( $post['timestamp'] ?? 0 );
		$date      = wp_date( get_option( 'date_format' ), $timestamp );
		$time      = wp_date( get_option( 'time_format' ), $timestamp );

		/* translators: 1: post date, 2: post time. */
		return sprintf( __( 'Tumblr post from %1$s at %2$s', '19h47' ), $date, $time );
	}
}
