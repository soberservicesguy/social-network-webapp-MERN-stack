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

import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


class ComponentForShowingPage extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			liked:false,
		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {
		const styles = {
			outerContainer:{
				marginTop: 25,
				marginBottom: 25,
				display:'flex',
				flexDirection:'row',
				justifyContent: 'space-between',
			},
			imageContainer:{
				flex:1
			},
			textContainer:{
				flex:4,
				paddingLeft:20,
			},

			heading:{
				fontWeight:'bold',
				fontSize:17,
				marginBottom:5,
			},
			text:{
				fontSize:15,
			},

			likeButtonContainer:{
				flex:1,
				alignSelf:'center',
				marginBottom:10,
			},
			likeButton:{
				outline:'none',
				borderStyle:'solid',
				borderColor:'white',
				backgroundColor:'white'
			},


			outerContainer:{
				marginTop:30,
			},

			imageStyle:{
				width: (this.props.showWholeComponent) ? '100%' : 50, 
				height: (this.props.showWholeComponent) ? 400 : 50, 
				resizeMode: "stretch",
				borderRadius:(this.props.showWholeComponent) ? 0 : 50/2,

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
					// { data.page_image }
					// { data.endpoint }

		var data = this.props.dataPayloadFromParent // data being plugged from parent flatlist
		var base64Image = "data:image/jpeg;base64," + data.page_image


		return (
			<div>

				{(this.props.showWholeComponent) ? (
				
					<div style={styles.outerContainer}>
				  		<Link 
				  			to={{pathname:`/advertisements/:id=${data.endpoint}`}} 
				  			style={{color: 'inherit', textDecoration: 'inherit'}}
				  			// onClick = {() => this.props.set_current_advertisement(data)}
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
							{ data.page_name }
						</p>
						<p style={styles.adDescription}>
							{ data.page_description }
						</p>

					</div>

				) : (

					<div style={styles.outerContainer}>
				  		
				  		<div style={{display:'flex'}}>
					  		<Link 
					  			to={{pathname:`/pages/:id=${data.endpoint}`}} 
					  			style={{color: 'inherit', textDecoration: 'inherit'}}
							>
								<div style={styles.imageContainer}>
									<img 
										src={base64Image} 
										// src = {utils.image}
										alt="" 
										style={styles.imageStyle}
									/>
								</div>
							</Link>

							<div style={styles.textContainer}>
								<p style={styles.heading}>
									{ data.page_name }
								</p>

								<p style={styles.text}>
									{ data.page_description }
								</p>
							</div>

							<div style={styles.likeButtonContainer}>
								<button
									style={styles.likeButton}
									onClick={ () => {
										
										let setResponseInCurrentPage = (arg) => this.props.set_current_page(arg)
										let redirectToNewPage = () => this.setState(prev => ({...prev, redirectToRoute: (prev.redirectToRoute === false) ? true : false }))	
										let setStateToLike = () => this.setState( prev => ({...prev, liked: (prev.liked===true) ? false : true }) )

										let page_endpoint = (typeof this.props.parentDetailsPayload.endpoint === "undefined" || this.props.parentDetailsPayload.endpoint === null) ? data.endpoint : this.props.parentDetailsPayload.endpoint

										axios.post(utils.baseUrl + '/pages/create-interest-for-page', 
											{
												// page_endpoint: this.props.parentDetailsPayload.endpoint,
												page_endpoint: page_endpoint,
											})
										.then(function (response) {

											// console.log(response.data) // current blogpost screen data

									// setting icon to liked
											setStateToLike()

											// set to current parent object
											setResponseInCurrentPage(response.data)

											// change route to current_blogpost	
											redirectToNewPage()							

										})
										.catch(function (error) {
											console.log(error)
										});						

									}}
								>
									{(this.state.liked) ?
										 <Favorite style={{color:utils.maroonColor, fontSize:30, marginRight:20,}}/>
										:
										 <FavoriteBorder style={{color:utils.maroonColor, fontSize:30, marginRight:20,}}/>
									}
									
									
								</button>
							</div>
				  			
				  		</div>


					</div>

				)}

			</div>
		);
	}
}
	
ComponentForShowingPage.defaultProps = {

};

// export default ComponentForShowingPage;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ComponentForShowingPage)
