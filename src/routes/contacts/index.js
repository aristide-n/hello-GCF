import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import style from './style.css';

export default class ContactsList extends Component {
	render() {
		const contacts = ['Bob Ford', 'Alice Boxer', 'Mallory Malek', 'Eve Potter'];
		return (
			<div class={`${style.contactsList} page`}>
				<List avatar-list>
					{contacts.map(contactName => {
						return (
							<List.Item>
								<List.ItemGraphic>perm_identity</List.ItemGraphic>
								<List.TextContainer>{contactName}</List.TextContainer>
							</List.Item>
						);
					})}
					<List.Item>
						<List.ItemGraphic>add_circle_outline</List.ItemGraphic>
						<List.TextContainer>Add a contact</List.TextContainer>
					</List.Item>
				</List>
			</div>
		);
	}
}
