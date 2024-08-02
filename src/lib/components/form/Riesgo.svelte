<script lang="ts">
	import { NivelRiesgo } from '$src/lib/util/enums';
	import type { SeleccionRiesgo, Riesgo, RiesgoExtendido } from '$lib/types';
	import { controllerRiesgos } from '$src/lib/client/controllers/riesgos.svelte';

	const {
		riesgo
	}: {
		riesgo: RiesgoExtendido;
	} = $props();

	let uid = controllerRiesgos.getUid(riesgo.nombre);
</script>

<div class="flex items-center gap-2">
	<input id={uid} type="checkbox" bind:checked={riesgo.checked} />

	<label for={uid}>{riesgo.nombre}</label>

	{#if riesgo.checked}
		<select
			class="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-sm font-medium text-zinc-700 ring-1 ring-inset ring-zinc-700/10 riesgo-{riesgo.nivel}"
			bind:value={riesgo.nivel}
		>
			<option value="" disabled>-- Tipo --</option>
			<option value="Posible">Posible</option>
			<option value="Probable">Probable</option>
			<option value="Inminente">Inminente</option>
		</select>
	{/if}
</div>

<style lang="scss">
	.riesgo-Posible {
		color: #3cbd00;
		border: 1px #3cbd00 solid;
		background-color: #f2ffcc;
	}

	.riesgo-Probable {
		color: #f9b300;
		border: 1px #ffb800 solid;
		background-color: #fff0c8;
	}

	.riesgo-Inminente {
		color: #ff2164;
		border: 1px #ff5287 solid;
		background-color: #ffd5e1;
	}
</style>
