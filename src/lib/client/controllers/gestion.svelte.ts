import { storeAuth } from '$stores/storeAuth.svelte';
import type { Proyeccion, Destino, Asignatura, UAB, Config, Solicitud } from '$lib/types';
import { dbController } from '$lib/db/controller';

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
