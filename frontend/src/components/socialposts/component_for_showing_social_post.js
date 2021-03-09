import { 
	// withRouter,
	Link,
} from "react-router-dom";

import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

const styles = theme => ({
	outerContainer: {
	},
});

class ComponentForShowingSocialPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {

		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		const styles = {
			outerContainer:{
				width:'100%',
				width:'95%',
				margin:'auto',
				marginTop:30,
				paddingTop:30,
			},
		// user name and avatar
			avatarAndUsernameContainer:{
				display:'flex',
				flexDirection:'row',
				alignItems:'flex-end',
			},
			avatarContainer:{
				flex:1,
			},
			usernameContainer:{
				flex:5,
			},
			avatarImage:{
				width:80, 
				height:80, 
				resizeMode: "stretch",
				borderRadius: 80/2,
				// marginLeft:20,
			},
			usernameText:{
				fontWeight:'bold',
				fontSize:18,
				paddingBottom:0,
				marginBottom: 0,
			},

		// post text
			postTextContainer:{
				marginTop:20,
			},
			postText:{
				color:'dark-grey',
			},

		// post image
			postImageContainer:{
				marginTop:20,
			},
			postImage:{
				width:'100%', 
				height:300, 
				resizeMode: "stretch"
			},
			postVideoContainer:{
				marginTop:20,
			}
		}


		// const data = {type_of_post:'text_post', notification_type:'created_page'} 

		const data = this.props.dataPayloadFromParent

		// var base64Image = "data:image/jpeg;base64," + data.image_for_post



