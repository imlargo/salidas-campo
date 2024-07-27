export function checkNumber(event: KeyboardEvent) {
	return event.keyCode !== 69;
}

export function showPicker(e: MouseEvent) {
	e.target.showPicker();
}

export function calcularDuracion(fecha1: Date, fecha2: Date) {
	const diferencia = fecha2.getTime() - fecha1.getTime();
	const dias = diferencia / (1000 * 3600 * 24);
	return dias + 1;
}

export function normalizarTexto(texto: string) {
	return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
