import { dbController } from '$src/lib/db/controller';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url, locals }) => {
	const id = url.searchParams.get('id');

	const user = locals.user;

	const proyeccion = id ? await dbController.getProyeccion(id) : null;

	if (proyeccion !== null && user.email !== proyeccion.email) {
		redirect(307, '/form/proyeccion');
	}

	return {
		proyeccion
	};
}) satisfies PageServerLoad;
