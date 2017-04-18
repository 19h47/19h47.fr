<?php 
class Custom_Post_Types {
	
	/**
     * The unique identifier of this theme.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $plugin_name    The string used to uniquely identify this theme.
     */
    protected $theme_name;


    /**
     * The version of the theme.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this theme.
     */
    private $theme_version;


	/**
	 * Construct function
	 *
	 * @access public
	 */
	public function __construct( $theme_name, $theme_version ) {
		$this->theme_name = $theme_name;
        $this->theme_version = $theme_version;
        $this->include_custom_post_types();
        $this->instanciate_custom_post_types();
	}


    /**
     * Include all custom post types
     *
     * @access public
     */
	public function include_custom_post_types() {
        // include __DIR__ . '/event.php';
		include __DIR__ . '/work.php';
	}

	
    /**
     * Instanciate all custom post types
     */
    public function instanciate_custom_post_types() {
        new Work( $this->theme_name, $this->theme_version );
        // new Event( $this->theme_name, $this->theme_version );      
    }
}