import type { PageLoad } from './$types';
import { storeAuth } from '$src/lib/stores/storeAuth.svelte';
import { dbController } from '$src/lib/db/controller';
import { browser } from '$app/environment';

export const load = (async ({ data }) => {
	if (browser) {
		const email = storeAuth.email;
		const proyecciones = await dbController.getProyeccionesByDocente(email);

		console.log(proyecciones);

		return {
			proyecciones,
			...data
		};
	}

	return {
		proyecciones: [],
		...data
	};
}) satisfies PageLoad;
