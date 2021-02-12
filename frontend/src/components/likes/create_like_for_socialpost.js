
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

import ThumbUp from '@material-ui/icons/ThumbUp';


class CreateLikeForSocialpost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			redirectToRoute: false,
		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		var styles = {
			buttonWithoutBG:{
				outline:'none',
				borderStyle:'solid',
				borderColor:'white',
				backgroundColor:'white'
			}
		}

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/Individual-Socialpost" }} />

		} else {

		return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object

				<div>

					<button style={styles.buttonWithoutBG}
						onClick={ () => {

							let setResponseInCurrentSocialpost = (arg) => this.props.set_current_socialpost(arg)
							let redirectToNewSocialpost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

							axios.post(utils.baseUrl + '/socialposts/create-like-for-socialpost', 
								{
									socialpost_endpoint: this.props.parentDetailsPayload.endpoint,
								})
							.then(function (response) {
								console.log(response.data) // current blogpost screen data
								
								// set to current parent object
								setResponseInCurrentSocialpost(response.data)

								// change route to current_blogpost	
								redirectToNewSocialpost()							

							})
							.catch(function (error) {
								console.log(error)
							});						

						}}
					>
						<ThumbUp style={{color:utils.maroonColor, fontSize:30,}}/>
					</button>
				</div>
			);
		}
	}
}
	
CreateLikeForSocialpost.defaultProps = {

};

// export default CreateLikeForSocialpost;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateLikeForSocialpost))
