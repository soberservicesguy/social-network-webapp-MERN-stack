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
	ConnectedComponentForShowingFriend,
} from '../redux_stuff/connected_components';


class FriendsContainer extends Component {
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
			

		// var friends_list = this.props.all_friends
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		return (

			<Grid container direction="column">

				{this.props.all_friends.map((item, index)=>(

					<Grid item>
						<ConnectedComponentForShowingFriend
							dataPayloadFromParent = { item }
						/>
					</Grid>

				))}

			</Grid>

		);
	}
}

FriendsContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(FriendsContainer);