import { storeAuth } from '$stores/storeAuth.svelte';
import { storeFiltro } from './asignaturas.svelte';
import type { Proyeccion, Destino, Asignatura } from '$lib/types';
import { calcularDuracion } from '../util/utils';
import { dbController } from '../db/controller';
import { EmailProyeccion } from '../util/emails';

class ControllerProyeccion implements Proyeccion {
	id = $state(-1);
	editMode = $state(false);

	ultimoDestinoSelection = $state('');
	multidocente = $state(false);
	docenteAdicional = $state('');

	tieneRelacion = $state(false);
	incluirRelacion = $state(false);
	relacion: Asignatura | null = $state(null);

	facultad = $state('MINAS');
	docente = $derived(storeAuth.nombre);
	uab = $state('');
	asignatura = $derived(storeFiltro.asignatura);
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
	ultimoDestino = $derived(
		this.ultimoDestinoSelection
			? this.destinos.find((destino) => destino.municipio === this.ultimoDestinoSelection) || null
			: null
	);
	observaciones = $state('');
	marcaTemporal = $state('');
	email = $derived(storeAuth.email);
	solicitada = $state(false);
	blank = $state(false);

	handleFechaChange() {
		if (this.fechaRegreso < this.fechaSalida) {
			this.fechaRegreso = '';
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

	getData() {
		const data: Proyeccion = {
			id: this.id,
			marcaTemporal: this.marcaTemporal,
			facultad: this.facultad,
			docente: this.docente,
			uab: this.uab,
			asignatura: this.asignatura!,
			relacion: this.incluirRelacion ? storeFiltro.anterior : null,
			grupo: this.grupo,
			asistentes: this.asistentes,
			fechaSalida: this.fechaSalida,
			horaSalida: this.horaSalida,
			lugarSalida: this.lugarSalida,
			fechaRegreso: this.fechaRegreso,
			horaRegreso: this.horaRegreso,
			lugarRegreso: this.lugarRegreso,
			duracion: this.duracion,
			destinos: this.destinos,
			ultimoDestino: this.ultimoDestino!,
			observaciones: this.observaciones,
			email: this.email,
			solicitada: this.solicitada,
			blank: this.blank
		};

		return data;
	}

	async sendData() {
		const proyeccion = this.getData();

		if (this.multidocente) {
			proyeccion.docente = `${this.docente},${this.docenteAdicional}`;
		}

		if (this.destinos.length === 0) {
			return;
		}

		// Agregar marca temporal del momento en que se envía el formulario (Fecha, hora)
		const marcaTemporal = new Date();
		proyeccion.marcaTemporal = `${marcaTemporal.toLocaleDateString()} - ${marcaTemporal.toLocaleTimeString()}`;

		// Enviar a la API para guardar en la base de datos
		// proyeccion.solicitada = this.editMode ? this.solicitada : false;

		console.log(proyeccion);

		if (this.editMode) {
			await dbController.updateProyeccion(proyeccion);
		} else {
			const consecutivo = await dbController.createProyeccion(proyeccion);
			this.id = consecutivo;
		}

		const email = EmailProyeccion(proyeccion, this.editMode);

		fetch('/api/mail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(email)
		});
	}

	loadFromData(proyeccion: Proyeccion) {
		this.editMode = true;
		this.id = proyeccion.id;

		const docentes = proyeccion.docente.split(',').map((docente) => docente.trim());

		this.ultimoDestinoSelection = proyeccion.ultimoDestino?.municipio || '';
		this.multidocente = docentes.length > 1;
		this.docenteAdicional = docentes.length > 1 ? docentes[1] : '';

		this.tieneRelacion = proyeccion.relacion !== null;
		this.incluirRelacion = proyeccion.relacion !== null;
		this.relacion = proyeccion.relacion;

		this.facultad = proyeccion.facultad;
		// this.docente = docentes[0];
		this.uab = proyeccion.uab;
		// this.asignatura = proyeccion.asignatura;
		storeFiltro.valueUAB = proyeccion.uab;
		storeFiltro.valueAsignatura = proyeccion.asignatura.ASIGNATURA;
		storeFiltro.valueCodigo = proyeccion.asignatura.COD_ASIGNATURA;

		this.grupo = proyeccion.grupo;
		this.asistentes = proyeccion.asistentes;
		this.fechaSalida = proyeccion.fechaSalida;
		this.horaSalida = proyeccion.horaSalida;
		this.lugarSalida = proyeccion.lugarSalida;
		this.fechaRegreso = proyeccion.fechaRegreso;
		this.horaRegreso = proyeccion.horaRegreso;
		this.lugarRegreso = proyeccion.lugarRegreso;
		// this.duracion = proyeccion.duracion;

		this.destinos = proyeccion.destinos;
		this.observaciones = proyeccion.observaciones;

		// this.ultimoDestino = proyeccion.ultimoDestino;
		this.marcaTemporal = proyeccion.marcaTemporal;
		// this.email = proyeccion.email;
		this.solicitada = proyeccion.solicitada;
		this.blank = proyeccion.blank;
	}
}

export const controllerProyeccion = new ControllerProyeccion();
