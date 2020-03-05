import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';
import Dialog from 'preact-material-components/Dialog';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/LayoutGrid/style.css';
import style from './style.css';
import firebase, { firestore } from '../../state/firebase';

export default class Home extends Component {

	signUp() {
		const emailField = document.querySelector('#su-email-field');
		const pwField = document.querySelector('#su-password-field');

		//todo: an - validate email address? same for login

		console.log('sign up: email -', emailField.value, ', pw -', pwField.value);
		firebase.auth().createUserWithEmailAndPassword(emailField.value, pwField.value)
			.then(userCred => {
				const nameField = document.querySelector('#su-name-field');
				const phoneNumField = document.querySelector('#su-phonenum-field');

				console.log('name - ', nameField.value);
				userCred.user.updateProfile({ displayName: nameField.value })
					.catch(err => console.error('Error in updateProfile:', err));
				firestore.collection('users').doc(userCred.user.uid).set({
					uid: userCred.user.uid,
					name: nameField.value,
					phoneNumber: phoneNumField.value,
					email: userCred.user.email,
					isAvailable: false
				}).catch(err => console.error('Error adding user: ', err));

				nameField.value = null;
			})
			.catch(err => console.error('Error in sign up:', err.message, '|', err.code));

		emailField.value = null;
		pwField.value = null;
	}

	logIn () {
		const emailField = document.querySelector('#li-email-field');
		const pwField = document.querySelector('#li-password-field');

		console.log('log in: email -', emailField.value, ', pw -' + pwField.value);
		firebase.auth().signInWithEmailAndPassword(emailField.value, pwField.value)
			.catch(err => console.error('Error in log in:', err.message, '|', err.code));

		emailField.value = null;
		pwField.value = null;
	}

	openSignUpDialog = () => this.signUpDialog.MDComponent.show();
	openLogInDialog = () => this.logInDialog.MDComponent.show();

	render() {
		return (
			<div class={`${style.home} page`}>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="4" />
						<LayoutGrid.Cell cols="4">
							<Card>
								<div class={style.cardBody}>
									<h3>
										Availably helps you share your schedule with your contacts and see theirs
									</h3>
								</div>
								<div class={`${style.buttons}`}>
									<Button raised primary onClick={this.openSignUpDialog}>Sign Up</Button>
									<Button onClick={this.openLogInDialog}>Log In</Button>
								</div>
							</Card>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4" />
					</LayoutGrid.Inner>
				</LayoutGrid>

				<Dialog ref={el => { this.signUpDialog = el; }} onAccept={this.signUp}>
					<Dialog.Body>
						<TextField label="Name" fullwidth id="su-name-field" />
						<TextField label="Phone number" fullwidth id="su-phonenum-field" />
						<TextField label="Email" fullwidth id="su-email-field" />
						<TextField  label="Password" fullwidth type="password" id="su-password-field" />
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept primary>Sign Up</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>

				<Dialog ref={el => { this.logInDialog = el; }} onAccept={this.logIn}>
					<Dialog.Body>
						<TextField label="Email" fullwidth id="li-email-field" />
						<TextField label="Password" fullwidth type="password" id="li-password-field" />
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept primary>Log In</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			</div>
		);
	}
}
