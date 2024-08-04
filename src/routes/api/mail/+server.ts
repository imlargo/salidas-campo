import type { RequestHandler } from './$types';
import { APPS_SCRIPT_API } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	// Obtener los datos de la pagina
	const emailRequest = await request.json();

	await fetch(APPS_SCRIPT_API, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			type: 'email',
			data: emailRequest
		})
	});

	return new Response('ok');
};
