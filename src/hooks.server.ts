import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { admin } from '$lib/server/firebase-server';
import type { DecodedIdToken } from 'firebase-admin/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Crear user en los locals
	event.locals.user = null;

	const session = event.cookies.get('session') ?? '';

	const isLogin: boolean = event.url.pathname === '/login';

	if (session === '' && isLogin === false) {
		throw redirect(303, '/login');
	}

	if (session === '' && isLogin === true) {
		return await resolve(event);
	}

	if (building) {
		event.cookies.set('session', '', {
			path: '/'
		});
		return await resolve(event);
	}

	try {
		let decodedUser: DecodedIdToken = await admin.auth().verifySessionCookie(session, false);
		event.locals.user = decodedUser;

		return await resolve(event);
	} catch (error) {
		event.cookies.set('session', '', {
			path: '/'
		});
		throw redirect(303, '/login');
	}
};
