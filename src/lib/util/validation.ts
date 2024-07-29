export function validateGroups(e: Event) {
	const targetElement = e.target as HTMLInputElement;

	console.log('targetElement', targetElement.value);

	const grupos = targetElement.value
		.split(',')
		.map((item: string) => item.trim())
		.filter((item: string) => item !== '');

	if (grupos.some((item: string) => isNaN(item)) || grupos.length !== new Set(grupos).size) {
		targetElement.classList.remove('is-valid');
		targetElement.classList.add('is-invalid');
		targetElement.setCustomValidity(
			'Los grupos deben ser números separados por coma y no se pueden repetir'
		);
		targetElement.reportValidity();
	} else {
		targetElement.classList.remove('is-invalid');
		targetElement.classList.add('is-valid');
		targetElement.setCustomValidity('');
		targetElement.reportValidity();
	}
}
