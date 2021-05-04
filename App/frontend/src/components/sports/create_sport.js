
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



class CreateSport extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,

			sport_name: '',
			sport_image: '',
			sport_description: '',

			new_sport_id:'',
		}

	}


// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		const styles = {
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
			},

		// upload image and create ad button
			buttonsContainer:{
				width:'80%',
				margin:'auto',
				marginTop:10,
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between',
			},
			uploadImageButton:{
				fontWeight:'bold',
				color:utils.maroonColor
			},

			createSportButton:{
				outline:'none',
				background:'none',
				border:'none',
				color:utils.maroonColor,
				fontWeight:'bold',
			}

		}


		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params


		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: `/sports/:id=${this.state.new_sport_id}` }} />

		} else {

			return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object

				<div style={{backgroundColor: 'white', paddingTop:20, paddingBottom:20}}>

				{/* round text input */}
					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								ref={ (divElement) => { this.divElement1 = divElement } }
								type="text" 
								name="post_text"
								multiline={true}
								placeholder="Type your sport_name" // placeholder 
								onChange={ (event) => this.setState( prev => ({...prev, sport_name: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>

					</div>


					<div style={styles.roundTextInputContainer}>
						<form style={{marginTop:10}}>
							<input 
								type="text" 
								multiline={true}
								name="post_text"
								placeholder="Type your sport_description" // placeholder 
								onChange={ (event) => this.setState( prev => ({...prev, sport_description: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>

					</div>



					<div style={styles.buttonsContainer}>
						<div>
							<label htmlFor="myInput">
								{/* below div will act as myInput button*/}
								<div style={styles.uploadImageButton}>
									Upload Image
								</div>
							</label>
							<input
								id="myInput"
								style={{display:'none'}}
								type={"file"}
								// multiple="multiple" // for selecting multiple files
								enctype="multipart/form-data"
								name="sport_image" // name of input field or fieldName simply
								onChange={(event) => {
									// console logging selected file from menu
									console.log( event.target.files[0] ) // gives first file
									// setState method with event.target.files[0] as argument
									this.setState(prev => ({...prev, sport_image: event.target.files[0]}))
								}}
							/>
						</div>						

						<button style={styles.createSportButton}
							onClick={ () => {

								let setResponseInCurrentSport = (arg) => this.props.set_current_sport(arg)
								let redirectToNewSport = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	
								let setNewSportIDToState = (response) => this.setState(prev => ({...prev, new_sport_id: response.data.new_sport.sport_endpoint }))	


								const formData = new FormData()
								formData.append('sport_name', this.state.sport_name)
								formData.append('sport_description', this.state.sport_description)
								formData.append('sport_image', this.state.sport_image, this.state.sport_image.name)

								axios.post(utils.baseUrl + '/sports/create-sport-with-user', formData)
								.then(function (response) {
									// console.log(response.data) // current sport screen data
									
									setNewSportIDToState(response)

									// set to current parent object
									setResponseInCurrentSport(response.data.new_sport)

									// change route to current_sport
									redirectToNewSport()

								})
								.catch(function (error) {
									console.log(error)
								});						

							}}
						>
						<p style={styles.innerText}>
							Press To Create Sport
						</p>
						</button>
					</div>

				</div>

			);
		}			
	}
}
	
CreateSport.defaultProps = {

};

// export default CreateSport // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateSport))