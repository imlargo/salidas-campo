<script lang="ts">
	import type { Proyeccion } from '$src/lib/types';
	import { tooltipAction } from '$src/lib/actions/tooltip';
	import Modal from '$src/lib/components/ui/Modal.svelte';
	import { dbController } from '$src/lib/db/controller';
	import type { SvelteComponent } from 'svelte';
	import { toastController } from '$src/lib/stores/toastStore.svelte.js';
	import { normalizarFecha } from '$src/lib/util/utils';

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
</script>

<Modal
	titulo="Confirmacion eliminar proyeccion"
	bind:this={modal}
	isConfirmacion={true}
	callback={deleteProyeccion}
>
	<p>¿Estás seguro de que deseas eliminar esta proyección?</p>
</Modal>

<div class="grid grid-cols-6 sm:grid-cols-6 items-center proyeccion gap-x-5 py-2">
	<div class="text-center">FM{proyeccion.id}</div>
	<button
		onclick={() => {
			toastController.addMensaje(`Correo del docente ${proyeccion.email} copiado`);
			navigator.clipboard.writeText('https://salidas-campo.vercel.app/form/proyeccion');
		}}
		use:tooltipAction={proyeccion.email}
		class="text-center cursor-pointer"
	>
		{proyeccion.docente}
	</button>
	<div class="text-nowrap truncate" use:tooltipAction={proyeccion.asignatura?.ASIGNATURA as string}>
		{proyeccion.asignatura?.ASIGNATURA}
	</div>
	<div
		use:tooltipAction={`${normalizarFecha(proyeccion.fechaSalida)} - ${normalizarFecha(proyeccion.fechaRegreso)}`}
	>
		{proyeccion.duracion}
		{proyeccion.duracion > 1 ? 'días' : 'día'}
	</div>
	<div>{proyeccion.destinos.map(({ municipio }) => municipio).join(', ')}</div>
	<div class="flex items-center justify-center">
		<button
			disabled
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
