
import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";

const styles = theme => ({
	outerContainer:{
		
	}
});

class ComponentForShowingShare extends Component {
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

		const styles = {
			outerContainer:{
				width:'70%',
				margin:'auto',
				display:'flex',
				flexDirection:'row',
				alignItems:'center',
				backgroundColor: '#eee',
				borderBottomWidth:1,
				borderBottomColor:'black',
				borderBottomStyle:'solid',
				paddingBottom:20,
				marginBottom:20,
			},

			usernameText:{
				fontSize:20,
				fontWeight:'bold',
			},

			imageContainer:{
				flex:1
			},
			usernameContainer:{
				flex:5
			},
		}


		const data = this.props.componentData // data being plugged from parent flatlist		
		var base64Image = "data:image/jpeg;base64," + data.user_avatar_image

		return (

			<div style={styles.outerContainer}>
				<div style={styles.imageContainer}>
					<img src={base64Image} alt="" 
						style={{
							width:100, 
							height:100, 
							resizeMode: "contain",
							borderRadius: 100/2,
						}}
					/>
				</div>
			
			
				<div style={styles.usernameContainer}>
					<p style={styles.usernameText}>
						{data.user_name}
					</p>					
				</div>
			
			</div>
		)
	}
}
	
ComponentForShowingShare.defaultProps = {

};

// export default ComponentForShowingShare; // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(withStyles(styles)(ComponentForShowingShare))
