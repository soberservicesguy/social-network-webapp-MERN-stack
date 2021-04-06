
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
	withRouter,
	Link,
} from "react-router-dom";

import axios from 'axios';
import firebase from 'firebase';

import {
	ComponentForShowingSport
} from "."

import utils from "../../utilities";

import {
	SummarizeLikesOfSport,
	ShowLikesOfSport,
} from "../likes/"

import {
	ConnectedCreateLikeForSport,
} from "../../redux_stuff/connected_components"

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";


const styles = theme => ({
	root: {
		maxWidth: 380,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},

});

class SportCard extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded: false,
			likes:[],

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

		axios.get(utils.baseUrl + '/sports/get-all-likes-of-sport', 
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
		  	<div>

		  		<div>
					{/* first the parent / card component */}
			  		<ComponentForShowingSport
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>

	  			<React.Fragment>
					<div style={styles.showSocialsContainer}>
						<ShowLikesOfSport
							dataPayloadFromParent = { this.props.dataPayloadFromParent }
							likes_quantity = { this.props.likes_quantity }
						/>
						<ConnectedCreateLikeForSport
							parentDetailsPayload = { this.props.dataPayloadFromParent }
		  					redirectToNew = { true }
						/>					
					</div>


					<div style={styles.createSocialObjectsContainer}>
						{/* 4th create individual child options like comment / like */}					
					</div>

				</React.Fragment>


		  	</div>
		);
	}
}
	
SportCard.defaultProps = {

};

// export default SportCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(SportCard));
