import { 
	// withRouter,
	Link,
} from "react-router-dom";

import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../responsiveness_hook";

import utils from "../utilities";

import Create from '@material-ui/icons/Create'
import ThumbUp from '@material-ui/icons/ThumbUp'
import Share from '@material-ui/icons/Share'
import Comment from '@material-ui/icons/Comment'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import Book from '@material-ui/icons/Book'
import Pageview from '@material-ui/icons/Pageview'
import SportsFootball from '@material-ui/icons/SportsFootball'
import FeaturedVideo from '@material-ui/icons/FeaturedVideo'


class ComponentForShowingNotification extends Component {
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


		let data = this.props.dataPayloadFromParent

	/* activity headers start here */
		let user_activity_header_for_post_create = (
	  		<Link 
	  			to={`/socialposts/:id=${data.endpoint}`} 
	  			style={{color: 'inherit', textDecoration: 'inherit'}}
			>
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
				<div style={{...styles.avatarAndUsernameContainer, alignItems:'center', marginBottom:30, width:'70%', margin:'auto'}}>
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
								<p style={{fontSize:20, fontStyle:'italic', fontWeight:'bold' }}>Nothing New</p>
							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

							</div>
						)

					} else if (data.notification_type === 'created_post' && data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_post_create}

							</div>
						)

				// liked_post section

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}

							</div>
						)

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}
								
							</div>
						)

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}

							</div>
						)

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}
								
							</div>
						)

					} else if (data.notification_type === 'liked_post' && data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_like}

							</div>
						)

				// shared_post section

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

							</div>
						)

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}
								
							</div>
						)

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

							</div>
						)

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

							</div>
						)

					} else if (data.notification_type === 'shared_post' && data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_share}

							</div>
						)

				// commented_on_post section

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}
								
							</div>
						)

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}

							</div>
						)

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}

							</div>
						)

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}
								
							</div>
						)

					} else if (data.notification_type === 'commented_on_post' && data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_comment}

							</div>
						)

				// created_book

					} else if (data.notification_type === 'created_book'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_book_creating}

							</div>
						)


				// got_interested_in_book

					} else if (data.notification_type === 'got_interested_in_book'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_book_liking}

							</div>
						)

				// created_page

					} else if (data.notification_type === 'created_page'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_page_creating}

							</div>
						)

				// got_interested_in_page

					} else if (data.notification_type === 'got_interested_in_page'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_page_liking}

							</div>
						)

				// created_sport

					} else if (data.notification_type === 'created_sport'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_sport_creating}

							</div>
						)

				// got_interested_in_sport

					} else if (data.notification_type === 'got_interested_in_sport'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_sport_liking}

							</div>
						)

				// got_interested_in_advertisement

					} else if (data.notification_type === 'created_advertisement'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_ad_creating}

							</div>
						)

				// 'got_interested_in_advertisement'

					} else if (data.notification_type === 'got_interested_in_advertisement'){

						return (
							<div style={styles.outerContainer}>

							{/* incorporating top line saying some user did this */}
								{user_activity_header_for_ad_liking}

							</div>
						)

					} else {
						return (
							null
						)
					}

				})()}


			</div>
		)

	}
}
	
ComponentForShowingNotification.defaultProps = {
};

export default ComponentForShowingNotification