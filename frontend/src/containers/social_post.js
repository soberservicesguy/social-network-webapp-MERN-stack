
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
	ConnectedSocialPostCard,
	ConnectedCreateSocialPost,
} from '../redux_stuff/connected_components';


const styles = theme => ({
  root: {
    height: 48,
//    color: props => (props.cool) ? 'red' : 'black',
    [theme.breakpoints.up('sm')]:{
    	paddingLeft:100
    },
  },
});

class SocialPostContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
		axios.get(utils.baseUrl + '/socialposts/socialposts-list-with-children',)
		.then((response) => {
			this.props.set_fetched_socialposts(response.data)
		})
		.catch((error) => {
			console.log(error);
		})


	}
	get_10_more_items() {
		axios.get(utils.baseUrl + `/socialposts/socialposts-list-next-10-with-children`)
		.then((response) => {
			this.props.set_fetched_10_more_socialpost(response.data)
		})
		.catch((error) => {
			console.log(error);
		})		
	}

// RENDER METHOD
	render() {
			
		const total_socialposts = this.props.total_socialposts

		const { classes } = this.props;
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		return (

			<Grid container direction="row" style={{backgroundColor: '#eee'}} >
				
				<Grid container xs={12} sm={12} md={3} lg={3} xl={3}>
					<div style={{backgroundColor: '#000000', width:'100%', marginLeft:30, marginRight:30,}}>
						
					</div>
				</Grid>


				<Grid container direction="column" xs={12} sm={12} md={6} lg={6} xl={6}>

					<Grid item>
						<div>
				  			<ConnectedCreateSocialPost/>
						</div>
			  		</Grid>

					{total_socialposts.map((item, index)=>(

						<Grid item>
							<ConnectedSocialPostCard
								dataPayloadFromParent = { item }

								comments_quantity = { item.comments_quantity }
								comments = { item.comments || [] }

								likes_quantity = { item.likes_quantity }
								likes = { item.likes || [] }

								shares_quantity = { item.shares_quantity }
								shares = { item.shares || [] }

								// user_quantity = { item.user_quantity }
								// user = { item.user || [] }
							
							/>
						</Grid>

					))}
					
				</Grid>


				<Grid container xs={12} sm={12} md={3} lg={3} xl={3}>
					<div style={{backgroundColor: '#000000', width:'100%', marginLeft:30, marginRight:30,}}>
						
					</div>					
				</Grid>


			</Grid>

		);
	}
}

SocialPostContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(withStyles(styles)(SocialPostContainer));

