import { dbController } from '$src/lib/db/controller';
import type { Solicitud } from '$src/lib/types';
import { EstadoSolicitud } from '$src/lib/util/enums';

export class ControllerSolicitud {
	solicitud: Solicitud;
	constructor(solicitud: Solicitud) {
		this.solicitud = solicitud;
	}

	async changeComite() {
		this.solicitud.agendado = true;
		this.changeAgendado();

		await dbController.updateCampoSolicitud(this.solicitud.id.toString(), {
			comite: this.solicitud.comite
		});
	}

	async changeAgendado() {
		if (this.solicitud.comite === '') {
			this.solicitud.agendado = false;
			return;
		}

		await dbController.updateCampoSolicitud(this.solicitud.id.toString(), {
			agendado: this.solicitud.agendado
		});
	}

	async changeRevisado() {
		if (!this.solicitud.agendado) {
			this.solicitud.revisado = false;
			return;
		}

		if (this.solicitud.revisado && this.solicitud.estado === EstadoSolicitud.PENDIENTE) {
			this.solicitud.revisado = false;
			return;
		}

		if (this.solicitud.estado === EstadoSolicitud.PENDIENTE && !this.solicitud.revisado) {
			// selectConcepto.setCustomValidity("");
			// selectConcepto.reportValidity();
		}

		await dbController.updateCampoSolicitud(this.solicitud.id.toString(), {
			revisado: this.solicitud.revisado
		});
	}

	async changeEstado() {
		this.solicitud.revisado = this.solicitud.estado !== EstadoSolicitud.SIN_ASIGNAR;

		// Si el concepto es pendiente
		if (this.solicitud.estado === EstadoSolicitud.PENDIENTE) {
			// selectConcepto.classList.add("concepto-pendiente");
		} else {
			// selectConcepto.classList.remove("concepto-pendiente");
		}

		if (this.solicitud.estado !== EstadoSolicitud.SIN_ASIGNAR && this.solicitud.acta === '') {
			// inputActa.classList.add("validation-acta");
			// inputActa.setCustomValidity("Ingrese el numero de acta");
			// inputActa.reportValidity();
		} else {
			// inputActa.classList.remove("validation-acta");
		}

		if (this.solicitud.estado === EstadoSolicitud.SIN_ASIGNAR && !this.solicitud.revisado) {
		}

		this.changeRevisado();
		await dbController.updateCampoSolicitud(this.solicitud.id.toString(), {
			estado: this.solicitud.estado
		});
	}

	async changeActa() {
		await dbController.updateCampoSolicitud(this.solicitud.id.toString(), {
			acta: this.solicitud.acta
		});
	}

	validar() {
		const isRevisado = this.solicitud.revisado;
		const hasConcepto = this.solicitud.estado !== EstadoSolicitud.SIN_ASIGNAR;
		const hasActa = this.solicitud.acta !== '';

		// const componente = componenteSolicitud.componente;
		// const inputActa = componente.querySelector("#acta");
		// const selectConcepto = componente.querySelector("#estado");

		if (isRevisado && !hasConcepto) {
			// 	selectConcepto.setCustomValidity("Por favor seleccione un concepto antes de guardar");
			// 			selectConcepto.reportValidity();

			// 			createPopUp("Por favor seleccione un concepto antes de guardar");
			return;
		} else if (isRevisado && !hasActa) {
			// 		inputActa.setCustomValidity("Por favor ingrese el número de acta antes de guardar");
			// 	inputActa.reportValidity();

			// createPopUp("Por favor ingrese el número de acta antes de guardar");
			return;
		}

		// 		selectConcepto.setCustomValidity("");
		// inputActa.setCustomValidity("");
	}

	copyDocente() {
		navigator.clipboard.writeText(this.solicitud.email);
	}
}
