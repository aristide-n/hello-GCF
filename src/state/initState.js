import firebase, { firestore } from './firebase';

const initState = contactStore => {
	// bug? - users sometimes see other users' invitations (e.g. when one user logs in after another and sends the last
	// user an invitation). It may have been fixed side effectedly.
	if (contactStore.incomingInvitations.size > 0)
		contactStore.incomingInvitations = new Map();
	if (contactStore.contacts.size > 0)
		contactStore.contacts = new Map();
	if (contactStore.outgoingInvitations.size > 0)
		contactStore.outgoingInvitations = new Map();
	const currentUserRef = firestore.collection('users').doc(firebase.auth().currentUser.uid);

	currentUserRef.collection('incoming_invitations').onSnapshot(snapshot => {
			snapshot.docChanges().forEach((docChange) => {
				switch (docChange.type) {
					case 'added':
						docChange.doc.data().userRef.get()
							.then(fromUserSnap =>
								contactStore.addIncomingInvitation(
									docChange.doc.id, fromUserSnap.data(), fromUserSnap.ref)
							)
							.catch(err => console.error('Error getting fromUser:', err));
						break;
					case 'removed':
						contactStore.removeIncomingInvitation(docChange.doc.id);
						break;
					default:
						console.error('Can not modify incoming_invitations docs yet!');
						break;
				}
			});
		});

	currentUserRef.collection('contacts').onSnapshot(snapshot => {
		snapshot.docChanges().forEach((docChange) => {
			switch (docChange.type) {
				case 'added':
					docChange.doc.data().userRef.get()
						.then(contactSnap =>
							contactStore.addContact(docChange.doc.id, contactSnap.data())
						)
						.catch(err => console.error('Error getting contact:', err));
					break;
				default:
					console.error('Can not delete or modify contacts docs yet!');
					break;
			}
		});
	});

	currentUserRef.collection('outgoing_invitations').onSnapshot(snapshot => {
		snapshot.docChanges().forEach((docChange) => {
			switch (docChange.type) {
				case 'added':
					if (docChange.doc.data().isAccepted || docChange.doc.data().isDeclined) {
						if (docChange.doc.data().isAccepted) {
							console.log('adding contact: ', docChange.doc.data().contactRef);
							// create new contact doc
							currentUserRef.collection('contacts').doc()
								// todo: use the email from the latest snapshot, !from the outgoing_invitations doc?
								.set({ userRef: docChange.doc.data().contactRef, email: docChange.doc.data().email})
								.catch(err => console.error('Error adding contact: ', err));
						}
						// delete outgoing invite doc
						docChange.doc.ref.delete()
							.catch(err => console.error('Error deleting outgoing_invitations doc: ', err));
					} else {
						contactStore.addOutgoingInvitation(docChange.doc.id, docChange.doc.data());
					}
					break;
				case 'modified':
					if (docChange.doc.data().isAccepted) {
						console.log('adding contact: ', docChange.doc.data().contactRef);
						// create new contact doc
						currentUserRef.collection('contacts').doc()
							// todo: use the email from the latest snapshot, !from the outgoing_invitations doc?
							.set({ userRef: docChange.doc.data().contactRef, email: docChange.doc.data().email})
							.catch(err => console.error('Error adding contact: ', err));
					}
					// delete outgoing invite doc
					docChange.doc.ref.delete()
						.catch(err => console.error('Error deleting outgoing_invitations doc: ', err));
					break;
				case 'removed':
					contactStore.removeOutgoingInvitation(docChange.doc.id);
					break;
			}
		});
	});
};

export default initState;