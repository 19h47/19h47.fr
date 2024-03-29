<?php
/**
 * 19h47 functions and definitions
 *
 * @see https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage 19h47
 * @since 1.0.0
 *
 * Functions'prefix is lj_
 */


/**
 * Autoload
 */
include get_template_directory() . '/vendor/autoload.php';


/**
 * Timber
 *
 * Instanciate Timber
 *
 * @see         https://github.com/timber/timber
 * @version     1.2.1
 */
$timber = new \Timber\Timber();


/**
 * Includes necessary files
 */
include get_template_directory() . '/inc/_includes.php';


/**
 * Dirname
 *
 * Tell Timber where are views
 */
Timber::$dirname = array( 'views' );


/**
 * class LJ
 */
class LJ extends TimberSite {

	/**
	 * The name of the theme
	 *
	 * @access private
	 */
	private $theme_name;


	/**
	 * The version of this theme
	 *
	 * @access private
	 */
	private $theme_version;


	/** Manifest
	 *
	 * @access private
	 */
	private $theme_manifest;


	/**
	 * Initialize the class and set its properties.
	 *
	 * @param  $theme_name
	 * @param  $theme_version
	 * @access public
	 */
	public function __construct( $theme_name, $theme_version ) {

		$this->theme_name    = $theme_name;
		$this->theme_version = $theme_version;

		$this->theme_manifest = json_decode(
			file_get_contents( __DIR__ . '/dist/manifest.json' ),
			true
		);

		$this->setup();
		$this->load_dependencies();
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );

