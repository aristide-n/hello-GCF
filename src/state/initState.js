import { firestore } from './firebase';

const initState = contactStore => {
	firestore
		.collection('contacts')
		.onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((docChange) => {
				switch (docChange.type) {
					case 'added':
						contactStore.addContact(docChange.doc.id, docChange.doc.data());
						break;
					default:
						console.error('Can not remove or modify contacts yet!');
						break;
				}
			});
		});
};

export default initState;