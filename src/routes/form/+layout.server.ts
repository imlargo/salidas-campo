import type { LayoutLoad } from './$types';
import type { UAB } from '$src/lib/types';
import asignaturas from '$lib/assets/asignaturas.json';
import geo from '$lib/assets/geo.json';
import { dbController } from '$src/lib/db/controller';

function GroupBy(array: [], func: (obj: any) => any) {
	return array.reduce((acc, obj) => {
		const key = func(obj);
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(obj);
		return acc;
	}, {});
}

export const load = (async () => {
	const [data, config] = await Promise.all([dbController.loadData(), dbController.loadConfig()]);

	return {
		config: config,
		lugares: data.lugares,
		riesgos: GroupBy(data.riesgos, ({ TIPO }) => TIPO),
		uabs: data.uabs.map((uab) => {
			const data: UAB = {
				codigo: uab.CODIGO_UAB.toString(),
				nombre: uab.NOMBRE_UAB.toString(),
				correo: uab.CORREO_UAB.toString()
			};

			return data;
		}),
		asignaturas,
		destinos: geo
	};
}) satisfies LayoutLoad;
