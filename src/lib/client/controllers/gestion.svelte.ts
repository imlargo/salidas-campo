import type { UAB, Config, Solicitud } from '$lib/types';

class ControllerGestion {
	uabs: UAB[] = $state([]);
	config: Config = $state({
		finProyeccion: '',
		finSemestre: '',
		finSolicitud: '',
		inicioProyeccion: '',
		inicioSemestre: '',
		inicioSolicitud: ''
	});

	solicitudes: Solicitud[] = $state([]);
}

export const controllerGestion = new ControllerGestion();
