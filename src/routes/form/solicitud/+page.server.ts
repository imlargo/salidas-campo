import { dbController } from '$src/lib/db/controller';
import type { Solicitud } from '$src/lib/types';
import { EstadoSolicitud } from '$src/lib/util/enums';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	// const solicitud = isEdit && id ? await dbController.getSolicitud(id) : null;

	// Si es una solicitud a partir de una proyeccion
	// const id = url.searchParams.get('id');

	// Verificar si está dentro de las fechas correctas

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

	/*

	// Verificar las condiciones de solicitud
	const queryParams = new URLSearchParams(window.location.search);

	// Si es una solicitud en blanco:
	if (!queryParams.has("id")) {
		return;
	}

	// Si es una solicitud a partir de una proyeccion
	const id = queryParams.get("id");
	const proyeccion = await Firestore.getRegistro(id);

	// En caso de error en la id
	if (proyeccion === null) {
		alert("No se ha encontrado la salida de campo solicitada, verifica el codigo FM");
		window.location.href = "resumen.html";
	}

	// Si es una solicitud de otra persona
	if (proyeccion.email !== user.email) {
		alert("No tienes permisos para editar este registro");
		window.location.href = "resumen.html";
	}

	// Agregar indicador de fm en la solicitud
	const selectFm = document.getElementById("fm");
	const option = document.createElement("option");
	option.value = proyeccion.id;
	option.textContent = `FM${proyeccion.id} - ${proyeccion.asignatura}`;
	selectFm.appendChild(option);

	// Si ya ha sido solicitada pero no esta en modo de edicion
	if (proyeccion.solicitada && !queryParams.has("edit")) {
		alert("Ya has solicitado esta salida de campo, para modificarla ve al panel de resumen.");
		window.location.href = "resumen.html";
		return;
	}

	// Si ya ha sido solicitada y esta en modo de edicion
	if (proyeccion.solicitada && queryParams.has("edit")) {

		// Obtiene la solicitud a editar
		const solicitud = await Firestore.getSolicitud(proyeccion.id);

		if (solicitud.agendado && !solicitud.revisado) {
			showModal(
				"Advertencia",
				"La solicitud actual se encuentra agendada, por lo tanto no es posible modificarla",
				() => { window.location.href = "resumen.html"; }
			);
			return;
		}
		if (solicitud.agendado && solicitud.estado !== SolicitudStatus.PENDIENTE && solicitud.estado !== SolicitudStatus.DENEGADA) {
			showModal(
				"Advertencia",
				"El estado de su solicitud no es PENDIENTE o DENEGADA, por lo tanto no es posible modificarla",
				() => { window.location.href = "resumen.html"; }
			);
			return;
		}

		// Entrar en modo de edicion
		GLOBALS.state.editMode = true;
		fillFromSolicitud(solicitud);
		return;
	}
	*/

	// Si es una solicitud a partir de una proyeccion
	const id = url.searchParams.get('id');
	const proyeccion = await dbController.getProyeccion(id as string);

	// En caso de error en la id
	if (proyeccion === null) {
		// alert("No se ha encontrado la salida de campo solicitada, verifica el codigo FM");
		// window.location.href = "resumen.html";

		redirect(307, '/modulo/docente');
	}

	// Si ya ha sido solicitada pero no esta en modo de edicion
	if (proyeccion.solicitada && !url.searchParams.has('edit')) {
		// Ya has solicitado esta salida de campo, para modificarla ve al panel de resumen.
		redirect(307, '/modulo/docente');
	}

	if (!url.searchParams.has('edit')) {
		return {
			solicitud: null,
			proyeccion: proyeccion,
			isEdit: false,
			isBlank: false,
			isNew: true
		};
	}

	// Si ya ha sido solicitada y esta en modo de edicion
	if (proyeccion.solicitada && url.searchParams.has('edit')) {
		// Obtiene la solicitud a editar
		const solicitud = (await dbController.getSolicitud(proyeccion.id)) as Solicitud;

		/* Verificar si la solicitud puede ser modificada segun su estado */
		if (solicitud.agendado && !solicitud.revisado) {
			// La solicitud actual se encuentra agendada, por lo tanto no es posible modificarla
			redirect(307, '/modulo/docente');
			return;
		}
		if (
			solicitud.agendado &&
			solicitud.estado !== EstadoSolicitud.PENDIENTE &&
			solicitud.estado !== EstadoSolicitud.DENEGADA
		) {
			// El estado de su solicitud no es PENDIENTE o DENEGADA, por lo tanto no es posible modificarla
			redirect(307, '/modulo/docente');
			return;
		}

		return {
			proyeccion,
			isEdit: true,
			solicitud
		};
	}
}) satisfies PageServerLoad;
