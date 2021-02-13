
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	ComponentForShowingAdvertisement
} from "."

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

class AdvertisementCard extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded: false,
		}	

	}


// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		return (
		  	<div>

				{/* first the parent / card component */}
		  		<ComponentForShowingAdvertisement
					dataPayloadFromParent = { this.props.dataPayloadFromParent }
		  		/>

		  	</div>
		);
	}
}
	
AdvertisementCard.defaultProps = {

};

// export default AdvertisementCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(AdvertisementCard);
