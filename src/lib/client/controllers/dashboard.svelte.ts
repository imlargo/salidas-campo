import { storeAuth } from '$stores/storeAuth.svelte';
import type { Proyeccion, Destino, Asignatura, UAB, Config } from '$lib/types';
import { dbController } from '$lib/db/controller';

class ControllerDashboard {
	uabs: UAB[] = $state([]);
	config: Config = $state({
		finProyeccion: '',
		finSemestre: '',
		finSolicitud: '',
		inicioProyeccion: '',
		inicioSemestre: '',
		inicioSolicitud: ''
	});

	async cambiarFechaConfig(e: Event) {
		const elemento = e.target as HTMLInputElement;
		const fecha = elemento.value;
		const campo = elemento.dataset.campo;

		dbController.setCampoConfig(campo as string, fecha);
	}
}

export const controllerDashboard = new ControllerDashboard();
