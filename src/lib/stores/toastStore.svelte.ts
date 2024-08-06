class ToastController {
	mensajes: string[] = $state([]);

	addMensaje(mensaje: string) {
		console.log('Agregando:', mensaje);

		this.mensajes.push(mensaje);
	}

	shift() {
		this.mensajes.shift();
	}
}

export const toastController = new ToastController();
