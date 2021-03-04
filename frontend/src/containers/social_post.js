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

			// tracked_container_width: 0,
			tracked_container_height: 0,
		}	
		this.resizeHandler = this.resizeHandler.bind(this);

	}

	componentDidMount() {

		this.resizeHandler();
		window.addEventListener('resize', this.resizeHandler);

		window.addEventListener("scroll", this.onScroll, false);

		this.get_social_posts()

	}

	componentWillUnmount(){
		window.removeEventListener('resize', this.resizeHandler);
		window.removeEventListener("scroll", this.onScroll);
	}

	resizeHandler() {
		this.setState(prev => ({
			...prev, 
			// tracked_container_width:this.social_posts_container.clientWidth, 
			tracked_container_height:this.social_posts_container.clientHeight,
		}))
	}

	onScroll = () => {
		// const scrollY = window.scrollY
		// console.log(`onScroll, window.scrollY: ${scrollY}, user_screen_height: ${window.screen.height}, total_page_height: ${window.screen.availHeight}, real_height:${this.state.tracked_container_height}`)

		if ( this.state.tracked_container_height - window.scrollY < 1500){ // 1500 is tested for 75% scrolled
			console.log('REACHED END')
			this.get_social_posts()
		}
	}

	get_social_posts(){
	
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
			// this.props.set_fetched_socialposts(response.data)

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
							<ConnectedFriendsContainer/>
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