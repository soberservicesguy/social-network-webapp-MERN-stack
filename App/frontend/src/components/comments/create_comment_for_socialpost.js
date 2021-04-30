
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

			tracked_width1: 0,
			tracked_height1: 0,
			tracked_width2: 0,
			tracked_height2: 0,

		}
		this.resizeHandler = this.resizeHandler.bind(this);

	}

// COMPONENT DID MOUNT
	componentDidMount() {
		this.resizeHandler();
		window.addEventListener('resize', this.resizeHandler);
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.resizeHandler);
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
			},


		// round text input
			roundTextInputContainer:{
				width:'100%', 
				height:40,
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
				width: '15%',
				// width: 100,
				height: 30,
				// backgroundColor: utils.maroonColor,
				// borderRadius: this.state.tracked_height2 / 2,
				// borderWidth: 1, 
				// borderStyle: 'solid',
				// borderColor: utils.maroonColor, 

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


		}

		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: `/socialposts/id=${this.props.parentDetailsPayload.endpoint}` }} />

		} else {

		return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object

				<div style={styles.outerContainer}>

				{/* round text input */}
					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								ref={ (divElement) => { this.divElement1 = divElement } }
								placeholder="Type your comment" 
								type="text" 
								name="post_text"
								multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, text: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>

				{/* round button inside round text input */}
						<div 
							ref={ (divElement) => { this.divElement2 = divElement } }
							style={styles.roundButtonInsideTextInputContainer}
						>
							<button style={styles.roundButtonInsideTextInput}
								onClick={ () => {
									let setResponseInCurrentSocialpost = (arg) => this.props.set_current_socialpost(arg)
									let redirectToNewSocialpost = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	
									let redirectToNew = this.props.redirectToNew

									// first create child object
									axios.post(utils.baseUrl + '/socialposts/create-comment-for-socialpost', 
										{
											comment_text: this.state.text,
											socialpost_endpoint: this.props.parentDetailsPayload.endpoint,
										})
									.then(function (response) {
										console.log('COMMENTED')
										console.log(response.data) // current image screen data
										
										// set to current parent object
										setResponseInCurrentSocialpost(response.data)

										// change route to current_image	
										if (redirectToNew){
											redirectToNewSocialpost()							
										}

									})
									.catch(function (error) {
										console.log(error)
									});						

								}}
							>
								<Comment style={{color:utils.maroonColor, fontSize:30,}}/>
							</button>
						</div>
					</div>


				</div>
			);
		}
	}
}
	
CreateCommentForSocialpost.defaultProps = {

};

// export default CreateCommentForSocialpost;  // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateCommentForSocialpost))