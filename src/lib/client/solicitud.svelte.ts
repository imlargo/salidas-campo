import { storeAuth } from '$stores/storeAuth.svelte';
import { storeFiltro } from './asignaturas.svelte';
import type { Proyeccion, Solicitud, Destino, Asignatura, SeleccionRiesgo } from '$lib/types';
import { calcularDuracion } from '../util/utils';
import { dbController } from '../db/controller';
import { EmailProyeccion } from '../util/emails';
import { EstadoSolicitud, NivelRiesgo } from '$utils/enums';
import { getMarcaTemporal } from '../util/utils';
import { controllerProyeccion } from './proyeccion.svelte';
import { controllerRiesgos } from '$src/lib/client/controllers/riesgos.svelte';

class ControllerSolicitud implements Solicitud {
	id = $state(-1);
	proyeccion: Proyeccion | null = $state(null);

	isBlank = $state(false);
	isNew = $state(false);
	isEdit = $state(false);

	editMode = $state(false);

	multidocente = $state(false);
	docenteAdicional = $state('');

	tieneRelacion = $state(false);
	incluirRelacion = $state(false);

	/* Datos de la solicitud */
	marcaTemporal = $state('');
	facultad = $state('MINAS');
	docente = $state('');
	email = $derived(storeAuth.email);
	uab = $state('');

	asignatura = $derived(storeFiltro.asignatura);
	relacion: Asignatura | null = $state(null);

	nivel = $state('');
	contemplada = $state('');

	porcentaje = $state(0);
	asistentes = $state(0);

	pertinencia = $state('');
	objetivo = $state('');
	alcance = $state('');
	descripcion = $state('');
	requerimientos = $state('');
	justificacionRequerimientos = $state('');
	pertinenciaRequerimientos = $state('');

	destinos: Destino[] = $state([]);

	fechaSalida = $state('');
	fechaRegreso = $state('');

	agenda: string[] = $state([]);
	riesgos: SeleccionRiesgo[] = $derived.by(() => {
		const seleccion: SeleccionRiesgo[] = [];

		for (const uid in controllerRiesgos.riesgos) {
			const riesgo = controllerRiesgos.riesgos[uid];

			if (riesgo.checked && riesgo.nivel !== NivelRiesgo.NN) {
				seleccion.push({
					tipo: riesgo.tipo,
					nombre: riesgo.nombre,
					nivel: riesgo.nivel
				});
			}
		}

		return seleccion;
	});
	idProyeccion = $state(-1);
	comite = $state('');
	acta = $state('');
	agendado = $state(false);
	revisado = $state(false);
	estado: EstadoSolicitud = $state(EstadoSolicitud.SIN_ASIGNAR);
	costo = $state(0);
	blank = $state(false);

	loadFromProyeccion(proyeccion: Proyeccion) {
		this.proyeccion = proyeccion;

		if (proyeccion.asignatura === null) {
			return;
		}

		storeFiltro.valueUAB = proyeccion.asignatura.COD_UAB;
		storeFiltro.valueAsignatura = proyeccion.asignatura.ASIGNATURA;
		storeFiltro.valueCodigo = proyeccion.asignatura.COD_ASIGNATURA;

		// this.id = proyeccion.id;
		// this.marcaTemporal = proyeccion.marcaTemporal;
		// this.facultad = proyeccion.facultad;
		this.docente = proyeccion.docente;
		// this.email = proyeccion.email;
		this.uab = proyeccion.uab;
		// this.asignatura = proyeccion.asignatura;

		this.tieneRelacion = proyeccion.relacion !== null;
		this.incluirRelacion = proyeccion.relacion !== null;
		this.relacion = proyeccion.relacion;
		// this.nivel = proyeccion.nivel;
		// this.contemplada = proyeccion.contemplada;
		// this.porcentaje = proyeccion.porcentaje;
		this.asistentes = proyeccion.asistentes;
		// this.pertinencia = proyeccion.pertinencia;
		// this.objetivo = proyeccion.objetivo;
		// this.alcance = proyeccion.alcance;
		// this.descripcion = proyeccion.descripcion;
		// this.requerimientos = proyeccion.requerimientos;
		// this.justificacionRequerimientos = proyeccion.justificacionRequerimientos;
		// this.pertinenciaRequerimientos = proyeccion.pertinenciaRequerimientos;
		this.destinos = proyeccion.destinos;
		this.fechaSalida = proyeccion.fechaSalida;
		this.fechaRegreso = proyeccion.fechaRegreso;
		// this.riesgos = proyeccion.riesgos;
		// this.agenda = proyeccion.agenda;
		this.idProyeccion = proyeccion.id;
		// this.comite = proyeccion.comite;
		// this.acta = proyeccion.acta;
		// this.agendado = proyeccion.agendado;
		// this.revisado = proyeccion.revisado;
		// this.estado = proyeccion.estado;
		// this.costo = proyeccion.costo;
		// this.blank = proyeccion.blank;
	}

