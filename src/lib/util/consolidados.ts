import type { Proyeccion } from '../types';

export function consolidarProyecciones(proyecciones: Proyeccion[], campos: any) {
	const registros = proyecciones.sort((a, b) => parseInt(a.id) - parseInt(b.id));

	const data = [
		Object.keys(campos),
		...registros.map((registro) =>
			Object.values(campos).map((key) => {
				if (key === 'id') {
					const id = registro[key];
					return id.includes('FM') ? registro[key] : `FM${id}`;
				}

				if (key === 'agenda') {
					return parseAgenda(registro);
				}

				if (key === 'duracion') {
					return calcDuracion(new Date(registro.fechaSalida), new Date(registro.fechaRegreso));
				}

				if (key === 'riesgos') {
					return Object.entries(Object.groupBy(registro.riesgos, ({ nivel }) => nivel))
						.map(([nivel, riesgos]) => `${nivel}: ${riesgos.map((r) => r.riesgo).join(', ')}`)
						.join('\n');
				}

				if (key === 'estado') {
					return SolicitudStatus.getAsString(registro.estado);
				}

				if (
					key === 'requerimientos' ||
					key === 'justificacionRequerimientos' ||
					key === 'pertinenciaRequerimientos'
				) {
					return registro[key] || 'Ninguno';
				}

				return registro[key];
			})
		)
	];

	return data;
}
