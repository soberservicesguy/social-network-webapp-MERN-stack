
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	// ComponentForShowingSocialPost
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
	ConnectedComponentForShowingSocialPost,
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
			  		<ConnectedComponentForShowingSocialPost
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>


		  		{(this.props.dataPayloadFromParent.message !== 'no more posts to show') ? (
		  			<React.Fragment>
						<div style={styles.showSocialsContainer}>
							<ShowLikesOfSocialPost
								dataPayloadFromParent = { this.props.dataPayloadFromParent }
								likes_quantity = { this.props.likes_quantity }
							/>
							<ShowCommentsOfSocialPost
								dataPayloadFromParent = { this.props.dataPayloadFromParent }
								comments_quantity = { this.props.comments_quantity }
							/>
							<ShowSharesOfSocialPost
								dataPayloadFromParent = { this.props.dataPayloadFromParent }
								shares_quantity = { this.props.shares_quantity }
							/>
						</div>


						<div style={styles.createSocialObjectsContainer}>
							{/* 4th create individual child options like comment / like */}					
							<ConnectedCreateLikeForSocialpost
								parentDetailsPayload = { this.props.dataPayloadFromParent }
			  					redirectToNew = { true }
							/>					
							<ConnectedCreateCommentForSocialpost
								parentDetailsPayload = { this.props.dataPayloadFromParent }
			  					redirectToNew = { true }
							/>					
							<ConnectedCreateShareForSocialpost
								parentDetailsPayload = { this.props.dataPayloadFromParent }
			  					redirectToNew = { true }
							/>
						</div>
					</React.Fragment>

	  			) : (
	  				null
	  			)}

		  	</div>
		);
	}
}
	
SocialPostCard.defaultProps = {

};

// export default SocialPostCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(SocialPostCard);
