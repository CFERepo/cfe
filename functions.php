<?php
/**
 * Sage includes
 *
 * The $sage_includes array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 *
 * Please note that missing files will produce a fatal error.
 *
 * @link https://github.com/roots/sage/pull/1042
 */
$sage_includes = [
  'lib/utils.php',                 // Utility functions
  'lib/init.php',                  // Initial theme setup and constants
  'lib/wrapper.php',               // Theme wrapper class
  'lib/conditional-tag-check.php', // ConditionalTagCheck class
  'lib/config.php',                // Configuration
  'lib/assets.php',                // Scripts and stylesheets
  'lib/titles.php',                // Page titles
  'lib/extras.php',                // Custom functions
];

foreach ($sage_includes as $file) {
  if (!$filepath = locate_template($file)) {
    trigger_error(sprintf(__('Error locating %s for inclusion', 'sage'), $file), E_USER_ERROR);
  }

  require_once $filepath;
}
unset($file, $filepath);

add_theme_support( 'admin-bar', array( 'callback' => '__return_false' ) );

function cfe_rewrite_rules() {
    add_rewrite_rule(
        '^tags/([0-9A-Za-z\-,]+)/?',
        'index.php?category_name=$matches[1]',
        'top'
    );
}

function cfe_redirection_rules() {

    $requested_path = esc_url_raw( $_SERVER['REQUEST_URI'] );
    $requested_path = stripslashes( $requested_path );

    $requested_path = untrailingslashit( $requested_path );
    if ( empty( $requested_path ) ){
        $requested_path = '/';
    }

    switch ($requested_path) {
        case '/main':
            $destination = '/tags/whats-cfe';
            break;
        case '/mtractrans':
            $destination = '/tags/mtractrans';
            break;
        case '/grad':
            $destination = '/tags/graduate';
            break;
        case '/elp':
            $destination = '/tags/elp';
            break;
        case '/thestartup':
            $destination = '/tags/the-startup';
            break;
        case '/jsg':
            $destination = '/tags/jsg';
            break;
        default:
            $destination = false;
            break;
    }

    if($destination) {
      wp_redirect( $destination, 301 ); 

      exit();
    }
}

add_action( 'init', 'cfe_rewrite_rules' );
add_action( 'parse_request', 'cfe_redirection_rules', 0 );

add_filter('show_admin_bar', '__return_false');