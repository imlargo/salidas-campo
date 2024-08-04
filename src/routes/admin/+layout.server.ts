import type { LayoutServerLoad } from './$types';
import { ROL } from '$src/lib/util/enums';
import type { UserData } from '$src/lib/types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const userData: UserData = locals.userData as UserData;

	if (!userData.isAdmin) {
		const rol = userData.rol;

		if (rol === ROL.OCASIONAL || rol === ROL.PLANTA) {
			redirect(307, '/modulo/docente');
		}

		if (rol === ROL.UAB) {
			redirect(307, '/modulo/uab');
		}
	}

	return {};
}) satisfies LayoutServerLoad;
