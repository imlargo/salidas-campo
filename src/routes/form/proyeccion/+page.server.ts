import { dbController } from '$src/lib/db/controller';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ url, locals }) => {
	const id = url.searchParams.get('id');

	const user = locals.user;

	const proyeccion = id ? await dbController.getProyeccion(id) : null;

	if (proyeccion !== null && user.email !== proyeccion.email) {
		error(403, {
			message: 'Unauthorized',
			tipo: 'proyeccion',
			titulo: 'No tienes permisos para ver esta proyección',
			mensaje: 'No tienes permisos para ver esta proyección',
		});
	}

	return {
		proyeccion
	};
}) satisfies PageServerLoad;
