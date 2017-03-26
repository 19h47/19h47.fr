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


    /**
     * Initialize the class and set its properties.
     *
     * @param  $theme_name
     * @param  $theme_version
     * @access public
     */
    public function __construct( $theme_name, $theme_version ) {
        
        $this->theme_name = $theme_name;
        $this->theme_version = $theme_version;
        $this->setup();
        $this->load_dependencies();
        // add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
        add_filter( 'timber_context', array( $this, 'add_to_context' ) );
        
        parent::__construct();
    }


    /**
     * Load dependencies description
     * 
     * @access private
     */
    private function load_dependencies() {

        // Load post type
        require_once get_template_directory() . '/inc/admin.php';
        
        new ADMIN( $this->get_theme_name(), $this->get_theme_version() );
    }


    /**
     * Add to Twig
     *
     * @return  $twig
     */
    public function add_to_twig () {

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
            $facebook = array( 
                'slug'  => 'facebook',
                'name'  => 'Facebook',
                'url'   => get_option( 'facebook' )
            ); 
            $socials['facebook'] = $facebook;
        }

        // Twitter
        if ( get_option( 'twitter' ) ) {
            $twitter = array( 
                'slug'  => 'twitter',
                'name'  => 'Twitter',
                'url'   => get_option( 'twitter' )
            ); 
            $socials['twitter'] = $twitter;
        }

        // Instagram
        if ( get_option( 'instagram' ) ) {
            $instagram = array( 
                'slug'  => 'instagram',
                'name'  => 'Instagram',
                'url'   => get_option( 'instagram' )
            ); 
            $socials['instagram'] = $instagram;
        }

        // Pinterest
        if ( get_option( 'pinterest' ) ) {
            $pinterest = array( 
                'slug'  => 'pinterest',
                'name'  => 'Pinterest',
                'url'   => get_option( 'pinterest' )
            ); 
            $socials['pinterest'] = $pinterest;
        }

        // Add socials to $context
        $context['socials'] = $socials;


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
                'caption'
            ) 
        );
        

        /**
         * Register nav menus
         */
        register_nav_menus( 
            array(
                'main'  => __( 'Menu Principal', $this->theme_name )            
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
         * Add scripts
         */
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );


         /**
         * Add favicons
         */
        add_action( 'wp_head', array( $this, 'favicons' ) );
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


        // Theme stylesheet
        wp_register_style(  $this->theme_name . '-global', get_template_directory_uri() . '/dist/css/global.css', $webfonts, null );
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
        wp_register_script( 'jquery', '//code.jquery.com/jquery-3.2.1.slim.min.js', false, null, true );
        
        //
        wp_register_script( $this->theme_name . '-main', get_template_directory_uri() . '/dist/js/bundle.js', array( 'jquery' ), null, true );
        
        // Localize script
        wp_localize_script( 
            $this->theme_name . '-main', 
            'wp', 
            array(
                'template_directory_uri'    => get_template_directory_uri(),
                'base_url'                  => site_url(),
                'home_url'                  => home_url( '/' ),
                'ajax_url'                  => admin_url( 'admin-ajax.php' )
            )
        ); 

        wp_enqueue_script( $this->theme_name . '-main' );
    }


    /**
     * List webfonts used by the theme.
     * 
     * @return array
     * @access public
     */
    public function webfonts() {
        
        return array(
        	'work-sans' => 'https://fonts.googleapis.com/css?family=Work+Sans:100,200,300,400,500,600,700,800,900',
        );
    }


    /**
     * Handles JavaScript detection.
     * Adds a `js` class to the root `<html>` element when JavaScript is detected.
     *
     * @access public
     */
    public function javascript_detection() {
	   
	    $output = "";

        $output .= "<script>";
        $output .= "document.documentElement.className = ";
        $output .= "document.documentElement.className.replace('no-js', 'js');";
        $output .= "</script>";

        echo $output;
    }


    /**
     * Retrieve the version number of the theme.
     *
     * @since     1.0.0
     * @return    string    The version number of the plugin.
     */
    public function get_version() {
        
        return $this->theme_version;
    }


    /**
     * The name of the theme used to uniquely identify it within the context of
     * WordPress and to define internationalization functionality.
     *
     * @since     1.0.0
     * @return    string    The name of the plugin.
     */
    public function get_plugin_name() {
        
        return $this->plugin_name;
    }


    /**
     * Add all favicon metas in <head>
     *
     * @see  http://realfavicongenerator.net/
     */
    function favicons() {

        $output = "";

        echo $output;
    }
}


/**
 * Begins execution of the theme.
 */
$theme = new LJ( '19h47', '1.0.0' );