import type { UAB, Destino, Config, Asignatura } from '$lib/types';
import { dbController } from '../db/controller';

class StoreData {
	asignaturas: Asignatura[] = $state([]);

	destinos: Destino[] = $state([]);
	lugares: string[] = $state([]);
	riesgos = $state({});
	uabs: UAB[] = $state([]);

	config: Config = $state({
		finProyeccion: '',
		finSemestre: '',
		finSolicitud: '',
		inicioProyeccion: '',
		inicioSemestre: '',
		inicioSolicitud: ''
	});
}

export const storeData = new StoreData();
