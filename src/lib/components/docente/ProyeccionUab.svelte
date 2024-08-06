<script lang="ts">
	import type { Proyeccion } from '$src/lib/types';
	import { tooltipAction } from '$src/lib/actions/tooltip';
	import Modal from '$src/lib/components/ui/Modal.svelte';
	import { dbController } from '$src/lib/db/controller';
	import type { SvelteComponent } from 'svelte';
	import { storeAuth } from '$src/lib/stores/storeAuth.svelte';
	import { toastController } from '$src/lib/stores/toastStore.svelte';
	import { sendMail } from '$src/lib/util/emails';
	import { EmailAsignacion } from '$src/lib/util/emails';

	type Props = {
		proyeccion: Proyeccion;
		storeProyecciones: Record<string, any>;
	};

	let { proyeccion, storeProyecciones }: Props = $props();

	let modal: SvelteComponent;

	async function deleteProyeccion() {
		storeProyecciones.deleteProyeccion(proyeccion.id.toString());
		await dbController.deleteProyeccion(proyeccion.id.toString());
	}

	let docenteAsignado = $state(proyeccion.email === storeAuth.email ? '' : proyeccion.email);

	async function changeDocente() {
		if (docenteAsignado === '') {
			proyeccion.email = storeAuth.email;
			toastController.addMensaje('Se removio el docente asignado a la proyeccion');
			await dbController.asignarDocente(proyeccion.id.toString(), storeAuth.email);
			return;
		}

		if (!docenteAsignado.endsWith('@unal.edu.co')) {
			toastController.addMensaje(
				'El correo ingresado no es valido, debe ser un correo institucional.'
			);
			return;
		}

		const isValid = await dbController.asignarDocente(proyeccion.id.toString(), docenteAsignado);

		if (!isValid) {
			docenteAsignado = '';
			toastController.addMensaje(
				`No se pudo asignar el docente ${docenteAsignado}, no esta en la base de datos`
			);
			return;
		}

		proyeccion.email = docenteAsignado;
		toastController.addMensaje(`Docente asignado correctamente: ${docenteAsignado}`);

		const email = EmailAsignacion(storeAuth.uab?.nombre as string, proyeccion);
		sendMail(email);
	}
</script>

<Modal
	titulo="Confirmacion eliminar proyeccion"
	bind:this={modal}
	isConfirmacion={true}
	callback={deleteProyeccion}
>
	<p>¿Estás seguro de que deseas eliminar esta proyeccion?</p>
</Modal>

<div class="grid grid-cols-4 sm:grid-cols-9 items-center proyeccion gap-x-5 py-2">
	<div class="text-center hidden sm:block">FM{proyeccion.id}</div>
	<div class="text-center hidden sm:block">
		<input
			bind:value={docenteAsignado}
			onchange={changeDocente}
			class="form-control"
			type="text"
			placeholder="Correo del docente"
		/>
	</div>
	<div class="hidden sm:block" use:tooltipAction={proyeccion.asignatura?.COD_ASIGNATURA as string}>
		{proyeccion.asignatura?.COD_ASIGNATURA}
	</div>
	<div class="text-nowrap truncate" use:tooltipAction={proyeccion.asignatura?.ASIGNATURA as string}>
		{proyeccion.asignatura?.ASIGNATURA}
	</div>
	<div class="hidden sm:block">{proyeccion.fechaSalida}</div>
	<div class="hidden sm:block">{proyeccion.duracion} días</div>
	<div>{proyeccion.destinos.map(({ municipio }) => municipio).join(', ')}</div>
	<div class="flex justify-center items-center">
		<a href="/form/proyeccion?id={proyeccion.id}">
			<span>Modificar</span>
			<i class="bi bi-pencil-square"></i>
		</a>
	</div>
	<div class="flex items-center justify-center">
		<button
			onclick={() => modal.open()}
			class="px-2.5 py-1.5 rounded-lg border border-red-500 text-red-500 btn-sm bi bi-trash hover:bg-red-50"
		></button>
	</div>
</div>

<style lang="scss">
	.proyeccion {
		&:hover {
			background-color: #f3f4f6;
		}
	}

	a {
		text-decoration: underline;
		text-decoration-color: #f9ae00;
		font-weight: light;
	}
</style>
