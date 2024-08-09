import type { PageServerLoad } from './$types';
import { dbController } from '$src/lib/db/controller';
import { validarFechaActual, getActualDate, calcularDuracion } from '$src/lib/util/utils';
import type { Proyeccion, Solicitud, UserData } from '$src/lib/types';
import { ROL } from '$src/lib/util/enums';
import { getRoleRedirect } from '$src/lib/server/role-router';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const user = locals.user;
	const userData: UserData = locals.userData;

	// Verificar si es uab o admin
	if (userData.rol !== ROL.UAB && userData.rol !== ROL.ADMIN) {
		redirect(303, getRoleRedirect(userData));
	}

	const config = await dbController.loadConfig();

	const proyeccionActiva = validarFechaActual(config.inicioProyeccion, config.finProyeccion);

	const diasFaltantesProyeccion = parseInt(
		calcularDuracion(getActualDate(), new Date(config.finProyeccion)).toString()
	);
	const proyecciones: Proyeccion[] = await dbController.getProyeccionesBy(
		'docente',
		userData.nombre
	);

	if (userData.rol === ROL.PLANTA || userData.rol === ROL.OCASIONAL) {
		redirect(308, '/modulo/docente');
	}

	return {
		config,
		proyeccionActiva,
		diasFaltantesProyeccion,
		proyecciones
	};
}) satisfies PageServerLoad;
