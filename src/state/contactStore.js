import { observable, action } from 'mobx';

class OutgoingInvitation {
	@observable id;
	@observable email;
	@observable phoneNumber;

	constructor(id, invitation) {
		this.id = id;
		this.email = invitation.email;
		this.phoneNumber = invitation.phoneNumber;
	}
}

class IncomingInvitation {
	@observable id;
	@observable fromUserName;
	@observable fromUserPhoneNumber;
	fromUserRef;

	constructor(id, fromUser, fromUserRef) {
		this.id = id;
		this.fromUserName = fromUser.name;
		this.fromUserPhoneNumber = fromUser.phoneNumber;
		this.fromUserRef = fromUserRef;
	}
}

class Contact {
	@observable id;
	@observable name;
	@observable phoneNumber;
	@observable email;
	@observable isAvailable;

	constructor(id, contact) {
		this.id = id;
		this.name = contact.name;
		this.phoneNumber = contact.phoneNumber;
		this.email = contact.email;
		this.isAvailable = contact.isAvailable;
	}
}

class ContactStore {
	@observable outgoingInvitations = new Map();
	@observable incomingInvitations = new Map();
	@observable contacts = new Map();
	@observable currentUserIsAvailable;
	snapshotFuncs = [];

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

	@action updateContact(id, contact) {
		this.contacts.get(id).isAvailable = contact.isAvailable;
	}

	resetState() {
		this.currentUserIsAvailable = null;
		if (this.incomingInvitations.size > 0) this.incomingInvitations = new Map();
		if (this.contacts.size > 0) this.contacts = new Map();
		if (this.outgoingInvitations.size > 0) this.outgoingInvitations = new Map();
		this.snapshotFuncs = [];
	}
}

export default new ContactStore();