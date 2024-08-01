<script lang="ts">
	import type { Destino } from '$src/lib/types';

	function deleteDestino(e: Event) {
		e.preventDefault();
		controller.eliminarDestino(destino);
	}

	const {
		destino,
		controller
	}: {
		destino: Destino;
		controller: any;
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
