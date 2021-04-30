import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import utils from "../utilities"
// IMPORT material-ui stuff
import { withStyles } from '@material-ui/styles';
import { Skeleton } from '@material-ui/lab';
import { 
	Grid,
	// Button 
} from "@material-ui/core";
// IMPORT responsiveness hook
import withResponsiveness from "../responsiveness_hook";


import {
	ConnectedSocialPostCard,
	ConnectedCreateSocialPost,

	ConnectedAdvertisementContainer,
	ConnectedPageContainer,

	// ConnectedNotificationsContainer,

	ConnectedFriendsContainer,
	ConnectedProfileHeader,
} from '../redux_stuff/connected_components';

import {
} from "../components"


class SocialPostContainer extends Component {
	constructor(props) {
		super(props);

	    // this.myRef = React.createRef()
// STATE	
		this.state = {
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

		axios.get(utils.baseUrl + '/socialposts/get-socialposts-from-friends',
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

		let total_socialposts = this.props.total_socialposts



	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	const styles = {

	  	}

  		
		return (
			<div ref={ (divElement) => { this.social_posts_container = divElement } }>

				<Grid container>
					<Grid container xs={12} sm={12} md={3} lg={3} xl={3}>
						<div style={{
							width:'100%', 
							marginLeft:(_md || _lg || _xl) ? 30 : 0, 
							marginRight:(_md || _lg || _xl) ? 30 : 0,
						}}>
							<ConnectedProfileHeader/>
							<ConnectedPageContainer/>

						{/* friends requests */}
							<ConnectedFriendsContainer
								showFriendsSuggestionsInstead = {false}
								showFriendsRequestInstead = {true}
							/>

						{/* friends suggestions */}
							<ConnectedFriendsContainer
								showFriendsSuggestionsInstead = {true}
								showFriendsRequestInstead = {false}
							/>

						{/* friends */}
							<ConnectedFriendsContainer
								showFriendsSuggestionsInstead = {false}
								showFriendsRequestInstead = {false}
							/>

						</div>
					</Grid>


					<Grid container direction="column" xs={12} sm={12} md={6} lg={6} xl={6}>

						<Grid item>
							<div>
					  			<ConnectedCreateSocialPost/>
							</div>
				  		</Grid>



					{total_socialposts.map((item, index) => {

							return(
								// <Grid item key={String(item.key)}>
								<Grid item key={String(index)}>
									{/*<div>
										{item.key}
									</div>*/}
									<ConnectedSocialPostCard
										dataPayloadFromParent = { item }

										comments_quantity = { item.total_comments }
										comments = { item.comments || [] }

										likes_quantity = { item.total_likes }
										likes = { item.likes || [] }

										shares_quantity = { item.total_shares }
										shares = { item.shares || [] }

										// user_quantity = { item.user_quantity }
										// user = { item.user || [] }
									
									/>
								</Grid>
							)
						})}
				
					</Grid>


					<Grid container xs={12} sm={12} md={3} lg={3} xl={3}>
						<div style={{
							width:'100%', 
							marginLeft:(_md || _lg || _xl) ? 30 : 0, 
							marginRight:(_md || _lg || _xl) ? 30 : 0,
						}}>
							<ConnectedAdvertisementContainer/>
						</div>					
					</Grid>


				</Grid>

			</div>
		);
	}
}

SocialPostContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(SocialPostContainer);