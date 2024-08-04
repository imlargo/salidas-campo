import type { PageServerLoad } from './$types';
import { dbController } from '$src/lib/db/controller';

export const load = (async () => {
	const [sizes, config, internalData] = await Promise.all([
		dbController.getCantidadRegistros(),
		dbController.loadConfig(),
		dbController.loadData()
	]);

	return {
		config,
		sizes,
		internalData
	};
}) satisfies PageServerLoad;
