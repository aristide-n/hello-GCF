const firebase = require('firebase');
require('firebase/firestore');

const config = {
	apiKey: 'AIzaSyD1_8OLtYse5eMUfPdQjQroIEZGrZ7kz_g',
	authDomain: 'when-available-ace5f.firebaseapp.com',
	databaseURL: 'https://when-available-ace5f.firebaseio.com',
	projectId: 'when-available-ace5f',
	storageBucket: 'when-available-ace5f.appspot.com',
	messagingSenderId: '783770976586',
	appId: '1:783770976586:web:bd5a9bd776cd73ca9ec1b3'
};

firebase.initializeApp(config);

export default firebase;
export const firestore = firebase.firestore();