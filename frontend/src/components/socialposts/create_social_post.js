
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
		height: 48,
		color: props => (props.cool) ? 'red' : 'black',
		[theme.breakpoints.up('sm')]:{
			paddingLeft:100
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
		width: '80%',
		justifyContent: 'center', // vertically centered
		alignSelf: 'center', // horizontally centered
		// backgroundColor: utils.lightGreen,
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
		}

	}


// COMPONENT DID MOUNT
	componentDidMount() {

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

				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your post_text" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, post_text: event.target.value})) }
							/>
						</form>
				  	</div>

					<div style={styles.textinputContainer}>
						<p style={styles.headingOverInput}>
							Post Image
						</p>
						<form className={styles.root} noValidate autoComplete="off">
							<input
								// multiple="multiple" // for selecting multiple files
								name="image_upload" // name of input field or fieldName simply
								enctype="multipart/form-data"
								type="file"
								onChange={(event) => {
									// console logging selected file from menu
									console.log( event.target.files[0] ) // gives first file
									// setState method with event.target.files[0] as argument
									this.setState(prev => ({...prev, image_upload: event.target.files[0]}))
								}}
							/>
						</form>
					</div>


					<div style={styles.textinputContainer}>
						<p style={styles.headingOverInput}>
							Post Video
						</p>
						<form className={styles.root} noValidate autoComplete="off">
							<input
								// multiple="multiple" // for selecting multiple files
								name="video_upload" // name of input field or fieldName simply
								enctype="multipart/form-data"
								type="file"
								onChange={(event) => {
									// console logging selected file from menu
									console.log( event.target.files[0] ) // gives first file
									// setState method with event.target.files[0] as argument
									this.setState(prev => ({...prev, video_upload: event.target.files[0]}))
								}}
							/>
						</form>
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
