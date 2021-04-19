
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
	// Modal, 
	// TextField,
	// Button 
} from "@material-ui/core";

import ThumbUp from '@material-ui/icons/ThumbUp';

const styles = theme => ({
	outerContainer: {
	},
});

class SummarizeLikesOfSport extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
		}

	}

// COMPONENT DID MOUNT
	componentDidMount() {

	}

	render() {

		return (

			<div style={styles.outerContainer}>

				{( this.props.showOnlyQuantity ) ? (

					<p style={{color: 'grey'}}>
						<ThumbUp style={{color:'grey', fontSize:30, marginRight:20,}}/> {this.props.child_quantity} likes
					</p>

				) : (

					<Grid container direction="row" spacing={4} style={{backgroundColor: '#eee'}}>

						{ this.props.dataPayloadFromParent.map((item, index) => (

							<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
								<ComponentForShowingLike
									componentData = { item }
								/>
							</Grid>
						))}

					</Grid>
				)}
			</div>
		);
	}
}
	
SummarizeLikesOfSport.defaultProps = {

};

// export default SummarizeLikesOfSport; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(SummarizeLikesOfSport))
