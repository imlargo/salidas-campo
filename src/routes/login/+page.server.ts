import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { admin } from '$lib/server/firebase-server';

import { ROL } from '$lib/util/enums';
import { dbController } from '$lib/db/controller';
import type { UserData } from '$src/lib/types';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, locals }) => {
	const user = locals.user;
	const userData: UserData = locals.userData;
	const from = url.searchParams.get('from');

	const data = await dbController.loadData();

	if (user === null) {
		return {
			uabs: data.uabs,
			from: from || null
		};
	}

	if (userData.rol === ROL.ADMIN) {
		throw redirect(303, '/admin/dashboard');
	}

	if (userData.rol === ROL.PLANTA || userData.rol === ROL.OCASIONAL) {
		throw redirect(303, '/modulo/docente');
	}

	if (userData.rol === ROL.UAB) {
		throw redirect(303, '/modulo/uab');
	}

	return {
		uabs: data.uabs,
		from: from || null
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();

		const token = form.get('token');
		const from = form.get('from');
		const rawUserData = form.get('userData');
		const userData: UserData = JSON.parse(rawUserData as string);

		if (!token || typeof token !== 'string') {
			throw redirect(303, '/login');
		}

		// Expires in 5 days
		const expiresIn = 60 * 60 * 24 * 5;
		let sessionCookie: string;
		try {
			sessionCookie = await admin
				.auth()
				.createSessionCookie(token, { expiresIn: expiresIn * 1000 });
		} catch (error) {
			console.error(error);
			cookies.set('session', '', {
				path: '/'
			});
			cookies.set('userData', '', {
				path: '/'
			});
			throw redirect(303, '/login');
		}

		cookies.set('session', sessionCookie, {
			maxAge: expiresIn,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		cookies.set('userData', rawUserData as string, {
			maxAge: expiresIn,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		if (from) {
			console.log('Redirigiendo a pagina anterior: ', from);

			throw redirect(303, from as string);
		}

		if (userData.rol === ROL.ADMIN) {
			throw redirect(303, '/admin/dashboard');
		}

		if (userData.rol === ROL.PLANTA || userData.rol === ROL.OCASIONAL) {
			throw redirect(303, '/modulo/docente');
		}

		if (userData.rol === ROL.UAB) {
			throw redirect(303, '/modulo/uab');
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
