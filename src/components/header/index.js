import { Component } from 'preact';
import { route } from 'preact-router';
import TopAppBar from 'preact-material-components/TopAppBar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/TopAppBar/style.css';
import firebase from '../../state/firebase';

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

	signOut() {
		firebase.auth().signOut()
			.catch(err => console.error('Error in sign out: ', err));
	}

	render(props) {
		console.log(props.selectedRoute);
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

						{/* TODO: an - hide this when not logged in */}
						<TopAppBar.Section align-end shrink-to-fit onClick={this.signOut}>
							<TopAppBar.Icon>exit_to_app</TopAppBar.Icon>
						</TopAppBar.Section>

						{/* TODO: an - restore settings? */}
						{/*<TopAppBar.Section align-end shrink-to-fit onClick={this.openSettings}>*/}
						{/*	<TopAppBar.Icon>settings</TopAppBar.Icon>*/}
						{/*</TopAppBar.Section>*/}
					</TopAppBar.Row>
				</TopAppBar>
				<Drawer modal ref={this.drawerRef}>
					<Drawer.DrawerContent>
						{/* dummy DrawerItem coz github.com/material-components/material-components-web/issues/762*/}
						<Drawer.DrawerItem selected={props.selectedRoute === '/'} />
						<Drawer.DrawerItem selected={props.selectedRoute === '/contacts'}
							onClick={this.goToContactsList}
						>
							<List.ItemGraphic>account_circle</List.ItemGraphic>
							Contacts
						</Drawer.DrawerItem>
						<Drawer.DrawerItem selected={props.selectedRoute === '/profile'} onClick={this.goToMyProfile}>
							<List.ItemGraphic>account_circle</List.ItemGraphic>
							Profile
						</Drawer.DrawerItem>
					</Drawer.DrawerContent>
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
