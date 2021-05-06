
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	ConnectedCreateLikeForBook,
	ConnectedComponentForShowingBook,
} from "../../redux_stuff/connected_components"


import {
	SummarizeLikesOfBook,
	ShowLikesOfBook,
} from "../likes/";

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";



class BookCard extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded: false,
			likes: [],

			showOnlyQuantityForLike:true,

		}	

	}


// COMPONENT DID MOUNT
	componentDidMount() {
		this.setState( prev => ({...prev, showOnlyQuantityForLike: true}) )
	}

	componentWillUnmount(){
		this.setState( prev => ({...prev, showOnlyQuantityForLike: true}) )
	}

	fetchAllLike(endpoint) {

		axios.get(utils.baseUrl + '/books/get-all-likes-of-book', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, likes: ( prev.likes.length === 0 ) ? response.data : [] }) )
			
		})
		.catch((error) => {
			console.log(error);
		})
		
	}


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


		return (
		  	<div style={{width:'95%', margin:'auto'}}>

		  		<div>
					{/* first the parent / card component */}
			  		<ConnectedComponentForShowingBook
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>

	  			<div style={styles.createSocialObjectsContainer}>

					<div style={styles.showSocialsContainer}>
						<ShowLikesOfBook
							dataPayloadFromParent = { this.props.dataPayloadFromParent }
							likes_quantity = { this.props.likes_quantity }
						/>
						<ConnectedCreateLikeForBook
							parentDetailsPayload = { this.props.dataPayloadFromParent }
		  					redirectToNew = { true }
						/>					
					</div>


				</div>
				
		  	</div>
		);
	}
}
	
BookCard.defaultProps = {

};

// export default BookCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(BookCard);