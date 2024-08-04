import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { admin } from '$lib/server/firebase-server';

import { dbController } from '$lib/db/controller';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const data = await dbController.loadData();

	const user = locals.user;

	if (user !== null) {
		redirect(303, '/');
	}

	return {
		uabs: data.uabs
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();

		const userData = form.get('userData');
		const token = form.get('token');

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
			throw redirect(303, '/login');
		}

		cookies.set('session', sessionCookie, {
			maxAge: expiresIn,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		cookies.set('userData', userData as string, {
			maxAge: expiresIn,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax'
		});

		throw redirect(303, '/');
	}
} satisfies Actions;
