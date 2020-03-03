import firebase, { firestore } from './firebase';

const initState = contactStore => {
	const currentUserRef = firestore.collection('users').doc(firebase.auth().currentUser.uid);
	currentUserRef.collection('outgoing_invitations').onSnapshot(snapshot => {
			snapshot.docChanges().forEach((docChange) => {
				switch (docChange.type) {
					case 'added':
					case 'modified':
						// todo - this feels error prone, look for bugs and see if I can refactor it
						if (docChange.doc.data().isAccepted) {
							// create contact doc
							currentUserRef.collection('contacts').doc()
								.set({userRef: docChange.doc.data().contactRef})
								.catch(err => console.error('Error adding contact: ', err));
							// delete outgoing invite doc
							docChange.doc.ref.delete()
								.catch(err => console.error('Error deleting outgoing_invitations doc: ', err));
						} else {
							contactStore.addOutgoingInvitation(docChange.doc.id, docChange.doc.data());
						}
						break;
					case 'removed':
						contactStore.removeOutgoingInvitation(docChange.doc.id);
						break;
				}
			});
		});

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
						console.error('Can not modify docs yet!');
						break;
				}
			});
		});
};

export default initState;