
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
	ConnectedCreateLikeForBook,
	ConnectedComponentForShowingBook,
} from "../redux_stuff/connected_components"

import { withRouter } from "react-router-dom";

import {
	SummarizeLikesOfBook,
	ShowLikesOfBook,
} from "../components/likes/";



class IndividualIndividualBook extends Component {
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

	  	let data = this.props.current_book

	  	return (
			<div style={{width:'80%', margin:'auto'}}>
				<ConnectedComponentForShowingBook
					dataPayloadFromParent={data}
				/>

	  			<React.Fragment>

					<div style={styles.showSocialsContainer}>
						<ShowLikesOfBook
							dataPayloadFromParent = { data }
							likes_quantity = { data.likes_quantity }
						/>
						<ConnectedCreateLikeForBook
							parentDetailsPayload = { data }
		  					redirectToNew = { true }
						/>					
					</div>

				</React.Fragment>

			</div>
		);
	}
}
	
IndividualIndividualBook.defaultProps = {
	//:,
};

export default withRouter(IndividualIndividualBook);