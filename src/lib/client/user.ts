import { ROL } from '$utils/enums';
import type { UserData, UAB, UserResponse } from '$lib/types';
import type { User } from 'firebase/auth';

export function getUserSession(user: User, userData: UserResponse, uabs: UAB[]): UserData {
	return {
		user: user,
		email: user.email as string,
		nombre: user.displayName as string,
		rol: userData.ROL,
		uab: uabs.find((uab) => uab.codigo === userData.CODIGO_UAB) || null,
		isAdmin: userData.ROL === ROL.ADMIN,
		isDepartamento: userData.ROL === ROL.UAB
	};
}
