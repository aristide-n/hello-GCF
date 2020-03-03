import firebase, { firestore } from './firebase';

const initState = contactStore => {
	firestore
		.collection('users/' + firebase.auth().currentUser.uid + '/outgoing_invitations')
		.onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((docChange) => {
				switch (docChange.type) {
					case 'added':
						contactStore.addOutgoingInvitation(docChange.doc.id, docChange.doc.data());
						break;
					default:
						console.error('Can not remove or modify docs yet!');
						break;
				}
			});
		});

	firestore
		.collection('users/' + firebase.auth().currentUser.uid + '/incoming_invitations')
		.onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((docChange) => {
				switch (docChange.type) {
					case 'added':
						docChange.doc.data().userRef.get()
							.then(fromUserSnap =>
								contactStore.addIncomingInvitation(docChange.doc.id, fromUserSnap.data())
							)
							.catch(err => console.error('Error getting fromUser:', err));
						break;
					default:
						console.error('Can not remove or modify docs yet!');
						break;
				}
			});
		});
};

export default initState;