
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
	ConnectedComponentForShowingNotification,
} from '../redux_stuff/connected_components';


class NotificationsContainer extends Component {
	constructor(props) {
		super(props);
// STATE	
		this.state = {
			backend_requests_made: 1,

			show_notifications_modal: false,

			no_more_notifications_from_backend:false,

		}	
	}

// COMPONENT DID MOUNT


	getNotifications(){

		if (!this.state.no_more_notifications_from_backend){

			let backend_requests_made = this.state.backend_requests_made
			let append_fetched_notifications_callback = (response) => this.props.append_fetched_notifications(response.data)
			let addEventListenerCallback = () => window.addEventListener("scroll", this.onScroll, false);
			let setNoMoreNotificationsCallback = () => this.setState(prev => ({...prev, no_more_notifications_from_backend: true }))
			let set_state_for_requests_made = () => {
				this.setState(prev => ({...prev, 
					backend_requests_made: prev.backend_requests_made + 1,
				}));
			}

			axios.get(utils.baseUrl + '/socialposts/get-notifications-from-friends',
			{
			    params: {
					request_number: backend_requests_made,
			    }
			})
			.then((response) => {

				if(response.data.length === 0){

					console.log('no more notifications to show')
					append_fetched_notifications_callback({data:[{message:'no more notifications'}]})
					setNoMoreNotificationsCallback()

				} else {

					console.log('Notifications recieved')
					console.log(response.data.length)
					append_fetched_notifications_callback(response)
					set_state_for_requests_made()

				}
				
			})
			.catch((error) => {
				console.log(error);
			})

		}

	}

	componentDidMount() {
		this.props.set_fetched_notifications([])
		this.setState(prev => ({...prev, no_more_notifications_from_backend: false }))
		this.getNotifications()
	}

	toggle_notification_modal(){
		this.setState(
			prev => (
				{
					...prev,
					show_notifications_modal: (prev.show_notifications_modal === false) ? true : false 
				}
			)
		)
	}



// RENDER METHOD
	render() {
			
		const total_notifications = this.props.notifications_list
		// const total_notifications = [1,2,3,4,5,6,7,8,9,10]

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

	  	const {_xs, _sm, _md, _lg, _xl} = this.props


		return (

			<Grid container direction="column">

				<div style={{backgroundColor: 'white', paddingLeft:20, paddingRight:20, margin:'auto'}}>

					<button onClick={() => this.toggle_notification_modal()}
						style={{
							outline:'none',
							background:'none',
							borderWidth:0,
						}}
					>
						<div style={{
							// width:'8%', 
							// margin:'auto',
							textAlign:'center'

						}}>
							<img src={utils.image} alt="" 
								style={{
									width:70, 
									height:70, 
									resizeMode: "stretch",
									borderRadius: 70/2,
									marginBottom:20,
								}}
							/>
						</div>
					</button>


					<div style={{
						position:'absolute',
						backgroundColor: 'white',
						width:(_xs || _sm ) ? '30%' : '15%',
						opacity: (this.state.show_notifications_modal) ? 1 : 0,
						borderWidth:1,
						borderColor:'#eee',
						borderStyle:'solid',
					}}>

						{/*<div>
							<p style={{fontWeight:'bold', fontSize:20, marginTop:20}}>
								Recent Notifications
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
						</div>*/}

						{total_notifications.map((item, index)=>{

							return (
								<Grid item>
									<ConnectedComponentForShowingNotification
										dataPayloadFromParent = { item }
									/>
								</Grid>
							)

						})}

						<button onClick={() => this.getNotifications()}
							style={{
								opacity:(this.state.no_more_notifications_from_backend) ? 0 : 1,
								outline:'none',
								background:'none',
								borderWidth:0,
								textAlign:'center',
								width:'100%',
								color:utils.maroonColor,
								paddingBottom:30,
								fontWeight:'bold'
							}}
						>
							Show more
						</button>

					</div>


				</div>

			</Grid>

		);
	}
}

NotificationsContainer.defaultProps = {
	// : ,
};

export default withResponsiveness(NotificationsContainer);