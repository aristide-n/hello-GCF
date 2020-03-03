import { Component } from 'preact';
import { route, Router } from 'preact-router';
import { observer } from 'preact-mobx';

import Header from './header';
import ContactsList from '../routes/contacts';
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFound from '../routes/404';
import initState from '../state/initState';
import firebase from '../state/firebase';

@observer
export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		// todo: an - looks like this isn't necessary, eventually remove it?
		if (!firebase.auth().currentUser) {
			this.setState({
				topAppBarTitle: 'when available'
			});
			route('/');
		}

		this.setState({
			currentUrl: e.url,
			topAppBarTitle: e.current.attributes.topAppBarTitle
		});
	};

	componentDidMount() {
		var that = this;
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log('current user: ', user.displayName, user.email, user.emailVerified, user.photoURL,
					user.isAnonymous, user.uid, user.providerData);
				initState(that.props.contactStore);
				route('/contacts');
			} else {
				console.log('signed out');
				if (!that.props.contactStore.outgoingInvitations.empty)
					that.props.contactStore.outgoingInvitations = [];
				if (!that.props.contactStore.incomingInvitations.empty)
					that.props.contactStore.incomingInvitations = [];
				that.setState({
					topAppBarTitle: 'when available'
				});
				route('/');
			}
		});
	}

	render({ contactStore }) {
		return (
			<div id="app">
				<Header selectedRoute={this.state.currentUrl} topAppBarTitle={this.state.topAppBarTitle} />
				<Router onChange={this.handleRoute}>
					<Home path="/" topAppBarTitle="when available" />
					<Profile path="/profile/" user="me"  topAppBarTitle="Profile" />
					<Profile path="/profile/:user" topAppBarTitle="Foo" />
					<ContactsList path="/contacts" topAppBarTitle="Contacts" contactStore={contactStore}/>
					<NotFound default topAppBarTitle="when available" />
					{/* todo - add more routes here? i.e contacts and "my schedule"*/}
				</Router>
			</div>
		);
	}
}