		parent::__construct();
	}


	/**
	 * Load dependencies description
	 *
	 * @access private
	 */
	private function load_dependencies() {

		require_once get_template_directory() . '/inc/admin.php';
		require_once get_template_directory() . '/inc/post-types/_includes.php';

		new ADMIN( $this->get_theme_name(), $this->get_theme_version() );
		new Custom_Post_Types( $this->get_theme_name(), $this->get_theme_version() );
	}


	/**
	 * Add to Twig
	 *
	 * @param object $twig Twig environment.
	 * @return object $twig
	 * @access public
	 */
	public function add_to_twig( object $twig ) : object {

		$twig->addFunction(
			new Twig_Function(
				'get_theme_manifest',
				function() {
					return $this->theme_manifest;
				}
			)
		);

		$twig->addFunction(
			new Twig_Function(
				'html_class',
				function ( $args = '' ) {
					return html_class( $args );
				}
			)
		);

		$twig->addFunction(
			new Twig_Function(
				'body_class',
				function ( $args = '' ) {
					return body_class( $args );
				}
			)
		);

		$twig->addFunction(
			new Twig_Function(
				'barba_namespace',
				function () {
					return barba_namespace();
				}
			)
		);

		return $twig;
	}



	/**
	 * Add to context
	 *
	 * @return  $context
	 * @access  public
	 */
	public function add_to_context( $context ) {

		/**
		 * Add menu to context
		 */
		$context['main_menu'] = new TimberMenu( 'main' );

		/**
		 * Add socials to context
		 */
		$socials = array();

		// Facebook
		if ( get_option( 'facebook' ) ) {
			$facebook            = array(
				'slug' => 'facebook',
				'name' => 'Facebook',
				'url'  => get_option( 'facebook' ),
			);
			$socials['facebook'] = $facebook;
		}

		// Twitter
		if ( get_option( 'twitter' ) ) {
			$twitter            = array(
				'slug' => 'twitter',
				'name' => 'Twitter',
				'url'  => get_option( 'twitter' ),
			);
			$socials['twitter'] = $twitter;
		}

		// Instagram
		if ( get_option( 'instagram' ) ) {
			$instagram            = array(
				'slug' => 'instagram',
				'name' => 'Instagram',
				'url'  => get_option( 'instagram' ),
			);
			$socials['instagram'] = $instagram;
		}

		// Pinterest
		if ( get_option( 'pinterest' ) ) {
			$pinterest            = array(
				'slug' => 'pinterest',
				'name' => 'Pinterest',
				'url'  => get_option( 'pinterest' ),
			);
			$socials['pinterest'] = $pinterest;
		}

		// Add socials to $context
		$context['socials'] = $socials;

		// Page permalink
		$context['page_permalink'] = array(
			'what_im_currently_listening_to' => get_permalink( get_page_by_path( 'what-im-currently-listening-to' ) ),
			'who_i_am'                       => get_permalink( get_page_by_path( 'who-i-am' ) ),
			'what_inspires_me'               => get_permalink( get_page_by_path( 'what-inspires-me' ) ),
			'work'                           => get_post_type_archive_link( 'work' ),
			'thoughts'                       => get_permalink( get_page_by_path( 'thoughts' ) ),
		);

		// Age
		$januaryDate = date( '01-m-Y' );
		$sDateBirth  = '27th July 1986';

		$oDateNow       = new DateTime( $januaryDate );
		$oDateBirth     = new DateTime( $sDateBirth );
		$oDateInterval  = $oDateNow->diff( $oDateBirth );
		$context['age'] = $oDateInterval->y;

		$context['manifest'] = $this->theme_manifest;

		return $context;
	}


	/**
	 * Setup
	 *
	 * @access public
	 */
	public function setup() {

		// Let WordPress manage the document title.
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @see https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);

		/**
		 * Register nav menus
		 */
		register_nav_menus(
			array(
				'main' => __( 'Menu Principal', '19h47' ),
			)
		);

		/**
		 * Add excerpt on page
		 *
		 * @see  https://codex.wordpress.org/Function_Reference/add_post_type_support
		 */
		add_post_type_support( 'page', 'excerpt' );

		/**
		 * Add JavaScript detection
		 */
		add_action( 'wp_head', array( $this, 'javascript_detection' ), 2 );

		/**
		 * Add styles
		 */
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_style' ) );

		/**
		 * Admin
		 */
		add_action( 'admin_init', array( $this, 'admin_init' ) );

		/**
		 * Add scripts
		 */
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		/**
		 * Add favicons
		 */
		add_action( 'wp_head', array( $this, 'favicons' ) );

		/**
		 * Set Barba namespace
		 */
		add_filter( 'barba_namespace', array( $this, 'barba_namespace' ) );

		/**
		 * custom styles for work
		 */
		add_action( 'wp_head', array( $this, 'work_styles' ), 99 );

		/**
		 * delete transient for work styles after work is saved/updated
		 */
		add_action( 'save_post_work', array( $this, 'clear_transient_for_work_styles' ), 10, 3 );
	}


	/**
	 *
	 */
	function work_styles() {
		$transient_id = $this->theme_name . '_work_styles';
		$html         = get_transient( $transient_id );

		if ( false === $html ) {
			$work = get_posts(
				array(
					'post_type'   => 'work',
					'numberposts' => -1,
				)
			);

			if ( $work ) {
				ob_start();
				?>
				<style>

					<?php
					foreach ( $work as $project ) :
						$color = get_field( 'color', $project );

						if ( $color ) :
							?>

							.Page__<?php echo $project->post_name; ?>,
							.Transition .js-to-<?php echo $project->post_name; ?> { background-color: <?php echo $color; ?> }

						<?php endif; ?>

					<?php endforeach; ?>

				</style>
				<?php
				$html = ob_get_clean();

				// minify HTML output before saving to transient
				$html = str_replace( array( "\r\n", "\r", "\n", "\t", ' ' ), '', $html );

				// then finally save to transient
				set_transient( $transient_id, $html, 30 * DAY_IN_SECONDS );
			}
		}

		echo $html;
	}


	/**
	 * Empty the transient for styles when a project is saved.
	 *
	 * @author Julien Vasseur <julien@poigneedemainvirile.com>
	 * @param int     $post_ID Post ID.
	 * @param WP_Post $post    Post object.
	 * @param bool    $update  Whether this is an existing post being updated or not.
	 */
	function clear_transient_for_work_styles() {
		delete_transient( $this->theme_name . '_work_styles' );
	}


	/**
	 * Admin init
	 */
	public function admin_init() {

		/**
		 * Editor style
		 */
		add_editor_style(
			get_template_directory_uri() . '/' . $this->theme_manifest['editor.css']
		);
	}


	/**
	 * Enqueue styles.
	 *
	 * @access public
	 */
	public function enqueue_style() {

		// Add custom fonts, used in the main stylesheet.
		$webfonts = array();
		foreach ( $this->webfonts() as $name => $url ) {
			wp_register_style( 'font-' . $name, $url, array(), null );
			$webfonts[] = 'font-' . $name;
		}

		/**
		 * Theme stylesheet
		 */
		wp_register_style(
			$this->theme_name . '-global',
			get_template_directory_uri() . '/' . $this->theme_manifest['main.css'],
			$webfonts,
			null
		);

		wp_enqueue_style( $this->theme_name . '-global' );
	}


	/**
	 * Enqueue scripts
	 *
	 * @access public
	 */
	public function enqueue_scripts() {

		// Remove wp-embed script from WordPress
		wp_deregister_script( 'wp-embed' );

		// Remove native version of jQuery and use custom CDN version instead
		wp_deregister_script( 'jquery' );
		wp_register_script( 'jquery', '//code.jquery.com/jquery-3.6.0.min.js', false, null, true );

		wp_register_script(
			$this->theme_name . '-main',
			get_template_directory_uri() . '/' . $this->theme_manifest['main.js'],
			array(
				'jquery',
			),
			null,
			true
		);

		// Localize script
		wp_localize_script(
			$this->theme_name . '-main',
			'wp',
			array(
				'template_directory_uri' => get_template_directory_uri(),
				'base_url'               => site_url(),
				'home_url'               => home_url( '/' ),
				'ajax_url'               => admin_url( 'admin-ajax.php' ),
				'nonce'                  => wp_create_nonce( 'wp_rest' ),
				'api_url'                => esc_url_raw( get_rest_url() ),
			)
		);

		wp_enqueue_script( $this->theme_name . '-main' );
	}


	/**
	 * Specify data-namespace attribute on barba container.
	 * @param  string $ns Default namespace
	 * @return string
	 */
	public function barba_namespace( $ns ) {

		if ( is_page() ) {
			$ns = 'page';
		}

		if ( is_post_type_archive( 'work' ) ) {
			$ns = 'archive-work';
		}

		if ( is_singular( 'work' ) ) {
			$ns = 'work';
		}

		if ( is_page( 'what-inspires-me' ) ) {

			$ns = 'what-inspires-me';
		}

		if ( is_page( 'what-im-currently-listening-to' ) ) {

			$ns = 'what-im-currently-listening-to';
		}

		if ( is_page( 'curriculum-vitae' ) ) {

			$ns = 'curriculum-vitae';
		}

		if ( is_404( '404' ) ) {

			$ns = '404';
		}

		if ( is_front_page() ) {
			$ns = 'front-page';
		}

		if ( is_home() ) {
			$ns = 'thoughts';
		}

		return $ns;
	}


	/**
	 * List webfonts used by the theme.
	 *
	 * @return array
	 * @access public
	 */
	public function webfonts() {

		return array(
			'work-sans' => 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,200;0,300;0,400;0,700;1,500&display=swap',
		);
	}


	/**
	 * Handles JavaScript detection.
	 * Adds a `js` class to the root `<html>` element when JavaScript is detected.
	 *
	 * @access public
	 */
	public function javascript_detection() {

		?>

		<script src="https://cdnjs.cloudflare.com/ajax/libs/feature.js/1.0.1/feature.min.js"></script>
		<script>
			document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
			if (feature.touch && !navigator.userAgent.match(/Trident\/(6|7)\./)) {
				document.documentElement.className = document.documentElement.className.replace('no-touch', 'touch');
			}
		 </script>

		<?php
	}


	/**
	 * Retrieve the version number of the theme.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_theme_version() {

		return $this->theme_version;
	}


	/**
	 * The name of the theme used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the theme.
	 */
	public function get_theme_name() {

		return $this->theme_name;
	}


	/**
	 * Add all favicon metas in <head>
	 *
	 * @see  http://realfavicongenerator.net/
	 */
	function favicons() {

		$output = '';

		echo $output;
	}
}


/**
 * Begins execution of the theme.
 */
$theme = new LJ( '19h47', '1.0.0' );
