import type { LayoutServerLoad } from './$types';
import type { UserData } from '$lib/types';

export const load = (async ({ locals }) => {
	const user = locals.user;
	const userData: UserData = locals.userData;
	return {
		user,
		userData
	};
}) satisfies LayoutServerLoad;
