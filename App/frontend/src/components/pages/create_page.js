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



class CreatePage extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,
			page_name: '',
			page_image: '',
			page_description: '',
			new_page_id:'',
		}

	}


// COMPONENT DID MOUNT
	componentDidMount() {

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

			createPageButton:{
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
			return <Redirect to = {{ pathname: `/pages/:id=${this.state.new_page_id}` }} />


		} else {

			return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
				<div style={styles.outerContainer}>

				{/* round text input */}
					<div style={styles.roundTextInputContainer}>
						<form>
							<input 
								ref={ (divElement) => { this.divElement1 = divElement } }
								placeholder="Type your page_name" 
								type="text" 
								name="post_text"
								multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, page_name: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>

					</div>


					<div style={styles.roundTextInputContainer}>
						<form style={{marginTop:10}}>
							<input 
								placeholder="Type your page_description" 
								type="text" 
								name="post_text"
								multiline={true}
								onChange={ (event) => this.setState( prev => ({...prev, page_description: event.target.value})) }
								style={styles.roundTextInput} 
							/>
						</form>

					</div>



					<div style={styles.buttonsContainer}>
						<div>
							<label htmlFor="myInputPage">
								{/* below div will act as myInput button*/}
								<div style={styles.uploadImageButton}>
									Upload Image
								</div>
							</label>
							<input
								id="myInputPage"
								style={{display:'none'}}
								name="ad_image" // name of input field or fieldName simply
								type={"file"}
								// multiple="multiple" // for selecting multiple files
								enctype="multipart/form-data"
								onChange={(event) => {
									// console logging selected file from menu
									// console.log( event.target.files[0] ) // gives first file
									// setState method with event.target.files[0] as argument
									this.setState(prev => ({...prev, page_image: event.target.files[0]}))
								}}
							/>
						</div>





						<button style={styles.createPageButton}
							onClick={ () => {

								// console.log('CREATE PAGE TRIGGERED')

								let setResponseInCurrentPage = (arg) => this.props.set_current_page(arg)
								let redirectToNewPage = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	
								let setNewPageIDToState = (response) => this.setState(prev => ({...prev, new_page_id: response.data.new_page.page_endpoint }))	


								const formData = new FormData()
								if (this.state.page_description !== ''){
									formData.append('page_description', this.state.page_description)
								}
								if (this.state.page_name){
									formData.append('page_name', this.state.page_name)
								}
								if (this.state.page_image){
									formData.append('page_image', this.state.page_image, this.state.page_image.name)
								}

								axios.post(utils.baseUrl + '/pages/create-page-with-user', formData)
								.then(function (response) {
									// console.log(response.data) // current page screen data

									// console.log('response.data')
									// console.log(response.data)
									setNewPageIDToState(response)
									
									// set to current parent object
									setResponseInCurrentPage(response.data.new_page)

									// change route to current_page
									redirectToNewPage()

								})
								.catch(function (error) {
									console.log(error)
								});						

							}}
						>
							<p style={styles.innerText}>
								Create Page
							</p>
						</button>
					</div>

				</div>
			);
		}			
	}
}
	
CreatePage.defaultProps = {

};

// export default CreatePage // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreatePage))
