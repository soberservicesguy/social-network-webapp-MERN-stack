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

import {
	InnerNavigation,
} from "./"

class TimelineContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			sectionToShow:'something_about_me',

			backend_requests_made:1,
			tracked_container_height: 0,
		}

	}

	getSocialposts(){

		let backend_requests_made = this.state.backend_requests_made
		let append_socialposts_callback = (response) => this.props.async_append_fetched_socialposts(response.data)
		let addEventListenerCallback = () => window.addEventListener("scroll", this.onScroll, false);
		let set_state_for_requests_made = () => {
			this.setState(prev => ({...prev, 
				backend_requests_made: prev.backend_requests_made + 1,
				tracked_container_height:this.social_posts_container.clientHeight,
			}));
		}

		axios.get(utils.baseUrl + '/socialposts/get-socialposts-of-someone',
		{
		    params: {
				request_number: backend_requests_made,
		    }
		})
		.then((response) => {

			if(response.data.length === 0){

				console.log('no more posts to show')
				window.removeEventListener("scroll", this.onScroll);
				append_socialposts_callback({data: [{message:'no more posts to show'}]})

			} else {

				console.log('posts recieved')
				console.log(response.data)
				append_socialposts_callback(response)
				set_state_for_requests_made()
				addEventListenerCallback()

			}
			
		})
		.catch((error) => {
			console.log(error);
		})

	}

	componentDidMount() {

	// REMOVE BELOW LINE ONCE FIXED
		this.props.set_fetched_socialposts([])
		window.addEventListener("scroll", this.onScroll, false);
		this.getSocialposts()
	// dummy objects as fetched socialposts
		// this.props.set_fetched_socialposts([
		// 	{ type_of_post:'dummy1', post_text:'dummy1', image_for_post:'dummy1', video_for_post:'dummy1', video_thumbnail_image:'dummy1', total_likes:'dummy1', total_shares:'dummy1', endpoint:'dummy1', date_of_publishing:'dummy1',},
		// 	{ type_of_post:'dummy2', post_text:'dummy2', image_for_post:'dummy2', video_for_post:'dummy2', video_thumbnail_image:'dummy2', total_likes:'dummy2', total_shares:'dummy2', endpoint:'dummy2', date_of_publishing:'dummy2',},
		// 	{ type_of_post:'dummy3', post_text:'dummy3', image_for_post:'dummy3', video_for_post:'dummy3', video_thumbnail_image:'dummy3', total_likes:'dummy3', total_shares:'dummy3', endpoint:'dummy3', date_of_publishing:'dummy3',},
		// 	{ type_of_post:'dummy4', post_text:'dummy4', image_for_post:'dummy4', video_for_post:'dummy4', video_thumbnail_image:'dummy4', total_likes:'dummy4', total_shares:'dummy4', endpoint:'dummy4', date_of_publishing:'dummy4',},
		// 	{ type_of_post:'dummy5', post_text:'dummy5', image_for_post:'dummy5', video_for_post:'dummy5', video_thumbnail_image:'dummy5', total_likes:'dummy5', total_shares:'dummy5', endpoint:'dummy5', date_of_publishing:'dummy5',},
		// 	{ type_of_post:'dummy6', post_text:'dummy6', image_for_post:'dummy6', video_for_post:'dummy6', video_thumbnail_image:'dummy6', total_likes:'dummy6', total_shares:'dummy6', endpoint:'dummy6', date_of_publishing:'dummy6',},
		// 	{ type_of_post:'dummy7', post_text:'dummy7', image_for_post:'dummy7', video_for_post:'dummy7', video_thumbnail_image:'dummy7', total_likes:'dummy7', total_shares:'dummy7', endpoint:'dummy7', date_of_publishing:'dummy7',},
		// 	{ type_of_post:'dummy8', post_text:'dummy8', image_for_post:'dummy8', video_for_post:'dummy8', video_thumbnail_image:'dummy8', total_likes:'dummy8', total_shares:'dummy8', endpoint:'dummy8', date_of_publishing:'dummy8',},
		// 	{ type_of_post:'dummy9', post_text:'dummy9', image_for_post:'dummy9', video_for_post:'dummy9', video_thumbnail_image:'dummy9', total_likes:'dummy9', total_shares:'dummy9', endpoint:'dummy9', date_of_publishing:'dummy9',},
		// 	{  type_of_post:'dummy10', post_text:'dummy10', image_for_post:'dummy10', video_for_post:'dummy10', video_thumbnail_image:'dummy10', total_likes:'dummy10', total_shares:'dummy10', endpoint:'dummy10', date_of_publishing:'dummy10',},
		// ]) // loading with empty since it was storing all objects reaching to 200
	}

	componentWillUnmount(){
		window.removeEventListener("scroll", this.onScroll);
	}

	onScroll = async () => {
		const scrollY = window.scrollY
		// console.log(`onScroll, window.scrollY: ${scrollY}, user_screen_height: ${window.screen.height}, total_page_height: ${window.screen.availHeight}, real_height:${this.state.tracked_container_height}`)
		// console.log({difference: this.state.tracked_container_height - scrollY})
		// console.log({container_height: this.state.tracked_container_height})
		// this.state.tracked_container_height - scrollY = 629.5

	// tracking end reached and adding more objects
		// console.log({scrollY, real_height:this.state.tracked_container_height})

		let scroll_judgement_factor = this.state.tracked_container_height - scrollY
			// console.log({scroll_judgement_factor})
		if (scroll_judgement_factor < 3000){ //3000

			window.removeEventListener("scroll", this.onScroll);

	// dummy objects as fetched socialposts
		// 	this.props.async_append_fetched_socialposts([
		// 		{ type_of_post:'dummy1', post_text:'dummy1', image_for_post:'dummy1', video_for_post:'dummy1', video_thumbnail_image:'dummy1', total_likes:'dummy1', total_shares:'dummy1', endpoint:'dummy1', date_of_publishing:'dummy1',},
		// 		{ type_of_post:'dummy2', post_text:'dummy2', image_for_post:'dummy2', video_for_post:'dummy2', video_thumbnail_image:'dummy2', total_likes:'dummy2', total_shares:'dummy2', endpoint:'dummy2', date_of_publishing:'dummy2',},
		// 		{ type_of_post:'dummy3', post_text:'dummy3', image_for_post:'dummy3', video_for_post:'dummy3', video_thumbnail_image:'dummy3', total_likes:'dummy3', total_shares:'dummy3', endpoint:'dummy3', date_of_publishing:'dummy3',},
		// 		{ type_of_post:'dummy4', post_text:'dummy4', image_for_post:'dummy4', video_for_post:'dummy4', video_thumbnail_image:'dummy4', total_likes:'dummy4', total_shares:'dummy4', endpoint:'dummy4', date_of_publishing:'dummy4',},
		// 		{ type_of_post:'dummy5', post_text:'dummy5', image_for_post:'dummy5', video_for_post:'dummy5', video_thumbnail_image:'dummy5', total_likes:'dummy5', total_shares:'dummy5', endpoint:'dummy5', date_of_publishing:'dummy5',},
		// 	])
		// 	this.setState(prev => ({
		// 		...prev, 
		// 		tracked_container_height:this.social_posts_container.clientHeight,
		// 	}))
		// 	window.addEventListener("scroll", this.onScroll, false);
		// }

		// real social posts addition
			this.getSocialposts()
		}
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

		var all_friends = this.props.list_of_friends

		var base64CoverImage = "data:image/jpeg;base64," + this.props.user_cover_image

		var base64AvatarImage = "data:image/jpeg;base64," + this.props.user_avatar_image

		// let all_friends = this.props.all_friends
		// let all_friends = [1,2,3,4,5,6,7,8,9,10]
		let total_books = this.props.total_books
		// let total_books = [1,2,3,4,5,6,7,8,9,10]

		let total_sports = this.props.total_sport
	
		let friend_suggestions = this.props.list_of_friend_suggestions

		const total_socialposts = this.props.total_socialposts

		return (
			<div ref={ (divElement) => { this.social_posts_container = divElement } }>
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

						<InnerNavigation/>

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

											<Grid item key={String(item.key)}>
												<ConnectedSocialPostCard
													dataPayloadFromParent = { item }

													comments_quantity = { item.total_comments }
													comments = { item.comments || [] }

													likes_quantity = { item.total_likes }
													likes = { item.likes || [] }

													shares_quantity = { item.total_shares }
													shares = { item.shares || [] }

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
			</div>

		);
	}
}

TimelineContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(TimelineContainer);