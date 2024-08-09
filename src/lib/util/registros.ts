import type { Proyeccion, Solicitud, Asignatura, Destino, SeleccionRiesgo } from '$lib/types';
import { EstadoSolicitud } from './enums';
import { GroupBy } from './utils';

export class ProyeccionInstance implements Proyeccion {
	id: number;
	marcaTemporal: string;
	facultad: string;
	docente: string;
	email: string;
	uab: string;
	asignatura: Asignatura | null;
	relacion: Asignatura | null;
	grupo: string;
	asistentes: number;
	fechaSalida: string;
	horaSalida: string;
	lugarSalida: string;
	fechaRegreso: string;
	horaRegreso: string;
	lugarRegreso: string;
	duracion: number;
	destinos: Destino[];
	ultimoDestino: Destino;
	observaciones: string;
	solicitada: boolean;
	blank: boolean;

	constructor(proyeccion: Proyeccion) {
		this.id = proyeccion.id;
		this.marcaTemporal = proyeccion.marcaTemporal;
		this.facultad = proyeccion.facultad;
		this.docente = proyeccion.docente;
		this.email = proyeccion.email;
		this.uab = proyeccion.uab;
		this.asignatura = proyeccion.asignatura;
		this.relacion = proyeccion.relacion;
		this.grupo = proyeccion.grupo;
		this.asistentes = proyeccion.asistentes;
		this.fechaSalida = proyeccion.fechaSalida;
		this.horaSalida = proyeccion.horaSalida;
		this.lugarSalida = proyeccion.lugarSalida;
		this.fechaRegreso = proyeccion.fechaRegreso;
		this.horaRegreso = proyeccion.horaRegreso;
		this.lugarRegreso = proyeccion.lugarRegreso;
		this.duracion = proyeccion.duracion;
		this.destinos = proyeccion.destinos;
		this.ultimoDestino = proyeccion.ultimoDestino;
		this.observaciones = proyeccion.observaciones;
		this.solicitada = proyeccion.solicitada;
		this.blank = proyeccion.blank;
	}

	getDepartamentos(): string {
		return [...new Set(this.destinos.map(({ departamento }) => departamento))].join(', ');
	}

	getMunicipios(): string {
		return this.destinos.map(({ municipio }) => municipio).join(', ');
	}

	getDestinos(): string {
		return this.destinos
			.map(({ municipio, departamento }) => `${municipio}, ${departamento}`)
			.join(' - ');
	}

	getAsignaturas(): string {
		return this.relacion
			? this.asignatura?.ASIGNATURA + ', ' + this.relacion.ASIGNATURA
			: this.asignatura?.ASIGNATURA || 'Error';
	}

	getCodigos(): string {
		return this.relacion
			? this.asignatura?.COD_ASIGNATURA + ', ' + this.relacion.COD_ASIGNATURA
			: this.asignatura?.COD_ASIGNATURA || 'Error';
	}
}

export class SolicitudInstance implements Solicitud {
	id: number;
	marcaTemporal: string;
	facultad: string;
	docente: string;
	email: string;
	uab: string;
	asignatura: Asignatura | null;
	relacion: Asignatura | null;
	nivel: string;
	contemplada: string;
	porcentaje: number;
	asistentes: number;
	pertinencia: string;
	objetivo: string;
	alcance: string;
	descripcion: string;
	requerimientos: string;
	justificacionRequerimientos: string;
	pertinenciaRequerimientos: string;
	destinos: Destino[];
	fechaSalida: string;
	fechaRegreso: string;
	riesgos: SeleccionRiesgo[];
	agenda: string[];
	idProyeccion: number;
	comite: string;
	acta: string;
	agendado: boolean;
	revisado: boolean;
	estado: EstadoSolicitud;
	costo: number;
	blank: boolean;

	constructor(solicitud: Solicitud) {
		this.id = solicitud.id;
		this.marcaTemporal = solicitud.marcaTemporal;
		this.facultad = solicitud.facultad;
		this.docente = solicitud.docente;
		this.email = solicitud.email;
		this.uab = solicitud.uab;
		this.asignatura = solicitud.asignatura;
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
		this.riesgos = solicitud.riesgos;
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

	getDepartamentos(): string {
		return this.destinos.map(({ departamento }) => departamento).join(', ');
	}

	getMunicipios(): string {
		return this.destinos.map(({ municipio }) => municipio).join(', ');
	}

	getDestinos(): string {
		return this.destinos
			.map(({ municipio, departamento }) => `${municipio}, ${departamento}`)
			.join(' - ');
	}

	getAsignaturas(): string {
		return this.relacion
			? this.asignatura?.ASIGNATURA + ', ' + this.relacion.ASIGNATURA
			: this.asignatura?.ASIGNATURA || 'Error';
	}

	getCodigos(): string {
		return this.relacion
			? this.asignatura?.COD_ASIGNATURA + ', ' + this.relacion.COD_ASIGNATURA
			: this.asignatura?.COD_ASIGNATURA || 'Error';
	}

	getRiesgos(): string {
		return Object.entries(GroupBy(this.riesgos, ({ nivel }) => nivel))
			.map(([nivel, riesgos]) => `${nivel}: ${riesgos.map((r) => r.nombre).join(', ')}`)
			.join('\n');
	}

	getAgenda(): string {
		return this.agenda.map((dia, i) => `Día ${i + 1}: ${dia}`).join('\n');
	}
}
