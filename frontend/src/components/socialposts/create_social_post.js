
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import {
	TextField,
	Grid, 
	// Modal, 
	// Button 
} from "@material-ui/core";

import {
	withRouter,
	Redirect,
} from "react-router-dom";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";


const styles = theme => ({
	root: {
		height: 100,
		backgroundColor: '#000000',
		color: props => (props.cool) ? 'red' : 'black',
		[theme.breakpoints.up('sm')]:{
			// paddingLeft:200
		},
	},
	buttonWithoutBG:{
		marginTop:50,
		marginBottom:50,
	},
	innerText:{

	},
	textinputContainer:{
		// marginTop: windowHeight * 0.05, // or 30  gap
		// height: windowHeight * 0.1, // or 100
		// width: '100%',
		width:'80%',
		justifyContent: 'center', // vertically centered
		alignSelf: 'center', // horizontally centered
		backgroundColor: utils.lightGreen,
	},
	textinput:{
		marginTop:20,
		textAlign:'left',
		borderWidth:1,
		borderColor:(utils.lightGrey),
		borderStyle:'solid',
		paddingLeft:20,
		paddingTop:15,
		paddingBottom:15,
		fontSize:18,
	},
	outerContainer: {
	},
	bigBlue: {
	},
});


class CreateSocialPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,
			post_text: '',
			image_upload: '',
			video_upload: '',



			tracked_width1: 0,
			tracked_height1: 0,
			tracked_width2: 0,
			tracked_height2: 0,

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

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/Individual-SocialPost" }} />

		} else {

			return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
				<div style={styles.outerContainer}>

					<div style={{width:'90%', margin:'auto'}}>
						<form>
							<input 
								ref={ (divElement) => { this.divElement1 = divElement } }
								placeholder="What's in your mind" 
								type="text" 
								name="post_text"
								multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, post_text: event.target.value})) }
								style={{
									outline:'none', 
									width:'100%', 
									height:50, 
									paddingLeft:20,
									paddingRight:100, 
									color:'black', 
									borderRadius:30,
									borderWidth:1, 
									borderStyle:'solid',
									borderColor:'black', 
									backgroundColor: '#eee'
								}} 
							/>
						</form>
						<div 
							ref={ (divElement) => { this.divElement2 = divElement } }
							style={{
								width:'20%',
								// width:100,
								height:40,
								backgroundColor: '#000000',
								borderRadius:30,
								borderWidth:1, 
								borderStyle:'solid',
								borderColor:'black', 

								position:'relative',
								bottom: (this.state.tracked_height2 + 2) + (this.state.tracked_height1 + 2 - this.state.tracked_height2 - 2)/2, // self_height_including_border_thickness + difference in heights of both / 2
								left: this.state.tracked_width1 + 2 - this.state.tracked_width2 - 10, // tracked_width - self_width - some_gap 
							}}
						>
							<p style={{
								color:'white',
								textAlign:'center',
								margin:'auto',
								paddingTop:10,
								paddingBottom:10,
							}}>
								Create Post
							</p>
						</div>
					</div>

				{/*image upload*/}
					<div>
						<label htmlFor="myImageInput">
							{/* below div will act as myInput button*/}
							<div style={{width:20, height:20, backgroundColor: '#000000'}}>
							</div>
						</label>
						<input
							id="myImageInput"
							style={{display:'none'}}
							type={"file"}
							onChange={(event) => {
								// console logging selected file from menu
								// setState method with event.target.files[0] as argument
								this.setState(prev => ({...prev, image_upload: event.target.files[0]}))
								console.log( event.target.files[0] ) // gives first file
							}}
						/>
					</div>

				{/*video upload*/}
					<div>
						<label htmlFor="myVideoInput">
							{/* below div will act as myInput button*/}
							<div style={{width:20, height:20, backgroundColor: '#000000'}}>
							</div>
						</label>
						<input
							id="myVideoInput"
							style={{display:'none'}}
							type={"file"}
							onChange={(event) => {
								// console logging selected file from menu
								console.log( event.target.files[0] ) // gives first file
								// setState method with event.target.files[0] as argument
								this.setState(prev => ({...prev, video_upload: event.target.files[0]}))
							}}

						/>
					</div>



					<button style={styles.buttonWithoutBG}
						onClick={ () => {

							let setResponseInCurrentSocialPost = (arg) => this.props.set_current_socialpost(arg)
							let redirectToNewSocialPost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

							const formData = new FormData()

							formData.append('post_text', this.state.post_text)
							formData.append('image_upload', this.state.image_upload, this.state.image_upload.name)
							formData.append('video_upload', this.state.video_upload, this.state.video_upload.name)

							axios.post(utils.baseUrl + '/socialposts/create-socialpost-with-user', formData)
							.then(function (response) {
								console.log(response.data) // current socialpost screen data
								
								// set to current parent object
								setResponseInCurrentSocialPost(response.data)

								// change route to current_socialpost
								redirectToNewSocialPost()

							})
							.catch(function (error) {
								console.log(error)
							});						

						}}
					>
						<p style={styles.innerText}>
							Press To Create SocialPost
						</p>
					</button>
				</div>
			);
		}			
	}
}
	
CreateSocialPost.defaultProps = {

};

// export default CreateSocialPost // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(withStyles(styles)(CreateSocialPost)))
