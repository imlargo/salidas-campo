import { initializeApp } from 'firebase/app';

import { getFirestore, collection } from 'firebase/firestore';
import {
	getAuth,
	GoogleAuthProvider,
	setPersistence,
	browserLocalPersistence,
	type Persistence
} from 'firebase/auth';

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
const auth = getAuth(app);

const persistance: Persistence = { type: 'NONE' };
await setPersistence(auth, browserLocalPersistence);

const provider = new GoogleAuthProvider();

// Base de datos
const db = getFirestore(app);
const colProyeccion = collection(db, 'proyeccion');
const colSolicitudes = collection(db, 'solicitudes');
const colConfig = collection(db, 'config');

export { app, auth, provider, db, colProyeccion, colSolicitudes, colConfig };
