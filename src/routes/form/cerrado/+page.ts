import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { dbController } from '$src/lib/db/controller';

export const load = (async ({ url }) => {
	const formulario = url.searchParams.get('formulario');

	return {
		formulario
	};
}) satisfies PageLoad;
