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


class AboutMeContainer extends Component {
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
				<div style={{backgroundColor: 'white', marginTop:30, paddingLeft:20, paddingRight:20}}>

					<div>
						<p style={{fontWeight:'bold', fontSize:20, marginTop:20}}>
							Friends Zone
						</p>
						<div style={{
							width:'20%',
							height:1,
							borderWidth:0,
							borderBottomWidth: 1,
							borderStyle:'solid',
							borderBottomColor:utils.maroonColor,
							marginBottom:20,
						}}>
							<p></p>
						</div>
					</div>




					{this.props.all_friends.map((item, index)=>(

						<Grid item>
							<ConnectedComponentForShowingFriend
								dataPayloadFromParent = { item }
								// showFriendsSuggestionsInstead = {true}
							/>
						</Grid>

					))}
					
				</div>


			</Grid>

		);
	}
}

AboutMeContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(AboutMeContainer);