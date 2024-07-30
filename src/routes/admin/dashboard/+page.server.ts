import type { LayoutLoad } from './$types';
import type { UAB } from '$src/lib/types';
import asignaturas from '$lib/assets/asignaturas.json';
import geo from '$lib/assets/geo.json';
import { dbController } from '$src/lib/db/controller';
import { redirect } from '@sveltejs/kit';
import { validarFechaActual } from '$src/lib/util/utils';

export const load = (async () => {
	const [sizes, config, internalData] = await Promise.all([
		dbController.getCantidadRegistros(),
		dbController.loadConfig(),
		dbController.loadData()
	]);

	return {
		config,
		sizes,
		internalData
	};
}) satisfies LayoutLoad;
