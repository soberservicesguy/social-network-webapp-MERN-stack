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
	// ConnectedSocialPostContainer,
	ConnectedCreateSocialPost,
	ConnectedSocialPostCard,
} from '../redux_stuff/connected_components';

import {
	Link,
} from "react-router-dom";


class TimelineContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			sectionToShow:'something_about_me',
			tracked_width1: 0,
			tracked_height1: 0,


		}
		this.resizeHandler = this.resizeHandler.bind(this);
	
	}

	resizeHandler() {
		this.setState(prev => ({
			...prev, 
			tracked_width1:this.divElement1.clientWidth, 
			tracked_height1:this.divElement1.clientHeight,

		}))
	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.resizeHandler);
	}


// COMPONENT DID MOUNT
	componentDidMount() {
		this.resizeHandler();
		window.addEventListener('resize', this.resizeHandler);

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

	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		const styles = {
			imageContainer:{

			},
			topBgImage:{
				width:'100%', 
				height:350, 
				resizeMode: "stretch"
			},

			upperMenu:{
				width:'85%',
				height:80,
				backgroundColor: 'white',
				margin:'auto',

				display:'flex',
				flexDirection:'row',
				justifyContent: 'flex-end',
				alignItems: 'center',
			},
			upperMenuButtonContainer:{
				flexBasis:(_xs || _sm || _md) ? '10%' :'15%',
				textAlign:'right',
			},
			upperMenuButtonRoundButtonContainer:{
				flexBasis:(_xs || _sm || _md) ? '15%' :'25%',
				textAlign:'center',
			},



			lowerTopBand:{
				// width:'85%',
				height:100,
				backgroundColor: 'white',
				margin:'auto',
				marginTop:20,
				display:'flex',
				alignItems:'center',
				// backgroundColor: '#000000'
			},

			avatarContainer:{
				// width:'85%',
				margin:'auto',

				position:'relative',
				bottom:320 + 30 -100 -20, // moving entire height up + paddings
				height:320-320, // self_height -  height_displaced_above
			},
			avatarWrapper:{
				// width:, // have to set to its length
				// height:330,
				height:this.state.tracked_length1,
				// paddingLeft: 15,
				// paddingRight: 15,
				paddingTop: 15,
				paddingBottom: 15,
				backgroundColor: 'white',
				// margin:'auto',
				textAlign:'center',
			},
			avatarImage:{
				width:320, 
				height:320, 
				resizeMode: "stretch",
			},

			menuText:{
				color:'black',
				fontWeight:'bold',
				marginBottom:0,
			},
			roundButtonWrapper:{
				backgroundColor: utils.maroonColor,
				width:(_xs || _sm || _md) ? '70%' : '30%',
				margin:'auto',
				borderRadius:50,
				// height:50,
				// paddingLeft:10,
				// paddingRight:10,
				// marginLeft:10,
			},
			menuRoundButtonText:{
				color:'white',
				fontWeight:'bold',
				paddingTop:10,
				paddingBottom:10,
				marginBottom:0,
			},

			currentSectionHeading:{
				textAlign:'left',
				fontSize:30,
				marginBottom:0,
				fontWeight:'bold',
			},

			headingForBlockContainer:{
				borderStyle:'solid',
				borderWidth:0,
				borderBottomWidth:1,
				borderBottomColor:'#eee',
				marginBottom:50,
			},
			headingForBlockText:{
				fontSize:25,
				textAlign:'center',
				fontWeight:'bold',
				paddingTop:20,
				paddingBottom:20,
			},

			blockChildrenInnerContainer:{
				width:'90%',
				margin:'auto',
				borderWidth:1,
				borderColor: '#eee',
				borderStyle:'solid',
				marginBottom:30,
				paddingLeft:20,
			},

			blockBottomButton:{
				outline:'none',
				background:'none',
				borderWidth:0,
				margin:'auto',
				width:'100%'
			},
			blockBottomButtonText:{
				fontSize:18,
				textAlign:'center',
				fontWeight:'bold',
				paddingTop:10,
				paddingBottom:10,
			},

		}			

		// var friends_list = this.props.all_friends

		// var base64Image = "data:image/jpeg;base64," + this.props.current_image

		// let all_friends = this.props.all_friends
		let all_friends = [1,2,3,4,5,6,7,8,9,10]
		// let total_books = this.props.total_books
		let total_books = [1,2,3,4,5,6,7,8,9,10]
		// let friend_suggestions = this.props.friend_suggestions
		let friend_suggestions = [1,2,3,4,5,6,7,8,9,10]

		const total_socialposts = this.props.total_socialposts

		return (

			<Grid container direction="column">
				<div style={{backgroundColor: '#eee'}}>
					<Grid item xs={12}>
						<div style={styles.imageContainer}>
							<img 
								alt="" 
								// src={base64Image} 
								src={utils.image}
								style={styles.topBgImage}
							/>
						</div>
					</Grid>


					<Grid item xs={12}>
						<div>
							<div style={{backgroundColor: 'white'}}>
								<div style={styles.upperMenu}>
									<div style={styles.upperMenuButtonContainer}>
										<Link to="/timeline">
											<p style={{...styles.menuText, color:utils.maroonColor}}>
												Timeline
											</p>
										</Link>
									</div>

									<div style={styles.upperMenuButtonContainer}>
										<Link to="/about-me">
											<p style={styles.menuText}>
												About
											</p>
										</Link>
									</div>

									<div style={styles.upperMenuButtonContainer}>
										<Link to="/friends">
											<p style={styles.menuText}>
												Friends
											</p>
										</Link>
									</div>

									<div style={styles.upperMenuButtonRoundButtonContainer}>
										<Link to="/edit-profile">
											<div style={styles.roundButtonWrapper}>
												<p style={styles.menuRoundButtonText}>
													Edit Profile
												</p>
											</div>
										</Link>
									</div>

								</div>
							</div>
						</div>
					</Grid>



					<div style={{
						width:'85%',
						margin:'auto'
					}}>
						<Grid container>
							<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
								<div style={styles.avatarContainer}>
									<div 
										style={styles.avatarWrapper}
										ref={ (divElement) => { this.divElement1 = divElement } }
									>
										<img 
											// src={base64Image}
											src={utils.image} 
											alt="" 
											style={styles.avatarImage}
										/>
									</div>
								</div>
							</Grid>						

							<Grid item xs={12} sm={12} md={6} lg={9} xl={9}>
								<div style={styles.lowerTopBand}>
									<div style={{
										marginLeft:20,
									}}>
										<p style={styles.currentSectionHeading}>
											Friends
										</p>
									</div>
								</div>
							</Grid>
						</Grid>

					</div>



				{/*Friends Section starts here*/}
					<div style={{
						paddingTop:20,
						width:'85%',
						margin:'auto',
						marginTop:20,
						backgroundColor: 'white',
					}}>
						<Grid container direction="column">
							<Grid item xs={12}>
								<div style={styles.headingForBlockContainer}>
									<p style={styles.headingForBlockText}>
										Personal Wall
									</p>
								</div>
							</Grid>

							<Grid container direction="row">

								<Grid item xs={0} sm={0} md={2} lg={2} xl={2}>
								</Grid>

								<Grid container direction="column" xs={12} sm={12} md={8} lg={8} xl={8}>

									<Grid item>
										<div>
								  			<ConnectedCreateSocialPost/>
										</div>
							  		</Grid>

									{total_socialposts.map((item, index)=>(

										<Grid item>
											<ConnectedSocialPostCard
												dataPayloadFromParent = { item }

												comments_quantity = { item.comments_quantity }
												comments = { item.comments || [] }

												likes_quantity = { item.likes_quantity }
												likes = { item.likes || [] }

												shares_quantity = { item.shares_quantity }
												shares = { item.shares || [] }

												// user_quantity = { item.user_quantity }
												// user = { item.user || [] }
											
											/>
										</Grid>

									))}
									
								</Grid>

								<Grid item xs={0} sm={0} md={2} lg={2} xl={2}></Grid>

							</Grid>

							<Grid item xs={12}>
								<button style={styles.blockBottomButton}>
									<p style={styles.blockBottomButtonText}>
										Load More
									</p>
								</button>
							</Grid>

						</Grid>
					</div>
				{/*Friends Section ends here*/}




				{/*Friends suggestions Section starts here*/}
					<div style={{
						paddingTop:20,
						width:'85%',
						margin:'auto',
						marginTop:20,
						backgroundColor: 'white',
					}}>
						<Grid container direction="column">
							<Grid item xs={12}>
								<div style={styles.headingForBlockContainer}>
									<p style={styles.headingForBlockText}>
										Friends Suggestions
									</p>
								</div>
							</Grid>

							<Grid container direction="row">
								{friend_suggestions.map((item, index) => {
									return (
										<Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
											<div style={{...styles.blockChildrenInnerContainer, paddingLeft:20}}>
												<ConnectedComponentForShowingFriend
													dataPayloadFromParent = { item }
													showFriendsSuggestionsInstead = {true}
												/>
											</div>
										</Grid>
									)
								})}
							</Grid>

							<Grid item xs={12}>
								<button style={styles.blockBottomButton}>
									<p style={styles.blockBottomButtonText}>
										Load More
									</p>
								</button>
							</Grid>

						</Grid>
					</div>
				{/*Friends suggestions Section ends here*/}


				</div>
			</Grid>

		);
	}
}

TimelineContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(TimelineContainer);