
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import {
	Grid, 
	// TextField,
	// Modal, 
	// Button 
} from "@material-ui/core";

import {
	withRouter,
	Redirect,
} from "react-router-dom";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";





class CreateSocialPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,
			post_text: '',
			social_post_image: '',
			social_post_video: '',

			tracked_width1: 0,
			tracked_height1: 0,
			tracked_width2: 0,
			tracked_height2: 0,

			new_socialpost_id: null,

		}
		this.resizeHandler = this.resizeHandler.bind(this);
	}

	resizeHandler() {
		this.setState(prev => ({
			...prev, 
			tracked_width1:this.divElement1.clientWidth, 
			tracked_height1:this.divElement1.clientHeight,
			tracked_width2:this.divElement2.clientWidth,
			tracked_height2:this.divElement2.clientHeight,
		}))
	}

	componentDidMount() {
		this.resizeHandler();
		window.addEventListener('resize', this.resizeHandler);
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.resizeHandler);
	}

	render() {

	// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

	// current screen size
		const { _xs, _sm, _md, _lg, _xl } = this.props

		const styles = {
			outerContainer:{
				// backgroundColor: 'white',
			},

			avatarAndCreatePostContainer:{
				width:'95%',
				margin:'auto',
				display:'flex',
				flexDirection:'row',
				height:100,
				// backgroundColor: '#000000'
				justifyContent: 'center',
				alignItems:'center',
			},
			createPostContainer:{
				flex: 5,
				// backgroundColor: '#000000',
				paddingTop:10,
			},
			avatarContainer:{
				flex: 1,
			},

		// round text input
			roundTextInputContainer:{
				width:'95%', 
				height:50,
				margin:'auto',
				// marginBottom:0,
				// backgroundColor: '#000000',
			},
			roundTextInput:{
				outline:'none', 
				width:'100%', 
				height:50, 
				paddingLeft:20,
				paddingRight:100, 
				color:'black', 
				borderRadius:30,
				borderWidth:1, 
				borderStyle:'solid',
				borderColor:'#eee', 
				backgroundColor: '#eee',
			},

		// roundButtonInsideTextInput
			roundButtonInsideTextInputContainer:{
				width: '20%',
				// width: 100,
				height: 40,
				backgroundColor: utils.maroonColor,
				borderRadius: this.state.tracked_height2 / 2,
				borderWidth: 1, 
				borderStyle: 'solid',
				borderColor: utils.maroonColor, 

				position: 'relative',
				bottom: (this.state.tracked_height2 + 2) + (this.state.tracked_height1 + 2 - this.state.tracked_height2 - 2)/2, // self_height_including_border_thickness + difference in heights of both / 2
				left: this.state.tracked_width1 + 2 - this.state.tracked_width2 - 10, // tracked_width - self_width - some_gap 
			},
			roundButtonInsideTextInput:{
				width:'100%',
				height:'100%',
				border:'none',
				background: 'none',
				outline:'none',
				color:'white',
				fontWeight:'bold',
			},

			uploadImageAndVideoContainer:{
				margin:'auto',
				marginTop:5,
				width:'75%',
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between' 
			},
			uploadImageAndVideoButton:{
				fontWeight:'bold',
				color:utils.maroonColor
			}

		}

		var base64Image = "data:image/jpeg;base64," + this.props.user_avatar_image

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: `/socialposts/:id=${this.state.new_socialpost_id}` }} />

		} else {
			return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
				<div style={styles.outerContainer}>

					<div style={styles.avatarAndCreatePostContainer}>
						<div styles={styles.avatarContainer}>
							<img 
								alt="" 
								src={base64Image}
								// src={utils.image}
								// src={require("../../images/samosa.jpeg").default}
								style={{
									width:80,
									height:80,
									resizeMode: "stretch",
									borderRadius: 80/2,
								}}
							/>
						</div>

						<div style={styles.createPostContainer}>
							{/* round text input */}
							<div style={styles.roundTextInputContainer}>
								<form>
									<input 
										ref={ (divElement) => { this.divElement1 = divElement } }
										placeholder="What's in your mind" 
										type="text" 
										name="post_text"
										multiline={true}
										onChange={ (event) => this.setState( prev => ({...prev, post_text: event.target.value})) }
										style={styles.roundTextInput} 
									/>
								</form>

								{/* round button inside round text input */}
								<div 
									ref={ (divElement) => { this.divElement2 = divElement } }
									style={styles.roundButtonInsideTextInputContainer}
								>
									<button 
										style={styles.roundButtonInsideTextInput}
										onClick={ () => {

											let setResponseInCurrentSocialPost = (response) => this.props.set_current_socialpost(response.data.new_socialpost)
											let redirectToNewSocialPost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	
											let setNewSocialpostIDToState = (response) => this.setState(prev => ({...prev, new_socialpost_id: response.data.socialpost_endpoint }))	
											
											const formData = new FormData()

											formData.append('post_text', this.state.post_text)
											if(this.state.social_post_image !== ''){
												formData.append('social_post_image', this.state.social_post_image, this.state.social_post_image.name)
											}
											if(this.state.social_post_video !== ''){
												formData.append('social_post_video', this.state.social_post_video, this.state.social_post_video.name)
											}

											axios.post(utils.baseUrl + '/socialposts/create-socialpost-with-user', formData)
											.then(function (response) {
												// console.log(response.data) // current socialpost screen data
												
												setNewSocialpostIDToState(response)
												// set to current parent object
												setResponseInCurrentSocialPost(response)

												// change route to current_socialpost
												redirectToNewSocialPost()

											})
											.catch(function (error) {
												console.log(error)
											});						

										}}
									>
										Create Post
									</button>
								</div>


							</div>

							<div style={styles.uploadImageAndVideoContainer}>
								
								{/*image upload*/}
								<div>
									<label htmlFor="myImageInput">
										{/* below div will act as myInput button*/}
										<div style={styles.uploadImageAndVideoButton}>
											Upload Image
										</div>
									</label>
									<input
										id="myImageInput"
										style={{display:'none'}}
										type={"file"}
										onChange={(event) => {
											// console logging selected file from menu
											// setState method with event.target.files[0] as argument
											this.setState(prev => ({...prev, social_post_image: event.target.files[0]}))
											// console.log( event.target.files[0] ) // gives first file
										}}
									/>
								</div>

								{/*video upload*/}
								<div>
									<label htmlFor="myVideoInput">
										{/* below div will act as myInput button*/}
										<div style={styles.uploadImageAndVideoButton}>
											Upload Video
										</div>
									</label>
									<input
										id="myVideoInput"
										style={{display:'none'}}
										type={"file"}
										onChange={(event) => {
											// console logging selected file from menu
											// console.log( event.target.files[0] ) // gives first file
											// setState method with event.target.files[0] as argument
											this.setState(prev => ({...prev, social_post_video: event.target.files[0]}))
										}}

									/>
								</div>
							</div>

						</div>

					</div>
				</div>
			);
		}			
	}
}

	
CreateSocialPost.defaultProps = {

};

// export default CreateSocialPost // REMOVE withResponsiveness and withStyles as much as possible
// export default withRouter(withResponsiveness(withStyles(styles)(CreateSocialPost)))
export default withRouter(withResponsiveness(CreateSocialPost))