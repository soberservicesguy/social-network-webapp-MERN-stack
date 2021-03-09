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

class MyResponsiveNavigation extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			backend_requests_made:1,
		}	
	}


// RENDER METHOD
	render() {
			
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	const styles = {

	  	}

	  	const navigation_options = [
	  		{option_name:'Wall', endpoint:'socialposts'},
	  		{option_name:'About Me', endpoint:'about-me'},
	  		// {option_name:'Friends', endpoint:'friends'},
	  		// {option_name:'Timeline', endpoint:'timeline'},
	  		{option_name:'Pages', endpoint:'pages'},
	  		{option_name:'Books', endpoint:'books'},
	  		{option_name:'Sports', endpoint:'sports'},
	  		// {option_name:'Logout', endpoint:'logout'},
	  		// {option_name:'Signup', endpoint:'signup'},
	  		{option_name:'Notifications', endpoint:'notifications'},
	  		{option_name:'Settings', endpoint:'settings'},

	  	]

	  	const { pathname } = this.props.location;

	  	let settings_logo = (
	  		<div style={{width:'8%', margin:'auto'}}>
	  			<img src={utils.image} alt="" 
	  				style={{
	  					width:70, 
	  					height:70, 
	  					resizeMode: "stretch",
	  					borderRadius: 70/2,
	  					marginBottom:20,
	  				}}
	  			/>
	  		</div>
  		)

  // 		let notification_logo = (
  // 			<div style={{width:'8%', margin:'auto'}}>
  // 				<img src={utils.image} alt="" 
  // 					style={{
  // 						width:70, 
  // 						height:70, 
  // 						resizeMode: "stretch",
  // 						borderRadius: 70/2,
  // 						marginBottom:20,
  // 					}}
  // 				/>
  // 			</div>
		// )

		return (

			<div style={{
				// backgroundColor: 'blue',
				paddingTop:20,
				paddingBottom:20,
				opacity:(pathname === '/login' || pathname === '/signup') ? 0 : 1
			}}>			
				<Grid container direction="row" alignItems="center">
					
					<Grid item xs={0} sm={0} md={12 - navigation_options.length} lg={12 - navigation_options.length} xl={12 - navigation_options.length}>
			  		</Grid>


					{navigation_options.map((item, index)=>(
		

						<Grid item xs={12} sm={12} md={1} lg={1} xl={1}>

								{(() => {
									if(item.option_name === 'Settings'){
										
										return(										
									  		<Link 
									  			to={`/${item.endpoint}`} 
									  			style={{
									  				color: 'inherit', 
									  				textDecoration: 'inherit',
									  			}}
											>
												{settings_logo}
											</Link>
										)
						
									} else if (item.option_name === 'Notifications'){

										return(										
											<ConnectedNotificationsContainer/>
										)
										
									} else {
										
										return(
									  		<Link 
									  			to={`/${item.endpoint}`} 
									  			style={{
									  				color: 'inherit', 
									  				textDecoration: 'inherit',
									  			}}
											>
												<p style={{
													textAlign:'center',
													marginBottom: 0,
													paddingBottom: 0,
													fontSize:18,
													fontWeight:'bold',
													// color:'grey',
												// color of active link
													color:( `/${item.endpoint}` === pathname) ? 'black' : 'grey',
												// border below active link
													// borderBottomWidth:( item.endpoint === this.state.current_route) ? 3 : 0,
													// borderBottomColor:'black',
													// borderBottomStyle:'solid',
													// marginLeft:20,
													// marginRight:20,
									  				marginBottom:15,
												}}>
													{item.option_name}
												</p>
											</Link>
										)

									}

								})()}
					
						</Grid>

					))}

				</Grid>
			</div>


		);
	}
}

MyResponsiveNavigation.defaultProps = {
	// : ,
};

export default withRouter(withResponsiveness(MyResponsiveNavigation));