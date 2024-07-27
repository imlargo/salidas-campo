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

	async loadData() {
		const [data, config] = await Promise.all([dbController.loadData(), dbController.loadConfig()]);

		this.config = config as Config;
		this.lugares = data.lugares;
		this.riesgos = Object.groupBy(data.riesgos, ({ TIPO }) => TIPO);

		this.uabs = data.uabs.map((uab) => {
			const data: UAB = {
				codigo: uab.CODIGO_UAB.toString(),
				nombre: uab.NOMBRE_UAB.toString(),
				correo: uab.CORREO_UAB.toString()
			};

			return data;
		});
	}
}

export const storeData = new StoreData();
