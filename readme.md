# Featured Read More and CLI Command

A plugin to display featured posts along with a styled "Read More" link.

## Description

This WordPress plugin provides two key functionalities:

1.  **Featured Read More Gutenberg Block:** A custom Gutenberg block that allows editors to easily insert a styled "Read More" link to a selected post. Editors can search for posts by title or ID directly within the block's Inspector Controls, and pagination is included for efficient browsing of results. The generated link displays the post title as the anchor text and uses the post's permalink as the link's destination, all wrapped within a paragraph element with the `dmg-read-more` CSS class.

2.  **`dmg-read-more search` WP-CLI Command:** A custom WP-CLI command that efficiently searches WordPress posts containing the Jana Featured Read More block within a specified date range. It outputs the Post IDs of the matching posts to STDOUT. This is useful for bulk operations or analysis of content using the block.

## Key Features

- **Gutenberg Block Integration:** Seamlessly integrates into the Gutenberg editor, offering a user-friendly way to add stylized "Read More" links.
- **Efficient Post Search:** Enables editors to search for posts by title or ID, enhancing content management.
- **WP-CLI Command:** Provides a powerful WP-CLI command for developers and advanced users to search for posts using the Featured Read More block within a specific date range.

## Installation

1.  **Build the Plugin:**
	*   Clone this repository in to your WordPress plugin folder use this command `git clone https://github.com/janarthanmano/featured-read-more.git`.
    *   Run the command `cd featured-read-more`
    *   Run the command `npm install` to install the dependencies.
    *   Run the command `npm run build` to build the code for production.
	*   In your WordPress admin dashboard, navigate to **Plugins** > **Installed Plugins**.
	*   Click **Activate** under the plugin **Feature Read More and CLI Command**.

2.  **Verify WP-CLI Installation (if using the CLI command):**
	*   Using your terminal go to the plugin folder.
	*   Run the command `wp --info`.
		*   If you see information about WP-CLI, it's already installed.
		*   If you get a "command not found" or similar error, follow the official WP-CLI installation instructions: [https://wp-cli.org/#installing](https://wp-cli.org/#installing)

## Usage

### Using the Gutenberg Block

1.  **Add the Block:**
	*   Open a WordPress page or post in the Gutenberg editor.
	*   Click the **Add Block** button (the "+" icon).
	*   Search for "Featured Read More" and select the block.
2.  **Select a Post:**
	*   In the block's Inspector Controls (the settings panel on the right-hand side of the editor), you'll see a "Search Post" field.
	*   Enter a search term (post title or ID).
	*   A list of matching posts will appear.
	*   Click the post you want to select.
3.  **The "Read More" Link:**
	*   The editor will display a preview of the "Read More" link.
4.  **Save the Page/Post:** Save your page or post to persist the selected link.

### Using the WP-CLI Command

1.  **Open a Terminal:**
	*   Open a terminal or command prompt on your server.
	*   Navigate to your WordPress installation directory.
2.  **Run the Command:**

	```bash
	wp dmg-read-more search
	```

	This will search for posts containing the Jana Featured Read More block within the last 30 days.

	To specify a date range, use the `--date-before` and `--date-after` arguments:

	```bash
	wp dmg-read-more search --date-before=YYYY-MM-DD --date-after=YYYY-MM-DD
	```

	Replace `YYYY-MM-DD` with the desired dates. For example:

	```bash
	wp dmg-read-more search --date-before=2025-02-04 --date-after=2025-01-01
	```

3.  **View the Output:** The command will output the Post IDs of the matching posts to STDOUT (your terminal).

## Arguments and Options (WP-CLI Command)

*   `--date-before=<date>`: (Optional) The date before which to search (YYYY-MM-DD). Defaults to today if `--date-after` is also specified, and to 30 days from today if `--date-after` is not specified.
*   `--date-after=<date>`: (Optional) The date after which to search (YYYY-MM-DD). Defaults to 30 days ago if `--date-before` is specified, and to 30 days ago from today if `--date-before` is not specified.

## Examples (WP-CLI Command)

*   `wp dmg-read-more search`: Searches for posts containing the DMG Read More block within the last 30 days.
*   `wp dmg-read-more search --date-before=2024-01-01 --date-after=2023-12-01`: Searches for posts containing the DMG Read More block between December 1, 2023, and January 1, 2024.

## Support

If you encounter any issues or have questions, please contact janarthanmano@gmail.com
