import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { admin } from '$lib/server/firebase-server';

import { ROL } from '$lib/util/enums';
import { dbController } from '$lib/db/controller';
import type { UserData } from '$src/lib/types';
import type { PageServerLoad } from './$types';
import { getRoleRedirect } from '$src/lib/server/role-router';

export const load = (async ({ url, locals }) => {
	const user = locals.user;
	const userData: UserData = locals.userData;
	const from = url.searchParams.get('from');

	if (user !== null) {
		const redirectPath = getRoleRedirect(userData);
		throw redirect(303, redirectPath);
	}

	const data = await dbController.loadData();
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

		const redirectPath = getRoleRedirect(userData);
		throw redirect(303, redirectPath);
	}
} satisfies Actions;
