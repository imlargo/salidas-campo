<script lang="ts">
	import { controllerProyeccion } from '$src/lib/client/proyeccion.svelte';
	import type { Destino } from '$src/lib/types';

	function deleteDestino(e: Event) {
		e.preventDefault();
		controllerProyeccion.eliminarDestino(destino);
	}

	const {
		destino
	}: {
		destino: Destino;
	} = $props();
</script>

<div class="flex justify-between px-2 py-2 border-b element-destino hover:bg-zinc-100">
	<span>
		<i class="bi bi-geo-alt"></i>
		<span>{destino.municipio}, {destino.departamento}</span>
	</span>
	<button onclick={deleteDestino} class="span-delete px-2"><i class="bi bi-x-lg"></i></button>
</div>

<style lang="scss">
</style>
