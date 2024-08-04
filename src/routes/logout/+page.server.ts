import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
	cookies.set('session', '', {
		path: '/'
	});
	cookies.set('userData', '', {
		path: '/'
	});
	throw redirect(303, '/login');

	return {};
}) satisfies PageServerLoad;
