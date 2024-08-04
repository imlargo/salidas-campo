import { ROL } from '$utils/enums';
import type { UserData, UAB, UserResponse } from '$lib/types';
import type { User } from 'firebase/auth';

export function getUserSession(user: User, userData: UserResponse, uabs: UAB[]): UserData {
	const uab = uabs.find((uab) => uab.codigo === userData.CODIGO_UAB);
	return {
		email: user.email as string,
		nombre: userData.ROL === ROL.UAB ? (uab?.nombre as string) : (user.displayName as string),
		rol: userData.ROL,
		uab: uab || null,
		isAdmin: userData.ROL === ROL.ADMIN,
		isDepartamento: userData.ROL === ROL.UAB
	};
}
