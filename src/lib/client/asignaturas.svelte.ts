import { storeData } from '../stores/storeData.svelte';
import type { Asignatura, UAB } from '$lib/types';
import { controllerProyeccion } from '$src/lib/client/proyeccion.svelte';

interface StoreFiltro {
	valueUAB: string;
	valueAsignatura: string;
	valueCodigo: string;

	listadoAsignaturas: Asignatura[];
	listadoCodigos: string[];
}

class StoreFiltro implements StoreFiltro {
	valueUAB = $state('');
	valueAsignatura = $state('');
	valueCodigo = $state('');

	asignatura: Asignatura | null = $derived(
		this.valueUAB && this.valueAsignatura && this.valueCodigo
			? this.listadoAsignaturas.find(
					(asignatura) => asignatura.COD_ASIGNATURA === this.valueCodigo
				) || null
			: null
	);

	tieneRelacion = $derived(this.asignatura ? this.asignatura.hasOwnProperty('ANTERIOR') : false);
	anterior = $derived(
		this.tieneRelacion
			? storeData.asignaturas.find(
					(asignatura) => asignatura.COD_ASIGNATURA === this.asignatura.ANTERIOR
				)
			: null
	);

	listadoAsignaturas = $derived(
		this.valueUAB
			? storeData.asignaturas.filter((asignatura) => asignatura.COD_UAB === this.valueUAB)
			: []
	);

	listadoCodigos = $derived(
		this.valueUAB && this.valueAsignatura
			? this.listadoAsignaturas
					.filter((asignatura) => asignatura.ASIGNATURA === this.valueAsignatura)
					.map((asignatura) => asignatura.COD_ASIGNATURA)
			: []
	);
}

export const storeFiltro = new StoreFiltro();
