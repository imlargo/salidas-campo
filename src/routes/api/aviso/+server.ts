import type { RequestHandler } from './$types';
import { APPS_SCRIPT_API } from '$env/static/private';
import { GroupBy } from '$src/lib/util/utils';
import type { Proyeccion } from '$src/lib/types';
import { EmailAvisoSolicitudSalida } from '$src/lib/util/emails';

export const POST: RequestHandler = async ({ request }) => {
	// Obtener los datos de la pagina
	const requestData = await request.json();

	const proyecciones: Proyeccion[] = requestData.proyecciones;

	const agrupado: Record<string, Proyeccion[]> = GroupBy(proyecciones, ({ email }) => email);

	for (const [email, proyeccionesDocente] of Object.entries(agrupado)) {
		await fetch(APPS_SCRIPT_API, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type: 'email',
				data: EmailAvisoSolicitudSalida(proyeccionesDocente)
			})
		});
	}

	return new Response();
};
