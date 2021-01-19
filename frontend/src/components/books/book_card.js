
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
} from "../../redux_stuff/connected_components"

import {
	ComponentForShowingBook
} from "."

import {
	SummarizeLikesOfBook,
	ShowLikesOfBook,
} from "../likes/";

import utils from "../../utilities";

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

class BookCard extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			expanded: false,
			likes: [],
		}	

	}


// COMPONENT DID MOUNT
	componentDidMount() {

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

		return (
		  	<div>

		  		<div>
					{/* first the parent / card component */}
			  		<ComponentForShowingBook
						dataPayloadFromParent = { this.props.dataPayloadFromParent }
			  		/>
		  		</div>

				<div>
					{/* 2nd show individual summary of childs */}
					<SummarizeLikesOfBook
						showOnlyQuantity= { false }
						child_quantity = { this.props.likes_quantity }
						dataPayloadFromParent = { this.props.likes }
					/>
				</div>

				<div>
					{/* 3rd show individual button for showing childs */}
					<button style={styles.buttonWithoutBG}
						onPress={ () => this.fetchAllLike( this.props.dataPayloadFromParent.endpoint ) }
					>
						<p>
							Show All Like
						</p>
					</button>
					
					<ShowLikesOfBook
						dataPayloadFromParent = { this.state.likes }
					/>
				</div>

				<div>
					{/* 4th create individual child options like comment / like */}
					<ConnectedCreateLikeForBook
						parentDetailsPayload = { this.props.dataPayloadFromParent }
					/>
				</div>

		  	</div>
		);
	}
}
	
BookCard.defaultProps = {

};

// export default BookCard; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(BookCard));
