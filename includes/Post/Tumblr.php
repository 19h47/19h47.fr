<?php
/**
 * Tumblr API proxy via admin-ajax (NPF-aware).
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Post;

use DixNeufHeureQuaranteSept\Service;

if ( ! defined( 'TUMBLR_API_KEY' ) ) {
	define( 'TUMBLR_API_KEY', 'T1ta3DzmFPU36KjYWsoJcvjl8kSPybrqagZsRp8sXWpUIlxQ98' );
}

if ( ! defined( 'TUMBLR_BLOG' ) ) {
	define( 'TUMBLR_BLOG', '19h47.tumblr.com' );
}

/**
 * Tumblr
 */
class Tumblr implements Service {

	/**
	 * Runs initialization tasks.
	 *
	 * @return void
	 */
	public function run(): void {
		add_action( 'wp_ajax_tumblr_posts', array( $this, 'posts' ) );
		add_action( 'wp_ajax_nopriv_tumblr_posts', array( $this, 'posts' ) );
	}

	/**
	 * Proxy Tumblr blog posts.
	 *
	 * @return void
	 */
	public function posts() {
		if ( ! isset( $_GET['nonce'] ) || ! wp_verify_nonce( sanitize_key( wp_unslash( $_GET['nonce'] ) ), 'security' ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Security verification failed. Please try again.', '19h47' ),
				),
				403
			);
		}

		if ( empty( TUMBLR_API_KEY ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Tumblr API key is missing.', '19h47' ),
				),
				500
			);
		}

		$offset   = isset( $_GET['offset'] ) ? absint( wp_unslash( $_GET['offset'] ) ) : 0;
		$per_page = isset( $_GET['per_page'] ) ? absint( wp_unslash( $_GET['per_page'] ) ) : 20;
		$per_page = min( max( $per_page, 1 ), 20 );

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
			wp_send_json_error(
				array(
					'message' => $response->get_error_message(),
				),
				502
			);
		}

		$code = wp_remote_retrieve_response_code( $response );
		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( 200 !== $code || ! is_array( $body ) || empty( $body['response'] ) ) {
			wp_send_json_error(
				array(
					'message' => __( 'Unable to load Tumblr posts.', '19h47' ),
				),
				$code ? $code : 502
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
				'src'   => ! empty( $post['post_url'] ) ? $post['post_url'] : '',
			);
		}

		$next_offset = $offset + count( $raw_posts );

		wp_send_json_success(
			array(
				'html'         => \Timber\Timber::compile( 'components/tumblr-posts.html.twig', array( 'posts' => $posts ) ),
				'total_posts'  => $total,
				'offset'       => $offset,
				'next_offset'  => $next_offset,
				'per_page'     => $per_page,
				'has_more'     => $next_offset < $total && count( $raw_posts ) > 0,
			)
		);
	}

	/**
	 * Extract the best available image URL from a Tumblr post (NPF or legacy).
	 *
	 * @param array $post Tumblr post payload.
	 * @return string|null
	 */
	private function extract_image( array $post ): ?string {
		if ( ! empty( $post['photos'][0]['original_size']['url'] ) ) {
			return $post['photos'][0]['original_size']['url'];
		}

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
	 * Pick the largest media URL from NPF image blocks.
	 *
	 * @param array $blocks NPF content blocks.
	 * @return string|null
	 */
	private function first_image_from_blocks( array $blocks ): ?string {
		foreach ( $blocks as $block ) {
			if ( empty( $block['type'] ) || 'image' !== $block['type'] || empty( $block['media'] ) || ! is_array( $block['media'] ) ) {
				continue;
			}

			$best   = null;
			$max_w  = -1;

			foreach ( $block['media'] as $media ) {
				if ( empty( $media['url'] ) ) {
					continue;
				}

				$width = isset( $media['width'] ) ? (int) $media['width'] : 0;

				if ( $width >= $max_w ) {
					$max_w = $width;
					$best  = $media['url'];
				}
			}

			if ( $best ) {
				return $best;
			}
		}

		return null;
	}
}
