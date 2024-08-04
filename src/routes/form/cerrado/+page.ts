import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
	const formulario = url.searchParams.get('formulario');

	return {
		formulario
	};
}) satisfies PageLoad;
