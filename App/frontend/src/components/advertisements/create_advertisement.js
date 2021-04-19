
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


class CreateAdvertisement extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,

			ad_name: '',
			ad_image: '',
			ad_description: '',

			tracked_width1: 0,
			tracked_height1: 0,

		}
		this.resizeHandler = this.resizeHandler.bind(this);

	}


	resizeHandler() {
		this.setState(prev => ({
			...prev, 
			tracked_width1:this.divElement1.clientWidth, 
			tracked_height1:this.divElement1.clientHeight,
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

			createAdButton:{
				outline:'none',
				background:'none',
				border:'none',
				color:utils.maroonColor,
				fontWeight:'bold',
			}

		}

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/Individual-Advertisement" }} />

		} else {

			return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
				<div>

				{/* round text input */}
					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								ref={ (divElement) => { this.divElement1 = divElement } }
								placeholder="Type your ad_name" 
								type="text" 
								name="post_text"
								multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, ad_name: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>

					</div>

					<div style={styles.roundTextInputContainer}>
						<form style={{marginTop:10}}>
							<input 
								placeholder="Type your ad_description" 
								type="text" 
								name="post_text"
								multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, ad_description: event.target.value})) }
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
								name="ad_image" // name of input field or fieldName simply
								type={"file"}
								// multiple="multiple" // for selecting multiple files
								enctype="multipart/form-data"
								onChange={(event) => {
									// console logging selected file from menu
									console.log( event.target.files[0] ) // gives first file
									// setState method with event.target.files[0] as argument
									this.setState(prev => ({...prev, ad_image: event.target.files[0]}))
								}}
							/>
						</div>


						<button style={styles.createAdButton}
							onClick={ () => {

								let setResponseInCurrentAdvertisement = (arg) => this.props.set_current_advertisement(arg)
								let redirectToNewAdvertisement = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

								const formData = new FormData()
								if (this.state.ad_description !== ''){
									formData.append('ad_description', this.state.ad_description)
								}
								if (this.state.ad_name !== ''){
									formData.append('ad_name', this.state.ad_name)
								}
								if (this.state.ad_image !== ''){
									formData.append('ad_image', this.state.ad_image, this.state.ad_image.name)
								}

								axios.post(utils.baseUrl + '/advertisements/create-ad-with-user', formData)
								.then(function (response) {
									console.log(response.data) // current advertisement screen data
									
									// set to current parent object
									setResponseInCurrentAdvertisement(response.data)

									// change route to current_advertisement
									redirectToNewAdvertisement()

								})
								.catch(function (error) {
									console.log(error)
								});						

							}}
						>
							<p style={styles.innerText}>
								Create Ad
							</p>
						</button>
					</div>

				</div>
			);
		}			
	}
}
	
CreateAdvertisement.defaultProps = {

};

// export default CreateAdvertisement // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateAdvertisement))
