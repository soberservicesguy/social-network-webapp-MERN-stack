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
	ConnectedSocialPostCard,
	ConnectedCreateSocialPost,

	ConnectedAdvertisementContainer,
	ConnectedPageContainer,

	ConnectedNotificationsContainer,

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

			track_scrolling: true,
			// tracked_container_width: 0,
			tracked_container_height: 0,
		}	
		// this.resizeHandler = this.resizeHandler.bind(this);
	}

	componentDidMount() {

	// not incorporating resizing now ie screen size changes
		// this.resizeHandler();
		// window.addEventListener('resize', this.resizeHandler);

		window.addEventListener("scroll", this.onScroll, false);
		// window.addEventListener("scroll", this.resizeHandler, false);

		this.get_social_posts()

	}

	componentWillUnmount(){
		window.removeEventListener("scroll", this.onScroll);
		// window.removeEventListener('resize', this.resizeHandler);
		// window.removeEventListener("scroll", this.resizeHandler);
	}

	// resizeHandler() {
	// 	this.setState(prev => ({
	// 		...prev, 

	// 		// tracked_container_width:this.social_posts_container.clientWidth, 
	// 		tracked_container_height:this.social_posts_container.clientHeight,
	// 	}))
	// }

	onScroll = () => {
		const scrollY = window.scrollY
		// console.log(`onScroll, window.scrollY: ${scrollY}, user_screen_height: ${window.screen.height}, total_page_height: ${window.screen.availHeight}, real_height:${this.state.tracked_container_height}`)
		// console.log({difference: this.state.tracked_container_height - scrollY})
		// console.log({container_height: this.state.tracked_container_height})
		// this.state.tracked_container_height - scrollY = 629.5


	// tracking end reached and adding more objects
		if ( this.state.track_scrolling && this.state.tracked_container_height - scrollY < 650 ){
			console.log('REACHED END')
			this.setState(prev => ({...prev, track_scrolling: false }));
			console.log('STOPPED TRACKING')
			this.get_social_posts() // this resumes scroll tracking again

			// console.log({difference_now: this.state.tracked_container_height - scrollY})
			// console.log({container_height_now: this.state.tracked_container_height})

		// tracking the height as well upon
			this.setState(prev => ({
				...prev, 

				// tracked_container_width:this.social_posts_container.clientWidth, 
				tracked_container_height:this.social_posts_container.clientHeight,
			}))


		}

	}

	get_social_posts(){

		// simulating addition of some objects upon end reached 
			this.setState(prev => ({...prev, backend_requests_made: prev.backend_requests_made + 1 }));
			this.props.append_fetched_socialposts([
				{ type_of_post:'dummy1', post_text:'dummy1', image_for_post:'dummy1', video_for_post:'dummy1', video_thumbnail_image:'dummy1', total_likes:'dummy1', total_shares:'dummy1', endpoint:'dummy1', date_of_publishing:'dummy1',},
				{ type_of_post:'dummy2', post_text:'dummy2', image_for_post:'dummy2', video_for_post:'dummy2', video_thumbnail_image:'dummy2', total_likes:'dummy2', total_shares:'dummy2', endpoint:'dummy2', date_of_publishing:'dummy2',},
				{ type_of_post:'dummy3', post_text:'dummy3', image_for_post:'dummy3', video_for_post:'dummy3', video_thumbnail_image:'dummy3', total_likes:'dummy3', total_shares:'dummy3', endpoint:'dummy3', date_of_publishing:'dummy3',},
				{ type_of_post:'dummy4', post_text:'dummy4', image_for_post:'dummy4', video_for_post:'dummy4', video_thumbnail_image:'dummy4', total_likes:'dummy4', total_shares:'dummy4', endpoint:'dummy4', date_of_publishing:'dummy4',},
				{ type_of_post:'dummy5', post_text:'dummy5', image_for_post:'dummy5', video_for_post:'dummy5', video_thumbnail_image:'dummy5', total_likes:'dummy5', total_shares:'dummy5', endpoint:'dummy5', date_of_publishing:'dummy5',},
				{ type_of_post:'dummy6', post_text:'dummy6', image_for_post:'dummy6', video_for_post:'dummy6', video_thumbnail_image:'dummy6', total_likes:'dummy6', total_shares:'dummy6', endpoint:'dummy6', date_of_publishing:'dummy6',},
				{ type_of_post:'dummy7', post_text:'dummy7', image_for_post:'dummy7', video_for_post:'dummy7', video_thumbnail_image:'dummy7', total_likes:'dummy7', total_shares:'dummy7', endpoint:'dummy7', date_of_publishing:'dummy7',},
				{ type_of_post:'dummy8', post_text:'dummy8', image_for_post:'dummy8', video_for_post:'dummy8', video_thumbnail_image:'dummy8', total_likes:'dummy8', total_shares:'dummy8', endpoint:'dummy8', date_of_publishing:'dummy8',},
				{ type_of_post:'dummy9', post_text:'dummy9', image_for_post:'dummy9', video_for_post:'dummy9', video_thumbnail_image:'dummy9', total_likes:'dummy9', total_shares:'dummy9', endpoint:'dummy9', date_of_publishing:'dummy9',},
				{ type_of_post:'dummy10', post_text:'dummy10', image_for_post:'dummy10', video_for_post:'dummy10', video_thumbnail_image:'dummy10', total_likes:'dummy10', total_shares:'dummy10', endpoint:'dummy10', date_of_publishing:'dummy10',},
			])
			console.log('ADDED 10 MORE')

			setTimeout(() => {
				console.log('RESUMED TRACKING')
				this.setState(prev => ({...prev, track_scrolling: true }))
			}, 5000);
			

	
	// real social posts addition
		let backend_requests_made = this.state.backend_requests_made
		axios.get(utils.baseUrl + '/socialposts/get-socialposts-from-friends',
		{
		    params: {
				request_number: backend_requests_made,
				// child_count: 3,
		    }
		})
		.then((response) => {

			this.setState(prev => ({...prev, backend_requests_made: prev.backend_requests_made + 1 }));
			// // append new socialposts
			this.props.append_fetched_socialposts(response.data)
			// // now resume tracking scroll again
			console.log('ADDED 10 MORE THROUGH AXIOS REQUEST')
			setTimeout(() => {
				console.log('RESUMED TRACKING AFTER AXIOS REQUEST')
				this.setState(prev => ({...prev, track_scrolling: true }))
			}, 5000);

		})
		.catch((error) => {
			console.log(error);
		})

	}

// RENDER METHOD
	render() {

		const total_socialposts = this.props.total_socialposts

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
							{/*<ConnectedFriendsContainer/>*/}
						</div>
					</Grid>


					<Grid container direction="column" xs={12} sm={12} md={6} lg={6} xl={6}>

						<Grid item>
							<div>
					  			<ConnectedCreateSocialPost/>
							</div>
				  		</Grid>

						{total_socialposts.map((item, index)=>(

							<Grid item>
								<div>
									{index}
								</div>
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


					<Grid container xs={12} sm={12} md={3} lg={3} xl={3}>
						<div style={{
							width:'100%', 
							marginLeft:(_md || _lg || _xl) ? 30 : 0, 
							marginRight:(_md || _lg || _xl) ? 30 : 0,
						}}>
							<ConnectedNotificationsContainer/>
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