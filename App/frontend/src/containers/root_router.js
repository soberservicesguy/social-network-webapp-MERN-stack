
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
	ConnectedSettingsContainer,
	ConnectedIndividualFriend,
} from "../redux_stuff/connected_components";

import {
	MyResponsiveNavigation,
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

					{/*<MyResponsiveNavigation/>*/}

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
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedSettingsContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/socialposts" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedSocialPostContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/socialposts/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedIndividualSocialPost/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/about-me" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedAboutMeContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/friends" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedCompleteFriendsContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/friends/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedIndividualFriend/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>


						<Route exact path="/timeline" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedTimelineContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/advertisements" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedAdvertisementContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/advertisements/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedIndividualAdvertisement/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/pages" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedPageContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/pages/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedIndividualPage/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/books" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedBookContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/books/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedIndividualBook/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/sports" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedSportContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/sports/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<MyResponsiveNavigation/>
									<ConnectedIndividualSport/>
								</React.Fragment>
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