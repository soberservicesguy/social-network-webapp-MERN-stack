import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import {
	ComponentForShowingLike
} from "."

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
	Grid, 
	Modal, 
	// TextField,
	// Button 
} from "@material-ui/core";

import ThumbUp from '@material-ui/icons/ThumbUp';


const styles = theme => ({
	outerContainer: {
	},
});

class ShowLikesOfSport extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			show_like_modal: false,
			showOnlyQuantityForLike: true,

			likes: [],
		}

	}

	toggle_like_modal(){
		this.setState(
			prev => (
				{
					...prev,
					show_like_modal: (prev.show_like_modal === false) ? true : false 
				}
			)
		)
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

		// this.setState( prev => ({...prev, show_like_modal: true}) )		
	}

	componentDidMount() {
		if (this.props.likes_quantity === null || typeof this.props.likes_quantity === 'undefined' ){
			this.fetchAllLike(this.props.dataPayloadFromParent.endpoint)
		}
	}

	render() {

		const styles = {
			showSocialsButton:{
				// color: 'inherit', 
				// textDecoration: 'inherit',

				outline:'none',
				background:'none',
				borderWidth:0,
				color:'grey',
				// borderStyle:'solid',
				// borderColor:'white',
				// backgroundColor:'white',
			},

		}

		return (

			<div style={styles.outerContainer}>

				<div>
					<button 
						style={styles.showSocialsButton}
						onClick={ () => {
							if (this.props.likes_quantity){
								this.fetchAllLike( this.props.dataPayloadFromParent.endpoint ) 
							}
							this.setState( prev => ({...prev, show_like_modal: true}) )
						}}
					>
						<ThumbUp style={{color:'grey', fontSize:30, marginRight:20,}}/> {(this.props.likes_quantity) ? this.props.likes_quantity : this.state.likes.length } likes							
					</button>
				</div>

				<Modal				  	
					open={this.state.show_like_modal} // link some variable to it so that it could be turned off
					aria-labelledby="server-modal-title"
					aria-describedby="server-modal-description"
					className={styles.modal}
					// onClose={() => {Alert.alert("Modal has been closed.");}}
				>
					<div style={{
						// height:windowHeight, 
					}}>
		
						<button onClick={() => {
							this.toggle_like_modal()
							// this.setState( prev => ({...prev, likes: [] }) )
						}}
							style={{
								outline:'none',
								background:'none',
								borderWidth:0,
								backgroundColor: 'grey',
								width:'100%',
								fontWeight:'bold',
								height:50,
							}}>
							Close Likes
						</button>

						<Grid container direction="column" style={{backgroundColor: '#eee', paddingTop:20, }}>

							{ this.state.likes.map((item, index) => (

								<Grid item xs={12}>
									<ComponentForShowingLike
										componentData = { item }
									/>
								</Grid>
							))}

						</Grid>

					</div>
				</Modal>

			</div>

		);
	}
}
	
ShowLikesOfSport.defaultProps = {

};

// export default ShowLikesOfSport; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(ShowLikesOfSport))