	/* activity headers start here */
		let user_activity_header_for_post_create = (
	  		<Link 
	  			to={`/socialposts/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} created a<span style={{fontWeight:'normal', color:utils.maroonColor}}> post!</span>
						</p>
					</div>
				</div>
			</Link>
		)


		let user_activity_header_for_like = (
	  		<Link 
	  			to={`/socialposts/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} liked a<span style={{fontWeight:'normal', color:utils.maroonColor}}> post!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_share = (
	  		<Link 
	  			to={`/socialposts/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} shared a<span style={{fontWeight:'normal', color:utils.maroonColor}}> post!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_comment = (
	  		<Link 
	  			to={`/socialposts/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} commented on a<span style={{fontWeight:'normal', color:utils.maroonColor}}> post!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_book_creating = (
	  		<Link 
	  			to={`/books/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} created a<span style={{fontWeight:'normal', color:utils.maroonColor}}> book title!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_book_liking = (
	  		<Link 
	  			to={`/books/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} liked a<span style={{fontWeight:'normal', color:utils.maroonColor}}> book!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_page_creating = (
	  		<Link 
	  			to={`/pages/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} created a<span style={{fontWeight:'normal', color:utils.maroonColor}}> page!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_page_liking = (
	  		<Link 
	  			to={`/pages/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} liked a <span style={{fontWeight:'normal', color:utils.maroonColor}}> page!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_sport_creating = (
	  		<Link 
	  			to={`/sports/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} created a<span style={{fontWeight:'normal', color:utils.maroonColor}}> sport activity!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_sport_liking = (
	  		<Link 
	  			to={`/sports/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} liked a<span style={{fontWeight:'normal', color:utils.maroonColor}}> sport!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_ad_creating = (
	  		<Link 
	  			to={`/ads/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} created an<span style={{fontWeight:'normal', color:utils.maroonColor}}> ad!</span>
						</p>
					</div>
				</div>
			</Link>
		)

		let user_activity_header_for_ad_liking = (
	  		<Link 
	  			to={`/ads/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'40%', margin:'auto'}}>
					<div style={{...styles.avatarContainer}}>
						<img 
							alt="" 
							src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
							// src={utils.image}
							style={{...styles.avatarImage, width:40, height:40,}}
						/>
					</div>
					<div style={{...styles.usernameContainer, flex:10}}>
						<p style={{...styles.usernameText, fontSize:15, marginLeft:20, fontWeight:'normal'}}>
							{data.friends_user_name} liked an<span style={{fontWeight:'normal', color:utils.maroonColor}}> ad!</span>
						</p>
					</div>
				</div>
			</Link>
		)
	/* activity headers end here */


	/* username and avatar start here */

		let username_avatar_in_created_post_type = (
			<div style={styles.avatarAndUsernameContainer}>
				<div style={styles.avatarContainer}>
					<img 
						alt="" 
						src={"data:image/jpeg;base64," + data.friends_user_avatar_image} 
						// src={utils.image}
						style={styles.avatarImage}
					/>
				</div>
				<div style={styles.usernameContainer}>
					<p style={styles.usernameText}>
						{data.friends_user_name}
					</p>
				</div>
			</div>
		)

		let username_avatar_in_rest_cases = (
			<div style={styles.avatarAndUsernameContainer}>
				<div style={styles.avatarContainer}>
					<img 
						alt="" 
						src={"data:image/jpeg;base64," + data.user_avatar_image} 
						// src={utils.image}
						style={styles.avatarImage}
					/>
				</div>
				<div style={styles.usernameContainer}>
					<p style={styles.usernameText}>
						{data.user_name}
					</p>
				</div>
			</div>
		)

	/* username and avatar end here */


		let post_text_content = (
			<div style={styles.postTextContainer}>
				<p style={styles.postText}>
					{ data.post_text }
				</p>
			</div>
		)

		let post_image_content = (
			<div style={styles.postImageContainer}>
				<img 
					src={"data:image/jpeg;base64," + data.image_for_post} 
					// src={utils.image}
					alt="" 
					style={styles.postImage}
				/>
			</div>
		)

		let post_video_content = (
			<div style={styles.postVideoContainer}>
				<video 
					width="100%" 
					height="300" 
					controls
					src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ data.video_for_post }`}} 
				/>
			</div>
		)

		let book_content = (
			// , , , interested_users, endpoint
			<div>
				<div style={styles.postTextContainer}>
					<p style={{...styles.postText, fontWeight:'bold'}}>
						{ data.book_name }
					</p>
				</div>

				<div style={{...styles.postImageContainer, width:'30%',  margin:'auto'}}>
					<img 
						src={"data:image/jpeg;base64," + data.book_image} 
						// src={utils.image}
						alt="" 
						style={styles.postImage}
					/>
				</div>

				<div style={styles.postTextContainer}>
					<p style={styles.postText}>
						{ data.book_description }
					</p>
				</div>				
			</div>
		)
		
		let page_content = (
			// , , , endpoint
			<div>
				<div style={styles.postTextContainer}>
					<p style={{...styles.postText, fontWeight:'bold'}}>
						{ data.page_name }
					</p>
				</div>

				<div style={{...styles.postImageContainer, width:'70%',  margin:'auto'}}>
					<img 
						src={"data:image/jpeg;base64," + data.page_image} 
						// src={utils.image}
						alt="" 
						style={styles.postImage}
					/>
				</div>

				<div style={styles.postTextContainer}>
					<p style={styles.postText}>
						{ data.page_description }
					</p>
				</div>
			</div>
		)

		let sport_content = (
			// , , , endpoint
			<div>
				<div style={styles.postTextContainer}>
					<p style={{...styles.postText, fontWeight:'bold'}}>
						{ data.sport_name }
					</p>
				</div>

				<div style={styles.postImageContainer}>
					<img 
						src={"data:image/jpeg;base64," + data.sport_image} 
						// src={utils.image}
						alt="" 
						style={styles.postImage}
					/>
				</div>

				<div style={styles.postTextContainer}>
					<p style={styles.postText}>
						{ data.sport_description }
					</p>
				</div>				
			</div>

		)

		let ad_content = (
			// , , , endpoint
			<div>
				<div style={styles.postTextContainer}>
					<p style={{...styles.postText, fontWeight:'bold'}}>
						{ data.ad_name }
					</p>
				</div>

				<div style={styles.postImageContainer}>
					<img 
						src={"data:image/jpeg;base64," + data.ad_image} 
						// src={utils.image}
						alt="" 
						style={styles.postImage}
					/>
				</div>

				<div style={styles.postTextContainer}>
					<p style={styles.postText}>
						{ data.ad_description }
					</p>
				</div>				
			</div>
		)

		return (
			<div>

				{(() => {

				// created_post section
					if (data.message){

						return (
							<div style={{
								margin:'auto', 
								width:'50%',
								marginTop:50,
							}}>
								<p style={{fontSize:20, fontStyle:'italic', fontWeight:'bold' }}>There are no new posts to show</p>
							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

								{username_avatar_in_created_post_type}

								{post_text_content}

							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

								{username_avatar_in_created_post_type}

								{post_image_content}

							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

								{username_avatar_in_created_post_type}

								{post_video_content}

							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

								{username_avatar_in_created_post_type}

								{post_text_content}

								{post_image_content}
								
							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

								{username_avatar_in_created_post_type}

								{post_text_content}

								{post_video_content}

							</div>
						)

				// liked_post section

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}

								{username_avatar_in_rest_cases}

								{post_text_content}
								
							</div>
						)

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}

								{username_avatar_in_rest_cases}

								{post_image_content}
								
							</div>
						)

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}

								{username_avatar_in_rest_cases}

								{post_video_content}

							</div>
						)

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}

								{username_avatar_in_rest_cases}

								{post_text_content}

								{post_image_content}
								
							</div>
						)

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}

								{username_avatar_in_rest_cases}

								{post_text_content}

								{post_video_content}

							</div>
						)

				// shared_post section

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

								{username_avatar_in_rest_cases}

								{post_text_content}
								
							</div>
						)

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

								{username_avatar_in_rest_cases}

								{post_image_content}
								
							</div>
						)

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

								{username_avatar_in_rest_cases}

								{post_video_content}

							</div>
						)

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

								{username_avatar_in_rest_cases}

								{post_text_content}

								{post_image_content}

							</div>
						)

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

								{username_avatar_in_rest_cases}

								{post_text_content}

								{post_video_content}

							</div>
						)

				// commented_on_post section

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}

								{username_avatar_in_rest_cases}

								{post_text_content}
								
							</div>
						)

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}

								{username_avatar_in_rest_cases}

								{post_image_content}

							</div>
						)

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}

								{username_avatar_in_rest_cases}

								{post_video_content}

							</div>
						)

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}

								{username_avatar_in_rest_cases}

								{post_text_content}

								{post_image_content}
								
							</div>
						)

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}

								{username_avatar_in_rest_cases}

								{post_text_content}

								{post_video_content}

							</div>
						)

				// created_book

					} else if (data.notification_type === 'created_book'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_book_creating}

								{username_avatar_in_rest_cases}

								{book_content}

							</div>
						)


				// got_interested_in_book

					} else if (data.notification_type === 'got_interested_in_book'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_book_liking}

								{username_avatar_in_rest_cases}

								{book_content}

							</div>
						)

				// created_page

					} else if (data.notification_type === 'created_page'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_page_creating}

								{username_avatar_in_rest_cases}

								{page_content}

							</div>
						)

				// got_interested_in_page

					} else if (data.notification_type === 'got_interested_in_page'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_page_liking}

								{username_avatar_in_rest_cases}

								{page_content}

							</div>
						)

				// created_sport

					} else if (data.notification_type === 'created_sport'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_sport_creating}

								{username_avatar_in_rest_cases}

								{sport_content}

							</div>
						)

				// got_interested_in_sport

					} else if (data.notification_type === 'got_interested_in_sport'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_sport_liking}

								{username_avatar_in_rest_cases}

								{sport_content}

							</div>
						)

				// got_interested_in_advertisement

					} else if (data.notification_type === 'created_advertisement'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_ad_creating}

								{username_avatar_in_rest_cases}

								{ad_content}

							</div>
						)

				// 'got_interested_in_advertisement'

					} else if (data.notification_type === 'got_interested_in_advertisement'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_ad_liking}

								{username_avatar_in_rest_cases}

								{ad_content}

							</div>
						)

					} else {
						return (
							null
						)
					}

				})()}


			</div>
		);
	}
}
	
ComponentForShowingSocialPost.defaultProps = {

};

// export default ComponentForShowingSocialPost;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(ComponentForShowingSocialPost))

				// <p>
				// 	{ data.video_thumbnail_image }
				// </p>
				// <p>
				// 	{ data.total_likes }
				// </p>
				// <p>
				// 	{ data.total_shares }
				// </p>
				// <p>
				// 	{ data.endpoint }
				// </p>
				// <p>
				// 	{ data.date_of_publishing }
				// </p>