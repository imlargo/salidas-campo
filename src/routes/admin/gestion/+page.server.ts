import type { LayoutLoad } from './$types';
import type { UAB } from '$src/lib/types';
import asignaturas from '$lib/assets/asignaturas.json';
import geo from '$lib/assets/geo.json';
import { dbController } from '$src/lib/db/controller';
import { redirect } from '@sveltejs/kit';
import { validarFechaActual } from '$src/lib/util/utils';

export const load = (async () => {
	const [config, internalData, solicitudes] = await Promise.all([
		dbController.loadConfig(),
		dbController.loadData(),
		dbController.getSolicitudes()
	]);

	return {
		config,
		internalData,
		solicitudes
	};
}) satisfies LayoutLoad;
