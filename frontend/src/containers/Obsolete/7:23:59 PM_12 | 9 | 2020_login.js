
import React, {Component} from 'react';
import axios from 'axios';

// IMPORT connected components
// import {ConnectedSomeComponent} from "../redux_stuff/connected_components";

import utils from "../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../responsiveness_hook";

import {
	TextField,
	// Modal, 
	// Grid, 
	// Button 
} from "@material-ui/core";

const styles = theme => ({
	iconStyle:{
		alignSelf:'center',
	},
	screenContainer:{
		alignItems:'center',
		flex:1,
		// display:'flex',
		// flexDirection: 'column',
		alignItems:'center',
		justifyContent: 'space-between', 
	},

	lowerButton:{
		alignItems: 'center',
		width:'100%',
		paddingTop:15,
		paddingBottom:15,
		marginBottom:0,
		backgroundColor: 'grey',
	},

	buttonWithoutBG:{
		marginTop:50,
		marginBottom:50,

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
	orText:{
		color:utils.lightGrey,
		fontSize:20,
		textAlign:'center',
	},
	orTextChild:{
		flex:1,
	},
	rightBar:{
		flex:3,
		borderBottomWidth:1,
		borderColor:utils.lightGrey,
		width:'100%',
	},
	leftBar:{
		flex:3,
		borderBottomWidth:1,
		borderColor:utils.lightGrey,
	},
	orContainer:{
		marginTop:20,
		display:'flex',
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		width:'80%',
	},
	buttonContainer:{
		marginTop:30,
		justifyContent: 'center',
		alignSelf:'center',
		height:100,
		width:'80%',
	},
	roundButton:{
		borderRadius:50,
		borderColor:'green',
		borderWidth:2,
		backgroundColor: 'green',
		borderStyle:'solid',
		width:'100%',
		paddingTop:15,
		paddingBottom:15,
	},
	text:{
		fontSize:20,
		color:'white',
		textAlign:'center',
	},
	headingOverInput:{
		width:'100%',
		marginTop:20,
		fontSize:18,
		fontWeight:'bold',
		textAlign:'left',
	},
	textinputContainer:{
		width:'80%',
	},
});

class LoginContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {

			phone_number: '',
			user_name: '',
			user_name_in_profile: '',
			user_avatar_image: '',
			user_cover_image: '',
			user_brief_intro: '',
			user_about_me: '',
			user_working_zone: '',
			user_education: '',
			user_contact_details: '',

		}
	}

	componentDidMount(){

	}


	storeDataAtBackend(){
		axios.post(utils.baseUrl + '/socialposts/create-user', 
			{
				phone_number: this.state.phone_number,
				user_name: this.state.user_name,
				user_name_in_profile: this.state.user_name_in_profile,
				user_avatar_image: this.state.user_avatar_image,
				user_cover_image: this.state.user_cover_image,
				user_brief_intro: this.state.user_brief_intro,
				user_about_me: this.state.user_about_me,
				user_working_zone: this.state.user_working_zone,
				user_education: this.state.user_education,
				user_contact_details: this.state.user_contact_details,
			}
		)
		.then(function (response) {
			console.log(`POST rest call response is${JSON.stringify(response.data, null, 1)}`);
			if (response.data.success === true){
				// console.log('yes')
			}

			return response
		})
		.then((response) => {
			if (response.data.success === true){
				this.props.set_is_signed_in( true )
				// this.props.set_user_token( response.data.userToken )

				this.props.set_phone_number( this.state.phone_number )
				this.props.set_user_name( this.state.user_name )
				this.props.set_user_name_in_profile( this.state.user_name_in_profile )
				this.props.set_user_avatar_image( this.state.user_avatar_image )
				this.props.set_user_cover_image( this.state.user_cover_image )
				this.props.set_user_brief_intro( this.state.user_brief_intro )
				this.props.set_user_about_me( this.state.user_about_me )
				this.props.set_user_working_zone( this.state.user_working_zone )
				this.props.set_user_education( this.state.user_education )
				this.props.set_user_contact_details( this.state.user_contact_details )
			}
		})
		.catch(function (error) {
			// console.log(error);
		});

	
	}

	render() {
		return(
			<div style={styles.screenContainer}>
				
				<div style={styles.buttonContainer}>
					<button style={styles.roundButton} onClick={() => null} activeOpacity={0.2}>
						<p style={styles.text}>
							SIGN UP WITH FACEBOOK
						</p>
					</button>
				</div>

			
				<div style={styles.orContainer}>
					<div style={styles.leftBar}>
					</div>

					<div style={styles.orTextChild}>
						<p style={styles.orText}>
							OR
						</p>
					</div>

					<div style={styles.rightBar}>
					</div>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						PHONE_NUMBER
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your phone number" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, phone_number: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_NAME
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user name" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_name: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_NAME_IN_PROFILE
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user name in profile" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_name_in_profile: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_AVATAR_IMAGE
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user avatar image" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_avatar_image: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_COVER_IMAGE
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user cover image" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_cover_image: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_BRIEF_INTRO
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user brief intro" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_brief_intro: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_ABOUT_ME
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user about me" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_about_me: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_WORKING_ZONE
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user working zone" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_working_zone: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_EDUCATION
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user education" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_education: event.target.value})) }
						/>
					</form>
				</div>

				<div style={styles.textinputContainer}>
					<p style={styles.headingOverInput}>
						USER_CONTACT_DETAILS
					</p>
					<form className={styles.root} noValidate autoComplete="off">
						<TextField 
							label="Type your user contact details" // placeholder 
							id="standard-basic" // "filled-basic" / "outlined-basic"
							variant="outlined" // "filled"
							classes={styles.textinput}
							onChange={ (event) =>  this.setState(prev => ({...prev, user_contact_details: event.target.value})) }
						/>
					</form>
				</div>
						
				<button  onClick={() => {}} style={styles.buttonWithoutBG}>
					<p style={styles.lowerText}>
						Already have an account ?
					</p>
				</button>
			
		
				<button style={styles.lowerButton} activeOpacity={0.2}
					onClick={ () => this.storeDataAtBackend() }
				>
					Create Account
				</button>
								
			</div>
		);
	}
}

// export default LoginContainer;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(LoginContainer))
