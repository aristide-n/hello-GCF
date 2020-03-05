import firebase, { firestore } from './firebase';

const initState = contactStore => {
	// bug? - users sometimes see other users' invitations (e.g. when one user logs in after another and sends the last
	// user an invitation). It may have been fixed side effectedly.
	contactStore.resetState();

	const currentUserRef = firestore.collection('users').doc(firebase.auth().currentUser.uid);

	contactStore.snapshotFuncs.push(
		currentUserRef.onSnapshot(userSnap => contactStore.currentUserIsAvailable = userSnap.data().isAvailable));

	contactStore.snapshotFuncs.push(currentUserRef.collection('incoming_invitations').onSnapshot(snapshot => {
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
		}));

	contactStore.snapshotFuncs.push(currentUserRef.collection('contacts').orderBy('isAvailable', 'desc')
		.onSnapshot(snapshot => {
			snapshot.docChanges().forEach((docChange) => {
				switch (docChange.type) {
					case 'added':
						docChange.doc.data().userRef.get()
							.then(contactSnap =>
								contactStore.addContact(docChange.doc.id, contactSnap.data())
							)
							.catch(err => console.error('Error getting contact:', err));
						break;
					case 'modified':
						contactStore.updateContact(docChange.doc.id, docChange.doc.data());
						break;
					default:
						console.error('Can not delete contacts docs yet!');
						break;
				}
			});
	}));

	contactStore.snapshotFuncs.push(currentUserRef.collection('outgoing_invitations').onSnapshot(snapshot => {
		snapshot.docChanges().forEach((docChange) => {
			switch (docChange.type) {
				case 'added':
					if (docChange.doc.data().isAccepted || docChange.doc.data().isDeclined) {
						if (docChange.doc.data().isAccepted) {
							createNewContact(currentUserRef, docChange.doc.data().contactRef);
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
						createNewContact(currentUserRef, docChange.doc.data().contactRef);
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
	}));

	function createNewContact(currentUserRef, contactRef) {
		console.log('adding contact: ', contactRef);

		contactRef.get().then(contactSnap =>
			currentUserRef.collection('contacts').doc()
				.set({ userRef: contactRef, email: contactSnap.data().email,
						isAvailable: contactSnap.data().isAvailable})
				.catch(err => console.error('Error adding contact: ', err))
		).catch(err => console.log('error getting contactRef:', err));
	}
};

export default initState;