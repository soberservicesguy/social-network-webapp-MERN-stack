
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


class CreateLikeForPage extends Component {
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

		var styles = {
			buttonWithoutBG:{
				outline:'none',
				borderStyle:'solid',
				borderColor:'white',
				backgroundColor:'white'
			}
		}


		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/Individual-Page" }} />

		} else {

		return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object

				<div style={styles.outerContainer}>

					<button style={styles.buttonWithoutBG}
						onClick={ () => {

							let setResponseInCurrentPage = (arg) => this.props.set_current_page(arg)
							let redirectToNewPage = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	
							let redirectToNew = this.props.redirectToNew

							let endpoint = (this.props.parentDetailsPayload.endpoint) ? this.props.parentDetailsPayload.endpoint : this.props.current_page.endpoint

							axios.post(utils.baseUrl + '/pages/create-interest-for-page', 
								{
									// page_endpoint: this.props.parentDetailsPayload.endpoint,
									page_endpoint: endpoint,
								})
							.then(function (response) {
								// console.log(response.data) // current blogpost screen data
								
								// set to current parent object
								setResponseInCurrentPage({...response.data, endpoint: endpoint})

								// change route to current_blogpost	
								if (redirectToNew){
									redirectToNewPage()							
								}

							})
							.catch(function (error) {
								console.log(error)
							});						

						}}
					>
						<p style={styles.innerText}>
							Press To Show Interest
						</p>
					</button>
				</div>
			);
		}
	}
}
	
CreateLikeForPage.defaultProps = {

};

// export default CreateLikeForPage;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateLikeForPage))