import type { Proyeccion } from '../types';

interface Email {
	para: string;
	asunto: string;
	cuerpo: string;
}

export function EmailProyeccion(proyeccion: Proyeccion, modificacion: boolean): Email {
	const mensajeEditado =
		'Se ha modificado exitosamente la salida de campo, la nueva información es la siguiente:';
	const mensajeNuevo = 'Se ha registrado exitosamente la salida de campo con los siguientes datos:';

	// Plantilla de correo:
	const cuerpo = `<h2>Estimado(a) ${proyeccion.docente}</h2>

        <p>${modificacion ? mensajeEditado : mensajeNuevo}</p>
        <p><strong>Código de consecutivo: FM${proyeccion.id}</strong></p>

        <hr>
        <h3>Información de la Salida de Campo:</h3>

        <table>
            <tr><td><strong>Facultad:</strong></td><td>${proyeccion.facultad}</td></tr>
            <tr><td><strong>Departamento:</strong></td><td>${proyeccion.uab}</td></tr>
            <tr><td><strong>Docente:</strong></td><td>${proyeccion.docente}</td></tr>

            <tr> <td> <hr> </td> <td> <hr> </td> </tr>
            <tr><td><strong>Asignatura:</strong></td><td>${proyeccion.relacion ? proyeccion.asignatura.ASIGNATURA + ', ' + proyeccion.relacion.ASIGNATURA : proyeccion.asignatura.ASIGNATURA}</td></tr>
            <tr><td><strong>Código:</strong></td><td>${proyeccion.relacion ? proyeccion.asignatura.COD_ASIGNATURA + ', ' + proyeccion.relacion.COD_ASIGNATURA : proyeccion.asignatura.COD_ASIGNATURA}</td></tr>
            <tr><td><strong>Grupo:</strong></td><td>${proyeccion.grupo}</td></tr>
            <tr><td><strong>Asistentes:</strong></td><td>${proyeccion.asistentes}</td></tr>

            <tr> <td> <hr> </td> <td> <hr> </td> </tr>
            <tr><td><strong>Fecha de salida:</strong></td><td>${proyeccion.fechaSalida}</td></tr>
            <tr><td><strong>Hora de salida:</strong></td><td>${proyeccion.horaSalida}</td></tr>
            <tr><td><strong>Lugar de salida:</strong></td><td>${proyeccion.lugarSalida}</td></tr>

            <tr> <td> <hr> </td> <td> <hr> </td> </tr>
            <tr><td><strong>Fecha de regreso:</strong></td><td>${proyeccion.fechaRegreso}</td></tr>
            <tr><td><strong>Hora de regreso:</strong></td><td>${proyeccion.horaRegreso}</td></tr>
            <tr><td><strong>Lugar de regreso:</strong></td><td>${proyeccion.lugarRegreso}</td></tr>

            <tr> <td> <hr> </td> <td> <hr> </td> </tr>
            <tr><td><strong>Duración (días):</strong></td><td>${proyeccion.duracion}</td></tr>

            <tr> <td> <hr> </td> <td> <hr> </td> </tr>
            <tr><td><strong>Departamentos:</strong></td><td>${proyeccion.destinos.map(({ departamento }) => departamento)}</td></tr>
            <tr><td><strong>Municipios:</strong></td><td>${proyeccion.destinos.map(({ municipio }) => municipio)}</td></tr>
            <tr><td><strong>Último destino:</strong></td><td>${proyeccion.ultimoDestino.municipio}</td></tr>
        </table>

        <hr>

        <p>Fecha y hora de registro: ${proyeccion.marcaTemporal}</p>

        <p><strong>Nota: no olvides tu código consecutivo, será usado más adelante (Código consecutivo: FM${proyeccion.id})</strong></p>

        <p>Atentamente,</p>
        <p>Salidas de campo</p>`;

	return {
		para: proyeccion.docente,
		asunto: `Salida de campo ${modificacion ? 'modificada' : 'registrada'} con éxito (FM${proyeccion.id})`,
		cuerpo: cuerpo
	};
}
