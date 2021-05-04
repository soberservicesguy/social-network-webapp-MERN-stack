
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
	ConnectedAdvertisementCard,
	ConnectedCreateAdvertisement,
} from '../redux_stuff/connected_components';


class AdvertisementContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
		console.log('FETCHING ADS')
		axios.get(utils.baseUrl + '/ads/ads-list',)
		.then((response) => {
			console.log('response.data in ads')
			console.log(response.data)
			this.props.set_fetched_advertisements(response.data)
		})
		.catch((error) => {
			console.log(error);
		})


	}
	get_10_more_items() {
		axios.get(utils.baseUrl + `/ad/advertisements-list-next-10-with-children`)
		.then((response) => {
			this.props.set_fetched_10_more_advertisement(response.data)
		})
		.catch((error) => {
			console.log(error);
		})		
	}

// RENDER METHOD
	render() {
			
		const total_advertisements = this.props.total_advertisements
		console.log('total_advertisements')
		console.log(total_advertisements)

		const { classes } = this.props;
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		return (

			<Grid container direction="column">

				<div style={{backgroundColor: 'white', paddingLeft:20, paddingRight:20, marginTop:30,}}>

					<div>
						<p style={{fontWeight:'bold', fontSize:20, marginTop:20}}>
							Advertisement
						</p>
						<div style={{
							width:'20%',
							height:1,
							borderWidth:0,
							borderBottomWidth: 1,
							borderStyle:'solid',
							borderBottomColor:utils.maroonColor,
							marginBottom:20,
						}}>
							<p></p>
						</div>
					</div>
					

					{total_advertisements.map((item, index)=>(

						<Grid key={String(index)} item>
							<ConnectedAdvertisementCard
								dataPayloadFromParent = { item }				
							/>
						</Grid>

					))}

					<Grid item>
			  			<ConnectedCreateAdvertisement/>
			  		</Grid>
					
				</div>

			</Grid>

		);
	}
}

AdvertisementContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(AdvertisementContainer);

