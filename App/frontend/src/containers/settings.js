import React, {Component} from 'react';
import axios from 'axios';

// IMPORT connected components
// import {ConnectedSomeComponent} from "../redux_stuff/connected_components";

import utils from "../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../responsiveness_hook";


import {
	// withRouter,
	Link,
	Redirect,
} from "react-router-dom";


class SettingsContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {

			user_avatar_image: '',
			user_cover_image: '',

			user_name_in_profile: '',
			user_brief_intro: '',
			user_about_me: '',
			user_working_zone: '',
			user_education: '',
			user_contact_details: '',

			redirectToRoute: false,

		}
	}

	componentDidMount(){

	}


	update_settings(){

		let set_user_name_in_profile_callback = (response) => this.props.set_user_name_in_profile( response.data.user_details.user_name_in_profile )
		let set_user_avatar_image_callback = (response) => this.props.set_user_avatar_image( response.data.user_details.user_avatar_image )
		let set_user_cover_image_callback = (response) => this.props.set_user_cover_image( response.data.user_details.user_cover_image )
		let set_user_brief_intro_callback = (response) => this.props.set_user_brief_intro( response.data.user_details.user_brief_intro )
		let set_user_about_me_callback = (response) => this.props.set_user_about_me( response.data.user_details.user_about_me )
		let set_user_working_zone_callback = (response) => this.props.set_user_working_zone( response.data.user_details.user_working_zone )
		let set_user_education_callback = (response) => this.props.set_user_education( response.data.user_details.user_education )
		let set_user_contact_details_callback = (response) => this.props.set_user_contact_details( response.data.user_details.user_contact_details )

		let redirectToHomeCallback = () => this.setState(prev => ({...prev, redirectToRoute: true }))

		// upload file with axios request
		const formData = new FormData()
		if (this.state.user_name_in_profile !== ''){
			formData.append('user_name_in_profile', this.state.user_name_in_profile)
		}
		if (this.state.user_brief_intro !== ''){
			formData.append('user_brief_intro', this.state.user_brief_intro)
		}
		if (this.state.user_about_me !== ''){
			formData.append('user_about_me', this.state.user_about_me)
		}
		if (this.state.user_working_zone !== ''){
			formData.append('user_working_zone', this.state.user_working_zone)
		}
		if (this.state.user_education !== ''){
			formData.append('user_education', this.state.user_education)
		}
		if (this.state.user_contact_details !== ''){
			formData.append('user_contact_details', this.state.user_contact_details)
		}

		if(this.state.user_avatar_image !== ''){
			formData.append('avatar_image', this.state.user_avatar_image, this.state.user_avatar_image.name)
		}
		if(this.state.user_cover_image !== ''){
			formData.append('cover_image', this.state.user_cover_image, this.state.user_cover_image.name)
		}


		if(this.state.user_avatar_image !== '' && this.state.user_cover_image !== ''){

			axios.post(utils.baseUrl + '/users/update-settings', formData, 
			// {
			// 	onUploadProgress: progressEvent => {
			// 		console.log( 'upload progress: ' + Math.round((progressEvent.loaded / progressEvent.total)*100) + '%' )
			// }}
			)
			.then(function (response) {

				if (response.data.success === true){
					console.log('UPDATED SUCCESSFULLY')

					console.log(response.data)

					set_user_name_in_profile_callback(response)
					set_user_avatar_image_callback(response)
					set_user_cover_image_callback(response)
					set_user_brief_intro_callback(response)
					set_user_about_me_callback(response)
					set_user_working_zone_callback(response)
					set_user_education_callback(response)
					set_user_contact_details_callback(response)

					redirectToHomeCallback()
				}

			})
			.catch(function (error) {
				console.log(error);
			});	
		}

	}

	render() {

		const styles = {
			outerContainer:{
				backgroundColor: 'white',
				// height:500,
				marginBottom:10,
				paddingTop:30,
				paddingBottom:30,
			},


		// round text input
			roundTextInputContainer:{
				width:'55%', 
				height:50,
				margin:'auto',
				marginTop:10,
				marginLeft:10,
				marginRight:10,
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

		// roundButton
			formAndRounButtonContainer:{
				marginTop:20,
				// flex:1,
				flexBasis:'50%',
				// width: '20%',
				// width: 100,
				height: 40,
				backgroundColor: 'none',
				borderRadius: 40,
				borderWidth: 1, 
				borderStyle: 'solid',
				borderColor: 'grey', 
				backgroundColor: 'grey',

				// position: 'relative',
				// bottom: (this.state.tracked_height2 + 2) + (this.state.tracked_height1 + 2 - this.state.tracked_height2 - 2)/2, // self_height_including_border_thickness + difference in heights of both / 2
				// left: this.state.tracked_width1 + 2 - this.state.tracked_width2 - 10, // tracked_width - self_width - some_gap 
			},
			roundButton:{
				width:'100%',
				height:'100%',
				border:'none',
				background: 'none',
				outline:'none',
				color:'white',
				fontWeight:'bold',
			},

			uploadImageContainer:{
				flexBasis:'50%',
				// height:60,
				margin:'auto',
				// marginTop:5,
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between', 
				alignItems:'center',
			},
			uploadImageButton:{
				paddingTop:20,
				// paddingBottom:20,
				fontWeight:'bold',
				color:'grey'
			}

		}

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/socialposts" }} />

		} else {

			return(
				<div style={styles.outerContainer}>
				

					<div style={{
						width:'80%',
						margin:'auto',
						display:'flex',
						flexDirection:'column',
						justifyContent: 'space-around',
						alignItems:'center',
						// height:60,
						marginBottom:20,
					}}>

						<div style={styles.roundTextInputContainer}>
							<form>
								<input 
									placeholder="Set your name to show" 
									type="text" 
									// name="post_text"
									// multiline={true}
									onChange={ (event) =>  this.setState(prev => ({...prev, user_name_in_profile: event.target.value})) }
									style={styles.roundTextInput} 
								/>
							</form>
						</div>
	
						<div style={styles.roundTextInputContainer}>
							<form>
								<input 
									placeholder="Type your Brief Into" 
									type="text" 
									// name="post_text"
									// multiline={true}
									onChange={ (event) =>  this.setState(prev => ({...prev, user_brief_intro: event.target.value})) }
									style={styles.roundTextInput} 
								/>
							</form>
						</div>

						<div style={styles.roundTextInputContainer}>
							<form>
								<input 
									placeholder="Set your about me" 
									type="text" 
									// name="post_text"
									// multiline={true}
									onChange={ (event) =>  this.setState(prev => ({...prev, user_about_me: event.target.value})) }
									style={styles.roundTextInput} 
								/>
							</form>
						</div>


						<div style={styles.roundTextInputContainer}>
							<form>
								<input 
									placeholder="Set your working zone" 
									type="text" 
									// name="post_text"
									// multiline={true}
									onChange={ (event) =>  this.setState(prev => ({...prev, user_working_zone: event.target.value})) }
									style={styles.roundTextInput} 
								/>
							</form>
						</div>

						<div style={styles.roundTextInputContainer}>
							<form>
								<input 
									placeholder="Set your education" 
									type="text" 
									// name="post_text"
									// multiline={true}
									onChange={ (event) =>  this.setState(prev => ({...prev, user_education: event.target.value})) }
									style={styles.roundTextInput} 
								/>
							</form>
						</div>
						<div style={styles.roundTextInputContainer}>
							<form>
								<input 
									placeholder="Set your contact details" 
									type="text" 
									// name="post_text"
									// multiline={true}
									onChange={ (event) =>  this.setState(prev => ({...prev, user_contact_details: event.target.value})) }
									style={styles.roundTextInput} 
								/>
							</form>
						</div>


					</div>

					<div style={{
						display:'flex',
						flexDirection:'row',
						justifyContent: 'space-around',
						alignItems:'center',
						height:60,
						width:'80%',
						margin:'auto',
						marginBottom:20,
					}}>
						{/*image upload*/}
						<div>
							<label htmlFor="myImageInput">
								{/* below div will act as myInput button*/}
								<div style={styles.uploadImageButton}>
									Upload Avatar
								</div>
							</label>
							<input
								id="myImageInput"
								style={{display:'none'}}
								enctype="multipart/form-data"
								name="avatar_image" // name of input field or fieldName simply
								enctype="multipart/form-data"
								type="file"
								onChange={(event) => {
									// console logging selected file from menu
									console.log( event.target.files[0] ) // gives first file
									// setState method with event.target.files[0] as argument
									this.setState(prev => ({...prev, user_avatar_image: event.target.files[0]}))
								}}
							/>
						</div>


						<div>
							<label htmlFor="myCoverImageInput">
								{/* below div will act as myInput button*/}
								<div style={styles.uploadImageButton}>
									Upload Cover Image
								</div>
							</label>
							<input
								id="myCoverImageInput"
								style={{display:'none'}}
								enctype="multipart/form-data"
								name="cover_image" // name of input field or fieldName simply
								enctype="multipart/form-data"
								type="file"
								onChange={(event) => {
									// console logging selected file from menu
									console.log( event.target.files[0] ) // gives first file
									// setState method with event.target.files[0] as argument
									this.setState(prev => ({...prev, user_cover_image: event.target.files[0]}))
								}}
							/>
						</div>

					</div>



					<div style={{
						width:'70%',
						margin:'auto',
						display:'flex',
						flexDirection:'row',
						justifyContent: 'space-around',
						alignItems:'center',
						height:60,
						marginBottom:20,
					}}>


						<div style={{...styles.formAndRounButtonContainer, marginLeft:50,}}>
							<button 
								style={styles.roundButton}
								onClick={ () => this.update_settings() }
							>
								Update Info
							</button>
						</div>

					</div>

									
				</div>

			);
		}
	}
}

// export default SettingsContainer;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(SettingsContainer)