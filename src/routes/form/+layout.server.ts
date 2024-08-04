import type { LayoutServerLoad } from './$types';

import type { UAB } from '$src/lib/types';
import asignaturas from '$lib/assets/asignaturas.json';
import geo from '$lib/assets/geo.json';
import { dbController } from '$src/lib/db/controller';
import { redirect } from '@sveltejs/kit';
import { validarFechaActual } from '$src/lib/util/utils';

export const load = (async ({ url, locals }) => {
	const { user, userData } = locals;

	const [data, config] = await Promise.all([dbController.loadData(), dbController.loadConfig()]);

	const formulario =
		url.pathname === '/form/proyeccion'
			? 'proyeccion'
			: url.pathname === '/form/solicitud'
				? 'solicitud'
				: url.pathname === '/form/cerrado'
					? 'cerrado'
					: '';

	if (
		formulario === 'proyeccion' &&
		validarFechaActual(config.inicioProyeccion, config.finProyeccion) === false
	) {
		redirect(307, '/form/cerrado?formulario=proyeccion');
	}

	if (
		formulario === 'solicitud' &&
		validarFechaActual(config.inicioSolicitud, config.finSolicitud) === false
	) {
		redirect(307, '/form/cerrado?formulario=solicitud');
	}

	if (formulario === 'cerrado') {
		const formulario = url.searchParams.get('formulario');

		if (!formulario) {
			redirect(307, '/');
		}

		if (
			formulario === 'proyeccion' &&
			validarFechaActual(config.inicioProyeccion, config.finProyeccion) === true
		) {
			redirect(301, '/form/proyeccion');
		}

		if (
			formulario === 'solicitud' &&
			validarFechaActual(config.inicioSolicitud, config.finSolicitud) === true
		) {
			redirect(307, '/form/solicitud');
		}
	}

	return {
		config: config,
		lugares: data.lugares,
		riesgos: data.riesgos,
		uabs: data.uabs as UAB[],
		asignaturas,
		destinos: geo,
		user: user,
		userData: userData
	};
}) satisfies LayoutServerLoad;
