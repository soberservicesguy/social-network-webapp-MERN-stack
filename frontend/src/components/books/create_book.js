
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


class CreateBook extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded:false,
			redirectToRoute: false,
			book_name: '',
			book_image: '',
			book_description: '',
		}

	}


// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		const styles = {
			
		}

		// parameters being passed from previous route
		const endpoint_params_passed = this.props.match.params

		if ( this.state.redirectToRoute !== false ){

			// switching it back to false
			this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))

			// redirecting
			return <Redirect to = {{ pathname: "/Individual-Book" }} />

		} else {

			return (
			// e.g a social post, textinput which lets user to enter text, takes persons id as assigned object
				<div style={styles.outerContainer}>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your book_name" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, book_name: event.target.value})) }
							/>
						</form>
				  	</div>

					<div style={styles.textinputContainer}>
						<p style={styles.headingOverInput}>
							IMAGE MAIN
						</p>
						<form className={styles.root} noValidate autoComplete="off">
							<input
								// multiple="multiple" // for selecting multiple files
								name="book_image" // name of input field or fieldName simply
								enctype="multipart/form-data"
								type="file"
								onChange={(event) => {
									// console logging selected file from menu
									console.log( event.target.files[0] ) // gives first file
									// setState method with event.target.files[0] as argument
									this.setState(prev => ({...prev, book_image: event.target.files[0]}))
								}}
							/>
						</form>
					</div>


				  	<div style={styles.textinputContainer}>
						<form className={styles.root} noValidate autoComplete="off">
							<TextField 
								label="Type your book_description" // placeholder 
								id="standard-basic" // "filled-basic" / "outlined-basic"
								variant="outlined" // "filled"
								classes={styles.textinput}
								onChange={ (event) => this.setState( prev => ({...prev, book_description: event.target.value})) }
							/>
						</form>
				  	</div>


					<button style={styles.buttonWithoutBG}
						onClick={ () => {
							let setResponseInCurrentBook = (arg) => this.props.set_current_book(arg)
							let redirectToNewBook = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	

							const formData = new FormData()
							formData.append('book_name', this.state.book_name)
							formData.append('book_description', this.state.book_description)
							formData.append('book_image', this.state.book_image, this.state.book_image.name)

							axios.post(utils.baseUrl + '/books/create-book-with-user', formData)
							.then(function (response) {
								console.log(response.data) // current book screen data
								
								// set to current parent object
								setResponseInCurrentBook(response.data)

								// change route to current_book
								redirectToNewBook()

							})
							.catch(function (error) {
								console.log(error)
							});						

						}}
					>
						<p style={styles.innerText}>
							Press To Create Book
						</p>
					</button>
				</div>
			);
		}			
	}
}
	
CreateBook.defaultProps = {

};

// export default CreateBook // REMOVE withResponsiveness and withStyles as much as possible
export default withRouter(withResponsiveness(CreateBook))