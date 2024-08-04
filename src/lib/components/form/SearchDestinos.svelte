<script lang="ts">
	import { normalizarTexto } from '$src/lib/util/utils';
	import { storeData } from '$src/lib/stores/storeData.svelte';
	import type { Destino } from '$src/lib/types';
	import DestinoRow from './Destino.svelte';

	const { controller } = $props();

	let busqueda = $state('');
	let coincidencias = $derived.by(() => {
		if (busqueda === '') {
			return [];
		}

		const filtrado = storeData.destinos.filter((destino) => {
			const text = `${destino.municipio}, ${destino.departamento}`;
			return normalizarTexto(text)
				.toLowerCase()
				.includes(normalizarTexto(busqueda.trim()).toLowerCase());
		});

		return filtrado;
	});

	function agegarDestino(destino: Destino) {
		controller.agregarDestino(destino);
		busqueda = '';
	}

	function handleKeyDown(e: KeyboardEvent) {
		const isValid = isNaN(parseInt(e.key));
		if (!isValid) {
			e.preventDefault();
		}
	}
</script>

<div class="flex relative items-stretch w-full">
	<input
		type="text"
		class="form-control"
		placeholder="Escriba el municipio"
		id="input-municipio"
		autocomplete="off"
		onkeydown={handleKeyDown}
		bind:value={busqueda}
	/>
	<label
		for="input-municipio"
		class="flex items-center rounded border text-center center-inside px-3"
		id="add-municipio"><i class="bi bi-search"></i></label
	>
</div>

<div id="resultado-busqueda" class="rounded-b border border-top-0">
	{#each coincidencias as coincidencia}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={() => agegarDestino(coincidencia)}
			class="flex gap-2 hover:bg-zinc-100 cursor-pointer px-2 py-2 border-bottom"
		>
			<i class="bi bi-geo-alt"></i><span>
				{coincidencia.municipio}, {coincidencia.departamento}</span
			>
		</div>
	{/each}
</div>
<hr class="my-4" />
<div id="flex flex-col">
	{#each controller.destinos as destino}
		<DestinoRow {controller} {destino} />
	{/each}
</div>
