
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";


class ComponentForShowingAdvertisement extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {

		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		const data = this.props.dataPayloadFromParent // data being plugged from parent flatlist
		// 			{ data.ad_image }
		// 			{ data.endpoint }
		// var base64Image = "data:image/jpeg;base64," + this.props.current_image

		const styles = {
			outerContainer:{
				marginTop:30,
			},

			imageStyle:{
				width:'100%', 
				height:300, 
				resizeMode: "stretch"
			},

			adHeading:{
				fontWeight:'bold',
				fontSize:20,
				marginBottom:10,
			},
			adDescription:{
				fontSize:15,
			},
		}

		return (
			<div style={styles.outerContainer}>
				<div style={styles.imageContainer}>
					<img 
						// src={base64Image}
						src={utils.image} 
						alt="" 
						style={styles.imageStyle}
					/>
				</div>
				<p style={styles.adHeading}>
					{ data.ad_name }
				</p>
				<p style={styles.adDescription}>
					{ data.ad_description }
				</p>
			</div>
		);
	}
}
	
ComponentForShowingAdvertisement.defaultProps = {

};

// export default ComponentForShowingAdvertisement;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ComponentForShowingAdvertisement)
