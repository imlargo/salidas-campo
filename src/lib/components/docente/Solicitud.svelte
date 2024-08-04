<script lang="ts">
	import type { Proyeccion, Solicitud } from '$src/lib/types';
	import { tooltipAction } from '$src/lib/actions/tooltip';
	import Modal from '$src/lib/components/ui/Modal.svelte';
	import { dbController } from '$src/lib/db/controller';
	import type { SvelteComponent } from 'svelte';

	type Props = {
		proyeccion: Proyeccion;
		solicitud: Solicitud | null;
		storeSolicitudes: any;
	};

	let { proyeccion, solicitud, storeSolicitudes }: Props = $props();

	let modal: SvelteComponent;

	async function deleteProyeccion() {
		// storeSolicitudes.delete(proyeccion.id.toString());
		// await dbController.deleteProyeccion(proyeccion.id.toString());
	}

	const hasSolicitud = solicitud !== null;
</script>

<Modal
	titulo="Confirmacion eliminar proyeccion"
	bind:this={modal}
	isConfirmacion={true}
	callback={deleteProyeccion}
>
	<p>¿Estás seguro de que deseas eliminar esta proyeccion?</p>
</Modal>

{#if hasSolicitud}
	<div class="grid grid-cols-8 items-center proyeccion gap-x-5 py-2">
		<div class="text-center">FM{solicitud.id}</div>
		<div use:tooltipAction={solicitud.asignatura?.COD_ASIGNATURA as string}>
			{solicitud.asignatura?.COD_ASIGNATURA}
		</div>
		<div
			class="text-nowrap truncate"
			use:tooltipAction={solicitud.asignatura?.ASIGNATURA as string}
		>
			{solicitud.asignatura?.ASIGNATURA}
		</div>
		<div>{solicitud.fechaSalida}</div>
		<div>{solicitud.fechaRegreso}</div>
		<div>{solicitud.destinos.map(({ municipio }) => municipio).join(', ')}</div>
		<a href="/form/solicitud?id={solicitud.id}&edit" class="link-modificar">
			<span>Modificar</span>
			<i class="bi bi-pencil-square"></i>
		</a>
		<div class="flex items-center justify-center">
			<button
				onclick={() => modal.open()}
				class="px-2.5 py-1.5 rounded-lg border border-red-500 text-red-500 btn-sm bi bi-trash hover:bg-red-50"
			></button>
		</div>
	</div>
{:else}
	<div class="grid grid-cols-8 items-center proyeccion gap-x-5 py-2">
		<div class="text-center">FM{proyeccion.id}</div>
		<div use:tooltipAction={proyeccion.asignatura?.COD_ASIGNATURA as string}>
			{proyeccion.asignatura?.COD_ASIGNATURA}
		</div>
		<div
			class="text-nowrap truncate"
			use:tooltipAction={proyeccion.asignatura?.ASIGNATURA as string}
		>
			{proyeccion.asignatura?.ASIGNATURA}
		</div>
		<div>{proyeccion.fechaSalida}</div>
		<div>{proyeccion.fechaRegreso}</div>
		<div>{proyeccion.destinos.map(({ municipio }) => municipio).join(', ')}</div>
		<a href="/form/solicitud?id={proyeccion.id}" class="link-solicitar">
			<span>Solicitar</span>
			<i class="bi bi-pencil-square"></i>
		</a>
		<div class="flex items-center justify-center">
			<button
				onclick={() => modal.open()}
				class="px-2.5 py-1.5 rounded-lg border border-red-500 text-red-500 btn-sm bi bi-trash hover:bg-red-50"
			></button>
		</div>
	</div>
{/if}

<style lang="scss">
	.proyeccion {
		&:hover {
			background-color: #f3f4f6;
		}
	}

	.link-solicitar {
		text-decoration-color: #a46bff;
	}

	.link-modificar {
		text-decoration-color: #f9ae00;
	}

	a {
		text-decoration: underline;

		font-weight: light;
	}
</style>
