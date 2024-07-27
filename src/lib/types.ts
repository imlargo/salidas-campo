import { ROL } from './util/enums';

export interface UAB {
	codigo: string;
	nombre: string;
	correo: string;
}

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

export interface ProyeccionData {
	facultad: string;
	docente: string;
	uab: string;
	asignatura: string;
	codigo: string;
	grupo: string;
	asistentes: string;
	fechaSalida: string;
	horaSalida: string;
	lugarSalida: string;
	fechaRegreso: string;
	horaRegreso: string;
	lugarRegreso: string;
	duracion: number;
	departamentos: string;
	municipios: string;
	ultimoDestino: string;
	marcaTemporal: string;
	email: string;
	solicitada: boolean;
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
