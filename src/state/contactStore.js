import { observable, action } from 'mobx';

class Contact {
	@observable id;
	@observable name;

	constructor(id, contact) {
		this.id = id;
		this.email = contact.email;
	}
}

class ContactStore {
	@observable contacts = [];

	@action addContact(id, contact) {
		this.contacts.push(
			new Contact(id, contact)
		);
	}
}

export default new ContactStore();