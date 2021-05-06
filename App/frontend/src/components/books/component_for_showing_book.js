import { 
	// withRouter,
	Link,
} from "react-router-dom";

import React, { Component } from 'react';
import PropTypes from 'prop-types';
					
import axios from 'axios';
import firebase from 'firebase';

import utils from "../../utilities";

import { withStyles } from '@material-ui/styles';
import withResponsiveness from "../../responsiveness_hook";


class ComponentForShowingBook extends Component {
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
			},
			imageContainer:{
				textAlign:'center',
			},
			imageStyle:{
				width:'100%', 
				height:300, 
				resizeMode: "stretch"
			}
		}

		const data = this.props.dataPayloadFromParent // data being plugged from parent flatlist

		var base64Image = "data:image/jpeg;base64," + data.book_image


		return (
			<div style={styles.outerContainer}>

		  		<Link 
		  			to={{pathname:`/books/:id=${data.endpoint}`}} 
		  			style={{color: 'inherit', textDecoration: 'inherit'}}
					onClick={() => this.props.set_current_book(data)}
				>
					<div style={styles.imageContainer}>
						<img 
							alt="" 
							src={base64Image}
							// src={utils.image} 
							style={styles.imageStyle}
						/>
					</div>
				</Link>

				<p style={{textAlign:'center', fontWeight:'bold', marginTop:10,}}>
					{ data.book_name }
				</p>
			</div>
		);
	}
}
	
ComponentForShowingBook.defaultProps = {

};

// export default ComponentForShowingBook;  // REMOVE withResponsiveness and withStyles as much as possible
export default withResponsiveness(ComponentForShowingBook)