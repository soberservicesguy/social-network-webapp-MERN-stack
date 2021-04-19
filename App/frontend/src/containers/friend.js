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

		let set_friends_suggestions_callback = (response) => this.props.set_friends_suggestions(response.data.friend_suggestions)
		let set_friends_list_callback = (response) => this.props.set_friends(response.data.friends_list)
		let set_friends_requests_callback = (response) => this.props.set_friends_requests(response.data.friends_requests)

		
		if (this.props.showFriendsSuggestionsInstead){

			axios.get(utils.baseUrl + '/users/friend-suggestions',)
			.then((response) => {
				if (response.data.success){
					console.log('GOT FRIEND SUGGESTIONS')
					console.log(response.data.friend_suggestions)
					set_friends_suggestions_callback(response)

					console.log('this.props.list_of_friend_suggestions')
					console.log(this.props.list_of_friend_suggestions)

				}
			})
			.catch((error) => {
				console.log('ERROR FRIEND SUGGESTIONS')
				console.log(error);
			})

		} else if (this.props.showFriendsRequestInstead){

			axios.get(utils.baseUrl + '/users/friend-requests',)
			.then((response) => {
				if (response.data.success){
					console.log('GOT FRIEND REQUESTS')
					console.log(response.data.friends_requests)
					set_friends_requests_callback(response)

					console.log('this.props.list_of_friend_requests')
					console.log(this.props.list_of_friend_requests)

				}
			})
			.catch((error) => {
				console.log('ERROR FRIEND REQUESTS')
				console.log(error);
			})

		} else {

			axios.get(utils.baseUrl + '/users/friends-list',)
			.then((response) => {
				if (response.data.success){				
					console.log('GOT FRIEND LIST')
					console.log(response.data.friends_list)
					set_friends_list_callback(response)

					console.log('this.props.list_of_friends')
					console.log(this.props.list_of_friends)

				}
			})
			.catch((error) => {
				console.log('ERROR FRIEND LIST')
				console.log(error);
			})


		}


	}

// RENDER METHOD
	render() {
			

		// var friends_list = this.props.all_friends
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	var data_to_use = []
	  	var heading = ''

	  	// console.log('this.props.all_friend_suggestions')
	  	// console.log(this.props)
	  	// console.log('this.props.all_friend_requests')
	  	// console.log(this.props)

		if (this.props.showFriendsRequestInstead){

			console.log('TRIED THIS')
			data_to_use = this.props.list_of_friend_requests
			heading = 'Friend Requests'

		}

		if (this.props.showFriendsSuggestionsInstead){

			console.log('TRIED THIS1')
			data_to_use = this.props.list_of_friend_suggestions
			heading = 'Friend Suggestions'


		}

		if (this.props.showFriendsSuggestionsInstead === false && this.props.showFriendsRequestInstead === false){

			console.log('TRIED THIS2')
			data_to_use = this.props.list_of_friends
			heading = 'Friends'

		}

		return (

			<Grid container direction="column">
				<div style={{backgroundColor: 'white', marginTop:30, paddingLeft:20, paddingRight:20}}>

					<div>
						<p style={{fontWeight:'bold', fontSize:20, marginTop:20}}>
							{heading}
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

					{data_to_use.map((item, index)=>(

						<Grid item>
							<ConnectedComponentForShowingFriend
								dataPayloadFromParent = { item }
								showFriendsSuggestionsInstead = {this.props.showFriendsSuggestionsInstead}
								showFriendsRequestInstead = {this.props.showFriendsRequestInstead} 
							/>
						</Grid>

					))}
					
				</div>


			</Grid>

		);
	}
}

FriendsContainer.defaultProps = {
	showFriendsSuggestionsInstead:false,
	showFriendsRequestInstead:false,
};

export default withResponsiveness(FriendsContainer);