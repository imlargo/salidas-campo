import { dbController } from '$src/lib/db/controller';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const id = url.searchParams.get('id');

    const proyeccion = id ? await dbController.getProyeccion(id) : null;

	return {
        proyeccion
    };
}) satisfies PageServerLoad;