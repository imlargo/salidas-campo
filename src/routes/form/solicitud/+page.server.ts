import { dbController } from '$src/lib/db/controller';
import type { Solicitud } from '$src/lib/types';
import { EstadoSolicitud } from '$src/lib/util/enums';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const load = (async ({ url, locals }) => {
	const user = locals.user;

	// Si es una solicitud en blanco
	if (!url.searchParams.has('id')) {
		// Cargar como solicitud en blanco (sin proyeccion)
		return {
			solicitud: null,
			proyeccion: null,
			isEdit: false,
			isBlank: true,
			isNew: false
		};
	}

	// Si es una solicitud a partir de una proyeccion
	const id = url.searchParams.get('id');
	const proyeccion = await dbController.getProyeccion(id as string);

	// En caso de error en la id
	if (proyeccion === null) {
		error(403, {
			message: 'Unauthorized',
			tipo: 'solicitud',
			titulo: 'Salida no encontrada',
			mensaje: 'No se ha encontrado la salida de campo solicitada, verifica el codigo FM'
		});
	}

	if (proyeccion.email !== user.email) {
		error(403, {
			message: 'Unauthorized',
			tipo: 'solicitud',
			titulo: 'No tienes permisos para solicitar esta proyeccion',
			mensaje: 'No tienes permisos para solicitar esta proyeccion'
		});
	}

	// Si ya ha sido solicitada pero no esta en modo de edicion
	if (proyeccion.solicitada && !url.searchParams.has('edit')) {
		error(403, {
			message: 'Unauthorized',
			tipo: 'solicitud',
			titulo: 'Salida solicitada',
			mensaje: 'Ya has solicitado esta salida de campo, para modificarla ve al panel de resumen.'
		});
	}

	// Si es en blanco
	if (!proyeccion.solicitada && !url.searchParams.has('edit')) {
		return {
			solicitud: null,
			proyeccion: proyeccion,
			isEdit: false,
			isBlank: false,
			isNew: true
		};
	}

	/*
	
	// Verificar las condiciones de solicitud
	const queryParams = new URLSearchParams(window.location.search);

	// Agregar indicador de fm en la solicitud
	const selectFm = document.getElementById("fm");
	const option = document.createElement("option");
	option.value = proyeccion.id;
	option.textContent = `FM${proyeccion.id} - ${proyeccion.asignatura}`;
	selectFm.appendChild(option);

	*/

	// Si ya ha sido solicitada y esta en modo de edicion
	if (proyeccion.solicitada && url.searchParams.has('edit')) {
		// Obtiene la solicitud a editar
		const solicitud = (await dbController.getSolicitud(proyeccion.id.toString())) as Solicitud;

		// Si es una solicitud de otra persona
		if (solicitud.email !== user.email) {
			error(403, {
				message: 'Unauthorized',
				tipo: 'solicitud',
				titulo: 'No tienes permisos para modificar esta solicitud',
				mensaje:
					'No tienes permisos para modificar esta solicitud, posiblemente te equivocaste, te recomendamos que verifiques el link'
			});
		}

		/* Verificar si la solicitud puede ser modificada segun su estado */
		if (solicitud.agendado && !solicitud.revisado) {
			//
			error(403, {
				message: 'Unauthorized',
				tipo: 'solicitud',
				titulo: 'No se puede modificar la solicitud',
				mensaje: 'La solicitud actual se encuentra agendada, por lo tanto no es posible modificarla'
			});
		}
		if (
			solicitud.agendado &&
			solicitud.estado !== EstadoSolicitud.PENDIENTE &&
			solicitud.estado !== EstadoSolicitud.NEGADA
		) {
			//
			error(403, {
				message: 'Unauthorized',
				tipo: 'solicitud',
				titulo: 'No se puede modificar la solicitud',
				mensaje:
					'El estado de su solicitud no es PENDIENTE o DENEGADA, por lo tanto no es posible modificarla'
			});
		}

		return {
			proyeccion,
			solicitud,
			isEdit: true,
			isBlank: false,
			isNew: false
		};
	}
}) satisfies PageServerLoad;
