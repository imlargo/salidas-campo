import type { UAB } from '$lib/types';
import { ROL } from '$utils/enums';

import { initializeApp } from 'firebase/app';
import { storeData } from './storeData.svelte';
import { browser } from '$app/environment';

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

import { dbController } from '../db/controller';

import { app, auth, provider } from '$lib/client/firebase';

interface UserData {
	user: any;
	email: string;
	nombre: string;
	rol: ROL;
	uab: UAB | null;
	isAdmin: boolean;
	isDepartamento: boolean;
}

class StoreAuth implements UserData {
	static storageKey = 'SessionAuthCache';

	user = $state(null);
	email = $state('');
	nombre = $state('');
	rol: ROL = $state(ROL.NONE);
	uab: UAB | null = $state(null);
	isAdmin = $state(false);
	isDepartamento = $state(false);

	constructor() {
		if (browser) {
			this.init();
		}
	}

	async init() {
		await setPersistence(auth, browserSessionPersistence);

		onAuthStateChanged(auth, async (user) => {
			if (user !== null) {
				const sessionAuth = this.getFromStorage();

				// Cargar del cache
				if (sessionAuth !== null) {
					this.setData(sessionAuth);
					return;
				}

				const userData = await dbController.getUser(user.email as string);

				// Si el docente no es valido
				if (userData === null) {
					return;
				}


				const sessionData: UserData = {
					user: user,
					email: user.email as string,
					nombre: user.displayName as string,
					rol: userData.ROL,
					uab: storeData.uabs.find((uab) => uab.codigo === userData.CODIGO_UAB) || null,
					isAdmin: userData.ROL === ROL.ADMIN,
					isDepartamento: userData.ROL === ROL.UAB
				};

				this.setData(sessionData);
			} else {
				// No user is signed in. Sign in.
				this.clearData();
				signInWithPopup(auth, provider);
			}
		});
	}

	setData(userData: UserData) {
		this.user = userData.user;
		this.email = userData.email;
		this.nombre = userData.nombre;
		this.rol = userData.rol;
		this.uab = userData.uab;
		this.isAdmin = userData.isAdmin;
		this.isDepartamento = userData.isDepartamento;
	}

	clearData() {
		this.user = null;
		this.email = '';
		this.nombre = '';

		this.rol = ROL.NONE;
		this.uab = null;
		this.isAdmin = false;
		this.isDepartamento = false;
	}

	saveToStorage() {
		const sessionData: UserData = {
			user: this.user,
			email: this.email,
			nombre: this.nombre,
			rol: this.rol,
			uab: this.uab,
			isAdmin: this.isAdmin,
			isDepartamento: this.isDepartamento
		};

		sessionStorage.setItem(StoreAuth.storageKey, JSON.stringify(sessionData));
	}

	getFromStorage(): UserData | null {
		const data = sessionStorage.getItem(StoreAuth.storageKey);
		return data ? JSON.parse(data) : null;
	}

	has(email: string) {
		const sessionAuth = this.getFromStorage();

		if (sessionAuth === null) {
			return false;
		}

		return sessionAuth.user.email === email;
	}
}

export const storeAuth = new StoreAuth();
