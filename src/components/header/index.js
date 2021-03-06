import { Component } from 'preact';
import { route } from 'preact-router';
import { observer } from 'preact-mobx';
import TopAppBar from 'preact-material-components/TopAppBar';
import Drawer from 'preact-material-components/Drawer';
// import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import Typography from 'preact-material-components/Typography';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/TopAppBar/style.css';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Typography/style.css';
import style from './style.css';
import firebase, { firestore } from '../../state/firebase';

@observer
export default class Header extends Component {
	closeDrawer() {
		this.drawer.MDComponent.open = false;
		this.setState({
			darkThemeEnabled: false
		});
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	openSettings = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);

	linkTo = (path, topAppBarTitle) => () => {
		route(path);
		this.setState({ topAppBarTitle });
		this.closeDrawer();
	};

	goToContactsList = this.linkTo('/contacts', 'Contacts');
	goToMyProfile = this.linkTo('/profile', 'Profile');

	toggleDarkTheme = () => {
		this.setState(
			{
				darkThemeEnabled: !this.state.darkThemeEnabled
			},
			() => {
				if (this.state.darkThemeEnabled) {
					document.body.classList.add('mdc-theme--dark');
				}
				else {
					document.body.classList.remove('mdc-theme--dark');
				}
			}
		);
	};

	signOut(contactStore) {
		contactStore.snapshotFuncs.forEach(unsubscribeFunc => unsubscribeFunc());
		firebase.auth().signOut()
			.catch(err => console.error('Error in sign out: ', err));
		contactStore.resetState();
	}

	toggleAvailability(contactStore) {
		const newAvailabilityVal = !contactStore.currentUserIsAvailable;
		firestore.collection('users').doc(firebase.auth().currentUser.uid)
			.update({isAvailable: newAvailabilityVal})
			.catch(err => console.error('error toggling availability:', err));
		firestore.collectionGroup('contacts').where('email', '==', firebase.auth().currentUser.email).get()
			.then(snapshot =>
				snapshot.docs.forEach(docSnapshot =>
					docSnapshot.ref.update({isAvailable: newAvailabilityVal}).catch(err =>
						console.error('error updating contact availability')
					)
				)
			);
	}

	render(props) {
		console.log('selectedRoute: ', props.selectedRoute);
		let logoutButton;
		let availabilitySwitch;

		if (firebase.auth().currentUser) {
			logoutButton = (
				<TopAppBar.Section align-end shrink-to-fit onClick={this.signOut.bind(this, props.contactStore)}>
					<TopAppBar.Icon>exit_to_app</TopAppBar.Icon>
				</TopAppBar.Section>
			);

			if (props.contactStore.currentUserIsAvailable) {
				availabilitySwitch = (
					<TopAppBar.Section>
						<Switch checked class={`${style.switchAvailability}`}
								onChange={this.toggleAvailability.bind(this, props.contactStore)} />
						<Typography body1>
							You are currently Available
						</Typography>
					</TopAppBar.Section>
				);
			} else if (props.contactStore.currentUserIsAvailable === false) {
				availabilitySwitch = (
					<TopAppBar.Section>
						<Switch class={`${style.switchAvailability}`}
								onChange={this.toggleAvailability.bind(this, props.contactStore)} />
						<Typography body1>
							You are currently Unavailable
						</Typography>
					</TopAppBar.Section>
				);
			}
		}

		return (
			<div>
				<TopAppBar className="topappbar">
					<TopAppBar.Row>
						<TopAppBar.Section align-start>
							<TopAppBar.Icon menu onClick={this.openDrawer}>
								menu
							</TopAppBar.Icon>
							<TopAppBar.Title>
								{props.topAppBarTitle || this.state.topAppBarTitle}
							</TopAppBar.Title>
						</TopAppBar.Section>

						{availabilitySwitch}

						{logoutButton}

						{/* TODO: an - restore settings? */}
						{/*<TopAppBar.Section align-end shrink-to-fit onClick={this.openSettings}>*/}
						{/*	<TopAppBar.Icon>settings</TopAppBar.Icon>*/}
						{/*</TopAppBar.Section>*/}
					</TopAppBar.Row>
				</TopAppBar>
				<Drawer disabled ref={this.drawerRef}>
					{/*<Drawer.DrawerContent>*/}
					{/*	/!* dummy DrawerItem coz github.com/material-components/material-components-web/issues/762*!/*/}
					{/*	<Drawer.DrawerItem selected={props.selectedRoute === '/'} />*/}
					{/*	<Drawer.DrawerItem selected={props.selectedRoute === '/contacts'}*/}
					{/*		onClick={this.goToContactsList}*/}
					{/*	>*/}
					{/*		<List.ItemGraphic>account_circle</List.ItemGraphic>*/}
					{/*		Contacts*/}
					{/*	</Drawer.DrawerItem>*/}
					{/*	<Drawer.DrawerItem selected={props.selectedRoute === '/profile'} onClick={this.goToMyProfile}>*/}
					{/*		<List.ItemGraphic>account_circle</List.ItemGraphic>*/}
					{/*		Profile*/}
					{/*	</Drawer.DrawerItem>*/}
					{/*</Drawer.DrawerContent>*/}
				</Drawer>
				<Dialog ref={this.dialogRef}>
					<Dialog.Header>Settings</Dialog.Header>
					<Dialog.Body>
						<div>
							Enable dark theme <Switch onClick={this.toggleDarkTheme} />
						</div>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept>OK</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			</div>
		);
	}
}
