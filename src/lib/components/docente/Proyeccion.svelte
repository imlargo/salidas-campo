<script lang="ts">
	import type { Proyeccion } from '$src/lib/types';
	import { tooltipAction } from '$src/lib/actions/tooltip';
	import Modal from '$src/lib/components/ui/Modal.svelte';
	import { dbController } from '$src/lib/db/controller';
	import type { SvelteComponent } from 'svelte';

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

<div class="grid grid-cols-4 sm:grid-cols-8 items-center proyeccion gap-x-5 py-2">
	<div class="text-center hidden sm:block">FM{proyeccion.id}</div>
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
