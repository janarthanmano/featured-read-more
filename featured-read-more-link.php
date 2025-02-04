<?php
/**
 * Plugin Name:       Featured Read More and CLI Command
 * Description:       A plugin to display featured posts along with read-more link
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Jana
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       featured-read-more-link
 *
 * @package Jana
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function jana_featured_read_more_link_block_init() {
	register_block_type( __DIR__ . '/build/featured-read-more-link' );
}
add_action( 'init', 'jana_featured_read_more_link_block_init' );

/**
 * Registers the custom WP-CLI command.
 */
if ( defined( 'WP_CLI' ) && WP_CLI ) {

	/**
	 * Custom WP-CLI command class.
	 */
	class Jana_Featured_Read_More_CLI_Command {
		/**
		 *  Defining the block name to search.  Inject this as a dependency
		 *  to make testing easier.
		 *
		 * @var string
		 */
		private $block_name;

		/**
		 * Injecting the dependencies of the class.
		 *
		 * @param string $block_name Block name,
		 */
		public function __construct( string $block_name = 'jana/featured-read-more-link' ) {
			$this->block_name = $block_name;
		}

		/**
		 * Searches for posts containing the Jana Featured Read More block within a date range.
		 *
		 * ## OPTIONS
		 *
		 * [--date-before=<date>]
		 * : The date before which to search (YYYY-MM-DD). Defaults to 30 days from now if date-after is also specified.
		 *
		 * [--date-after=<date>]
		 * : The date after which to search (YYYY-MM-DD). Defaults to 30 days ago if date-before is also specified.
		 *
		 * ## EXAMPLES
		 *
		 * wp dmg-read-more search
		 * wp dmg-read-more search --date-before=2024-01-01 --date-after=2023-12-01
		 *
		 * @param array $args
		 * @param array $assoc_args
		 */
		public function __invoke( $args, $assoc_args ) {
			$date_before = WP_CLI\Utils\get_flag_value( $assoc_args, 'date-before', null );
			$date_after  = WP_CLI\Utils\get_flag_value( $assoc_args, 'date-after', null );

			// Handling date defaults
			if ( $date_before === null && $date_after === null ) {
				$date_after = date( 'Y-m-d', strtotime( '-30 days' ) );
				$date_before = date( 'Y-m-d' );  // Today
			} elseif ($date_before === null) {
				$date_before = date( 'Y-m-d' ); //Today
			} elseif ($date_after === null){
				$date_after  = date( 'Y-m-d', strtotime( '-30 days', strtotime($date_before) ) );
			}

			// Validating date formats
			if ( $date_before && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date_before ) ) {
				WP_CLI::error( 'Invalid date format for --date-before. Use YYYY-MM-DD.' );
				return;
			}
			if ( $date_after && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date_after ) ) {
				WP_CLI::error( 'Invalid date format for --date-after. Use YYYY-MM-DD.' );
				return;
			}

			WP_CLI::log( "Searching for posts with Jana Featured Read More block between " . ($date_after ?: 'beginning') . " and " . ($date_before ?: 'now') . "...");

//			Direct query on database for performance
//			global $wpdb;
//
//			$sql = $wpdb->prepare(
//				"SELECT ID FROM {$wpdb->posts}
//                WHERE post_type = 'post'
//                AND post_status = 'publish'
//                AND post_content LIKE %s" .
//				($date_before ? " AND post_date <= %s" : "") .
//				($date_after  ? " AND post_date >= %s" : ""),
//				'%' . $this->block_name . '%',
//				($date_before ? $date_before . ' 23:59:59' : null),
//				($date_after ? $date_after . ' 00:00:00' : null)
//			);
//
//			$posts = $wpdb->get_col( $sql );
			$query_args = array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => -1, // Get all posts (should be used with caution on very large sites)
				's'              => $this->block_name,
				'date_query'     => array(
					'inclusive' => true,
				),
				'fields' => 'ids',
			);

			//Adding the dates to the query
			$query_args['date_query'][0]['before'] = $date_before . ' 23:59:59';
			$query_args['date_query'][0]['after'] = $date_after . ' 00:00:00';

			$query = new WP_Query( $query_args );
			$posts = $query->posts;


			if ( ! empty( $posts ) ) {
				foreach ( $posts as $post_id ) {
					WP_CLI::line( $post_id );
				}
				WP_CLI::success( sprintf( '%d posts found with the Jana Featured Read More block.', count( $posts ) ) );
			} else {
				WP_CLI::warning( 'No posts found with the Jana Featured Read More block within the specified date range.' );
			}
		}
	}

	WP_CLI::add_command( 'dmg-read-more search', 'Jana_Featured_Read_More_CLI_Command' );
}
