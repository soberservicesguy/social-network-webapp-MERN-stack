
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	ComponentForShowingPage
} from "."

// import {
// 	ShowLikesOfPage,
// } from "../likes"

// import {
// 	ConnectedCreateLikeForPage
// } from "../../redux_stuff/connected_components"

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import ThumbUp from '@material-ui/icons/ThumbUp';

class PageCard extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded: false,
			likes: [],

			showOnlyQuantityForLike:true,
		}	

	}


// COMPONENT DID MOUNT
	componentDidMount() {
		this.setState( prev => ({...prev, showOnlyQuantityForLike: true}) )
	}

	componentWillUnmount(){
		this.setState( prev => ({...prev, showOnlyQuantityForLike: true}) )
	}

	fetchAllLike(endpoint) {

		axios.get(utils.baseUrl + '/pages/get-all-likes-of-page', 
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

		  	{/*added like button inside component for showing page*/}
		  		<div>
					{/* first the parent / card component */}
			  		<ComponentForShowingPage
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
						parentDetailsPayload = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>

		  	</div>
		);
	}
}
	
PageCard.defaultProps = {

};

// export default PageCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(PageCard);

				// <div style={styles.createSocialObjectsContainer}>
				// 	{/* 4th create individual child options like comment / like */}
				// 	<ConnectedCreateLikeForPage
				// 		parentDetailsPayload = { this.props.dataPayloadFromParent }
				// 	/>
				// </div>