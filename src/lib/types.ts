import { ROL, EstadoSolicitud, NivelRiesgo } from './util/enums';

export interface UAB {
	codigo: string;
	nombre: string;
	correo: string;
}

export interface SeleccionRiesgo {
	tipo: string;
	nombre: string;
	nivel: NivelRiesgo;
}

export type Riesgo = {
	RIESGO: string;
	TIPO: string;
};

export type RiesgoExtendido = {
	tipo: string;
	nombre: string;
	checked: boolean;
	nivel: NivelRiesgo;
};

export interface UserResponse {
	CODIGO_UAB: string;
	ROL: ROL;
}

export interface Destino {
	municipio: string;
	departamento: string;
}

export interface Config {
	finProyeccion: string;
	finSemestre: string;
	finSolicitud: string;
	inicioProyeccion: string;
	inicioSemestre: string;
	inicioSolicitud: string;
}

export interface Proyeccion {
	id: string;
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
}

export interface Solicitud {
	id: string;
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
	idProyeccion: string;
	comite: string;
	acta: string;
	agendado: boolean;
	revisado: boolean;
	estado: EstadoSolicitud;
	costo: number;
	blank: boolean;
}

export interface Asignatura {
	COD_UAB: string;
	UAB: string;
	COD_ASIGNATURA: string;
	ASIGNATURA: string;
	VIGENTE: boolean;
	ANTERIOR?: string;
}
