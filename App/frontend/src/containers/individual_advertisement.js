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
	ConnectedComponentForShowingAdvertisement,
} from "../redux_stuff/connected_components"


class IndividualIndividualAdvertisement extends Component {
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

		let data = this.props.current_advertisement

	  	return (
	  		<ConnectedComponentForShowingAdvertisement
				dataPayloadFromParent = { data }
				increaseImageHeight = {true}
	  		/>
		);
	}
}
	
IndividualIndividualAdvertisement.defaultProps = {
	//:,
};

export default withRouter(IndividualIndividualAdvertisement)