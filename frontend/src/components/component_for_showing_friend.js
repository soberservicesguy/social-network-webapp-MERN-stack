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
		}	

	}


// COMPONENT DID MOUNT
	componentDidMount() {

	}

	sendFriendRequest(endpoint){

		axios.post(utils.baseUrl + '/books/books-list-with-children', {endpoint: endpoint})
		.then((response) => {
			this.props.set_fetched_books(response.data)
		})
		.catch((error) => {
			console.log(error);
		})

	}

	render() {

		let data = this.props.dataPayloadFromParent
		let base64Image = "data:image/jpeg;base64," + data.user_avatar_image
		
		const styles = {
		// button
			outerContainer:{
				// flexDirection:'row',
				justifyContent: 'center',
				alignItems:'center',
				height: 100,
				width: '100%',
				// backgroundColor: '#000000',
				// marginTop:windowHeight * 0.01,
				marginBottom:10,
				borderBottomWidth: 1,
				borderBottomColor: utils.dimWhite,

			},

			innerContainer:{
				width: '90%',
				alignSelf:'center',
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
				height: 100,
				width: 100,
				borderRadius: 100/2,
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
				flex:2,
				flexDirection:'row',
				justifyContent: 'center',
				alignItems:'center',
				backgroundColor: utils.darkGreen,
				borderRadius: 10,
				height: '40%',
			},
			followingText:{
				fontSize:15,
				color:utils.dimWhite,
				fontWeight:'bold',
			},
	
		}

		return (

			<div>
		
				{(() => {

					if (this.props.showFriendsSuggestionsInstead === true){
					
						return (

							<button 
						  		style={styles.outerContainer} 
						  		onPress={ () => this.sendFriendRequest(data.endpoint) } 
					  		>
								<div style={styles.innerContainer}>
									<div style={styles.imageContainer}>
										<img 
											source={utils.image}
											// source={{uri: base64Image}} 
											style={styles.imageStyle}
										/>
									</div>

									<div style={styles.textContainer}>
										<p style={{...styles.nameText, color:'black'}}>
											arsalan {data.user_name_in_profile}
										</p>
									</div>

									<div style={{...styles.iconContainer, flex:3, height: '50%', backgroundColor: utils.darkBlue}}>
										<div style={{flex:1}}>
											<CheckCircleOutline style={{fontSize:20, color:utils.maroonColor}}/>
										</div>
										<div style={{flex:3}}>
											<p style={{...styles.followingText, textAlign:'center'}}>
												Send Friend Request
											</p>
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
						  		onPress={ () => this.props.navigation.navigate('SocialPost', {endpoint: data.endpoint}) } 
					  		>
								<div style={styles.innerContainer}>
									<div style={styles.imageContainer}>
										<img
											source={utils.image}
											// source={{uri: base64Image}} 
											style={styles.imageStyle}
										/>
									</div>

									<div style={styles.textContainer}>
										<p style={styles.nameText}>
											arsalan {data.user_name_in_profile}
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