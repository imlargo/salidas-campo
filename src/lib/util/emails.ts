import type { Proyeccion, Solicitud } from '../types';
import { ProyeccionInstance, SolicitudInstance } from './registros';

interface Email {
	para: string;
	asunto: string;
	cuerpo: string;
}

function getProyeccionAsTable(proyeccion: Proyeccion) {
	const proyeccionInstance = new ProyeccionInstance(proyeccion);

	return `<table>
        <tr><td><strong>FM:</strong></td><td>FM${proyeccion.id}</td></tr>
        <tr><td><strong>Facultad:</strong></td><td>${proyeccion.facultad}</td></tr>
        <tr><td><strong>Docente:</strong></td><td>${proyeccion.docente}</td></tr>

        <tr> <td> <hr> </td> <td> <hr> </td> </tr>
        <tr><td><strong>Departamento:</strong></td><td>${proyeccion.uab}</td></tr>
        <tr><td><strong>Asignatura:</strong></td><td>${proyeccionInstance.getAsignaturas()}</td></tr>
        <tr><td><strong>Código:</strong></td><td>${proyeccionInstance.getCodigos()}</td></tr>
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
        <tr><td><strong>Departamentos:</strong></td><td>${proyeccionInstance.getDepartamentos()}</td></tr>
        <tr><td><strong>Municipios:</strong></td><td>${proyeccionInstance.getMunicipios()}</td></tr>
        <tr><td><strong>Último destino:</strong></td><td>${proyeccion.ultimoDestino.municipio}</td></tr>
        <tr><td><strong>Observaciones:</strong></td><td>${proyeccion.observaciones}</td></tr>
    </table>`;
}

function getSolicitudAsTable(solicitud: Solicitud) {
	const solicitudInstance = new SolicitudInstance(solicitud);

	return `<table>
        <tr><td><strong>Facultad:</strong></td><td>${solicitud.facultad}</td></tr>
        <tr><td><strong>Docente:</strong></td><td>${solicitud.docente}</td></tr>

        <tr> <td> <hr> </td> <td> <hr> </td> </tr>

        <tr><td><strong>Departamento:</strong></td><td>${solicitud.uab}</td></tr>
        <tr><td><strong>Asignatura:</strong></td><td>${solicitudInstance.getAsignaturas()}</td></tr>
        <tr><td><strong>Código:</strong></td><td>${solicitudInstance.getCodigos()}</td></tr>
        <tr><td>Pregrado / Posgrado</td><td>${solicitud.nivel}</td></tr>

        <tr><td><hr></td><td><hr></td></tr>
        <tr><td>¿La salida está contemplada en el programa oficial de la asignatura?</td><td>${solicitud.contemplada}</td></tr>
        <tr><td>Porcentaje de la práctica en la nota total de la asignatura</td><td>${solicitud.porcentaje}</td></tr>
        <tr><td>Pertinencia de la práctica</td><td>${solicitud.pertinencia}</td></tr>
        <tr><td>Objetivo de la práctica</td><td>${solicitud.objetivo}</td></tr>
        <tr><td>Alcance de la práctica</td><td>${solicitud.alcance}</td></tr>
        <tr><td>Descripción de la salida</td><td>${solicitud.descripcion}</td></tr>
        <tr><td>Número mínimo de estudiantes a participar</td><td>${solicitud.asistentes}</td></tr>

        <tr><td><hr></td><td><hr></td></tr>
        <tr><td>Destino(s)</td><td>${solicitudInstance.getDestinos()}</td></tr>
        <tr><td>Fecha de salida</td><td>${solicitud.fechaSalida}</td></tr>
        <tr><td>Fecha de regreso</td><td>${solicitud.fechaRegreso}</td></tr>
        <tr><td>Riesgos</td><td>${solicitudInstance.getRiesgos()}</td></tr>
        <tr><td><hr></td><td><hr></td></tr>

        <tr><td>Agenda</td><td>${solicitudInstance.getAgenda()}</td></tr>

        <tr><td>Requerimientos adicionales</td><td>${solicitud.requerimientos}</td></tr>
        <tr><td>Justificación de los requerimientos</td><td>${solicitud.justificacionRequerimientos}</td></tr>
        <tr><td>Pertinencia de los requerimientos</td><td>${solicitud.pertinenciaRequerimientos}</td></tr>
    </table>`;
}

