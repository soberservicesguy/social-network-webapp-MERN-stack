import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../responsiveness_hook";

import utils from "../utilities";



class ProfileHeader extends Component {
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
		// button
			outerContainer:{
				marginTop: 0,
				paddingTop:0,
				backgroundColor: 'white',
				justifyContent: 'center',
				alignItems:'center',
				// height: 150,
				width: '100%',
				marginBottom:30,

			},

			backgroundImage:{
				height:200,				
				backgroundImage: `url(${utils.image})`,
				// backgroundColor: '#cccccc', // Used if the image is unavailable
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'auto', // '300px 100px' | '75% 50%' | 'cover' | 'contain' | 'none'
			},

			roundImageContainer:{
				margin:'auto',
				// backgroundColor: 'green',
				textAlign:'center',
				width:'100%',
				height: 100 - 50, // reduced the amount displaced from 'bottom' ie 50

				position:'relative',
				bottom:50, // half of its height
				marginBottom:0,
				paddingBottom:0,

			},
			roundImage:{
				width:100, 
				height:100, 
				resizeMode: "stretch",
				borderRadius:100/2,				
				marginBottom:0,

			},

			headingText:{
				marginTop:10,
				textAlign:'center',
				fontSize:20,
				fontWeight:'bold',
				// backgroundColor: '#000000'
			},
			longText:{
				textAlign:'center',
				color:'grey',
				fontSize:15,
				paddingLeft:20,
				paddingRight:20,
				paddingBottom:40,
			}
		}

		let data = this.props.dataPayloadFromParent
		// var base64Image = "data:image/jpeg;base64," + this.props.current_image

		return (

			<div style={styles.outerContainer}>
				<div style={styles.backgroundImage}>
				</div>


				<div style={styles.roundImageContainer}>
					<img 
						// src={base64Image}
						src={utils.image} 
						alt="" 
						style={styles.roundImage}
					/>
				</div>

				<p style={styles.headingText}>
					Arsalan
				</p>

				<p style={styles.longText}>
					lorem ipsum this is lorem ipsum this is lorem ipsum this is lorem ipsum this is lorem ipsum 
				</p>
			</div>
			  	
		);
	}
}
	
ProfileHeader.defaultProps = {
};

export default ProfileHeader