import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import {
	ComponentForShowingShare
} from "."

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

import {
	Grid, 
	Modal, 
	// TextField,
	// Button 
} from "@material-ui/core";

import Share from '@material-ui/icons/Share';


class ShowSharesOfSocialPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			show_share_modal: false,

			shares:[],
		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	fetchAllShare(endpoint) {

		axios.get(utils.baseUrl + '/socialposts/get-all-shares-of-socialpost', 
			{
			    params: {
					endpoint: endpoint,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, shares: ( prev.shares.length === 0 ) ? response.data : [] }) )
			
		})
		.catch((error) => {
			console.log(error);
		})

		this.setState( prev => ({...prev, show_share_modal: true}) )		
	}

	toggle_share_modal(){
		this.setState(
			prev => (
				{
					...prev,
					show_share_modal: (prev.show_share_modal === false) ? true : false 
				}
			)
		)
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
							this.fetchAllShare( this.props.dataPayloadFromParent.endpoint )
						}}
					>
						<Share style={{ fontSize:30, marginRight:10,}}/> {this.props.shares_quantity} shares
					</button>
				</div>

				<Modal				  	
					open={this.state.show_share_modal} // link some variable to it so that it could be turned off
					aria-labelledby="server-modal-title"
					aria-describedby="server-modal-description"
					className={styles.modal}
					// onClose={() => {Alert.alert("Modal has been closed.");}}
				>
					<div style={{
						// height:windowHeight, 
					}}>
		
						<button onClick={() => {
							this.toggle_share_modal()
							this.setState( prev => ({...prev, shares: [] }) )
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
							Close shares
						</button>

						<Grid container direction="column" style={{backgroundColor: '#eee', paddingTop:20}}>


							{ this.state.shares.map((item, index) => (

								<Grid item xs={12}>
									<ComponentForShowingShare
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
	
ShowSharesOfSocialPost.defaultProps = {

};

// export default ShowSharesOfSocialPost; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ShowSharesOfSocialPost)