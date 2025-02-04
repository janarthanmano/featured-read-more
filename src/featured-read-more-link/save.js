/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
const Save = ( { attributes } ) => {
	const { postLink, postTitle } = attributes;

	if ( ! postLink ) {
		return null; // Don't render anything if no post is selected
	}
	return (
		<p className="dmg-read-more">
			Read More: <a href={ postLink }>{ postTitle }</a>
		</p>
	);
};

export default Save;
