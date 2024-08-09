import type { Proyeccion, Solicitud } from '../types';
import { dbController } from '../db/controller';
import { ArrayToExcel } from './sheet-service';
import { ProyeccionInstance, SolicitudInstance } from './registros';
import { getMarcaTemporal } from './utils';
import { EstadoSolicitud } from './enums';
import { toastController } from '$src/lib/stores/toastStore.svelte.js';

export function consolidarProyeccionesAsExcel(proyecciones: Proyeccion[]): string[][] {
	if (proyecciones.length === 0) {
		return [];
	}

	const dataProyecciones = proyecciones.map((proyeccion) => {
		const proyeccionInstance = new ProyeccionInstance(proyeccion);

		return {
			'MARCA TEMPORAL': proyeccion.marcaTemporal,
			CONSECUTIVO: 'FM' + proyeccion.id.toString(),
			FACULTAD: proyeccion.facultad,
			DEPARTAMENTO: proyeccion.uab,
			ASIGNATURA: proyeccionInstance.getAsignaturas(),
			CODIGO: proyeccionInstance.getCodigos(),
			GRUPO: proyeccion.grupo,
			DOCENTE: proyeccion.docente,
			ASISTENTES: proyeccion.asistentes.toString(),
			DURACIÓN: proyeccion.duracion.toString(),
			'FECHA SALIDA': proyeccion.fechaSalida,
			'HORA SALIDA': proyeccion.horaSalida,
			'LUGAR SALIDA': proyeccion.lugarSalida,
			'FECHA LLEGADA': proyeccion.fechaRegreso,
			'LUGAR LLEGADA': proyeccion.lugarRegreso,
			'HORA LLEGADA': proyeccion.horaRegreso,
			DEPARTAMENTOS: proyeccionInstance.getDepartamentos(),
			MUNICIPIOS: proyeccionInstance.getMunicipios(),
			'DESTINO MÁS LEJANO': proyeccion.ultimoDestino.municipio,
			OBSERVACIONES: proyeccion.observaciones || ''
		} satisfies Record<string, string>;
	});

	const data = [Object.keys(dataProyecciones[0]), ...dataProyecciones.map(Object.values)];

	return data;
}

export function consolidarSolicitudesAsExcel(solicitudes: Solicitud[]): any[] {
	if (solicitudes.length === 0) {
		return [];
	}

	const dataSolicitudes = solicitudes.map((solicitud) => {
		const solicitudInstance = new SolicitudInstance(solicitud);

		return {
			'Marca temporal': solicitud.marcaTemporal,
			Correo: solicitud.email,
			Docente: solicitud.docente,

			UAB: solicitud.uab,
			Asignatura: solicitudInstance.getAsignaturas(),
			Código: solicitudInstance.getCodigos(),
			'Pregrado / Posgrado': solicitud.nivel,

			'¿La salida está contemplada en el programa oficial de la asignatura?': solicitud.contemplada,
			'Porcentaje de la práctica en la nota total de la asignatura':
				solicitud.porcentaje.toString(),
			'Pertinencia de la práctica': solicitud.pertinencia,
			'Objetivo de la práctica': solicitud.objetivo,
			'Alcance de la práctica': solicitud.alcance,
			'Descripción de la salida': solicitud.descripcion,
			'Número mínimo de estudiantes a participar.': solicitud.asistentes.toString(),
			'Destino(s)': solicitudInstance.getDestinos(),
			'Fecha de salida': solicitud.fechaSalida,
			'Fecha de regreso': solicitud.fechaRegreso,
			Riesgos: solicitudInstance.getRiesgos(),
			Agenda: solicitudInstance.getAgenda(),
			'Requerimientos adicionales': solicitud.requerimientos,
			'Justificación de los requerimientos': solicitud.justificacionRequerimientos,
			'Pertinencia de los requerimientos': solicitud.pertinenciaRequerimientos
		} satisfies Record<string, string>;
	});

	const data = [Object.keys(dataSolicitudes[0]), ...dataSolicitudes.map(Object.values)];

	return data;
}

