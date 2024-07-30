import type { LayoutLoad } from './$types';
import type { UAB } from '$src/lib/types';
import asignaturas from '$lib/assets/asignaturas.json';
import geo from '$lib/assets/geo.json';
import { dbController } from '$src/lib/db/controller';
import { redirect } from '@sveltejs/kit';
import { validarFechaActual } from '$src/lib/util/utils';

export const load = (async ({ url }) => {
	const [data, config] = await Promise.all([dbController.loadData(), dbController.loadConfig()]);

	const formulario =
		url.pathname === '/form/proyeccion'
			? 'proyeccion'
			: url.pathname === '/form/solicitud'
				? 'solicitud'
				: '';

	if (
		formulario === 'proyeccion' &&
		validarFechaActual(config.inicioProyeccion, config.finProyeccion) === false
	) {
		redirect(307, '/form/cerrado');
	}

	if (
		formulario === 'solicitud' &&
		validarFechaActual(config.inicioProyeccion, config.finProyeccion) === false
	) {
		redirect(307, '/form/cerrado');
	}

	return {
		config: config,
		lugares: data.lugares,
		riesgos: data.riesgos,
		uabs: data.uabs as UAB[],
		asignaturas,
		destinos: geo
	};
}) satisfies LayoutLoad;
