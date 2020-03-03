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

	constructor(id, fromUser) {
		this.id = id;
		this.fromUserName = fromUser.name;
	}
}

class ContactStore {
	@observable outgoingInvitations = [];
	@observable incomingInvitations = [];

	@action addOutgoingInvitation(id, invitation) {
		this.outgoingInvitations.push(
			new OutgoingInvitation(id, invitation)
		);
	}

	@action addIncomingInvitation(id, fromUser) {
		this.incomingInvitations.push(
			new IncomingInvitation(id, fromUser)
		);
	}
}

export default new ContactStore();