	loadFromSolicitud(solicitud: Solicitud) {
		if (solicitud.asignatura === null) {
			return;
		}

		storeFiltro.valueUAB = solicitud.asignatura.COD_UAB;
		storeFiltro.valueAsignatura = solicitud.asignatura.ASIGNATURA;
		storeFiltro.valueCodigo = solicitud.asignatura.COD_ASIGNATURA;

		this.id = solicitud.id;
		// this.marcaTemporal = solicitud.marcaTemporal;
		// this.facultad = solicitud.facultad;
		this.docente = solicitud.docente;
		// this.email = solicitud.email;
		this.uab = solicitud.uab;
		// this.asignatura = solicitud.asignatura;

		this.tieneRelacion = solicitud.relacion !== null;
		this.incluirRelacion = solicitud.relacion !== null;
		this.relacion = solicitud.relacion;

		this.nivel = solicitud.nivel;
		this.contemplada = solicitud.contemplada;

		this.porcentaje = solicitud.porcentaje;
		this.asistentes = solicitud.asistentes;
		this.pertinencia = solicitud.pertinencia;
		this.objetivo = solicitud.objetivo;
		this.alcance = solicitud.alcance;
		this.descripcion = solicitud.descripcion;
		this.requerimientos = solicitud.requerimientos;
		this.justificacionRequerimientos = solicitud.justificacionRequerimientos;
		this.pertinenciaRequerimientos = solicitud.pertinenciaRequerimientos;
		this.destinos = solicitud.destinos;
		this.fechaSalida = solicitud.fechaSalida;
		this.fechaRegreso = solicitud.fechaRegreso;
		// this.riesgos = solicitud.riesgos;
		this.agenda = solicitud.agenda;
		this.idProyeccion = solicitud.idProyeccion;
		this.comite = solicitud.comite;
		this.acta = solicitud.acta;
		this.agendado = solicitud.agendado;
		this.revisado = solicitud.revisado;
		this.estado = solicitud.estado;
		this.costo = solicitud.costo;
		this.blank = solicitud.blank;
	}

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
		const data: Solicitud = {
			id: this.id,
			marcaTemporal: this.marcaTemporal,
			facultad: this.facultad,
			docente: this.docente,
			email: this.email,
			uab: this.uab,
			asignatura: this.asignatura,
			relacion: this.incluirRelacion ? storeFiltro.anterior : null,
			nivel: this.nivel,
			contemplada: this.contemplada,
			porcentaje: this.porcentaje,
			asistentes: this.asistentes,
			pertinencia: this.pertinencia,
			objetivo: this.objetivo,
			alcance: this.alcance,
			descripcion: this.descripcion,
			requerimientos: this.requerimientos,
			justificacionRequerimientos: this.justificacionRequerimientos,
			pertinenciaRequerimientos: this.pertinenciaRequerimientos,
			destinos: this.destinos,
			fechaSalida: this.fechaSalida,
			fechaRegreso: this.fechaRegreso,
			riesgos: this.riesgos,
			agenda: this.agenda,
			idProyeccion: this.idProyeccion,
			comite: this.comite,
			acta: this.acta,
			agendado: this.agendado,
			revisado: this.revisado,
			estado: this.estado,
			costo: this.costo,
			blank: this.blank
		};

		return data;
	}

	async sendData() {
		const solicitud = this.getData();
		const marcaTemporal = getMarcaTemporal();

		if (this.multidocente) {
			solicitud.docente = `${this.docente},${this.docenteAdicional}`;
		}

		// Agregar marca temporal del momento en que se envía el formulario (Fecha, hora)
		solicitud.marcaTemporal = marcaTemporal;

		// Si la solicitud es desde cero
		if (this.isBlank) {
			const nuevaProyeccion = controllerProyeccion.getData();
			nuevaProyeccion.uab = this.uab;
			nuevaProyeccion.solicitada = true;
			nuevaProyeccion.blank = true;
			nuevaProyeccion.relacion = this.incluirRelacion ? storeFiltro.anterior : null;
			nuevaProyeccion.marcaTemporal = marcaTemporal;

			const newId = await dbController.createProyeccion(nuevaProyeccion);

			solicitud.destinos = nuevaProyeccion.destinos;
			solicitud.fechaSalida = nuevaProyeccion.fechaSalida;
			solicitud.fechaRegreso = nuevaProyeccion.fechaRegreso;
			solicitud.idProyeccion = newId;
			solicitud.blank = true;
			solicitud.id = newId;

			await dbController.createSolicitud(solicitud);
		}

		if (this.riesgos.length === 0) {
			// alert("Debe seleccionar al menos un riesgo y su nivel");
			return;
		}

		if (this.isNew) {
			if (this.proyeccion === null) {
				return;
			}
			const idProyeccion = this.proyeccion.id;
			solicitud.idProyeccion = idProyeccion;
			solicitud.id = idProyeccion;

			await dbController.setProyeccionSolicitada(idProyeccion.toString());
			await dbController.createSolicitud(solicitud);
		}

		if (this.isEdit) {
			await dbController.updateSolicitud(this.id.toString(), solicitud);
		}

		console.log(solicitud);

		// Enviar correo
	}
}

export const controllerSolicitud = new ControllerSolicitud();
