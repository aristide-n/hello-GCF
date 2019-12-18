import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import ContactsList from '../routes/contacts';
import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFound from '../routes/404';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.setState({
			currentUrl: e.url,
			topAppBarTitle: e.current.attributes.topAppBarTitle
		});
	};

	render() {
		return (
			<div id="app">
				<Header selectedRoute={this.state.currentUrl} topAppBarTitle={this.state.topAppBarTitle} />
				<Router onChange={this.handleRoute}>
					<Home path="/" topAppBarTitle="when available" />
					<Profile path="/profile/" user="me"  topAppBarTitle="Profile" />
					<Profile path="/profile/:user" topAppBarTitle="Foo" />
					<ContactsList path="/contacts" topAppBarTitle="Contacts" />
					<NotFound default topAppBarTitle="when available" />
					{/*	add more routes here? i.e contacts and "my schedule"*/}
				</Router>
			</div>
		);
	}
}
