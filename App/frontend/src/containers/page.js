
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
	ConnectedPageCard,
	ConnectedCreatePage,
} from '../redux_stuff/connected_components';


class PageContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
		axios.get(utils.baseUrl + '/pages/pages-list-with-children',)
		.then((response) => {
			this.props.set_fetched_pages(response.data)
		})
		.catch((error) => {
			console.log(error);
		})


	}

	get_10_more_items() {
		axios.get(utils.baseUrl + `/pages/pages-list-next-10-with-children`)
		.then((response) => {
			this.props.set_fetched_10_more_page(response.data)
		})
		.catch((error) => {
			console.log(error);
		})		
	}

// RENDER METHOD
	render() {
			
		const total_pages = this.props.total_pages

		const { classes } = this.props;
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

		return (

			<Grid container direction="column">

				<div style={{backgroundColor: 'white', paddingLeft:20, paddingRight:20,}}>

					<div>
						<p style={{fontWeight:'bold', fontSize:20, marginTop:20}}>
							Pages You May Like
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


					{total_pages.map((item, index) => {
						return (
							<Grid key={String(index)} item>
								<ConnectedPageCard
									dataPayloadFromParent = { item }
									likes = { item.likes || [] }
								/>
							</Grid>
						)
					})}

					<Grid item>
			  			<ConnectedCreatePage/>
			  		</Grid>
					
				</div>
				

			</Grid>

		);
	}
}

PageContainer.defaultProps = {
	// : ,

};

export default withResponsiveness(PageContainer);

