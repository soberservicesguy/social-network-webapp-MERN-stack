
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
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
	SettingsContainer,
} from "./"

// IMPORT material-ui stuff
// import { withStyles } from '@material-ui/styles';
import { Grid, Button } from "@material-ui/core";
// IMPORT responsiveness hook
// import withResponsiveness from "../responsiveness_hook";




class RootRouterContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {
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

						<Route exact path="/" render={() => (
							(this.props.isSignedIn) ? (
								<Redirect to="/socialposts"/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/settings" render={() => (
							(this.props.isSignedIn) ? (
								<SettingsContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/socialposts" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedSocialPostContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/socialposts/:endpoint-param" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedIndividualSocialPost/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/about-me" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedAboutMeContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/friends" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedCompleteFriendsContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/timeline" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedTimelineContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/advertisements" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedAdvertisementContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/advertisements/:endpoint-param" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedIndividualAdvertisement/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/pages" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedPageContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/pages/:endpoint-param" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedIndividualPage/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/books" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedBookContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/books/:endpoint-param" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedIndividualBook/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/sports" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedSportContainer/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/sports/:endpoint-param" render={() => (
							(this.props.isSignedIn) ? (
								<ConnectedIndividualSport/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/*" render={() => (
							(this.props.isSignedIn) ? (
								<Redirect to="/socialposts"/>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

					</Switch>
				</div>
			</Router>
		);
	}
}

// export default withResponsiveness(RootRouterContainer);
export default RootRouterContainer;