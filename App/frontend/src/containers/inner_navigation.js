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
	withRouter,
	Link,
} from "react-router-dom";

import {
	ConnectedNotificationsContainer,
} from "../redux_stuff/connected_components"

class InnerNavigation extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}


// RENDER METHOD
	render() {
			
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	const styles = {
	  		upperMenu:{
	  			width:'85%',
	  			height:80,
	  			backgroundColor: 'white',
	  			margin:'auto',

	  			display:'flex',
	  			flexDirection:'row',
	  			justifyContent: 'flex-end',
	  			alignItems: 'center',
	  		},
	  		upperMenuButtonContainer:{
	  			flexBasis:(_xs || _sm || _md) ? '10%' :'15%',
	  			textAlign:'right',
	  		},
	  		upperMenuButtonRoundButtonContainer:{
	  			flexBasis:(_xs || _sm || _md) ? '15%' :'25%',
	  			textAlign:'center',
	  		},
	  		menuText:{
	  			color:'black',
	  			fontWeight:'bold',
	  			marginBottom:0,
	  		},
			upperMenuButtonRoundButtonContainer:{
				flexBasis:(_xs || _sm || _md) ? '15%' :'25%',
				textAlign:'center',
			},
			roundButtonWrapper:{
				backgroundColor: utils.maroonColor,
				width:(_xs || _sm || _md) ? '70%' : '30%',
				margin:'auto',
				borderRadius:50,
				// height:50,
				// paddingLeft:10,
				// paddingRight:10,
				// marginLeft:10,
			},
			menuRoundButtonText:{
				color:'white',
				fontWeight:'bold',
				paddingTop:10,
				paddingBottom:10,
				marginBottom:0,
			},


	  	}

	  	const { pathname } = this.props.location;

		return (

			<Grid item xs={12}>
				<div>
					<div style={{backgroundColor: 'white'}}>
						<div style={styles.upperMenu}>
							<div style={styles.upperMenuButtonContainer}>
								<Link to="/timeline">
									<p style={{...styles.menuText, color:( pathname === `/timeline`) ? utils.maroonColor : 'grey',}}>
										Timeline
									</p>
								</Link>
							</div>

							<div style={styles.upperMenuButtonContainer}>
								<Link to="/about-me">
									<p style={{...styles.menuText, color:( pathname === `/about-me`) ? utils.maroonColor : 'grey',}}>
										About
									</p>
								</Link>
							</div>

							<div style={styles.upperMenuButtonContainer}>
								<Link to="/friends">
									<p style={{...styles.menuText, color:( pathname === `/friends`) ? utils.maroonColor : 'grey',}}>
										Friends
									</p>
								</Link>
							</div>

							<div style={styles.upperMenuButtonRoundButtonContainer}>
								<Link to="/settings">
									<div style={styles.roundButtonWrapper}>
										<p style={{...styles.menuRoundButtonText, color: 'white',}}>
											Edit Profile
										</p>
									</div>
								</Link>
							</div>

						</div>
					</div>
				</div>
			</Grid>


		);
	}
}

InnerNavigation.defaultProps = {
	// : ,
};

export default withRouter(withResponsiveness(InnerNavigation));