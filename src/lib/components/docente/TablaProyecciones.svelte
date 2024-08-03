<script lang="ts">
	import type { Proyeccion } from '$src/lib/types';

	import RowProyeccion from './Proyeccion.svelte';

	type Props = {
		proyecciones: Proyeccion[];
	};

	const { proyecciones }: Props = $props();
</script>

<div class="grid grid-cols-8 font-semibold gap-x-5">
	<span class="text-center">Consecutivo</span>
	<span>Codigo(s)</span>
	<span>Asignatura(s)</span>
	<span>Fecha salida</span>
	<span>Duracion</span>
	<span>Destinos</span>
	<span>Modificar</span>
	<span class="text-center">Eliminar</span>
</div>

<div class="flex flex-col divide-y divide-solid mt-3 border-y">
	{#each proyecciones as proyeccion}
		<RowProyeccion {proyeccion} />
	{/each}
</div>
