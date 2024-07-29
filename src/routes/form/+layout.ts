import type { LayoutLoad } from './$types';

export const ssr = true;

export const load = (async ({ data }) => {
	return data;
}) satisfies LayoutLoad;
