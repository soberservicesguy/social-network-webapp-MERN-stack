
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

import { withRouter } from "react-router-dom";



import {
	SummarizeLikesOfSport,
	ShowLikesOfSport,
} from "../components/likes/"

import {
	ConnectedComponentForShowingSport,
	ConnectedCreateLikeForSport,
} from "../redux_stuff/connected_components"



class IndividualIndividualSport extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
	}

// RENDER METHOD
	render() {

		const styles = {
			showSocialsContainer:{
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between',
				width:'85%',
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
				width:'85%',
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



	  	let data = this.props.current_sport

	  	return (
	  		<div>

		  		<div>
					{/* first the parent / card component */}
			  		<ConnectedComponentForShowingSport
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>

	  			<div style={styles.createSocialObjectsContainer}>

					<div style={styles.showSocialsContainer}>
						<ShowLikesOfSport
							dataPayloadFromParent = { data }
							likes_quantity = { data.likes_quantity }
						/>
						<ConnectedCreateLikeForSport
							parentDetailsPayload = { data }
		  					redirectToNew = { true }
						/>					
					</div>

				</div>

	  		</div>

		);
	}
}
	
IndividualIndividualSport.defaultProps = {
	//:,
};

export default withRouter(IndividualIndividualSport);