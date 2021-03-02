
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
} from "react-router-dom";

// IMPORT CONNECTED CONTAINERS
import {
	ConnectedLoginContainer,
	ConnectedSignUpContainer,
	ConnectedSocialPostContainer,
	ConnectedIndividualSocialPost,
	ConnectedAdvertisementContainer,
	ConnectedIndividualAdvertisement,
	ConnectedPageContainer,
	ConnectedIndividualPage,
	ConnectedBookContainer,
	ConnectedIndividualBook,
	ConnectedSportContainer,
	ConnectedIndividualSport,
	ConnectedAboutMeContainer,
	ConnectedCompleteFriendsContainer,
	ConnectedTimelineContainer,
} from "../redux_stuff/connected_components";

import {
	MyResponsiveNavigation,
} from "./"

// IMPORT material-ui stuff
// import { withStyles } from '@material-ui/styles';
import { Grid, Button } from "@material-ui/core";
// IMPORT responsiveness hook
import withResponsiveness from "../responsiveness_hook";




class RootRouterContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			anchorEl:null,
			mobileMoreAnchorEl:null,
		}

	}

	render() {

		const styles = {

		}

		return (
			<Router>
				<div>
					<MyResponsiveNavigation/>

					<Switch>

						<Route exact path="/signup">
							<ConnectedSignUpContainer/>
						</Route>


						<Route exact path="/login">
							<ConnectedLoginContainer/>
						</Route>



						<Route exact path="/socialposts">
							<ConnectedSocialPostContainer/>
						</Route>



						<Route path="/socialposts/:endpoint-param">
							<ConnectedIndividualSocialPost/>
						</Route>



						<Route exact path="/about-me">
							<ConnectedAboutMeContainer/>
						</Route>

						<Route exact path="/friends">
							<ConnectedCompleteFriendsContainer/>
						</Route>

						<Route exact path="/timeline">
							<ConnectedTimelineContainer/>
						</Route>



						<Route exact path="/advertisements">
							<ConnectedAdvertisementContainer/>
						</Route>



						<Route path="/advertisements/:endpoint-param">
							<ConnectedIndividualAdvertisement/>
						</Route>



						<Route exact path="/pages">
							<ConnectedPageContainer/>
						</Route>



						<Route path="/pages/:endpoint-param">
							<ConnectedIndividualPage/>
						</Route>



						<Route exact path="/books">
							<ConnectedBookContainer/>
						</Route>



						<Route path="/books/:endpoint-param">
							<ConnectedIndividualBook/>
						</Route>



						<Route exact path="/sports">
							<ConnectedSportContainer/>
						</Route>



						<Route path="/sports/:endpoint-param">
							<ConnectedIndividualSport/>
						</Route>


						{/*<Route path="/home">
							<HomeContainer/>
						</Route>*/}
					</Switch>
				</div>
			</Router>
		);
	}
}


export default withResponsiveness(RootRouterContainer);
// export default RootRouterContainer;
