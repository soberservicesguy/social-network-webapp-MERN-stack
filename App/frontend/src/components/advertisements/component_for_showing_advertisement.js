import { 
	// withRouter,
	Link,
} from "react-router-dom";

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
		var base64Image = "data:image/jpeg;base64," + data.ad_image

		const styles = {
			outerContainer:{
				marginTop:30,
			},

			imageStyle:{
				width:'100%', 
				height: (this.props.increaseImageHeight) ? 400 : 200, 
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

		  		<Link 
		  			to={{pathname:`/advertisements/:id=${data.endpoint}`}} 
		  			style={{color: 'inherit', textDecoration: 'inherit'}}
		  			onClick = {() => this.props.set_current_advertisement(data)}
				>
					<div style={styles.imageContainer}>
						<img 
							src={base64Image}
							// src={utils.image} 
							alt="" 
							style={styles.imageStyle}
						/>
					</div>
				</Link>

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
