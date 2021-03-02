
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	ComponentForShowingSocialPost
} from "."

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
	ShowCommentsOfSocialPost,
} from "../comments/"

import {
	ConnectedCreateCommentForSocialpost,
} from "../../redux_stuff/connected_components"


import {
	ShowLikesOfSocialPost,
} from "../likes/"

import {
	ConnectedCreateLikeForSocialpost,
} from "../../redux_stuff/connected_components"


import {
	ShowSharesOfSocialPost,
} from "../shares/"

import {
	ConnectedCreateShareForSocialpost,
} from "../../redux_stuff/connected_components"

import Share from '@material-ui/icons/Share';
import Comment from '@material-ui/icons/Comment';
import ThumbUp from '@material-ui/icons/ThumbUp';


class SocialPostCard extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded: false,
			comments: [],
			likes: [],
			shares: [],
			users: [],

			showOnlyQuantityForComment:true,
			showOnlyQuantityForLike:true,
			showOnlyQuantityForShare:true,
		}	

	}

	fetchAllComment(endpoint) {

		axios.get(utils.baseUrl + '/sports/get-all-comments-of-sport', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, comments: ( prev.comments.length === 0 ) ? response.data : [] }) )
			
		})
		.catch((error) => {
			console.log(error);
		})

		this.setState( prev => ({...prev, showOnlyQuantityForComment: false}) )		
	}


	fetchAllLike(endpoint) {

		axios.get(utils.baseUrl + '/sports/get-all-likes-of-sport', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, likes: ( prev.likes.length === 0 ) ? response.data : [] }) )
			
		})
		.catch((error) => {
			console.log(error);
		})

		this.setState( prev => ({...prev, showOnlyQuantityForLike: false}) )		
	}


	fetchAllShare(endpoint) {

		axios.get(utils.baseUrl + '/sports/get-all-shares-of-sport', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, shares: ( prev.shares.length === 0 ) ? response.data : [] }) )
			
		})
		.catch((error) => {
			console.log(error);
		})

		this.setState( prev => ({...prev, showOnlyQuantityForShare: false}) )		
	}



// COMPONENT DID MOUNT
	componentDidMount() {
		this.setState( prev => ({...prev, showOnlyQuantityForComment: true}) )
		this.setState( prev => ({...prev, showOnlyQuantityForShare: true}) )
		this.setState( prev => ({...prev, showOnlyQuantityForLike: true}) )
	}

	componentWillUnmount(){
		this.setState( prev => ({...prev, showOnlyQuantityForComment: true}) )
		this.setState( prev => ({...prev, showOnlyQuantityForShare: true}) )
		this.setState( prev => ({...prev, showOnlyQuantityForLike: true}) )
	}

	render() {

		const styles = {
			showSocialsContainer:{
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between',
				width:'95%',
				margin:'auto',
				marginTop:10,
			},
			showSocialsButton:{
				outline:'none',
				borderStyle:'solid',
				borderColor:'white',
				backgroundColor:'white'
			},
			createSocialObjectsContainer:{
				width:'90%',
				margin:'auto',
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginTop:20,
				paddingBottom:20,

				borderWidth:0,
				borderTopWidth:1,
				borderStyle:'solid',
				borderColor:utils.maroonColor,
				paddingTop:10,
			},
		}

		return (
		  	<div style={{backgroundColor: 'white'}}>

		  		<div>
					{/* first the parent / card component */}
			  		<ComponentForShowingSocialPost
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>

				<div style={styles.showSocialsContainer}>
					{/* 2nd show individual summary of childs */}

					<div>
						<button 
							style={styles.showSocialsButton}
							onClick={ () => this.fetchAllLike( this.props.dataPayloadFromParent.endpoint ) }
						>
							<ThumbUp style={{color:'grey', fontSize:30, marginRight:20,}}/> {this.props.likes_quantity} likes							
						</button>
					</div>

					<div>
						<button 
							style={styles.showSocialsButton}
							onClick={ () => this.fetchAllComment( this.props.dataPayloadFromParent.endpoint ) }
						>
							<Comment style={{color:'grey', fontSize:30, marginRight:20,}}/> {this.props.comments_quantity} likes
						</button>
					</div>

					<div>
						<button 
							style={styles.showSocialsButton}
							onClick={ () => this.fetchAllShare( this.props.dataPayloadFromParent.endpoint ) }
						>
							<Share style={{color:'grey', fontSize:30, marginRight:20,}}/> {this.props.shares_quantity} likes
						</button>
					</div>
				</div>

				<div style={{
					marginBottom: 25,
				}}>
					<ShowLikesOfSocialPost
						dataPayloadFromParent = { this.props.likes }
					/>
					<ShowCommentsOfSocialPost
						dataPayloadFromParent = { this.props.comments }
					/>
					<ShowSharesOfSocialPost
						dataPayloadFromParent = { this.props.shares }
					/>
				</div>


				<div style={styles.createSocialObjectsContainer}>
					{/* 4th create individual child options like comment / like */}					
					<ConnectedCreateLikeForSocialpost
						parentDetailsPayload = { this.props.dataPayloadFromParent }
					/>					
					<ConnectedCreateCommentForSocialpost
						parentDetailsPayload = { this.props.dataPayloadFromParent }
					/>					
					<ConnectedCreateShareForSocialpost
						parentDetailsPayload = { this.props.dataPayloadFromParent }
					/>
				</div>

		  	</div>
		);
	}
}
	
SocialPostCard.defaultProps = {

};

// export default SocialPostCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(SocialPostCard);
