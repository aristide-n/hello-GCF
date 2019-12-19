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
import { firestore } from '../../state/firebase';

@observer
export default class ContactsList extends Component {

	addContact(e) {
		e.preventDefault();
		const nameField = document.querySelector('#name-field');
		const name = nameField.value;
		nameField.value = null;

		firestore.collection('contacts').doc().set({ name })
			.then(()=>{})
			.catch(err => alert('Error adding contact: ', err));
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
					<List.Item onClick={()=>{this.dialog.MDComponent.show();}}>
						<List.ItemGraphic>add_circle_outline</List.ItemGraphic>
						<List.TextContainer>Add a Contact</List.TextContainer>
					</List.Item>
				</List>

				<Dialog ref={el => { this.dialog = el; }} onAccept={this.addContact.bind(this)}>
					<Dialog.Header>Add a Contact</Dialog.Header>
					<Dialog.Body>
						<TextField label="Name" outlined id="name-field"/>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept={true}>Save</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			</div>
		);
	}
}
