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
						console.error('Can not remove or modify contacts yet!');
						break;
				}
			});
		});
};

export default initState;