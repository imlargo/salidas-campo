import { storeData } from '$stores/storeData.svelte';
import { storeAuth } from '$stores/storeAuth.svelte';
import { storeFiltro } from './asignaturas.svelte';
import type { ProyeccionData, Destino } from '$lib/types';
import { calcularDuracion } from '../util/utils';
import { dbController } from '../db/controller';

class ControllerProyeccion implements ProyeccionData {
	multidocente = $state(false);
	docenteAdicional = $state('');

	tieneRelacion = $state(true);
	asignaturaRelacion = $state({});
	incluirRelacion = $state(false);

	facultad = $state('MINAS');
	docente = $derived(storeAuth.nombre);

	uab = $state('');
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
			this.fechaRegreso = "";
			document.getElementById('fechaRegreso')?.dispatchEvent(new Event('change'));
		}
	}

	eliminarDestino(destino: Destino) {
		this.destinos = this.destinos.filter((d) => d !== destino);
	}

	agregarDestino(destino: Destino) {
		this.destinos.push(destino);
	}

	changeUAB(value: string) {
		this.uab = value;
		storeFiltro.valueUAB = value;

		storeFiltro.valueAsignatura = '';
		storeFiltro.valueCodigo = '';
	}

	sendData() {
		const data: ProyeccionData = {
			facultad: this.facultad,
			docente: this.docente,
			uab: this.uab,
			asignatura: this.asignatura,
			codigo: this.codigo,
			grupo: this.grupo,
			asistentes: this.asistentes,
			fechaSalida: this.fechaSalida,
			horaSalida: this.horaSalida,
			lugarSalida: this.lugarSalida,
			fechaRegreso: this.fechaRegreso,
			horaRegreso: this.horaRegreso,
			lugarRegreso: this.lugarRegreso,
			duracion: this.duracion,
			departamentos: this.departamentos,
			municipios: this.municipios,
			ultimoDestino: this.ultimoDestino,
			marcaTemporal: this.marcaTemporal,
			email: this.email,
			solicitada: this.solicitada,
			blank: this.blank
		};

		dbController.addRegistro(data);

	}
}

export const controllerProyeccion = new ControllerProyeccion();