export function consolidarSolicitudesAsExcelAmpliado(solicitudes: Solicitud[]): any[] {
	if (solicitudes.length === 0) {
		return [];
	}

	const dataSolicitudes = solicitudes.map((solicitud) => {
		const solicitudInstance = new SolicitudInstance(solicitud);

		return {
			'Marca temporal': solicitud.marcaTemporal,
			Correo: solicitud.email,
			Docente: solicitud.docente,

			UAB: solicitud.uab,
			Asignatura: solicitudInstance.getAsignaturas(),
			Código: solicitudInstance.getCodigos(),
			'Pregrado / Posgrado': solicitud.nivel,

			'¿La salida está contemplada en el programa oficial de la asignatura?': solicitud.contemplada,
			'Porcentaje de la práctica en la nota total de la asignatura':
				solicitud.porcentaje.toString(),
			'Pertinencia de la práctica': solicitud.pertinencia,
			'Objetivo de la práctica': solicitud.objetivo,
			'Alcance de la práctica': solicitud.alcance,
			'Descripción de la salida': solicitud.descripcion,
			'Número mínimo de estudiantes a participar.': solicitud.asistentes.toString(),
			'Destino(s)': solicitudInstance.getDestinos(),
			'Fecha de salida': solicitud.fechaSalida,
			'Fecha de regreso': solicitud.fechaRegreso,
			Riesgos: solicitudInstance.getRiesgos(),
			Agenda: solicitudInstance.getAgenda(),
			'Requerimientos adicionales': solicitud.requerimientos,
			'Justificación de los requerimientos': solicitud.justificacionRequerimientos,
			'Pertinencia de los requerimientos': solicitud.pertinenciaRequerimientos,
			'Comité asesor': solicitud.comite,
			'Numero de Acta': solicitud.acta,
			// "Agendado": solicitud.agendado,
			// "Revisado": solicitud.revisado,
			Concepto: solicitud.estado,
			'Fue extra': solicitud.blank ? 'SI' : 'NO'
		} satisfies Record<string, string>;
	});

	const data = [Object.keys(dataSolicitudes[0]), ...dataSolicitudes.map(Object.values)];

	return data;
}

export async function getConsolidadoProyeccion() {
	const proyecciones = await dbController.getProyecciones();
	const data = consolidarProyeccionesAsExcel(proyecciones);

	if (data.length === 0) {
		toastController.addMensaje("No hay proyecciones para consolidar");
		return;
	}
	
	const marcaTemporal = getMarcaTemporal();
	ArrayToExcel(data, `Consolidado proyecciones ${marcaTemporal}`);
}

export async function getConsolidadoExtras() {
	const proyecciones = await dbController.getProyeccionesExtra();
	const data = consolidarProyeccionesAsExcel(proyecciones);
	if (data.length === 0) {
		toastController.addMensaje("No hay proyecciones extra para consolidar");
		return;
	}
	const marcaTemporal = getMarcaTemporal();
	ArrayToExcel(data, `Consolidado proyecciones extra ${marcaTemporal}`);
}

export async function getConsolidadoByUAB(uab: string) {
	const proyecciones = await dbController.getProyeccionesByUAB(uab);
	const data = consolidarProyeccionesAsExcel(proyecciones);
	if (data.length === 0) {
		toastController.addMensaje("No hay proyecciones del departamento para consolidar");
		return;
	}
	const marcaTemporal = getMarcaTemporal();
	ArrayToExcel(data, `Consolidado proyecciones ${uab} ${marcaTemporal}`);
}

export async function getConsolidadoSolicitud() {
	const solicitudes = await dbController.getSolicitudes();
	const data = consolidarSolicitudesAsExcel(solicitudes);
	if (data.length === 0) {
		toastController.addMensaje("No hay solicitudes para consolidar");
		return;
	}
	const marcaTemporal = getMarcaTemporal();
	ArrayToExcel(data, `Consolidado solicitudes ${marcaTemporal}`);
}

export async function getConsolidadoSolicitudAmpliado() {
	const solicitudes = await dbController.getSolicitudes();
	const data = consolidarSolicitudesAsExcelAmpliado(solicitudes);
	if (data.length === 0) {
		toastController.addMensaje("No hay solicitudes para consolidar");
		return;
	}
	const marcaTemporal = getMarcaTemporal();
	ArrayToExcel(data, `Consolidado ampliado de solicitudes ${marcaTemporal}`);
}

export async function getConsolidadoSolicitudesAprobadas() {
	const solicitudes = await dbController.getSolicitudesBy('estado', EstadoSolicitud.APROBADA);
	const data = consolidarSolicitudesAsExcel(solicitudes);
	if (data.length === 0) {
		toastController.addMensaje("No hay solicitudes aprobadas para consolidar");
		return;
	}
	const marcaTemporal = getMarcaTemporal();
	ArrayToExcel(data, `Consolidado solicitudes aprobadas ${marcaTemporal}`);
}
