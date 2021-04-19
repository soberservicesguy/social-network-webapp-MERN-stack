
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

class ComponentForShowingSport extends Component {
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
		const styles = {
			outerContainer:{
			},
			imageContainer:{
				textAlign:'center',
			},
			imageStyle:{
				width:'100%', 
				height:300, 
				resizeMode: "stretch"
			}
		}


		const data = this.props.dataPayloadFromParent // data being plugged from parent flatlist

		var base64Image = "data:image/jpeg;base64," + data.sport_image

		return (
			<div style={styles.outerContainer}>
				<div style={styles.imageContainer}>
					<img 
						alt="" 
						src={base64Image}
						// src={utils.image} 
						style={styles.imageStyle}
					/>
				</div>
				<p style={{textAlign:'center', fontWeight:'bold', marginTop:10,}}>
					Name{ data.sport_name }
				</p>

			</div>
		);
	}
}
	
ComponentForShowingSport.defaultProps = {

};

// export default ComponentForShowingSport;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ComponentForShowingSport)
				// <p>
				// 	{ data.sport_description }
				// </p>
				// <p>
				// 	{ data.endpoint }
				// </p>