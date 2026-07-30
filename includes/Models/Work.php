<?php
/**
 * Work model (Timber).
 *
 * @package DixNeufHeureQuaranteSept
 */

namespace DixNeufHeureQuaranteSept\Models;

use Timber\{ Post, Timber };

/**
 * Timber Post model for the work CPT.
 */
class Work extends Post {

	/**
	 * Cached adjacent works (circular).
	 *
	 * @var array{next: self, previous: self}|null
	 */
	private $adjacent = null;

	/**
	 * Project accent color.
	 *
	 * @return string|null
	 */
	public function color(): ?string {
		$color = $this->meta( 'color' );

		return is_string( $color ) && '' !== $color ? $color : null;
	}

	/**
	 * Project year (ACF date picker, return format Y).
	 *
	 * @return string|null
	 */
	public function year(): ?string {
		$year = $this->meta( 'year' );

		return is_string( $year ) && '' !== $year ? $year : null;
	}

	/**
	 * Client term names.
	 *
	 * @return string[]
	 */
	public function clients(): array {
		return $this->term_names( 'client' );
	}

	/**
	 * Role term names.
	 *
	 * @return string[]
	 */
	public function roles(): array {
		return $this->term_names( 'role' );
	}

	/**
	 * Stack term names.
	 *
	 * @return string[]
	 */
	public function stack(): array {
		return $this->term_names( 'stack' );
	}

	/**
	 * External project URL (ACF `link` field).
	 *
	 * Named `website` to avoid clashing with Timber\Post::$link (permalink).
	 *
	 * @return string|null
	 */
	public function website(): ?string {
		$link = $this->meta( 'link' );

		return is_string( $link ) && '' !== $link ? $link : null;
	}

	/**
	 * Repository URL.
	 *
	 * @return string|null
	 */
	public function repository(): ?string {
		$repository = $this->meta( 'repository' );

		return is_string( $repository ) && '' !== $repository ? $repository : null;
	}

	/**
	 * Next work in year order (DESC), wrapping to the oldest.
	 *
	 * Compatible with Timber\Post::next(); `$in_same_term` is unused (order is meta-based).
	 *
	 * @param bool|string $in_same_term Unused.
	 * @return self
	 */
	public function next( $in_same_term = false ) {
		return $this->adjacent()['next'];
	}

	/**
	 * Previous work in year order (DESC), wrapping to the newest.
	 *
	 * @return self
	 */
	public function previous(): self {
		return $this->adjacent()['previous'];
	}

	/**
	 * Resolve and cache circular next/previous siblings.
	 *
	 * Ordered by ACF date meta (`year`, stored as Ymd) via pre_get_work.
	 *
	 * @return array{next: self, previous: self}
	 */
	private function adjacent(): array {
		if ( null !== $this->adjacent ) {
			return $this->adjacent;
		}

		$works = Timber::get_posts(
			array(
				'post_type'      => 'work',
				'posts_per_page' => -1,
				'post_status'    => 'publish',
			)
		);

		$posts = $works ? array_values( iterator_to_array( $works ) ) : array();
		$count = count( $posts );
		$index = null;

		foreach ( $posts as $key => $post ) {
			if ( (int) $post->ID === (int) $this->ID ) {
				$index = $key;
				break;
			}
		}

		if ( null === $index || 0 === $count ) {
			$this->adjacent = array(
				'next'     => $this,
				'previous' => $this,
			);

			return $this->adjacent;
		}

		// List is year DESC: lower index = newer, higher index = older.
		$next_index     = ( $index - 1 + $count ) % $count;
		$previous_index = ( $index + 1 ) % $count;

		$this->adjacent = array(
			'next'     => $posts[ $next_index ],
			'previous' => $posts[ $previous_index ],
		);

		return $this->adjacent;
	}

	/**
	 * Extract term names from an ACF taxonomy field.
	 *
	 * @param string $field Field name.
	 * @return string[]
	 */
	private function term_names( string $field ): array {
		$terms = $this->meta( $field );

		if ( empty( $terms ) || ! is_array( $terms ) ) {
			return array();
		}

		$names = array();

		foreach ( $terms as $term ) {
			if ( is_object( $term ) && isset( $term->name ) ) {
				$names[] = $term->name;
			}
		}

		return $names;
	}
}
