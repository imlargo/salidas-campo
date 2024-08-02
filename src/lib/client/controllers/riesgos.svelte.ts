import { NivelRiesgo } from '$src/lib/util/enums';

import type { Riesgo, SeleccionRiesgo, RiesgoExtendido } from '$src/lib/types';

export class ControllerRiesgos {
	riesgos: Record<string, RiesgoExtendido> = $state({});

	initListado(listado: [string, Riesgo[]][]) {
		for (const [tipo, riesgos] of listado) {
			for (const riesgo of riesgos) {
				const riesgoExtenido: RiesgoExtendido = {
					tipo: riesgo.TIPO,
					nombre: riesgo.RIESGO,
					checked: false,
					nivel: NivelRiesgo.NN
				};

				const uid = this.getUid(riesgoExtenido.nombre);
				this.riesgos[uid] = riesgoExtenido;
			}
		}
	}

	getRiesgo(uid: string) {
		return this.riesgos[uid];
	}

	getUid(riesgo: string): string {
		return `riesgo-${riesgo.toLowerCase().replace(' ', '-')}`;
	}

	cargarRiesgos(solicitudRiesgos: SeleccionRiesgo[]) {
		for (const riesgo of solicitudRiesgos) {
			const uid = this.getUid(riesgo.nombre);

			this.riesgos[uid].checked = true;
			this.riesgos[uid].nivel = riesgo.nivel;
		}
	}
}

export const controllerRiesgos = new ControllerRiesgos();
