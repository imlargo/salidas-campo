import type { LayoutLoad } from './$types';
import asignaturas from '$lib/assets/asignaturas.json';
import geo from '$lib/assets/geo.json';

export const load = (async () => {
	return {
		asignaturas,
		destinos: geo
	};
}) satisfies LayoutLoad;
