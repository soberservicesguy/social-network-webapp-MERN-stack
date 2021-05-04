
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import utils from "../utilities"
// IMPORT material-ui stuff
import { withStyles } from '@material-ui/styles';
import { 
	Grid, 
	// Button 
} from "@material-ui/core";
// IMPORT responsiveness hook
import withResponsiveness from "../responsiveness_hook";

import {
	ConnectedBookCard,
	ConnectedCreateBook,
} from '../redux_stuff/connected_components';


class BookContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
		axios.get(utils.baseUrl + '/books/books-list-with-children',)
		.then((response) => {
			this.props.set_fetched_books(response.data)
		})
		.catch((error) => {
			console.log(error);
		})


	}
	get_10_more_items() {
		axios.get(utils.baseUrl + `/books/books-list-next-10-with-children`)
		.then((response) => {
			this.props.set_fetched_10_more_book(response.data)
		})
		.catch((error) => {
			console.log(error);
		})		
	}

// RENDER METHOD
	render() {
			
		const total_books = this.props.total_books

	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		return (

			<Grid container direction="row">
				

				{total_books.map((item, index)=>(

					<Grid  key={String(index)} item xs={12} sm={12} md={4} lg={4} xl={4}>
						<ConnectedBookCard
							dataPayloadFromParent = { item }
							likes = { item.likes || [] }						
						/>
					</Grid>

				))}


				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
		  			<ConnectedCreateBook/>
		  		</Grid>

			</Grid>

		);
	}
}

BookContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(BookContainer)