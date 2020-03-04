import { observable, action } from 'mobx';

class OutgoingInvitation {
	@observable id;
	@observable email;

	constructor(id, invitation) {
		this.id = id;
		this.email = invitation.email;
	}
}

class IncomingInvitation {
	@observable id;
	@observable fromUserName;
	fromUserRef;

	constructor(id, fromUser, fromUserRef) {
		this.id = id;
		this.fromUserName = fromUser.name;
		this.fromUserRef = fromUserRef;
	}
}

class Contact {
	@observable id;
	@observable name;
	@observable email;

	constructor(id, contact) {
		this.id = id;
		this.name = contact.name;
		this.email = contact.email;
	}
}

class ContactStore {
	@observable outgoingInvitations = new Map();
	@observable incomingInvitations = new Map();
	@observable contacts = new Map();

	@action addOutgoingInvitation(id, invitation) {
		this.outgoingInvitations.set(id, new OutgoingInvitation(id, invitation));
	}

	@action addIncomingInvitation(id, fromUser, fromUserRef) {
		this.incomingInvitations.set(id, new IncomingInvitation(id, fromUser, fromUserRef));
	}

	@action addContact(id, contact) {
		this.contacts.set(id, new Contact(id, contact));
	}

	@action removeOutgoingInvitation(id) {
		this.outgoingInvitations.delete(id);
	}

	@action removeIncomingInvitation(id) {
		this.incomingInvitations.delete(id);
	}
}

export default new ContactStore();