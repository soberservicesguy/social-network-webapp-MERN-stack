
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

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

import Comment from '@material-ui/icons/Comment';

class CreateCommentForSocialpost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			redirectToRoute: false,
			text: '',
			// commenting_timestamp: '',
		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		var styles = {
			buttonWithoutBG:{
				outline:'none',
				borderStyle:'solid',
				borderColor:'white',
				backgroundColor:'white',

				position:'relative',
				top:-30, // self_height
				left: 200, // width_of_Textinput - self_width
			}
		}

		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/Individual-Socialpost" }} />

		} else {

		return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object

				<div style={styles.outerContainer}>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your comment" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, text: event.target.value})) }
							/>
						</form>
				  	</div>


					<button style={styles.buttonWithoutBG}
						onClick={ () => {
							let setResponseInCurrentSocialpost = (arg) => this.props.set_current_socialpost(arg)
							let redirectToNewSocialpost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

							// first create child object
							axios.post(utils.baseUrl + '/socialposts/create-comment-for-socialpost', 
								{
									comment_text: this.state.text,
									socialpost_endpoint: this.props.parentDetailsPayload.endpoint,
								})
							.then(function (response) {
								console.log(response.data) // current image screen data
								
								// set to current parent object
								setResponseInCurrentSocialpost(response.data)

								// change route to current_image	
								redirectToNewSocialpost()							

							})
							.catch(function (error) {
								console.log(error)
							});						

						}}
					>
						<Comment style={{color:utils.maroonColor, fontSize:30,}}/>
					</button>
				</div>
			);
		}
	}
}
	
CreateCommentForSocialpost.defaultProps = {

};

// export default CreateCommentForSocialpost;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateCommentForSocialpost))