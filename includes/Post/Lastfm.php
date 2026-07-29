<?php
/**
 * Last.fm API proxy via admin-ajax.
 *
 * Uses the still-current Last.fm API 2.0:
 * https://ws.audioscrobbler.com/2.0/
 * Methods: user.getrecenttracks, user.getinfo (no auth required).
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Post;

use DixNeufHeureQuaranteSept\Service;
use Timber\Timber;

if ( ! defined( 'LASTFM_API_KEY' ) ) {
	define( 'LASTFM_API_KEY', '34ee8634c2620b37bb06c0910c946200' );
}

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
	 * Cache TTL in seconds (short: scrobbles change often).
	 *
	 * @var int
	 */
	private const CACHE_TTL = 60;

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'wp_ajax_lastfm_recent', array( $this, 'recent' ) );
		add_action( 'wp_ajax_nopriv_lastfm_recent', array( $this, 'recent' ) );
	}

	/**
	 * Proxy recent tracks + playcount (AJAX).
	 *
	 * @return void
	 */
	public function recent() {
		if ( ! isset( $_GET['nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_GET['nonce'] ) ), 'security' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Security verification failed. Please try again.', '19h47' ),
				),
				403
			);
		}

		$limit = isset( $_GET['limit'] ) ? absint( wp_unslash( $_GET['limit'] ) ) : 50;
		$feed  = $this->get_feed( $limit );

		if ( is_wp_error( $feed ) ) {
			$status = 502;
			$data   = $feed->get_error_data();

			if ( is_array( $data ) && isset( $data['status'] ) ) {
				$status = (int) $data['status'];
			} elseif ( is_int( $data ) ) {
				$status = $data;
			}

			wp_send_json_error(
				array(
					'message' => $feed->get_error_message(),
				),
				$status ? $status : 502
			);
		}

		wp_send_json_success( $feed );
	}

	/**
	 * Fetch (and cache) recent tracks for SSR or AJAX.
	 *
	 * @param int $limit Number of tracks (1–200).
	 * @return array|\WP_Error {
	 *     @type string $html
	 *     @type int    $playcount
	 * }
	 */
	public function get_feed( int $limit = 50 ) {
		if ( empty( LASTFM_API_KEY ) ) {
			return new \WP_Error(
				'lastfm_api_key',
				__( 'Last.fm API key is missing.', '19h47' ),
				500
			);
		}

		$limit     = min( max( $limit, 1 ), 200 );
		$cache_key = sprintf( '19h47_lastfm_recent_%s_%d', sanitize_key( LASTFM_USER ), $limit );
		$cached    = get_transient( $cache_key );

		if ( is_array( $cached ) ) {
			return $cached;
		}

		$tracks_body = $this->request(
			array(
				'method'  => 'user.getrecenttracks',
				'user'    => LASTFM_USER,
				'api_key' => LASTFM_API_KEY,
				'limit'   => $limit,
				'format'  => 'json',
			)
		);

		$info_body = $this->request(
			array(
				'method'  => 'user.getinfo',
				'user'    => LASTFM_USER,
				'api_key' => LASTFM_API_KEY,
				'format'  => 'json',
			)
		);

		if ( is_wp_error( $tracks_body ) ) {
			return $tracks_body;
		}

		$raw_tracks = isset( $tracks_body['recenttracks']['track'] ) ? $tracks_body['recenttracks']['track'] : array();

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

		$playcount = 0;

		if ( ! is_wp_error( $info_body ) && isset( $info_body['user']['playcount'] ) ) {
			$playcount = (int) $info_body['user']['playcount'];
		}

		$payload = array(
			'html'      => Timber::compile( 'components/tracks.html.twig', array( 'tracks' => $tracks ) ),
			'playcount' => $playcount,
		);

		set_transient( $cache_key, $payload, self::CACHE_TTL );

		return $payload;
	}

	/**
	 * Pick the largest available album art URL.
	 *
	 * @param array $track Track payload.
	 * @return string
	 */
	private function extract_image( array $track ): string {
		if ( empty( $track['image'] ) || ! is_array( $track['image'] ) ) {
			return '';
		}

		$preferred = array( 'extralarge', 'large', 'medium', 'small' );
		$by_size   = array();

		foreach ( $track['image'] as $image ) {
			if ( empty( $image['#text'] ) || empty( $image['size'] ) ) {
				continue;
			}

			$by_size[ $image['size'] ] = $image['#text'];
		}

		foreach ( $preferred as $size ) {
			if ( ! empty( $by_size[ $size ] ) ) {
				return $by_size[ $size ];
			}
		}

		$last = end( $track['image'] );

		return is_array( $last ) && ! empty( $last['#text'] ) ? $last['#text'] : '';
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
			return $response;
		}

		$code = wp_remote_retrieve_response_code( $response );
		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( 200 !== $code || ! is_array( $body ) ) {
			return new \WP_Error( 'lastfm_error', __( 'Unable to load Last.fm data.', '19h47' ), 502 );
		}

		// Last.fm often returns HTTP 200 with an error payload.
		if ( isset( $body['error'] ) ) {
			$message = isset( $body['message'] ) ? $body['message'] : __( 'Unable to load Last.fm data.', '19h47' );

			return new \WP_Error( 'lastfm_api_error', $message, array( 'status' => (int) $body['error'] ) );
		}

		return $body;
	}
}
