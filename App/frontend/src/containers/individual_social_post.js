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

import { withRouter } from "react-router-dom";

import {
	ConnectedComponentForShowingSocialPost,
} from "../redux_stuff/connected_components"

import {
	ComponentForShowingLike
} from "../components/likes"

import {
	ComponentForShowingShare
} from "../components/shares"

import {
	ComponentForShowingComment
} from "../components/comments"

import Share from '@material-ui/icons/Share';
import Comment from '@material-ui/icons/Comment';
import ThumbUp from '@material-ui/icons/ThumbUp';


class IndividualSocialPost extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			likes:[],
			comments:[],
			shares:[],
			show_likes: false,
			show_comments: false,
			show_shares: false,
		}	
	}

// COMPONENT DID MOUNT
	componentDidMount() {

// FETCHING DATA FOR COMPONENT
	// if id was set by previous route
		// var { id } = this.props.match.params // use in render method to access param
		// if (typeof id !== 'undefined'){
		// 	id = id.replace(":id=", "")

		// 	console.log('MAKING REQEST')
		// 	axios.get(utils.baseUrl + '/socialposts/get-socialpost', 
		// 		{
		// 		    params: {
		// 				endpoint: id,
		// 		    }
		// 		})
		// 	.then((response) => {

		// 		// console.log('RESPONSE')
		// 		// console.log(response.data)
		// 		this.props.set_current_socialpost(response.data)
		// 		console.log('this.props.current_socialpost')		
		// 		console.log(this.props.current_socialpost)		
		// 		// this.setState( prev => ({...prev, 
		// 		// 	comments: response.data,
		// 		// 	show_comments: ( prev.show_comments === true ) ? false : true,
		// 		// 	show_shares: false,
		// 		// 	show_likes: false,
		// 		// }))
				
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	})
		// }
		
	}

	fetchAllComment(endpoint) {

		axios.get(utils.baseUrl + '/socialposts/get-all-comments-of-socialpost', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {

			// console.log('Called')
			this.setState( prev => ({...prev, 
				comments: response.data,
				show_comments: ( prev.show_comments === true ) ? false : true,
				show_shares: false,
				show_likes: false,
			}))
			
		})
		.catch((error) => {
			console.log(error);
		})
		
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
			this.setState( prev => ({...prev, 
				shares: response.data,
				show_shares: ( prev.show_shares === true ) ? false : true,
				show_comments: false,
				show_likes: false,
			}))
			
		})
		.catch((error) => {
			console.log(error);
		})
	}


	fetchAllLike(endpoint) {

		axios.get(utils.baseUrl + '/socialposts/get-all-likes-of-socialpost', 
			{
			    params: {
					endpoint: endpoint,
					child_count: 3,
			    }
			})
		.then((response) => {
			// console.log(response.data);
			this.setState( prev => ({...prev, 
				likes: response.data, 
				show_likes: ( prev.show_likes === true ) ? false : true,
				show_comments: false,
				show_shares: false,
			}))
			
		})
		.catch((error) => {
			console.log(error);
		})

	}

// RENDER METHOD
	render() {
	  	const {_xs, _sm, _md, _lg, _xl} = this.props

	  	const styles = {
	  		showSocialsContainer:{
	  			display:'flex',
	  			flexDirection:'row',
	  			justifyContent: 'space-between',
	  			width:'95%',
	  			margin:'auto',
	  			marginTop:10,

	  			borderWidth:0,
	  			borderTopWidth:1,
	  			borderStyle:'solid',
	  			borderColor:utils.maroonColor,
	  			paddingTop:10,
	  		},
	  		showSocialsButton:{
	  			outline:'none',
	  			borderStyle:'solid',
	  			borderColor:'white',
	  			backgroundColor:'white',
	  		},


	  	}

		let data = this.props.current_socialpost

		console.log({data})

		let all_likes = (
			<Grid container direction="column" style={{backgroundColor: '#eee', paddingTop:20, width:'70%', margin:'auto'}}>

				{ this.state.likes.map((item, index) => (

					<Grid item xs={12}>
						<ComponentForShowingLike
							componentData = { item }
						/>
					</Grid>
				))}

			</Grid>
		)

		let all_comments = (
			<Grid container direction="column" style={{backgroundColor: '#eee', paddingTop:20, width:'70%', margin:'auto'}}>

				{ this.state.comments.map((item, index) => (

					<Grid item xs={12}>
						<ComponentForShowingComment
							componentData = { item }
						/>
					</Grid>
				))}

			</Grid>
		)

		let all_shares = (
			<Grid container direction="column" style={{backgroundColor: '#eee', paddingTop:20, width:'70%', margin:'auto'}}>

				{ this.state.shares.map((item, index) => (

					<Grid item xs={12}>
						<ComponentForShowingShare
							componentData = { item }
						/>
					</Grid>
				))}

			</Grid>
		)

	  	return (
	  		<React.Fragment>
		  		<div style={{width:'70%', margin:'auto'}}>
		  			<ConnectedComponentForShowingSocialPost
		  				dataPayloadFromParent = { data }
		  				hideActivityHeader = {true}
		  			/>
		  		</div>

				<div style={{...styles.showSocialsContainer, width:'70%', margin:'auto'}}>
					<div>
				  		<button 
							style={styles.showSocialsButton}
							onClick={ () => {
								this.fetchAllLike( data.endpoint )
							}}
						>
							<ThumbUp style={{ fontSize:30, marginRight:10,}}/> {data.total_likes} likes
						</button>
					</div>

					<div>
				  		<button 
							style={styles.showSocialsButton}
							onClick={ () => {
								this.fetchAllComment( data.endpoint )
							}}
						>
							<Comment style={{ fontSize:30, marginRight:10,}}/> {data.total_comments} comments
						</button>
					</div>


					<div>
				  		<button 
							style={styles.showSocialsButton}
							onClick={ () => {
								this.fetchAllShare( data.endpoint )
							}}
						>
							<Share style={{ fontSize:30, marginRight:10,}}/> {data.total_shares} shares
						</button>
					</div>
				</div>


		  		{(this.state.show_likes )?(
	  				 all_likes
	  			):(
	  				null
	  			)}

		  		{(this.state.show_comments )?(
	  				 all_comments
	  			):(
	  				null
	  			)}

		  		{(this.state.show_shares )?(
	  				 all_shares
	  			):(
	  				null
	  			)}

	  		</React.Fragment>
		);
	}
}
	
IndividualSocialPost.defaultProps = {
	//:,
};

export default withRouter(IndividualSocialPost)