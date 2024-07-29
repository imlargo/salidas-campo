import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const API_URL =
		'https://script.google.com/macros/s/AKfycbykUwdl5oVKCqyeuDT_SbZxq4SO9NNvRtVbSuzQpCpsHdLed7OmMmTMWHlvclH8IDbffg/exec';

	// Obtener los datos de la pagina
	const emailRequest = await request.json();

	await fetch(API_URL, {
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
