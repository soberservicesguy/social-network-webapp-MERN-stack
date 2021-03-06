import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../responsiveness_hook";

import utils from "../utilities";

import CheckCircle from '@material-ui/icons/CheckCircle';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';


class ComponentForShowingFriend extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			request_sent: false,
			accepted_request: false,
		}	

	}


// COMPONENT DID MOUNT
	componentDidMount() {

	}

	sendFriendRequest(endpoint){

		axios.post(utils.baseUrl + '/users/send-friend-request', {endpoint: endpoint})
		.then((response) => {
			if(response.data.success){
				console.log('FRIEND REQUEST SENT')
				this.setState(prev => ({...prev, request_sent: true }));
			}
		})
		.catch((error) => {
			console.log(error);
		})

	}

	acceptFriendRequest(endpoint){

		axios.post(utils.baseUrl + '/users/accept-friend-request', {endpoint: endpoint})
		.then((response) => {
			if(response.data.success){
				console.log('FRIEND REQUEST SENT')
				this.setState(prev => ({...prev, accepted_request: true }));
			}
		})
		.catch((error) => {
			console.log(error);
		})

	}

	render() {
		
		const styles = {
		// button
			outerContainer:{
				outline:'none',
				background:'none',
				// backgroundColor: 'white',
				borderWidth:0,
				// flexDirection:'row',
				justifyContent: 'center',
				alignItems:'center',
				height: 100,
				width: '100%',
				// backgroundColor: '#000000',
				// marginTop:windowHeight * 0.01,
				marginBottom:10,
				// borderBottomWidth: 1,
				// borderBottomColor: utils.dimWhite,

			},

			innerContainer:{
				width: '90%',
				alignSelf:'center',
				display:'flex',
				flexDirection: 'row',
				// backgroundColor: '#000000',
				justifyContent: 'center',
				alignItems:'center', 
			},


		// image
			imageContainer:{
				height: '100%',
				justifyContent: 'center', // vertically centered
				alignSelf: 'center', // horizontally centered
				// backgroundColor: utils.lightGreen,
				flex:1,
			},
			imageStyle:{
				resizeMode: "stretch",
				height: 50,
				width: 50,
				borderRadius: 50/2,
			},

		// friend name
			textContainer:{
				flex:3,
				marginLeft:10,
				alignSelf:'center',
				alignItems:'flex-start',
				justifyContent: 'center', 
				// backgroundColor: '#000000',

			},
			nameText:{
				fontSize:20,
				fontWeight:'bold',
				color:utils.darkBlue,
			},

		// icon
			iconContainer:{
				marginLeft:10,
				flex:2,
				flexDirection:'row',
				justifyContent: 'center',
				alignItems:'center',
				backgroundColor: utils.darkGreen,
				borderRadius: 10,
				height: '40%',
			},
			followingText:{
				fontSize:12,
				color:(this.state.request_sent || this.state.accepted_request) ? 'blue' : utils.dimWhite,
				fontWeight:'bold',
			},
	
		}

		let data = this.props.dataPayloadFromParent
		let base64Image = "data:image/jpeg;base64," + data.user_avatar_image

		return (

			<div>
		
				{(() => {

					if (this.props.showFriendsSuggestionsInstead === true){
					
						return (

							<button 
						  		style={styles.outerContainer} 
						  		onClick={ () => this.sendFriendRequest(data.endpoint) } 
					  		>
								<div style={styles.innerContainer}>
									<div style={styles.imageContainer}>
										<img 
											// src={utils.image}
											src={base64Image}
											style={styles.imageStyle}
										/>
									</div>

									<div style={styles.textContainer}>
										<p style={{...styles.nameText, color:'black'}}>
											{data.user_name_in_profile}
										</p>
									</div>

									<div style={{...styles.iconContainer, flex:3, height: '50%', backgroundColor: utils.darkBlue}}>
										<div style={{flex:1}}>
											<CheckCircleOutline style={{fontSize:20, color:utils.maroonColor}}/>
										</div>
										<div style={{flex:3}}>
											{(this.state.request_sent) ? (
												<p style={{...styles.followingText, textAlign:'center',}}>
													Sent
												</p>

											):(
												<p style={{...styles.followingText, textAlign:'center',}}>
													Send Friend Request
												</p>
											)}

										</div>
									</div>
								</div>

						  	</button>
						) 

					} else if (this.props.showFriendsRequestsInstead === true) {

						return (

							<button 
						  		style={styles.outerContainer} 
						  		onClick={ () => this.acceptFriendRequest(data.endpoint) } 
					  		>
								<div style={styles.innerContainer}>
									<div style={styles.imageContainer}>
										<img 
											// src={utils.image}
											src={base64Image}
											style={styles.imageStyle}
										/>
									</div>

									<div style={styles.textContainer}>
										<p style={{...styles.nameText, color:'black'}}>
											{data.user_name_in_profile}
										</p>
									</div>

									<div style={{...styles.iconContainer, flex:3, height: '50%', backgroundColor: utils.darkBlue}}>
										<div style={{flex:1}}>
											<CheckCircleOutline style={{fontSize:20, color:utils.maroonColor}}/>
										</div>
										<div style={{flex:3}}>
											{(this.state.accepted_request) ? (

												<p style={{...styles.followingText, textAlign:'center',}}>
													Accepted
												</p>

											):(
												<p style={{...styles.followingText, textAlign:'center',}}>
													Accept Friend Request
												</p>
											)}

										</div>
									</div>
								</div>

						  	</button>					
						)

					
					} else {

						return (

							<button 
						  		activeOpacity={0.2}
						  		style={styles.outerContainer} 
						  		onClick={ () => this.props.navigation.navigate('SocialPost', {endpoint: data.endpoint}) } 
					  		>
								<div style={styles.innerContainer}>
									<div style={styles.imageContainer}>
										<img
											src={utils.image}
											// src={{uri: base64Image}} 
											style={styles.imageStyle}
										/>
									</div>

									<div style={styles.textContainer}>
										<p style={styles.nameText}>
											{data.user_name_in_profile}
										</p>
									</div>

									<div style={styles.iconContainer}>
										<CheckCircle style={{fontSize:20, color:utils.maroonColor}}/>
										<p style={styles.followingText}>
											Following
										</p>
									</div>
								</div>

						  	</button>
						)
					}
				})()}

			</div>


		);
	}
}

ComponentForShowingFriend.defaultProps = {
};

export default ComponentForShowingFriend