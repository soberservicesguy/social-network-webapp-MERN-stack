
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
	ConnectedResponsiveNavigation,
} from "../redux_stuff/connected_components";

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

					{/*<ConnectedResponsiveNavigation/>*/}

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
									<ConnectedResponsiveNavigation/>
									<ConnectedSettingsContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/socialposts" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedSocialPostContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/socialposts/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedIndividualSocialPost/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/about-me" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedAboutMeContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/friends" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedCompleteFriendsContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/friends/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedIndividualFriend/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>


						<Route exact path="/timeline" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedTimelineContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/advertisements" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedAdvertisementContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/ads/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedIndividualAdvertisement/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/pages" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedPageContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/pages/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedIndividualPage/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/books" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedBookContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/books/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedIndividualBook/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/sports" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedSportContainer/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/sports/:id" render={() => (

							(this.props.isSignedIn) ? (
								<React.Fragment>
									<ConnectedResponsiveNavigation/>
									<ConnectedIndividualSport/>
								</React.Fragment>
							) : (
								<Redirect to="/login"/>
							)
						)}/>

						<Route exact path="/" render={() => (
							(this.props.isSignedIn) ? (
								<Redirect to="/socialposts"/>
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