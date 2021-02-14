
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
	ConnectedComponentForShowingNotification,
} from '../redux_stuff/connected_components';


class NotificationsContainer extends Component {
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
			
		// const total_notifications = this.props.all_notifications
		const total_notifications = [1,2,3,4,5,6,7,8,9,10]

	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		return (

			<Grid container direction="column">

				{total_notifications.map((item, index)=>(

					<Grid item>
						<ConnectedComponentForShowingNotification
							dataPayloadFromParent = { item }
						/>
					</Grid>

				))}

			</Grid>

		);
	}
}

NotificationsContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(NotificationsContainer);