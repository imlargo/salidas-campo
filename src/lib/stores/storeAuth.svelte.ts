import type { UAB } from '$lib/types';
import { ROL } from '$utils/enums';
import type { UserData } from '$lib/types';

class StoreAuth implements UserData {
	static storageKey = 'SessionAuthCache';

	user = $state(null);
	email = $state('');
	nombre = $state('');
	rol: ROL = $state(ROL.NONE);
	uab: UAB | null = $state(null);
	isAdmin = $state(false);
	isDepartamento = $state(false);

	init(user: any, userData: UserData) {
		this.user = user;
		this.email = userData.email;
		this.nombre = userData.nombre;
		this.rol = userData.rol;
		this.uab = userData.uab;
		this.isAdmin = userData.isAdmin;
		this.isDepartamento = userData.isDepartamento;
	}

	getData(): UserData {
		return {
			user: this.user,
			email: this.email,
			nombre: this.nombre,
			rol: this.rol,
			uab: this.uab,
			isAdmin: this.isAdmin,
			isDepartamento: this.isDepartamento
		};
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
