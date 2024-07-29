import { storeAuth } from '$stores/storeAuth.svelte';
import { storeFiltro } from './asignaturas.svelte';
import type { Proyeccion, Destino, Asignatura } from '$lib/types';
import { calcularDuracion } from '../util/utils';
import { dbController } from '../db/controller';
import { EmailProyeccion } from '../util/emails';

class ControllerProyeccion implements Proyeccion {
	id = $state('');
	editMode = $state(false);

	ultimoDestinoSelection = $state('');
	multidocente = $state(false);
	docenteAdicional = $state('');

	tieneRelacion = $state(true);
	incluirRelacion = $state(false);
	relacion: Asignatura | null = $state(null);

	facultad = $state('MINAS');
	docente = $derived(storeAuth.nombre);
	uab = $state('');
	asignatura = $derived(storeFiltro.asignatura);
	grupo = $state('');
	asistentes = $state(0);

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
			? this.destinos.find((destino) => destino.municipio === this.ultimoDestinoSelection)
			: null
	);
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
			relacion: this.relacion!,
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

		if (this.editMode) {
			await dbController.updateProyeccion(proyeccion);
		} else {
			const consecutivo = await dbController.createProyeccion(proyeccion);
			this.id = consecutivo;
		}

		const email = EmailProyeccion(proyeccion, this.editMode);

		fetch('/api/services/mail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(email)
		});

		// Limpiar formulario

		/*
		const templateModal = `
		<p>Hola ${proyeccion.docente}, se ha ${
			GLOBALS.state.editMode ? 'modificado' : 'registrado'
		} su salida de campo con éxito.</p>
		<strong>Su código consecutivo es: ${
			proyeccion.id
		}, también llegará en el correo de confirmación</strong>
		<p>Se ha enviado un correo de confirmación a ${
			proyeccion.email
		} con los datos de la salida e información adicional.</p>
		`;

		// Mostrar aviso de confirmación instantáneo
		showModal(
			`<span>Confirmacion de registro </span><i class="bi bi-check2-square"></i>`,
			templateModal,
			() => {
				const isUAB = Firestore.state.docente.rol === 'UAB';

				window.location.href = isUAB ? 'uab.html' : 'resumen.html';
			}
		);
		*/
	}
}

export const controllerProyeccion = new ControllerProyeccion();
