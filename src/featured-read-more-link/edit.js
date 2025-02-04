/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useSelect } from '@wordpress/data';
import { TextControl, PanelBody, Button, Spinner } from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 * @return {Element} Element to render.
 */
const Edit = ( { attributes, setAttributes } ) => {
	const { postId, postLink, postTitle } = attributes;
	const [ searchTerm, setSearchTerm ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const [ selectedPost, setSelectedPost ] = useState( null );
	const [ loadingPosts, setLoadingPosts ] = useState( false );
	const [ query, setQuery ] = useState( {
		per_page: 5,
		order: 'desc',
		orderby: 'date',
	} );

	//Getting current Post ID to exclude from the listed posts to select.
	const currentPostId = useSelect( ( select ) => {
		return select( 'core/editor' ).getCurrentPostId();
	}, [] );

	const { posts, totalPages, isRequesting } = useSelect(
		( select ) => {
			query.page = currentPage;

			const {
				getEntityRecords,
				getEntityRecordsTotalPages,
				isResolving,
			} = select( 'core' );

			const selectorArgs = [
				'postType',
				'post',
				{ ...query, exclude: currentPostId ? [ currentPostId ] : [] },
			];

			const totalPostsArgs = {
				...query,
			};

			// If the search term is a number, try to search by ID
			if ( searchTerm && ! isNaN( parseInt( searchTerm ) ) ) {
				selectorArgs[ 2 ].include = [ parseInt( searchTerm ) ];
				totalPostsArgs.include = [ parseInt( searchTerm ) ];
			} else if ( searchTerm ) {
				totalPostsArgs.search_columns =
					selectorArgs[ 2 ].search_columns = 'post_title';
				selectorArgs[ 2 ].search = searchTerm;
				totalPostsArgs.search = searchTerm;
			}

			if ( currentPostId ) {
				totalPostsArgs.exclude = [ currentPostId ];
				selectorArgs[ 2 ].exclude = [ currentPostId ];
			}

			const totalPagesCount = getEntityRecordsTotalPages(
				'postType',
				'post',
				totalPostsArgs
			);

			return {
				posts: getEntityRecords( ...selectorArgs ),
				isRequesting: isResolving(
					'core',
					'getEntityRecords',
					selectorArgs
				),
				totalPages: Math.ceil( totalPagesCount ),
			};
		},
		[ searchTerm, query, currentPostId ]
	);

	// Set selectedPost after first render or when attributes change
	useEffect( () => {
		if ( postId ) {
			setSelectedPost( postId );
		}
	}, [ postId ] );

	useEffect( () => {
		if ( posts && postId ) {
			const post = posts.find( ( post ) => post.id === postId );
			if ( post ) {
				setAttributes( {
					postId: post.id,
					postTitle: post.title.rendered,
					postLink: post.link,
				} );
				setSelectedPost( postId );
			} else {
				setSelectedPost( null );
			}
		} else if ( ! postId ) {
			setSelectedPost( null );
		}
	}, [ posts, postId ] );

	useEffect( () => {
		setLoadingPosts( isRequesting );
	}, [ isRequesting ] );

	const handleSearch = ( value ) => {
		setCurrentPage( 1 );
		setSearchTerm( value );
	};

	const handleSelectPost = ( post ) => {
		setAttributes( {
			postId: post.id,
			postTitle: post.title.rendered,
			postLink: post.link,
		} );
		setSelectedPost( post.id );
	};

	const handlePagination = ( page ) => {
		setQuery( { ...query, page } );
		setCurrentPage( page );
	};

	const blockProps = useBlockProps( {
		style: {
			backgroundColor: 'transparent',
			color: 'black',
		},
	} );

	const shouldShowPagination = ! loadingPosts && totalPages > 1;

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Post Selection', 'jana' ) }>
					<TextControl
						label={ __( 'Search Post', 'jana' ) }
						value={ searchTerm }
						onChange={ handleSearch }
						help={ __(
							'Enter a post title or ID to search',
							'jana'
						) }
					/>
					<div
						style={ {
							maxHeight: '200px',
							overflowY: 'scroll',
							border: '1px solid #ddd',
							padding: '10px',
						} }
					>
						{ loadingPosts && (
							<div
								style={ {
									textAlign: 'center',
									margin: '10px 0',
								} }
							>
								<Spinner />
							</div>
						) }
						{ posts && posts.length > 0
							? posts.map( ( post ) => (
									<div
										key={ post.id }
										style={ { marginBottom: '5px' } }
									>
										<Button
											variant="secondary"
											onClick={ () =>
												handleSelectPost( post )
											}
											isPrimary={
												post.id === selectedPost
											}
											style={ {
												width: '100%',
												textAlign: 'left',
											} }
										>
											{ post.title.rendered.length > 20
												? post.title.rendered.substring(
														0,
														30
												  ) + '...'
												: post.title.rendered }
										</Button>
									</div>
							  ) )
							: ! loadingPosts && (
									<p>{ __( 'No posts found', 'jana' ) }</p>
							  ) }
					</div>
					{ shouldShowPagination && (
						<div style={ { marginTop: '10px' } }>
							{ Array.from( { length: totalPages }, ( _, i ) => (
								<Button
									key={ i }
									variant="secondary"
									onClick={ () => handlePagination( i + 1 ) }
									isPrimary={ currentPage === i + 1 }
								>
									{ i + 1 }
								</Button>
							) ) }
						</div>
					) }
				</PanelBody>
			</InspectorControls>
			<p className="dmg-read-more">
				{ postLink ? (
					<>
						Read More: <a href={ postLink }>{ postTitle }</a>
					</>
				) : (
					<>{ __( 'No post selected', 'jana' ) }</>
				) }
			</p>
		</div>
	);
};

export default Edit;
