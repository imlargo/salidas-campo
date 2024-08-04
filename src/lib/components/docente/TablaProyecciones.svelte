<script lang="ts">
	import type { Proyeccion } from '$src/lib/types';

	import RowProyeccion from './Proyeccion.svelte';

	type Props = {
		proyecciones: Proyeccion[];
	};

	const { proyecciones }: Props = $props();

	class StoreProyecciones {
		proyecciones: Proyeccion[] = $state(proyecciones);

		deleteProyeccion(id: number) {
			this.proyecciones = this.proyecciones.filter((p) => p.id !== id);
		}
	}

	const storeProyecciones = new StoreProyecciones();
</script>

<div class="grid grid-cols-8 md:font-semibold gap-x-5">
	<span class="text-center">Consecutivo</span>
	<span>Codigo(s)</span>
	<span>Asignatura(s)</span>
	<span>Fecha salida</span>
	<span>Duracion</span>
	<span>Destinos</span>
	<span>Modificar</span>
	<span class="text-center">Eliminar</span>
</div>

<div class="flex flex-col divide-y divide-solid mt-3 border-y text-xs md:text-base">
	{#each storeProyecciones.proyecciones as proyeccion}
		<RowProyeccion {proyeccion} {storeProyecciones} />
	{/each}
</div>
