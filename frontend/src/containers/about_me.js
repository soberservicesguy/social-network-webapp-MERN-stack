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
	ConnectedComponentForShowingBook,
	ConnectedComponentForShowingSport,
} from '../redux_stuff/connected_components';

import {
	Link,
} from "react-router-dom";


class AboutMeContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			sectionToShow:'something_about_me',
			tracked_width1: 0,
			tracked_height1: 0,

			tracked_width2: 0,
			tracked_height2: 0,

		}
		this.resizeHandler = this.resizeHandler.bind(this);
	
	}

	resizeHandler() {
		this.setState(prev => ({
			...prev, 
			tracked_width1:this.divElement1.clientWidth, 
			tracked_height1:this.divElement1.clientHeight,

			tracked_width2:this.divElement2.clientWidth, 
			tracked_height2:this.divElement2.clientHeight,
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
			sectionButtonsContainer:{
				backgroundColor: 'white',
				marginRight:10,
				paddingLeft:30,
				paddingRight:30,
				paddingTop:30,
				paddingBottom:30,
				// width: 330,
			},
			sectionButton:{
				marginBottom:30,
				outline:'none',
				background:'none',
				borderWidth:0,
				width:'100%',
				borderBottomColor:'light-grey',
				borderBottomWidth:1,
				borderStyle:'solid',
				paddingBottom:10,
				textAlign:'left',
				paddingLeft:0,
				fontSize:18,
				fontWeight: 'bold',
			},

			shortBottomBorder:{
				width:'20%',
				height:1,
				borderWidth:0,
				borderBottomWidth: 1,
				borderStyle:'solid',
				borderBottomColor:utils.maroonColor,
				marginBottom:20,
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

		var base64CoverImage = "data:image/jpeg;base64," + this.props.user_cover_image

		var base64AvatarImage = "data:image/jpeg;base64," + this.props.user_avatar_image

		// let all_friends = this.props.all_friends
		let all_friends = [1,2,3,4,5,6,7,8,9,10]
		// let total_books = this.props.total_books
		let total_books = [1,2,3,4,5,6,7,8,9,10]

		return (

			<Grid container direction="column">
				<div style={{backgroundColor: '#eee'}}>
					<Grid item xs={12}>
						<div style={styles.imageContainer}>
							<img 
								alt="" 
								src={base64CoverImage}
								// src={utils.image}
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
											<p style={styles.menuText}>
												Timeline
											</p>
										</Link>
									</div>

									<div style={styles.upperMenuButtonContainer}>
										<Link to="/about-me">
											<p style={{...styles.menuText, color:utils.maroonColor}}>
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
										<Link to="/settings">
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
											src={base64AvatarImage}
											// src={utils.image} 
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
											About
										</p>
									</div>
								</div>
							</Grid>
						</Grid>

					</div>


					<div style={{
						width:'85%',
						margin:'auto',
						marginTop:20,
						// backgroundColor: 'black',
					}}>
						<Grid container direction="row">
							<Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
								<div 
									ref={ (divElement) => { this.divElement2 = divElement } }
									style={styles.sectionButtonsContainer}
								>
									<button
										style={styles.sectionButton}
										onClick={ () => this.setState(prev => ({...prev, sectionToShow: 'something_about_me' })) }
									>
										Something About Me
									</button>

									<button
										style={styles.sectionButton}
										onClick={ () => this.setState(prev => ({...prev, sectionToShow: 'working_zone' })) }
									>
										Working Zone
									</button>

									<button
										style={styles.sectionButton}
										onClick={ () => this.setState(prev => ({...prev, sectionToShow: 'educational_qualification' })) }
									>
										Educational Qualification
									</button>

									<button
										style={{...styles.sectionButton, marginBottom:10}}
										onClick={ () => this.setState(prev => ({...prev, sectionToShow: 'contact_details' })) }
									>
										Contacts Details
									</button>

								</div>
							</Grid>

							<Grid item xs={12} sm={12} md={6} lg={9} xl={9}>
								<div style={{
									backgroundColor: 'white',
									marginLeft:10,
									height:this.state.tracked_height2,
									paddingLeft:60,
									paddingTop:20,

								}}>
									{(() => {
										if (this.state.sectionToShow === 'something_about_me'){
											return (

												<div>
													<p style={{fontWeight:'bold', fontSize:20,}}>
														Something About Me
													</p>
													<div style={styles.shortBottomBorder}>
														<p style={{paddingTop:20}}>{this.props.user_about_me}</p>
													</div>

												</div>

											)
										} else if (this.state.sectionToShow === 'working_zone'){
											return (

												<div>
													<p style={{fontWeight:'bold', fontSize:20,}}>
														Working Zone
													</p>
													<div style={styles.shortBottomBorder}>
														<p style={{paddingTop:20}}>{this.props.user_working_zone}</p>
													</div>

												</div>

											)
										} else if (this.state.sectionToShow === 'educational_qualification'){
											return (

												<div>
													<p style={{fontWeight:'bold', fontSize:20,}}>
														Educational Qualification
													</p>
													<div style={styles.shortBottomBorder}>
														<p style={{paddingTop:20}}>{this.props.user_education}</p>
													</div>

												</div>

											)
										} else if (this.state.sectionToShow === 'contact_details'){
											return (

												<div>
													<p style={{fontWeight:'bold', fontSize:20,}}>
														Contact Details
													</p>
													<div style={styles.shortBottomBorder}>
														<p style={{paddingTop:20}}>{this.props.user_contact_details}</p>
													</div>

												</div>

											)
										} else {
											return null
										}

									})()}
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
										Friends
									</p>
								</div>
							</Grid>

							<Grid container direction="row">
								{all_friends.map((item, index) => {
									return (
										<Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
											<div style={{...styles.blockChildrenInnerContainer, paddingLeft:20}}>
												<ConnectedComponentForShowingFriend
													dataPayloadFromParent = { item }
													// showFriendsSuggestionsInstead = {true}
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
				{/*Friends Section ends here*/}


				{/*Books Section starts here*/}
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
										Favourite Books
									</p>
								</div>
							</Grid>

							<Grid container direction="row">
								{total_books.map((item, index) => {
									return (
										<Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
											<div style={{...styles.blockChildrenInnerContainer, paddingLeft:0,}}>
												<ConnectedComponentForShowingBook
													dataPayloadFromParent = { item }
													// showFriendsSuggestionsInstead = {true}
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
				{/*Books Section ends here*/}



				{/*Sports Section starts here*/}
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
										Sports
									</p>
								</div>
							</Grid>

							<Grid container direction="row">
								{total_books.map((item, index) => {
									return (
										<Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
											<div style={{...styles.blockChildrenInnerContainer, paddingLeft:0,}}>
												<ConnectedComponentForShowingSport
													dataPayloadFromParent = { item }
													// showFriendsSuggestionsInstead = {true}
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
				{/*Sports Section ends here*/}



				</div>
			</Grid>

		);
	}
}

AboutMeContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(AboutMeContainer);