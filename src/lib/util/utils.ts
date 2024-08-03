export function checkNumber(event: KeyboardEvent) {
	return event.keyCode !== 69;
}

export function showPicker(e: FocusEvent) {
	e.target?.showPicker();
}

export function normalizarTexto(texto: string) {
	return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function GroupBy(array: [], func: (obj: any) => any) {
	return array.reduce((acc, obj) => {
		const key = func(obj);
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(obj);
		return acc;
	}, {});
}

export function getActualDate(): Date {
	const rawDate = new Date();
	const local = rawDate.toLocaleString('es-CO', { timeZone: 'America/Bogota' });

	const formated = local.split(',')[0].split('/').reverse().join('-');

	return new Date(formated);
}

export function validarFechaActual(min: string, max: string) {
	const fechaActual = getActualDate();

	const fechaInicio = new Date(min);
	const fechaFin = new Date(max);

	return fechaActual >= fechaInicio && fechaActual <= fechaFin;
}

export function getMarcaTemporal(): string {
	const fechaActual = new Date();
	return `${fechaActual.toLocaleDateString()} - ${fechaActual.toLocaleTimeString()}`;
}

export function calcularDuracion(fecha1: Date, fecha2: Date) {
	const diferencia = fecha2.getTime() - fecha1.getTime();
	const dias = diferencia / (1000 * 3600 * 24);
	return dias + 1;
}
