import { initializeApp } from 'firebase/app';

import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	setPersistence,
	browserLocalPersistence,
	browserSessionPersistence
} from 'firebase/auth';

import {
	getFirestore,
	collection,
	onSnapshot,
	doc,
	addDoc,
	setDoc,
	getDocs,
	getDoc,
	deleteDoc,
	updateDoc,
	query,
	where
} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCI3x94m8Yl80letqFZ-0gIrKOmRRYur7g',
	authDomain: 'salidas-campo-cf088.firebaseapp.com',
	projectId: 'salidas-campo-cf088',
	storageBucket: 'salidas-campo-cf088.appspot.com',
	messagingSenderId: '17594644898',
	appId: '1:17594644898:web:7f2237453d71be18b65afb',
	measurementId: 'G-HGJN7M0JP4'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Base de datos
const db = getFirestore(app);
const colProyeccion = collection(db, 'proyeccion');
const colSolicitudes = collection(db, 'solicitudes');
const colConfig = collection(db, 'config');

function getSnapshotData(querySnapshot) {
	const data = [];
	querySnapshot.forEach((doc) => {
		data.push({
			...doc.data(),
			id: doc.id
		});
	});
	return data;
}

export { app, auth, provider, db, colProyeccion, colSolicitudes, colConfig };
