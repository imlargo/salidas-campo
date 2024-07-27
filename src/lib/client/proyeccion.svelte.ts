import { storeData } from '$stores/storeData.svelte';
import { storeAuth } from '$stores/storeAuth.svelte';
import { storeFiltro } from './asignaturas.svelte';
import type { ProyeccionData, Destino } from '$lib/types';
import { calcularDuracion } from '../util/utils';

class ControllerProyeccion implements ProyeccionData {
	multidocente = $state(false);
	docenteAdicional = $state('');

	tieneRelacion = $state(true);
	asignaturaRelacion = $state({});
	incluirRelacion = $state(false);

	facultad = $state('MINAS');
	docente = $derived(storeAuth.nombre);

	uab = $state(storeAuth.uab?.codigo || '');
	asignatura = $derived(storeFiltro.valueAsignatura);
	codigo = $derived(storeFiltro.valueCodigo);

	grupo = $state('');
	asistentes = $state('');
	fechaSalida = $state('');
	horaSalida = $state('');
	lugarSalida = $state('');
	fechaRegreso = $state('');

	horaRegreso = $state('');
	lugarRegreso = $state('');

	duracion = $derived.by(() => {
		const fecha1 = new Date(this.fechaSalida.replaceAll('-', '/'));
		const fecha2 = new Date(this.fechaRegreso.replaceAll('-', '/'));
		return calcularDuracion(fecha1, fecha2);
	});

	destinos: Destino[] = $state([]);

	departamentos = $state('');
	municipios = $state('');
	ultimoDestino = $state('');
	marcaTemporal = $state('');
	email = $state('');
	solicitada = $state(false);
	blank = $state(false);

	handleFechaChange() {
		if (this.fechaRegreso < this.fechaSalida) {
			this.fechaRegreso = this.fechaSalida;
			document.getElementById('fechaRegreso')?.dispatchEvent(new Event('change'));
		}
	}

	eliminarDestino(destino: Destino) {
		this.destinos = this.destinos.filter((d) => d !== destino);
	}

	agregarDestino(destino: Destino) {
		this.destinos.push(destino);
	}

	changeUAB(e: Event) {
		const target = e.target as HTMLSelectElement;
		this.uab = target.value;
		storeFiltro.valueUAB = target.value;
		console.log(this.uab);

		storeFiltro.valueAsignatura = '';
		storeFiltro.valueCodigo = '';
	}
}

export const controllerProyeccion = new ControllerProyeccion();
