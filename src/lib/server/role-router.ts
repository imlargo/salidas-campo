import { ROL } from '$lib/util/enums';
import type { UserData } from '$src/lib/types';

export function getRoleRedirect(userData: UserData): string {
	if (userData.rol === ROL.ADMIN) {
		return '/admin/dashboard';
	}

	if (userData.rol === ROL.PLANTA || userData.rol === ROL.OCASIONAL) {
		return '/modulo/docente';
	}

	if (userData.rol === ROL.UAB) {
		return '/modulo/uab';
	}

	return '/logout';
}
