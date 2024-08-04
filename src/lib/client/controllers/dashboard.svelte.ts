import type { UAB, Config } from '$lib/types';
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
	selectedUAB: string = $state('');

	async cambiarFechaConfig(e: Event) {
		const elemento = e.target as HTMLInputElement;
		const fecha = elemento.value;
		const campo = elemento.dataset.campo;
		console.log('Cambiando:', campo, fecha);
		await dbController.setCampoConfig(campo as string, fecha);
		console.log('Cambiada');
	}
}

export const controllerDashboard = new ControllerDashboard();
