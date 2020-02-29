import { Component } from 'preact';
import { observer } from 'preact-mobx';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Dialog/style.css';
import style from './style.css';
import firebase, { firestore } from '../../state/firebase';

@observer
export default class ContactsList extends Component {

	inviteContact(e) {
		e.preventDefault();
		const emailField = document.querySelector('#email-field');

		// query firestore to see if user with email exists -> ref1
		//   if not, lookup email in non-user-invitations col -> ref2
		// add other-ref to outgoing invitations sub-col of current user
		// add this-ref to incoming  invitations sub-col of ref1 or ref2

		emailField.value = null;
	}

	addContact(e) {
		e.preventDefault();
		const nameField = document.querySelector('#name-field');

		firestore.collection('users/' + firebase.auth().currentUser.uid + '/contacts').doc()
			.set({ name: nameField.value })
			.catch(err => console.error('Error adding contact: ', err));

		nameField.value = null;
	}

	render({ contactStore }) {
		return (
			<div class={`${style.contactsList} page`}>
				<List avatar-list>
					{contactStore.contacts && contactStore.contacts.map(contact => (
						<List.Item>
							<List.ItemGraphic>perm_identity</List.ItemGraphic>
							<List.TextContainer>{contact.name}</List.TextContainer>
						</List.Item>
					))}
					<List.Item onClick={()=>{this.oldDialog.MDComponent.show();}}>
						<List.ItemGraphic>add_circle_outline</List.ItemGraphic>
						<List.TextContainer>Add a Contact</List.TextContainer>
					</List.Item>
					<List.Item onClick={()=>{this.newDialog.MDComponent.show();}}>
						<List.ItemGraphic>add_circle_outline</List.ItemGraphic>
						<List.TextContainer>Invite a Contact</List.TextContainer>
					</List.Item>
				</List>

				<Dialog ref={el => { this.oldDialog = el; }} onAccept={this.addContact.bind(this)}>
					<Dialog.Header>Add a Contact</Dialog.Header>
					<Dialog.Body>
						<TextField label="Name" outlined id="name-field"/>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept={true}>Save</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>

				<Dialog ref={el => { this.newDialog = el; }} onAccept={this.inviteContact.bind(this)}>
					<Dialog.Header>Invite a Contact</Dialog.Header>
					<Dialog.Body>
						<TextField label="Email" outlined id="email-field"/>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept={true}>Save</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			</div>
		);
	}
}
