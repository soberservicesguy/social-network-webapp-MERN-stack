
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

		// const data = this.props.dataPayloadFromParent // data being plugged from parent flatlist

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


		const data = {type_of_post:'text_with_image_post'} 
		// var base64Image = "data:image/jpeg;base64," + data.image_for_post

		return (
			<div>

				{(() => {

					if (data.type_of_post === 'text_post'){

						return (
							<div style={styles.outerContainer}>
								<div style={styles.avatarAndUsernameContainer}>
									<div style={styles.avatarContainer}>
										<img 
											alt="" 
											// src={base64Image} 
											src={utils.image}
											style={styles.avatarImage}
										/>
									</div>
									<div style={styles.usernameContainer}>
										<p style={styles.usernameText}>
											Arsalan
										</p>
									</div>
								</div>

								<div style={styles.postTextContainer}>
									<p style={styles.postText}>
										post text post text post text post text post text post text 
										{ data.post_text }
									</p>
								</div>
								
							</div>
						)

					} else if (data.type_of_post === 'image_post'){

						return (
							<div style={styles.outerContainer}>
								<div style={styles.avatarAndUsernameContainer}>
									<div style={styles.avatarContainer}>
										<img 
											alt="" 
											// src={base64Image} 
											src={utils.image}
											style={styles.avatarImage}
										/>
									</div>
									<div style={styles.usernameContainer}>
										<p style={styles.usernameText}>
											Arsalan
										</p>
									</div>
								</div>

								<div style={styles.postImageContainer}>
									<img 
										// src={base64Image} 
										src={utils.image}
										alt="" 
										style={styles.postImage}
									/>
								</div>
								
							</div>
						)

					} else if (data.type_of_post === 'video_post'){

						return (
							<div style={styles.outerContainer}>
								<div style={styles.avatarAndUsernameContainer}>
									<div style={styles.avatarContainer}>
										<img 
											alt="" 
											// src={base64Image} 
											src={utils.image}
											style={styles.avatarImage}
										/>
									</div>
									<div style={styles.usernameContainer}>
										<p style={styles.usernameText}>
											Arsalan
										</p>
									</div>
								</div>


								<div style={styles.postVideoContainer}>
									<video 
										width="100%" 
										height="300" 
										controls
										src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ data.video_for_post }`}} 
									/>
								</div>

							</div>
						)

					} else if (data.type_of_post === 'text_with_image_post'){

						return (
							<div style={styles.outerContainer}>
								<div style={styles.avatarAndUsernameContainer}>
									<div style={styles.avatarContainer}>
										<img 
											alt="" 
											// src={base64Image} 
											src={utils.image}
											style={styles.avatarImage}
										/>
									</div>
									<div style={styles.usernameContainer}>
										<p style={styles.usernameText}>
											Arsalan
										</p>
									</div>
								</div>

								<div style={styles.postTextContainer}>
									<p style={styles.postText}>
										post text post text post text post text post text post text 
										{ data.post_text }
									</p>
								</div>

								<div style={styles.postImageContainer}>
									<img 
										// src={base64Image} 
										src={utils.image}
										alt="" 
										style={styles.postImage}
									/>
								</div>
								
							</div>
						)

					} else if (data.type_of_post === 'text_with_video_post'){

						return (
							<div style={styles.outerContainer}>
								<div style={styles.avatarAndUsernameContainer}>
									<div style={styles.avatarContainer}>
										<img 
											alt="" 
											// src={base64Image} 
											src={utils.image}
											style={styles.avatarImage}
										/>
									</div>
									<div style={styles.usernameContainer}>
										<p style={styles.usernameText}>
											Arsalan
										</p>
									</div>
								</div>

								<div style={styles.postTextContainer}>
									<p style={styles.postText}>
										post text post text post text post text post text post text 
										{ data.post_text }
									</p>
								</div>

								<div style={styles.postVideoContainer}>
									<video 
										width="100%" 
										height="300" 
										controls
										src={{uri: `http://localhost:3001/video-stream/video?endpoint=${ data.video_for_post }`}} 
									/>
								</div>

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