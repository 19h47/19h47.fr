<?php
/**
 * Last.fm recent tracks, rendered server-side and refreshed over the REST API.
 *
 * Uses the Last.fm API 2.0 (https://ws.audioscrobbler.com/2.0/), method
 * user.getrecenttracks, which needs an API key but no user auth. Define
 * LASTFM_API_KEY in wp-config.php.
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Post;

use DixNeufHeureQuaranteSept\Service;
use Timber\Timber;
use function get_theme_text_domain;

if ( ! defined( 'LASTFM_USER' ) ) {
	define( 'LASTFM_USER', 'Bsurde' );
}

/**
 * Lastfm
 */
class Lastfm implements Service {

	/**
	 * API base URL.
	 *
	 * @var string
	 */
	private const API_URL = 'https://ws.audioscrobbler.com/2.0/';

	/**
	 * REST route, under the theme namespace.
	 *
	 * @var string
	 */
	private const ROUTE = '/lastfm';

	/**
	 * Cache TTL in seconds (short: scrobbles change often).
	 *
	 * @var int
	 */
	private const CACHE_TTL = 60;

	/**
	 * Width of each Last.fm image size, for srcset.
	 *
	 * @var array<string, int>
	 */
	private const IMAGE_WIDTHS = array(
		'small'      => 34,
		'medium'     => 64,
		'large'      => 174,
		'extralarge' => 300,
	);

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'rest_api_init', array( $this, 'register_route' ) );
	}

	/**
	 * REST endpoint URL, for the lastfm-feed element.
	 *
	 * @return string
	 */
	public static function endpoint(): string {
		return rest_url( get_theme_text_domain() . '/v1' . self::ROUTE );
	}

	/**
	 * Register the public, read-only recent tracks route.
	 *
	 * @return void
	 */
	public function register_route(): void {
		register_rest_route(
			get_theme_text_domain() . '/v1',
			self::ROUTE,
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'recent' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'limit' => array(
						'type'    => 'integer',
						'default' => 50,
						'minimum' => 1,
						'maximum' => 200,
					),
				),
			)
		);
	}

	/**
	 * Recent tracks + playcount (REST).
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function recent( \WP_REST_Request $request ) {
		$feed = $this->get_feed( $request['limit'] );

		if ( is_wp_error( $feed ) ) {
			return $feed;
		}

		$response = rest_ensure_response( $feed );

		$response->header( 'Cache-Control', 'public, max-age=' . self::CACHE_TTL );

		return $response;
	}

	/**
	 * Fetch (and cache) recent tracks for SSR or REST.
	 *
	 * Falls back to the last successful feed when Last.fm is unreachable.
	 *
	 * @param int $limit Number of tracks (1–200).
	 * @return array|\WP_Error {
	 *     @type string $html
	 *     @type int    $playcount
	 * }
	 */
	public function get_feed( int $limit = 50 ) {
		$cache_key = sprintf( '19h47_lastfm_recent_%s_%d', sanitize_key( LASTFM_USER ), $limit );
		$stale_key = '19h47_lastfm_stale';
		$cached    = get_transient( $cache_key );

		if ( is_array( $cached ) ) {
			return $cached;
		}

		$payload = $this->fetch( $limit );

		if ( is_wp_error( $payload ) ) {
			$stale = get_option( $stale_key );

			return is_array( $stale ) ? $stale : $payload;
		}

		set_transient( $cache_key, $payload, self::CACHE_TTL );
		update_option( $stale_key, $payload, false );

		return $payload;
	}

	/**
	 * Request recent tracks and render them.
	 *
	 * The playcount is the total of the recent tracks list, so a single
	 * request is enough.
	 *
	 * @param int $limit Number of tracks.
	 * @return array|\WP_Error
	 */
	private function fetch( int $limit ) {
		if ( ! defined( 'LASTFM_API_KEY' ) || empty( LASTFM_API_KEY ) ) {
			return new \WP_Error(
				'lastfm_api_key',
				__( 'Last.fm API key is missing.', '19h47' ),
				array( 'status' => 500 )
			);
		}

		$body = $this->request(
			array(
				'method'  => 'user.getrecenttracks',
				'user'    => LASTFM_USER,
				'api_key' => LASTFM_API_KEY,
				'limit'   => $limit,
				'format'  => 'json',
			)
		);

		if ( is_wp_error( $body ) ) {
			return $body;
		}

		$raw_tracks = isset( $body['recenttracks']['track'] ) ? $body['recenttracks']['track'] : array();

		if ( isset( $raw_tracks['name'] ) ) {
			$raw_tracks = array( $raw_tracks );
		}

		$tracks = array();

		foreach ( (array) $raw_tracks as $track ) {
			$tracks[] = array(
				'image'      => $this->extract_image( $track ),
				'artist'     => isset( $track['artist']['#text'] ) ? $track['artist']['#text'] : '',
				'name'       => isset( $track['name'] ) ? $track['name'] : '',
				'url'        => isset( $track['url'] ) ? $track['url'] : '',
				'nowplaying' => ! empty( $track['@attr']['nowplaying'] ),
			);
		}

		$playcount = isset( $body['recenttracks']['@attr']['total'] ) ? (int) $body['recenttracks']['@attr']['total'] : 0;

		return array(
			'html'      => Timber::compile( 'components/tracks.html.twig', array( 'tracks' => $tracks ) ),
			'playcount' => $playcount,
		);
	}

	/**
	 * Album art as src + srcset, from every available size.
	 *
	 * @param array $track Track payload.
	 * @return array{src: string, srcset: string}|null
	 */
	private function extract_image( array $track ): ?array {
		if ( empty( $track['image'] ) || ! is_array( $track['image'] ) ) {
			return null;
		}

		$src    = '';
		$srcset = array();

		foreach ( $track['image'] as $image ) {
			if ( empty( $image['#text'] ) || empty( self::IMAGE_WIDTHS[ $image['size'] ?? '' ] ) ) {
				continue;
			}

			$src      = $image['#text'];
			$srcset[] = $image['#text'] . ' ' . self::IMAGE_WIDTHS[ $image['size'] ] . 'w';
		}

		if ( ! $src ) {
			return null;
		}

		return array(
			'src'    => $src,
			'srcset' => implode( ', ', $srcset ),
		);
	}

	/**
	 * Perform a Last.fm API request.
	 *
	 * @param array $args Query args.
	 * @return array|\WP_Error
	 */
	private function request( array $args ) {
		$url = add_query_arg( $args, self::API_URL );

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
			return new \WP_Error( 'lastfm_http', $response->get_error_message(), array( 'status' => 502 ) );
		}

		$code = wp_remote_retrieve_response_code( $response );
		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		// Last.fm often returns HTTP 200 with an error payload.
		if ( 200 !== $code || ! is_array( $body ) || isset( $body['error'] ) ) {
			$message = isset( $body['message'] ) ? $body['message'] : __( 'Unable to load Last.fm data.', '19h47' );

			return new \WP_Error( 'lastfm_error', $message, array( 'status' => 502 ) );
		}

		return $body;
	}
}
