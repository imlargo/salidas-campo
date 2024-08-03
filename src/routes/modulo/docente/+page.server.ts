import type { PageServerLoad } from './$types';
import { dbController } from '$src/lib/db/controller';
import { validarFechaActual, getActualDate, calcularDuracion } from '$src/lib/util/utils';

export const load = (async ({ locals }) => {
	const user = locals.user;

	const config = await dbController.loadConfig();

	const solicitudActiva = validarFechaActual(config.inicioSolicitud, config.finSolicitud);
	const proyeccionActiva = validarFechaActual(config.inicioProyeccion, config.finProyeccion);

	const diasFaltantesProyeccion = parseInt(
		calcularDuracion(getActualDate(), new Date(config.finProyeccion)).toString()
	);
	const diasFaltantesSolicitud = parseInt(
		calcularDuracion(getActualDate(), new Date(config.finSolicitud)).toString()
	);

	const proyecciones = await dbController.getProyeccionesByDocente(user.email);

	return {
		config,
		solicitudActiva,
		proyeccionActiva,
		diasFaltantesProyeccion,
		diasFaltantesSolicitud,
		proyecciones
	};
}) satisfies PageServerLoad;
