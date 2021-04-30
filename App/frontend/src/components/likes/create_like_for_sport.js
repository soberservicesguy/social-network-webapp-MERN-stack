
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

class CreateLikeForSport extends Component {
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
			return <Redirect to = {{ pathname: "/Individual-Sport" }} />

		} else {

		return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object


				<div>

					<button style={styles.buttonWithoutBG}
						onClick={ () => {

							let setResponseInCurrentSport = (arg) => this.props.set_current_sport(arg)
							let redirectToNewSport = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	
							let redirectToNew = this.props.redirectToNew

							axios.post(utils.baseUrl + '/sports/create-interest-for-sport', 
								{
									sport_endpoint: this.props.parentDetailsPayload.endpoint,
								})
							.then(function (response) {
								console.log(response.data) // current blogpost screen data
								
								// set to current parent object
								setResponseInCurrentSport(response.data)

								// change route to current_blogpost	
								if (redirectToNew){
									redirectToNewSport()							
								}


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
	
CreateLikeForSport.defaultProps = {

};

// export default CreateLikeForSport;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(withStyles(styles)(CreateLikeForSport)))
