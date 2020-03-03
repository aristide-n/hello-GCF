import { observable, action } from 'mobx';

class OutgoingInvitation {
	@observable id;
	@observable email;

	constructor(id, contact) {
		this.id = id;
		this.email = contact.email;
	}
}

class ContactStore {
	@observable outgoingInvitations = [];

	@action addOutgoingInvitation(id, contact) {
		this.outgoingInvitations.push(
			new OutgoingInvitation(id, contact)
		);
	}
}

export default new ContactStore();