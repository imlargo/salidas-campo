import type { PageServerLoad } from './$types';
import { dbController } from '$src/lib/db/controller';

export const load = (async () => {
	const [config, internalData, solicitudes] = await Promise.all([
		dbController.loadConfig(),
		dbController.loadData(),
		dbController.getSolicitudes()
	]);

	return {
		config,
		internalData,
		solicitudes
	};
}) satisfies PageServerLoad;