export function EmailProyeccion(proyeccion: Proyeccion, isModificacion: boolean): Email {
	const mensajeEditado =
		'Se ha modificado exitosamente la salida de campo, la nueva información es la siguiente:';
	const mensajeNuevo = 'Se ha registrado exitosamente la salida de campo con los siguientes datos:';

	// Plantilla de correo:
	const cuerpo = `<h2>Estimado(a) ${proyeccion.docente}</h2>

        <p>${isModificacion ? mensajeEditado : mensajeNuevo}</p>
        <p><strong>Código de consecutivo: FM${proyeccion.id}</strong></p>

        <hr>

        <h3>Información de la Salida de Campo:</h3>
        ${getProyeccionAsTable(proyeccion)}
        <hr>

        <p>Fecha y hora de registro: ${proyeccion.marcaTemporal}</p>

        <p><strong>Nota: no olvides tu código consecutivo, será usado más adelante (Código consecutivo: FM${proyeccion.id})</strong></p>

        <p>Atentamente,</p>
        <p>Salidas de campo</p>`;

	return {
		para: proyeccion.email,
		asunto: `Salida de campo ${isModificacion ? 'modificada' : 'registrada'} con éxito (FM${proyeccion.id})`,
		cuerpo: cuerpo
	};
}

export function EmailAsignacion(uab: string, proyeccion: Proyeccion, modificacion: boolean): Email {
	// Plantilla de correo:
	const cuerpo = `<h2>Estimado(a) docente</h2>

            <p>Se le informa que el departamento ${uab} le ha asignado la práctica de campo FM${proyeccion.id}, por lo tanto se le informa que debe hacer la solicitud de la salida por el siguiente link:</p>
            <a href="https://salidas-campo.vercel.app/modulo/docente">Link panel del docente</a>
            
            <p>Cualquier duda con el formulario por favor comunicarse a areasfm_med@unal.edu.co</p>
            
            <p>A continuacion se muestran los datos de la practica:</p>
            <p><strong>Código de consecutivo: FM${proyeccion.id}</strong></p>

            <hr>
            <h3>Información de la Salida de Campo:</h3>

            ${getProyeccionAsTable(proyeccion)}

            <hr>

            <p>Fecha y hora de registro: ${proyeccion.marcaTemporal}</p>

            <p><strong>Nota: no olvides tu código consecutivo, será usado más adelante (Código consecutivo: FM${proyeccion.id})</strong></p>

            <p>Atentamente,</p>
            <p>Salidas de campo</p>`;

	return {
		para: proyeccion.email,
		asunto: `Asignacion de salida de campo (FM${proyeccion.id})`,
		cuerpo: cuerpo
	};
}

export function EmailSolicitud(solicitud: Solicitud, modificacion: boolean): Email {
	// Plantilla de correo:
	const cuerpo = `<h2>Estimado(a) ${solicitud.docente}</h2>

            <p>Se ha ${modificacion ? 'modificado' : 'realizado'} exitosamente la solicitud de salida de campo con los siguientes datos:</p>

            <hr>
            <h3>Información de la solicitud:</h3>

            ${getSolicitudAsTable(solicitud)}

            <hr>

            <p>Fecha y hora: ${solicitud.marcaTemporal}</p>

            <p>Atentamente,</p>
            <p>Salidas de campo</p>`;

	return {
		para: solicitud.email,
		asunto: `> Confirmación ${modificacion ? 'modificación' : ''} solicitud de salida de campo`,
		cuerpo: cuerpo
	};
}

export function EmailAvisoSolicitudSalida(proyecciones: Proyeccion[]): Email {
	const cuerpo = `<strong>Estimado(a) Docente</strong>

                <p>Le recordamos que actualmente tiene(s) <strong>${proyecciones.length}</strong> salida(s) de campo proyectada(s) para el semestre en curso que están pendientes por solicitar para su trámite ante el Consejo de Facultad. Tenga en cuenta que para realizar salidas de campo, es imprescindible completar el formulario de solicitud para cada una de las salidas que tenga planeado realizar.</p>

                <p>
                    <strong>Para realizar las solicitudes debe acceder al siguiente enlace: </strong>
                    <span>https://salidas-campo.vercel.app/modulo/docente</span>
                </p>

                <p>
                    <strong>Salidas de campo pendientes:</strong>
                    <ul>
                    ${proyecciones.map(
											(proyeccion) =>
												`<li>FM${proyeccion.id} - ${proyeccion.asignatura?.ASIGNATURA} - ${proyeccion.destinos.map(({ municipio }) => municipio).join(', ')}</li>`
										)}
                    </ul>
                </p>

                <p>
                    Lo invitamos a que planifique sus salidas de campo con antelación, enviando sus solicitudes de acuerdo a las fechas
                    establecidas en el cronograma y teniendo en cuenta que estas deberán ser tramitadas ante Comité Asesor y Consejo de
                    Facultad.
                </p>

                <p>
                    Cualquier inquietud con gusto será atendida por el Sistema de Gestión de Áreas Curriculares (SGAC)<br>
                    areasfm_med@unal.edu.co<br>
                    Tel: 425 50 44<br>
                </p>

                <p>¡Gracias por su colaboración!</p>
                <p>Atentamente,</p>
                <p>Gestion de Areas Curriculares, Facultad de Minas</p>`;
	return {
		para: proyecciones[0].email,
		asunto: `> Salidas de campo pendientes por solicitar`,
		cuerpo: cuerpo
	};
}
