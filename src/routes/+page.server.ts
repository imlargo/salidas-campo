import { redirect } from '@sveltejs/kit';
import type { UserData } from '$src/lib/types';
import type { PageServerLoad } from './$types';
import { getRoleRedirect } from '$src/lib/server/role-router';

export const load = (async ({ locals }) => {
	const user = locals.user;
	const userData: UserData = locals.userData;

	const redirectPath = getRoleRedirect(userData);
	throw redirect(303, redirectPath);

	return {};
}) satisfies PageServerLoad;
