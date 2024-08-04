import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { admin } from '$lib/server/firebase-server';
import type { DecodedIdToken } from 'firebase-admin/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Crear user en los locals
	event.locals.user = null;
	event.locals.userData = null;

	const session = event.cookies.get('session') ?? '';
	const rawUserData = event.cookies.get('userData') ?? '';
	const userData = rawUserData !== '' ? JSON.parse(rawUserData) : null;
	const isValid = session !== '' && rawUserData !== '';
	const isLogin: boolean = event.url.pathname === '/login';

	// Si no hay session y no es login, redirigir a login
	if (!isValid && isLogin === false) {
		event.cookies.set('session', '', {
			path: '/'
		});
		event.cookies.set('userData', '', {
			path: '/'
		});
		throw redirect(303, '/login');
	}

	// Si no hay session y es login, continuar
	if (!isValid && isLogin === true) {
		return await resolve(event);
	}

	// Si hay session y es login, redirigir a home
	if (building) {
		event.cookies.set('session', '', {
			path: '/'
		});
		event.cookies.set('userData', '', {
			path: '/'
		});
		return await resolve(event);
	}

	try {
		const decodedUser: DecodedIdToken = await admin.auth().verifySessionCookie(session, false);
		event.locals.user = decodedUser;
		event.locals.userData = userData;

		return await resolve(event);
	} catch (error) {
		console.log(error);

		event.cookies.set('session', '', {
			path: '/'
		});
		event.cookies.set('userData', '', {
			path: '/'
		});
		throw redirect(303, '/login');
	}
};
