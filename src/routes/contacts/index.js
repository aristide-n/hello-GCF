import { Component } from 'preact';
import { observer } from 'preact-mobx';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import style from './style.css';

@observer
export default class ContactsList extends Component {
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
					<List.Item>
						<List.ItemGraphic>add_circle_outline</List.ItemGraphic>
						<List.TextContainer>Add a contact</List.TextContainer>
					</List.Item>
				</List>
			</div>
		);
	}
}
