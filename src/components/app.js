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
				topAppBarTitle: 'Availably'
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
				that.props.contactStore.currentUserIsAvailable = null;
				if (that.props.contactStore.incomingInvitations.size > 0)
					that.props.contactStore.incomingInvitations = new Map();
				if (that.props.contactStore.contacts.size > 0)
					that.props.contactStore.contacts = new Map();
				if (that.props.contactStore.outgoingInvitations.size > 0)
					that.props.contactStore.outgoingInvitations = new Map();
				that.setState({
					topAppBarTitle: 'Availably'
				});
				route('/');
			}
		});
	}

	render({ contactStore }) {
		return (
			<div id="app">
				<Header selectedRoute={this.state.currentUrl} topAppBarTitle={this.state.topAppBarTitle}
						contactStore={contactStore}/>
				<Router onChange={this.handleRoute}>
					<Home path="/" topAppBarTitle="Availably" />
					<Profile path="/profile/" user="me"  topAppBarTitle="Profile" />
					<Profile path="/profile/:user" topAppBarTitle="Foo" />
					<ContactsList path="/contacts" topAppBarTitle="Contacts" contactStore={contactStore}/>
					<NotFound default topAppBarTitle="Availably" />
					{/* todo - add more routes here? i.e contacts and "my schedule"*/}
				</Router>
			</div>
		);
	}
}
